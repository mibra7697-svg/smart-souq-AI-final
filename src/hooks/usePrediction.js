import { useState, useEffect } from 'react';
import predictionService from '@/services/predictionService';

export const usePrediction = (symbol, type = 'stock') => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeAsset = async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await predictionService.analyzeAsset(symbol, type);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      analyzeAsset();
    }
  }, [symbol, type]);

  const refreshAnalysis = () => {
    analyzeAsset();
  };

  return {
    analysis,
    loading,
    error,
    refreshAnalysis
  };
};

export const useBatchPredictions = (symbols) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeBatch = async () => {
    if (!symbols || symbols.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      const results = await predictionService.getBatchAnalysis(symbols);
      setAnalyses(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbols && symbols.length > 0) {
      analyzeBatch();
    }
  }, [symbols]);

  return {
    analyses,
    loading,
    error,
    refreshAnalyses: analyzeBatch
  };
};
