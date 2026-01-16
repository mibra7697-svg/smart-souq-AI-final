import axios from 'axios';
import { ENV } from '@/config/env';
import { proxiedRequest } from '@/lib/proxyHandler';

class StockService {
  constructor() {
    this.apiKey = ENV.api.alphaVantage;
    this.baseURL = 'https://www.alphavantage.co/query';
    this.cache = this.loadFromCache();
  }

  get isConfigured() {
    return !!this.apiKey;
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem('stock_data_cache');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  }

  saveToCache(symbol, data) {
    try {
      const current = this.loadFromCache();
      current[symbol] = { ...data, timestamp: Date.now() };
      localStorage.setItem('stock_data_cache', JSON.stringify(current));
    } catch (e) {
      // Ignore
    }
  }

  async getStockData(symbol) {
    if (!this.isConfigured) {
      return this.getMockStockData(symbol);
    }

    try {
      const params = {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: this.apiKey
      };

      // Use proxy handler for CORS-safe request
      const data = await proxiedRequest(
        `${this.baseURL}?${new URLSearchParams(params).toString()}`,
        {
          apiType: 'alphavantage',
          timeout: 10000,
          retries: 1,
          fallback: null
        }
      );

      const quoteData = data['Global Quote'];
      if (!quoteData || Object.keys(quoteData).length === 0) {
        // Handle API limit or error messages
        const errorMsg = data['Note'] || data['Error Message'];
        if (errorMsg) {
          console.warn(`Stock API Note/Error for ${symbol}:`, errorMsg);
        }
        throw new Error('Invalid API response');
      }

      const result = {
        symbol: quoteData['01. symbol'],
        price: parseFloat(quoteData['05. price']),
        change: parseFloat(quoteData['09. change']),
        changePercent: quoteData['10. change percent']
      };

      this.saveToCache(symbol, result);
      return result;
    } catch (error) {
      console.warn(`Fetch failed for ${symbol}, using cache/mock:`, error.message);
      const cached = this.loadFromCache()[symbol];
      if (cached) return cached;
      return this.getMockStockData(symbol);
    }
  }

  getMockStockData(symbol) {
    return {
      symbol: symbol,
      price: 150.00,
      change: 2.50,
      changePercent: '1.67%'
    };
  }
}

export const stockService = new StockService();
export default stockService;
