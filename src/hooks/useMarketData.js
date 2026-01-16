import { useEffect, useState } from 'react';
import newsService from '@/services/newsService';
import stockService from '@/services/stockService';

export const useMarketData = () => {
  const [news, setNews] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeNews = null;
    let unsubscribeStocks = null;

    const initializeMarketData = async () => {
      try {
        setLoading(true);
        
        // Subscribe to news updates
        unsubscribeNews = newsService.subscribe((articles) => {
          setNews(articles);
          setError(null);
        });

        // Subscribe to stock updates
        unsubscribeStocks = stockService.subscribe((stockData) => {
          setStocks(stockData);
          setError(null);
        });

        // Initialize services if not already initialized
        if (!newsService.isInitialized) {
          await newsService.initialize();
        }
        if (!stockService.isInitialized) {
          await stockService.initialize();
        }
      } catch (err) {
        console.error('Failed to initialize market data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeMarketData();

    // Cleanup
    return () => {
      if (unsubscribeNews) unsubscribeNews();
      if (unsubscribeStocks) unsubscribeStocks();
    };
  }, []);

  const getLatestNews = (limit = 5) => {
    return news
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);
  };

  const getEGX30 = () => {
    return stockService.getEGX30();
  };

  const getTopMovers = (limit = 3) => {
    return stockService.getTopMovers(limit);
  };

  const getGainers = (limit = 3) => {
    return stockService.getGainers(limit);
  };

  const getLosers = (limit = 3) => {
    return stockService.getLosers(limit);
  };

  return {
    news,
    stocks,
    loading,
    error,
    getLatestNews,
    getEGX30,
    getTopMovers,
    getGainers,
    getLosers
  };
};
