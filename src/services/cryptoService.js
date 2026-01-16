import { ENV } from '@/config/env';
import apiClient, { getProxiedPath } from './apiClient';

class CryptoService {
  constructor() {
    this.prices = this.loadFromCache();
    this.subscribers = [];
    this.isInitialized = false;
    this.pollingInterval = null;
  }

  // Cache management
  loadFromCache() {
    try {
      const cached = localStorage.getItem('crypto_prices_cache');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  }

  saveToCache(prices) {
    try {
      localStorage.setItem('crypto_prices_cache', JSON.stringify(prices));
    } catch (e) {
      // Ignore cache errors
    }
  }

  // Robust proxy handling for origin mismatches
  getProxiedURL(targetUrl, type = 'binance') {
    return getProxiedPath(targetUrl, type);
  }

  // Non-blocking initialization
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initial fetch without blocking
      await this.fetchPrices();
      
      // Start polling after initial fetch
      this.startPolling();
      this.isInitialized = true;
    } catch (error) {
      // Catch error silently
      console.warn('CryptoService initialization partial:', error.message);
    }
  }

  async fetchPrices() {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];
      const promises = symbols.map(symbol => {
        const baseUrl = 'https://api.binance.com/api/v3';
        const endpoint = `/ticker/price?symbol=${symbol}`;
        const finalUrl = this.getProxiedURL(`${baseUrl}${endpoint}`, 'binance');
        
        return apiClient.get(finalUrl).catch(() => null);
      });

      const responses = await Promise.allSettled(promises);
      
      const newPrices = {};
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value?.data) {
          const symbol = symbols[index];
          const price = parseFloat(response.value.data.price);
          if (!isNaN(price)) {
            newPrices[symbol.replace('USDT', '')] = price;
          }
        }
      });

      if (Object.keys(newPrices).length > 0) {
        this.prices = { ...this.prices, ...newPrices };
        this.saveToCache(this.prices);
        this.notifySubscribers();
      }
    } catch (error) {
      // Fail silently and keep existing/cached prices
      console.warn('CryptoService fetchPrices failed silently:', error.message);
    }
  }

  startPolling() {
    // Clear existing interval if any
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Poll every 30 seconds
    this.pollingInterval = setInterval(() => {
      this.fetchPrices();
    }, 30000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    
    // Return current prices immediately if available
    if (Object.keys(this.prices).length > 0) {
      callback(this.prices);
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.prices);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  getPrice(symbol) {
    return this.prices[symbol.toUpperCase()] || null;
  }

  getAllPrices() {
    return { ...this.prices };
  }

  // Convert amount from one crypto to USD
  convertToUSD(symbol, amount) {
    const price = this.getPrice(symbol);
    return price ? amount * price : null;
  }

  // Convert amount from USD to crypto
  convertFromUSD(symbol, usdAmount) {
    const price = this.getPrice(symbol);
    return price ? usdAmount / price : null;
  }
}

// Create singleton instance
const cryptoService = new CryptoService();

// Auto-initialize in background without blocking
if (typeof window !== 'undefined') {
  // Use setTimeout to defer initialization
  setTimeout(() => {
    cryptoService.initialize().catch(console.error);
  }, 100);
}

export default cryptoService;
