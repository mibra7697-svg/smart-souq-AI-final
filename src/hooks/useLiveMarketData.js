import useSWR from 'swr';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ENV } from '@/config/env';
import apiClient, { getProxiedPath } from '@/services/apiClient';

// Enhanced fetcher using unified apiClient with JSON validation
const enhancedFetcher = async (url, options = {}) => {
  const { timeout = 8000, retries = 2 } = options;
  
  let finalUrl = url;
  
  // Use local proxy routes for Binance and CoinGecko
  if (url.includes('api.binance.com')) {
    finalUrl = `/api/binance${url.split('api.binance.com')[1]}`;
  } else if (url.includes('api.coingecko.com')) {
    finalUrl = `/api/coingecko${url.split('api.coingecko.com')[1]}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiClient.get(finalUrl, {
        timeout: timeout,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers
        },
        validateStatus: (status) => status < 500 // Don't throw on 4xx
      });

      // Validate response is JSON
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('application/json')) {
        const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
          throw new Error('Received HTML instead of JSON. Proxy may be misconfigured.');
        }
      }

      return response.data;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

// Alpha Vantage EGX 30 hook
export const useLiveEGX30 = () => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  const url = apiKey
    ? `${baseUrl}?function=GLOBAL_QUOTE&symbol=EGX30.CAI&apikey=${apiKey}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    (url) => enhancedFetcher(url, { timeout: 5000, retries: 1 }),
    {
      refreshInterval: 120000, // 2 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.warn('EGX30 fetch error:', error.message);
      },
      // Keep showing last known data while loading
      keepPreviousData: true
    }
  );

  // Transform data with safety
  const egx30Data = useMemo(() => {
    if (!data?.['Global Quote']) {
      return {
        symbol: 'EGX30.CAI',
        price: 12847.50,
        change: 45.20,
        changePercent: 0.35,
        volume: 125000000,
        lastUpdate: new Date().toISOString(),
        currency: 'EGP',
        source: 'fallback'
      };
    }

    try {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'] || 'EGX30.CAI',
        price: parseFloat(quote['05. price']) || 12847.50,
        change: parseFloat(quote['09. change']) || 45.20,
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0.35,
        volume: parseInt(quote['06. volume']) || 125000000,
        lastUpdate: quote['07. latest trading day'] || new Date().toISOString(),
        currency: 'EGP',
        source: 'api'
      };
    } catch (error) {
      console.warn('EGX30 data transformation error:', error);
      return {
        symbol: 'EGX30.CAI',
        price: 12847.50,
        change: 45.20,
        changePercent: 0.35,
        volume: 125000000,
        lastUpdate: new Date().toISOString(),
        currency: 'EGP',
        source: 'fallback'
      };
    }
  }, [data]);

  return {
    data: egx30Data,
    isLoading,
    error,
    mutate,
    hasData: true,
    isLive: egx30Data.source === 'api'
  };
};

// Binance crypto hook
export const useLiveCryptoData = (symbols = ['BTC', 'ETH', 'BNB']) => {
  const [cryptoData, setCryptoData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCryptoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const promises = symbols.map(symbol => {
        // Use proxy route via apiClient
        const proxyUrl = `/api/binance/ticker/price?symbol=${symbol}USDT`;
        
        return apiClient.get(proxyUrl, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json'
          },
          validateStatus: (status) => status < 500
        })
          .then(response => {
            // Validate JSON response
            const contentType = response.headers['content-type'] || '';
            if (!contentType.includes('application/json')) {
              const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
              if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
                throw new Error('Received HTML instead of JSON');
              }
            }
            return response.data;
          })
          .catch(err => {
            console.warn(`Failed to fetch ${symbol}:`, err.message);
            return null;
          });
      });

      const results = await Promise.allSettled(promises);
      const newCryptoData = {};

      results.forEach((result, index) => {
        const symbol = symbols[index];
        if (result.status === 'fulfilled' && result.value && result.value.price) {
          const price = parseFloat(result.value.price);
          newCryptoData[symbol] = {
            symbol,
            price,
            change: 0, // Binance doesn't provide change in this endpoint
            changePercent: 0,
            volume: 0,
            lastUpdate: new Date().toISOString(),
            currency: 'USD',
            source: 'api'
          };
        } else {
          // Fallback for failed symbols
          newCryptoData[symbol] = {
            symbol,
            price: symbol === 'BTC' ? 43250.75 : symbol === 'ETH' ? 2280.45 : 315.80,
            change: 0,
            changePercent: 0,
            volume: 0,
            lastUpdate: new Date().toISOString(),
            currency: 'USD',
            source: 'fallback'
          };
        }
      });

      setCryptoData(newCryptoData);
      setIsLoading(false);
    } catch (err) {
      console.warn('Crypto data fetch error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [symbols]);

  // Initial fetch
  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const topCrypto = useMemo(() => {
    return Object.values(cryptoData).slice(0, 3);
  }, [cryptoData]);

  return {
    data: topCrypto,
    isLoading,
    error,
    mutate: fetchCryptoData,
    hasData: true,
    isLive: topCrypto.some(crypto => crypto.source === 'api')
  };
};

// Combined live market ticker
export const useLiveMarketTicker = () => {
  const { data: egx30, isLoading: egxLoading, isLive: egxLive } = useLiveEGX30();
  const { data: crypto, isLoading: cryptoLoading, isLive: cryptoLive } = useLiveCryptoData(['BTC', 'ETH', 'BNB']);

  const isLoading = egxLoading || cryptoLoading;
  const isLive = egxLive || cryptoLive;

  return {
    egx30,
    crypto,
    isLoading,
    isLive,
    hasData: true,
    status: isLive ? 'Live' : 'Demo',
    lastUpdate: new Date().toISOString()
  };
};

export default useLiveMarketTicker;
