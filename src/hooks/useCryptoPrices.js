import { useEffect, useState } from 'react';
import cryptoService from '@/services/cryptoService';

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const initializePrices = async () => {
      try {
        setLoading(true);
        
        // Subscribe to price updates
        unsubscribe = cryptoService.subscribe((newPrices) => {
          setPrices(newPrices);
          setLoading(false);
          setError(null);
        });

        // Initialize service if not already initialized
        if (!cryptoService.isInitialized) {
          await cryptoService.initialize();
        }
      } catch (err) {
        console.error('Failed to initialize crypto prices:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializePrices();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const getPrice = (symbol) => {
    return prices[symbol.toUpperCase()] || null;
  };

  const convertToUSD = (symbol, amount) => {
    return cryptoService.convertToUSD(symbol, amount);
  };

  const convertFromUSD = (symbol, usdAmount) => {
    return cryptoService.convertFromUSD(symbol, usdAmount);
  };

  return {
    prices,
    loading,
    error,
    getPrice,
    convertToUSD,
    convertFromUSD,
    allPrices: cryptoService.getAllPrices()
  };
};
