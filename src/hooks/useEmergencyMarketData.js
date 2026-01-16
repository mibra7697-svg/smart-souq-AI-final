import { useState, useEffect, useCallback, useMemo } from 'react';
import { isClient, safeLocalStorage, checkEnvVariable } from '@/utils/ssrSafe';
import { ENV } from '@/config/env';

// Emergency fallback cache that never fails
const EMERGENCY_CACHE = {
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
    currency: 'EGP',
    source: 'emergency_cache'
  },
  crypto: {
    BTC: {
      symbol: 'BTC',
      price: 43250.75,
      change: 125.50,
      changePercent: 0.29,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD',
      source: 'emergency_cache'
    },
    ETH: {
      symbol: 'ETH',
      price: 2280.45,
      change: -15.30,
      changePercent: -0.67,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD',
      source: 'emergency_cache'
    },
    BNB: {
      symbol: 'BNB',
      price: 315.80,
      change: 5.20,
      changePercent: 1.67,
      volume: 0,
      lastUpdate: new Date().toISOString(),
      currency: 'USD',
      source: 'emergency_cache'
    }
  }
};

// Cache manager for market data
class MarketDataCache {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.updateInterval = 60000; // 1 minute
    this.isInitialized = false;
  }

  initialize() {
    if (!isClient) return;
    
    try {
      const cached = safeLocalStorage.getItem('marketDataCache');
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = new Map(data.cache || []);
        this.lastUpdate = data.lastUpdate;
        console.info('✅ Market data cache loaded from localStorage');
      } else {
        // Initialize with emergency data
        this.setEmergencyData();
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('⚠️ Failed to load market cache, using emergency data:', error);
      this.setEmergencyData();
    }
  }

  setEmergencyData() {
    this.cache.set('egx30', EMERGENCY_CACHE.egx30);
    this.cache.set('crypto', EMERGENCY_CACHE.crypto);
    this.lastUpdate = new Date().toISOString();
    this.saveToCache();
    console.info('🚨 Emergency market data activated');
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
    this.lastUpdate = new Date().toISOString();
    this.saveToCache();
  }

  saveToCache() {
    if (!isClient) return;
    
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        lastUpdate: this.lastUpdate
      };
      safeLocalStorage.setItem('marketDataCache', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Failed to save market cache:', error);
    }
  }

  isExpired() {
    if (!this.lastUpdate) return true;
    const now = new Date();
    const last = new Date(this.lastUpdate);
    return (now - last) > this.updateInterval;
  }

  updateWithRealData(data) {
    if (data.egx30) {
      this.set('egx30', { ...data.egx30, source: 'api' });
    }
    if (data.crypto) {
      this.set('crypto', { ...data.crypto, source: 'api' });
    }
    console.info('✅ Market data updated with real API data');
  }
}

// Global cache instance
const marketCache = new MarketDataCache();

// Emergency market data hook
export const useEmergencyMarketData = () => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    source: 'emergency',
    lastUpdate: null
  });

  // Initialize cache on mount
  useEffect(() => {
    if (!marketCache.isInitialized) {
      marketCache.initialize();
    }
    
    // Load initial data
    const egx30 = marketCache.get('egx30');
    const crypto = marketCache.get('crypto');
    
    setState({
      data: { egx30, crypto: Object.values(crypto || {}).slice(0, 3) },
      isLoading: false,
      error: null,
      source: egx30?.source || 'emergency',
      lastUpdate: marketCache.lastUpdate
    });
  }, []);

  // Try to fetch real data (non-blocking)
  const fetchRealData = useCallback(async () => {
    if (!isClient) return;

    const alphaVantageKey = ENV.api.alphaVantage;
    const baseUrl = 'https://www.alphavantage.co/query';
    
    if (!alphaVantageKey) {
      console.warn('⚠️ Alpha Vantage API key not found, using cache');
      return;
    }

    try {
      // Fetch EGX 30
      const egx30Response = await fetch(
        `${baseUrl}?function=GLOBAL_QUOTE&symbol=EGX30.CAI&apikey=${alphaVantageKey}`,
        { timeout: 5000 }
      );

      if (egx30Response.ok) {
        const egx30Data = await egx30Response.json();
        const quote = egx30Data['Global Quote'];
        
        if (quote) {
          const egx30 = {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']),
            lastUpdate: quote['07. latest trading day'],
            currency: 'EGP',
            source: 'api'
          };

          marketCache.set('egx30', egx30);
          setState(prev => ({ 
            ...prev, 
            data: { ...prev.data, egx30 },
            source: 'api',
            lastUpdate: new Date().toISOString()
          }));
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch real market data, keeping cache:', error.message);
    }
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      if (marketCache.isExpired()) {
        fetchRealData();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [fetchRealData]);

  // Manual refresh
  const refresh = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    fetchRealData().finally(() => {
      setState(prev => ({ ...prev, isLoading: false }));
    });
  }, [fetchRealData]);

  // Memoized formatted data
  const formattedData = useMemo(() => {
    if (!state.data) return null;

    const { egx30, crypto } = state.data;
    
    return {
      egx30: egx30 || EMERGENCY_CACHE.egx30,
      crypto: crypto || Object.values(EMERGENCY_CACHE.crypto).slice(0, 3),
      hasRealData: state.source === 'api',
      isUsingEmergency: state.source === 'emergency',
      lastUpdate: state.lastUpdate
    };
  }, [state.data, state.source, state.lastUpdate]);

  return {
    ...formattedData,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
    source: state.source
  };
};

// Emergency ticker component hook
export const useEmergencyTicker = () => {
  const { egx30, crypto, hasRealData, isUsingEmergency, lastUpdate } = useEmergencyMarketData();

  const formatChange = useCallback((change, changePercent) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    let icon = '→';
    let color = '#64748b';
    
    if (isPositive) {
      icon = '↑';
      color = '#10b981';
    } else if (isNegative) {
      icon = '↓';
      color = '#ef4444';
    }

    return { icon, color };
  }, []);

  const formatPrice = useCallback((price, currency = 'USD') => {
    if (currency === 'EGP') {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }, []);

  const tickerItems = useMemo(() => {
    const items = [];

    // EGX 30
    if (egx30) {
      const { icon, color } = formatChange(egx30.change, egx30.changePercent);
      
      items.push({
        type: 'stock',
        symbol: 'EGX 30',
        price: formatPrice(egx30.price, 'EGP'),
        change: `${icon} ${Math.abs(egx30.changePercent).toFixed(2)}%`,
        color,
        source: egx30.source
      });
    }

    // Crypto
    if (crypto && Array.isArray(crypto)) {
      crypto.forEach(cryptoData => {
        const { icon, color } = formatChange(cryptoData.change, cryptoData.changePercent);
        
        items.push({
          type: 'crypto',
          symbol: cryptoData.symbol,
          price: formatPrice(cryptoData.price),
          change: `${icon} ${Math.abs(cryptoData.changePercent).toFixed(2)}%`,
          color,
          source: cryptoData.source
        });
      });
    }

    return items;
  }, [egx30, crypto, formatChange, formatPrice]);

  return {
    items: tickerItems,
    hasRealData,
    isUsingEmergency,
    lastUpdate,
    status: hasRealData ? 'Live' : isUsingEmergency ? 'Emergency Cache' : 'Loading'
  };
};

export default useEmergencyMarketData;
