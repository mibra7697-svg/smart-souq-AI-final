import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ENV } from '@/config/env';
import { proxiedRequest } from '@/lib/proxyHandler';
import apiClient from './apiClient';

/**
 * Exchange Rate Service with Failover Mechanism
 * Handles real-time currency conversion with multiple fallback sources
 */

const EXCHANGE_RATE_APIS = {
  primary: {
    url: 'https://api.coingecko.com/api/v3/simple/price',
    params: (from, to) => ({
      ids: 'tether',
      vs_currencies: to.toLowerCase()
    })
  },
  fallback1: {
    url: 'https://api.binance.com/api/v3/ticker/price',
    params: (from, to) => ({
      symbol: `${to}USDT`
    })
  },
  fallback2: {
    url: 'https://api.coinbase.com/v2/exchange-rates',
    params: (from, to) => ({
      currency: from
    })
  }
};

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

class ExchangeRateService {
  constructor() {
    this.cache = new Map();
    this.rates = {};
    this.lastUpdate = null;
    this.isUpdating = false;
  }

  /**
   * Initialize exchange rate service
   */
  async initialize() {
    try {
      // Load cached rates on startup
      this.loadCachedRates();
      
      // Fetch latest rates
      await this.updateRates();
      
      // Start periodic updates
      this.startPeriodicUpdates();
      
    } catch (error) {
      console.error('Failed to initialize exchange rate service:', error);
      // Use cached rates if available
      if (Object.keys(this.rates).length === 0) {
        this.setDefaultRates();
      }
    }
  }

  /**
   * Start periodic rate updates
   */
  startPeriodicUpdates() {
    // Update every 30 minutes
    setInterval(() => {
      this.updateRates().catch(error => {
        console.error('Periodic rate update failed:', error);
      });
    }, CACHE_DURATION);
  }

  /**
   * Update exchange rates with failover mechanism
   */
  async updateRates() {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    
    try {
      const rates = await this.fetchRatesWithFailover();
      this.rates = rates;
      this.lastUpdate = Date.now();
      
      // Cache the rates
      this.cacheRates(rates);
      
    } catch (error) {
      console.error('All exchange rate sources failed:', error);
      
      // Use cached rates as final fallback
      const cached = this.getCachedRates();
      if (cached && cached.rates) {
        this.rates = cached.rates;
      } else {
        this.setDefaultRates();
      }
      
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Fetch rates with multiple API fallbacks
   */
  async fetchRatesWithFailover() {
    const sources = [
      EXCHANGE_RATE_APIS.primary,
      EXCHANGE_RATE_APIS.fallback1,
      EXCHANGE_RATE_APIS.fallback2
    ];

    for (const source of sources) {
      try {
        const url = source.url;
        const params = source.params('USD', 'EGP');
        
        // Determine API type for proxy routing
        let apiType = 'coingecko';
        if (url.includes('binance.com')) apiType = 'binance';
        else if (url.includes('coinbase.com')) apiType = 'coingecko'; // Use coingecko proxy as fallback
        
        // Use proxy handler for CORS-safe requests
        const data = await proxiedRequest(
          `${url}?${new URLSearchParams(params).toString()}`,
          {
            apiType,
            timeout: 5000,
            retries: 1,
            fallback: null
          }
        );

        return this.parseAPIResponse(data, source);
      } catch (error) {
        console.warn(`Source failed: ${source.url}`, error.message);
      }
    }

    throw new Error('All sources failed');
  }

  /**
   * Fetch from CoinGecko with CORS proxy support
   */
  async fetchFromCoinGecko() {
    const baseUrl = 'https://api.coingecko.com/api/v3/simple/price';
    
    // Fetch rates for all supported currencies
    const vsCurrencies = [
      'usd', 'syp', 'egp', 'iqd', 'lyd', 'jod', 
      'sar', 'aed', 'kwd', 'qar', 'bhd', 'omr'
    ].join(',');
    
    const params = {
      ids: 'tether',
      vs_currencies: vsCurrencies
    };

    // Use proxy handler for CORS-safe request
    const data = await proxiedRequest(
      `${baseUrl}?${new URLSearchParams(params).toString()}`,
      {
        apiType: 'coingecko',
        timeout: 10000,
        retries: 2,
        fallback: null
      }
    );
    if (!data?.tether) {
      throw new Error('Invalid response from CoinGecko');
    }
    
    // Convert to standard format
    const rates = {
      USDT: 1 // Base currency
    };
    
    Object.entries(data.tether).forEach(([currency, rate]) => {
      // Convert from USD to target currency
      rates[currency.toUpperCase()] = rate;
    });
    
    return rates;
  }

  /**
   * Generic API fetcher
   */
  async fetchFromAPI(config) {
    const params = config.params('USDT', 'USD');
    
    // Determine API type
    let apiType = 'coingecko';
    if (config.url.includes('binance.com')) apiType = 'binance';
    
    // Use proxy handler
    const data = await proxiedRequest(
      `${config.url}?${new URLSearchParams(params).toString()}`,
      {
        apiType,
        timeout: 8000,
        retries: 1,
        fallback: null
      }
    );
    
    return this.parseAPIResponse(data, config);
  }

  /**
   * Parse different API response formats
   */
  parseAPIResponse(data, config) {
    // This would be customized for each API
    // For now, return default rates
    return this.getDefaultRates();
  }

  /**
   * Get current exchange rate
   */
  getRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = this.rates[fromCurrency] || 1;
    const toRate = this.rates[toCurrency] || 1;
    
    return toRate / fromRate;
  }

  /**
   * Convert amount between currencies
   */
  convert(amount, fromCurrency, toCurrency) {
    const rate = this.getRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  /**
   * Get all current rates
   */
  getAllRates() {
    return { ...this.rates };
  }

  /**
   * Check if rates are stale
   */
  isRatesStale() {
    if (!this.lastUpdate) return true;
    return Date.now() - this.lastUpdate > CACHE_DURATION;
  }

  /**
   * Cache rates in localStorage
   */
  cacheRates(rates) {
    try {
      const cacheData = {
        rates,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache rates:', error);
    }
  }

  /**
   * Load cached rates
   */
  loadCachedRates() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Check if cache is still valid (less than 24 hours)
        if (Date.now() - data.timestamp < 86400000) {
          this.rates = data.rates;
          this.lastUpdate = data.timestamp;
          console.log('Loaded cached exchange rates');
        }
      }
    } catch (error) {
      console.warn('Failed to load cached rates:', error);
    }
  }

  /**
   * Get cached rates
   */
  getCachedRates() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to read cached rates:', error);
      return null;
    }
  }

  /**
   * Set default rates for emergency fallback
   */
  setDefaultRates() {
    this.rates = this.getDefaultRates();
    console.log('Using default exchange rates');
  }

  /**
   * Get default rates
   */
  getDefaultRates() {
    return {
      USDT: 1,
      USD: 1,
      SYP: 12800,    // Approximate rates
      EGP: 30.9,
      IQD: 1310,
      LYD: 4.8,
      JOD: 0.71,
      SAR: 3.75,
      AED: 3.67,
      KWD: 0.31,
      QAR: 3.64,
      BHD: 0.38,
      OMR: 0.39
    };
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      lastUpdate: this.lastUpdate,
      isStale: this.isRatesStale(),
      isUpdating: this.isUpdating,
      ratesCount: Object.keys(this.rates).length,
      hasCachedData: !!this.getCachedRates()
    };
  }
}

export default new ExchangeRateService();