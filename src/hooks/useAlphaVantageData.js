import useSWR from 'swr';
import axios from 'axios';
import { ENV } from '@/config/env';

const fetcher = async (url) => {
  const response = await axios.get(url, { timeout: 10000 });
  return response.data;
};

// EGX 30 Data Hook
export const useEGX30 = () => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  const url = apiKey 
    ? `${baseUrl}?function=GLOBAL_QUOTE&symbol=EGX30.CAI&apikey=${apiKey}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      refreshInterval: 120000, // 2 minutes for stock data
      revalidateOnFocus: false, // Don't refetch on focus for stocks
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.error('Error fetching EGX 30 data:', error);
      }
    }
  );

  // Transform data
  const quote = data?.['Global Quote'];
  const egx30Data = quote ? {
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
    currency: 'EGP'
  } : null;

  return {
    data: egx30Data,
    isLoading,
    error,
    mutate,
    isEmpty: !isLoading && !egx30Data
  };
};

// Cryptocurrency Data Hook
export const useCryptoData = (symbols = ['BTC', 'ETH', 'BNB']) => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  
  const fetchCryptoData = async () => {
    if (!apiKey) return null;

    const promises = symbols.map(symbol =>
      axios.get(`${baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`, { timeout: 5000 })
        .catch(error => {
          console.warn(`Failed to fetch ${symbol}:`, error.message);
          return null;
        })
    );

    const responses = await Promise.allSettled(promises);
    
    const cryptoData = {};
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled' && response.value?.data?.['Realtime Currency Exchange Rate']) {
        const rate = response.value.data['Realtime Currency Exchange Rate'];
        const symbol = symbols[index];
        
        cryptoData[symbol] = {
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
      }
    });

    return cryptoData;
  };

  const { data, error, isLoading, mutate } = useSWR(
    apiKey ? 'crypto-data' : null,
    fetchCryptoData,
    {
      refreshInterval: 60000, // 1 minute for crypto data
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.error('Error fetching crypto data:', error);
      }
    }
  );

  return {
    data: data || {},
    isLoading,
    error,
    mutate,
    isEmpty: !isLoading && (!data || Object.keys(data).length === 0)
  };
};

// Combined Market Ticker Hook
export const useMarketTicker = () => {
  const { data: egx30, isLoading: egxLoading, error: egxError } = useEGX30();
  const { data: crypto, isLoading: cryptoLoading, error: cryptoError } = useCryptoData(['BTC', 'ETH', 'BNB']);

  const isLoading = egxLoading || cryptoLoading;
  const error = egxError || cryptoError;

  // Get top crypto movers (mock data for demonstration)
  const topCrypto = Object.values(crypto || {}).slice(0, 3);

  return {
    egx30,
    crypto: topCrypto,
    isLoading,
    error,
    hasData: egx30 || (crypto && Object.keys(crypto).length > 0)
  };
};

// Historical Data Hook for Charts
export const useHistoricalData = (symbol, interval = 'daily') => {
  const apiKey = ENV.api.alphaVantage;
  const baseUrl = 'https://www.alphavantage.co/query';
  const url = apiKey 
    ? `${baseUrl}?function=TIME_SERIES_${interval.toUpperCase()}&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      refreshInterval: 300000, // 5 minutes for historical data
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
      errorRetryInterval: 10000,
      onError: (error) => {
        console.error(`Error fetching historical data for ${symbol}:`, error);
      }
    }
  );

  // Transform data
  const timeSeriesKey = data && Object.keys(data).find(key => key.includes('Time Series'));
  const historicalData = timeSeriesKey && data[timeSeriesKey] 
    ? Object.entries(data[timeSeriesKey]).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).reverse()
    : [];

  return {
    data: historicalData,
    isLoading,
    error,
    mutate,
    isEmpty: !isLoading && historicalData.length === 0
  };
};

// Technical Indicators Hook
export const useTechnicalIndicators = (symbol) => {
  const { data: historicalData, isLoading: historyLoading } = useHistoricalData(symbol);
  
  const calculateIndicators = (data) => {
    if (!data || data.length < 20) return null;

    const closingPrices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);

    // RSI
    const calculateRSI = (prices, period = 14) => {
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
      return 100 - (100 / (1 + rs));
    };

    // Moving Averages
    const calculateSMA = (prices, period) => {
      if (prices.length < period) return prices[prices.length - 1] || 0;
      const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
      return sum / period;
    };

    const calculateEMA = (prices, period) => {
      if (prices.length < period) return prices[prices.length - 1] || 0;
      const multiplier = 2 / (period + 1);
      let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
      
      for (let i = period; i < prices.length; i++) {
        ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
      }
      
      return ema;
    };

    return {
      rsi: calculateRSI(closingPrices),
      sma20: calculateSMA(closingPrices, 20),
      sma50: calculateSMA(closingPrices, 50),
      ema12: calculateEMA(closingPrices, 12),
      ema26: calculateEMA(closingPrices, 26),
      volume: volumes[volumes.length - 1],
      avgVolume: volumes.slice(-20).reduce((a, b) => a + b, 0) / 20,
      lastUpdate: data[data.length - 1]?.date
    };
  };

  const indicators = historicalData ? calculateIndicators(historicalData) : null;

  return {
    indicators,
    isLoading: historyLoading,
    historicalData
  };
};
