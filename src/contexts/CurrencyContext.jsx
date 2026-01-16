import React, { createContext, useContext, useState, useEffect } from 'react';
import geolocationService from '@/services/geolocationService';
import apiClient from '@/services/apiClient';
import { ENV } from '@/config/env';

/**
 * Currency Context for managing multi-currency system
 * Supports MENA region currencies and USDT fallback
 */

const CurrencyContext = createContext({
  currency: 'USDT',
  country: 'default',
  exchangeRates: { USDT: 1 },
  loading: true,
  error: null,
  convertCurrency: () => {},
  formatCurrency: () => '',
  changeCurrency: () => {},
  getSupportedCurrencies: () => [],
  getCurrencySymbol: () => '$',
  getCurrencyDecimals: () => 2,
});

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USDT');
  const [country, setCountry] = useState('default');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize currency based on geolocation
  useEffect(() => {
    initializeCurrency();
  }, []);

  const initializeCurrency = async () => {
    try {
      setLoading(true);
      
      // Fast-Fail strategy: 1s timeout for geolocation
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => {
          resolve({ country: 'default', currency: { currency: 'USDT' } });
        }, 1000)
      );
      
      const locationPromise = geolocationService.getUserLocation();
      const location = await Promise.race([locationPromise, timeoutPromise]);
      
      setCountry(location?.country || 'default');
      setCurrency(location?.currency?.currency || 'USDT');
      
      // Fetch exchange rates for the detected currency
      await fetchExchangeRates(location?.currency?.currency || 'USDT');
      
    } catch (error) {
      console.warn('Currency initialization error (handled):', error.message);
      // Fallback to USDT/Global
      setCurrency('USDT');
      setCountry('default');
      setExchangeRates({ USDT: 1 });
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async (baseCurrency) => {
    try {
      // Fetch rates from CoinGecko or fallback service
      const rates = await fetchRatesFromAPI(baseCurrency);
      setExchangeRates(rates);
      
      // Cache rates in localStorage for failover
      localStorage.setItem('exchangeRates', JSON.stringify({
        rates,
        timestamp: Date.now(),
        baseCurrency
      }));
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Use cached rates as fallback
      const cached = getCachedRates();
      if (cached) {
        setExchangeRates(cached.rates);
      }
    }
  };

  const fetchRatesFromAPI = async (baseCurrency) => {
    try {
      // Use CoinGecko API via proxy route
      const proxyUrl = `/api/coingecko/simple/price?ids=tether&vs_currencies=${baseCurrency.toLowerCase()}`;
      
      const response = await apiClient.get(proxyUrl, {
        timeout: 8000,
        headers: {
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500
      });
      
      // Validate JSON response
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('application/json')) {
        const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
          throw new Error('Received HTML instead of JSON');
        }
      }
      
      const data = response.data;
      
      // Convert to standard format
      const rates = {
        USDT: 1, // Base currency
        [baseCurrency]: data.tether ? data.tether[baseCurrency.toLowerCase()] : 1
      };
      
      return rates;
    } catch (error) {
      console.error('Failed to fetch rates from API:', error.message);
      // Return fallback rates
      return { USDT: 1, [baseCurrency]: 1 };
    }
  };

  const getCachedRates = () => {
    try {
      const cached = localStorage.getItem('exchangeRates');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 1 hour old
        if (Date.now() - parsed.timestamp < 3600000) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to read cached rates:', error);
    }
    return null;
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    
    // Convert through USDT as base
    const usdtAmount = fromCurrency === 'USDT' ? amount : amount / fromRate;
    return toCurrency === 'USDT' ? usdtAmount : usdtAmount * toRate;
  };

  const formatCurrency = (amount, targetCurrency = currency, locale = 'en-US') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: getCurrencyDecimals(targetCurrency),
        maximumFractionDigits: getCurrencyDecimals(targetCurrency)
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      const symbol = getCurrencySymbol(targetCurrency);
      const decimals = getCurrencyDecimals(targetCurrency);
      return `${symbol}${amount.toFixed(decimals)}`;
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      'SYP': '£S',
      'EGP': '£E',
      'IQD': 'ع.د',
      'LYD': 'ل.د',
      'JOD': 'د.أ',
      'SAR': 'ر.س',
      'AED': 'د.إ',
      'KWD': 'د.ك',
      'QAR': 'ر.ق',
      'BHD': 'د.ب',
      'OMR': 'ر.ع',
      'USDT': '₮'
    };
    return symbols[currencyCode] || '$';
  };

  const getCurrencyDecimals = (currencyCode) => {
    const decimals = {
      'SYP': 2,
      'EGP': 2,
      'IQD': 3,
      'LYD': 3,
      'JOD': 3,
      'SAR': 2,
      'AED': 2,
      'KWD': 3,
      'QAR': 2,
      'BHD': 3,
      'OMR': 3,
      'USDT': 6
    };
    return decimals[currencyCode] || 2;
  };

  const changeCurrency = async (newCurrency) => {
    try {
      setLoading(true);
      setCurrency(newCurrency);
      await fetchExchangeRates(newCurrency);
      
      // Store user preference
      localStorage.setItem('preferredCurrency', newCurrency);
    } catch (error) {
      console.error('Failed to change currency:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSupportedCurrencies = () => {
    return [
      { code: 'SYP', name: 'Syrian Pound', country: 'Syria' },
      { code: 'EGP', name: 'Egyptian Pound', country: 'Egypt' },
      { code: 'IQD', name: 'Iraqi Dinar', country: 'Iraq' },
      { code: 'LYD', name: 'Libyan Dinar', country: 'Libya' },
      { code: 'JOD', name: 'Jordanian Dinar', country: 'Jordan' },
      { code: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia' },
      { code: 'AED', name: 'UAE Dirham', country: 'UAE' },
      { code: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait' },
      { code: 'QAR', name: 'Qatari Riyal', country: 'Qatar' },
      { code: 'BHD', name: 'Bahraini Dinar', country: 'Bahrain' },
      { code: 'OMR', name: 'Omani Riyal', country: 'Oman' },
      { code: 'USDT', name: 'Tether (USDT)', country: 'Global' }
    ];
  };

  const value = {
    currency,
    country,
    exchangeRates,
    loading,
    error,
    convertCurrency,
    formatCurrency,
    changeCurrency,
    getSupportedCurrencies,
    getCurrencySymbol,
    getCurrencyDecimals
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;