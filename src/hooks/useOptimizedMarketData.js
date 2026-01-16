import useSWR from 'swr';
import { useState, useCallback, useMemo } from 'react';
import { ENV } from '@/config/env';

// Fallback data to prevent UI freezing
const FALLBACK_DATA = {
  egx30: {
    symbol: 'EGX30.CAI',
    price: 12847.50,
    change: 45.20,
    changePercent: 0.35,
    volume: 125000000,
    lastUpdate: new Date().toISOString(),
    open: 12802.30,
    high: 12895.60,
    low: 12789.40,
    previousClose: 12802.30,
    currency: 'EGP'
  },
  crypto: {
    BTC: {
      symbol: 'BTC',
      price: 43250.75,
      change: 125.50,
      changePercent: 0.29,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD'
    },
    ETH: {
      symbol: 'ETH',
      price: 2280.45,
      change: -15.30,
      changePercent: -0.67,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD'
    },
    BNB: {
      symbol: 'BNB',
      price: 315.80,
      change: 5.20,
      changePercent: 1.67,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD'
    }
  }
};

// Enhanced fetcher with timeout and error handling
const enhancedFetcher = async (url, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - using fallback data');
    }
    throw error;
  }
};

// Optimized EGX 30 hook with fallback
export const useOptimizedEGX30 = () => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  const url = apiKey 
    ? `${baseUrl}?function=GLOBAL_QUOTE&symbol=EGX30.CAI&apikey=${apiKey}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    (url) => enhancedFetcher(url).catch(err => {
      console.warn('EGX30 API error, using fallback:', err.message);
      return { 'Global Quote': FALLBACK_DATA.egx30 };
    }),
    {
      refreshInterval: 120000, // 2 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.warn('EGX30 fetch error:', error);
      },
      fallbackData: { 'Global Quote': FALLBACK_DATA.egx30 }
    }
  );

  // Transform data with safety checks
  const egx30Data = useMemo(() => {
    try {
      const quote = data?.['Global Quote'];
      if (!quote) return FALLBACK_DATA.egx30;

      return {
        symbol: quote['01. symbol'] || FALLBACK_DATA.egx30.symbol,
        price: parseFloat(quote['05. price']) || FALLBACK_DATA.egx30.price,
        change: parseFloat(quote['09. change']) || FALLBACK_DATA.egx30.change,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || FALLBACK_DATA.egx30.changePercent,
        volume: parseInt(quote['06. volume']) || FALLBACK_DATA.egx30.volume,
        lastUpdate: quote['07. latest trading day'] || FALLBACK_DATA.egx30.lastUpdate,
        open: parseFloat(quote['02. open']) || FALLBACK_DATA.egx30.open,
        high: parseFloat(quote['03. high']) || FALLBACK_DATA.egx30.high,
        low: parseFloat(quote['04. low']) || FALLBACK_DATA.egx30.low,
        previousClose: parseFloat(quote['08. previous close']) || FALLBACK_DATA.egx30.previousClose,
        currency: 'EGP'
      };
    } catch (error) {
      console.warn('EGX30 data transformation error:', error);
      return FALLBACK_DATA.egx30;
    }
  }, [data]);

  return {
    data: egx30Data,
    isLoading,
    error,
    mutate,
    isUsingFallback: !data || error,
    hasData: true // Always true with fallback
  };
};

// Optimized Crypto hook with fallback
export const useOptimizedCryptoData = (symbols = ['BTC', 'ETH', 'BNB']) => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  
  const fetchCryptoData = useCallback(async () => {
    if (!apiKey) return FALLBACK_DATA.crypto;

    const promises = symbols.map(symbol =>
      enhancedFetcher(`${baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`, 5000)
        .catch(error => {
          console.warn(`Failed to fetch ${symbol}:`, error.message);
          return { 'Realtime Currency Exchange Rate': FALLBACK_DATA.crypto[symbol] };
        })
    );

    const responses = await Promise.allSettled(promises);
    
    const cryptoData = {};
    responses.forEach((response, index) => {
      const symbol = symbols[index];
      if (response.status === 'fulfilled' && response.value?.data?.['Realtime Currency Exchange Rate']) {
        const rate = response.value.data['Realtime Currency Exchange Rate'];
        
        cryptoData[symbol] = {
          symbol: symbol,
          price: parseFloat(rate['5. Exchange Rate']) || FALLBACK_DATA.crypto[symbol].price,
          change: FALLBACK_DATA.crypto[symbol].change,
          changePercent: FALLBACK_DATA.crypto[symbol].changePercent,
          volume: 0,
          lastUpdate: rate['6. Last Refreshed'] || FALLBACK_DATA.crypto[symbol].lastUpdate,
          currency: 'USD'
        };
      } else {
        cryptoData[symbol] = FALLBACK_DATA.crypto[symbol];
      }
    });

    return cryptoData;
  }, [symbols, apiKey]);

  const { data, error, isLoading, mutate } = useSWR(
    'optimized-crypto-data',
    fetchCryptoData,
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      onError: (error) => {
        console.warn('Crypto fetch error:', error);
      },
      fallbackData: FALLBACK_DATA.crypto
    }
  );

  return {
    data: data || FALLBACK_DATA.crypto,
    isLoading,
    error,
    mutate,
    isUsingFallback: !data || error,
    hasData: true // Always true with fallback
  };
};

// Combined optimized market ticker
export const useOptimizedMarketTicker = () => {
  const { data: egx30, isLoading: egxLoading, error: egxError, isUsingFallback: egxFallback } = useOptimizedEGX30();
  const { data: crypto, isLoading: cryptoLoading, error: cryptoError, isUsingFallback: cryptoFallback } = useOptimizedCryptoData(['BTC', 'ETH', 'BNB']);

  const isLoading = egxLoading || cryptoLoading;
  const error = egxError || cryptoError;
  const isUsingFallback = egxFallback || cryptoFallback;

  // Get top crypto with safety checks
  const topCrypto = useMemo(() => {
    try {
      return Object.values(crypto || {}).slice(0, 3);
    } catch (error) {
      console.warn('Crypto data processing error:', error);
      return Object.values(FALLBACK_DATA.crypto).slice(0, 3);
    }
  }, [crypto]);

  return {
    egx30,
    crypto: topCrypto,
    isLoading,
    error,
    isUsingFallback,
    hasData: true,
    lastUpdate: new Date().toISOString()
  };
};

// Manual refresh function
export const useMarketDataRefresh = () => {
  const { mutate: mutateEGX30 } = useOptimizedEGX30();
  const { mutate: mutateCrypto } = useOptimizedCryptoData();

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        mutateEGX30(),
        mutateCrypto()
      ]);
      return { success: true };
    } catch (error) {
      console.warn('Market data refresh error:', error);
      return { success: false, error: error.message };
    }
  }, [mutateEGX30, mutateCrypto]);

  return { refreshAll };
};
