import axios from 'axios';
import { ENV } from '@/config/env';
import { proxiedRequest } from '@/lib/proxyHandler';

class AlphaVantageService {
  constructor() {
    this.apiKey = ENV.api.alphaVantage;
    this.baseURL = 'https://www.alphavantage.co/query';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  get isConfigured() {
    return !!this.apiKey;
  }

  // Get real-time stock quote
  async getStockQuote(symbol) {
    if (!this.isConfigured) {
      console.warn(`⚠️ Alpha Vantage not configured, returning mock data for ${symbol}`);
      return this.getMockQuote(symbol);
    }

    try {
      const cacheKey = `quote_${symbol}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

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

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        const data = {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          lastUpdate: quote['07. latest trading day'],
          open: parseFloat(quote['02. open']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          previousClose: parseFloat(quote['08. previous close']),
          currency: 'USD'
        };

        this.setCache(cacheKey, data);
        return data;
      }

      throw new Error('No quote data available');
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return this.getMockQuote(symbol);
    }
  }

  // Get crypto price
  async getCryptoPrice(symbol) {
    try {
      const cacheKey = `crypto_${symbol}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const params = {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol,
        to_currency: 'USD',
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

      if (data['Realtime Currency Exchange Rate']) {
        const rate = data['Realtime Currency Exchange Rate'];
        const data = {
          symbol: symbol,
          price: parseFloat(rate['5. Exchange Rate']),
          change: 0, // Alpha Vantage doesn't provide change for crypto
          changePercent: 0,
          volume: 0,
          lastUpdate: rate['6. Last Refreshed'],
          currency: 'USD',
          fromCurrency: rate['1. From_Currency'],
          toCurrency: rate['3. To_Currency']
        };

        this.setCache(cacheKey, data);
        return data;
      }

      throw new Error('No crypto data available');
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error);
      return this.getMockCryptoPrice(symbol);
    }
  }

  // Get historical data for technical analysis
  async getHistoricalData(symbol, interval = 'daily', outputsize = 'compact') {
    try {
      const cacheKey = `history_${symbol}_${interval}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await axios.get(`${this.baseURL}`, {
        params: {
          function: 'TIME_SERIES_' + interval.toUpperCase(),
          symbol: symbol,
          outputsize: outputsize,
          apikey: this.apiKey
        },
        timeout: 15000
      });

      const timeSeriesKey = Object.keys(response.data).find(key => key.includes('Time Series'));
      if (!timeSeriesKey) {
        throw new Error('No time series data available');
      }

      const timeSeries = response.data[timeSeriesKey];
      const data = Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).reverse(); // Reverse to get chronological order

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return this.getMockHistoricalData(symbol);
    }
  }

  // Get technical indicators
  async getTechnicalIndicators(symbol, interval = 'daily') {
    try {
      const historicalData = await this.getHistoricalData(symbol, interval);
      
      if (historicalData.length < 20) {
        throw new Error('Insufficient data for technical analysis');
      }

      const closingPrices = historicalData.map(d => d.close);
      const volumes = historicalData.map(d => d.volume);

      return {
        rsi: this.calculateRSI(closingPrices),
        sma20: this.calculateSMA(closingPrices, 20),
        sma50: this.calculateSMA(closingPrices, 50),
        ema12: this.calculateEMA(closingPrices, 12),
        ema26: this.calculateEMA(closingPrices, 26),
        macd: this.calculateMACD(closingPrices),
        bollingerBands: this.calculateBollingerBands(closingPrices),
        volume: volumes[volumes.length - 1],
        avgVolume: volumes.slice(-20).reduce((a, b) => a + b, 0) / 20
      };
    } catch (error) {
      console.error(`Error calculating indicators for ${symbol}:`, error);
      return this.getMockTechnicalIndicators();
    }
  }

  // Calculate RSI (Relative Strength Index)
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return 50;

    const gains = [];
    const losses = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100;
  }

  // Calculate Simple Moving Average
  calculateSMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return Math.round((sum / period) * 100) / 100;
  }

  // Calculate Exponential Moving Average
  calculateEMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return Math.round(ema * 100) / 100;
  }

  // Calculate MACD
  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      macd: Math.round(macdLine * 100) / 100,
      signal: Math.round(signalLine * 100) / 100,
      histogram: Math.round(histogram * 100) / 100
    };
  }

  // Calculate Bollinger Bands
  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) {
      const price = prices[prices.length - 1] || 0;
      return { upper: price, middle: price, lower: price };
    }

    const recentPrices = prices.slice(-period);
    const sma = this.calculateSMA(prices, period);
    
    const variance = recentPrices.reduce((sum, price) => {
      return sum + Math.pow(price - sma, 2);
    }, 0) / period;
    
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: Math.round((sma + (standardDeviation * stdDev)) * 100) / 100,
      middle: Math.round(sma * 100) / 100,
      lower: Math.round((sma - (standardDeviation * stdDev)) * 100) / 100
    };
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock data for demo purposes
  getMockQuote(symbol) {
    const basePrice = Math.random() * 1000 + 50;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: Math.round(basePrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: Math.floor(Math.random() * 10000000),
      lastUpdate: new Date().toISOString(),
      open: basePrice,
      high: basePrice + Math.random() * 10,
      low: basePrice - Math.random() * 10,
      previousClose: basePrice - change,
      currency: 'USD'
    };
  }

  getMockCryptoPrice(symbol) {
    const basePrice = Math.random() * 50000 + 100;
    return {
      symbol,
      price: Math.round(basePrice * 100) / 100,
      change: 0,
      changePercent: 0,
      volume: Math.floor(Math.random() * 1000000000),
      lastUpdate: new Date().toISOString(),
      currency: 'USD'
    };
  }

  getMockHistoricalData(symbol) {
    const data = [];
    let basePrice = Math.random() * 1000 + 50;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      const volatility = Math.random() * 0.05 - 0.025;
      const change = basePrice * volatility;
      basePrice += change;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: basePrice,
        high: basePrice + Math.random() * 20,
        low: basePrice - Math.random() * 20,
        close: basePrice,
        volume: Math.floor(Math.random() * 10000000)
      });
    }
    
    return data;
  }

  getMockTechnicalIndicators() {
    return {
      rsi: Math.random() * 100,
      sma20: Math.random() * 1000 + 50,
      sma50: Math.random() * 1000 + 50,
      ema12: Math.random() * 1000 + 50,
      ema26: Math.random() * 1000 + 50,
      macd: {
        macd: (Math.random() - 0.5) * 10,
        signal: (Math.random() - 0.5) * 10,
        histogram: (Math.random() - 0.5) * 5
      },
      bollingerBands: {
        upper: Math.random() * 1000 + 100,
        middle: Math.random() * 1000 + 50,
        lower: Math.random() * 1000 + 10
      },
      volume: Math.floor(Math.random() * 10000000),
      avgVolume: Math.floor(Math.random() * 10000000)
    };
  }
}

// Create singleton instance
const alphaVantageService = new AlphaVantageService();

export default alphaVantageService;
