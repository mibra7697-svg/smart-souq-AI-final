import React, { useState, useEffect } from 'react';
import { FaRobot, FaLightbulb, FaChartLine, FaSyncAlt } from 'react-icons/fa';
import aiService from '@/services/aiService.js';
import cryptoService from '@/services/cryptoService.js';
import stockService from '@/services/stockService.js';
import { useValidation } from '@/contexts/ValidationContext.jsx';

const SmartAIAnalyst = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const { useMockData } = useValidation();

  const generateInsight = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      // Gather current market data safely
      const cryptoPrices = cryptoService.getAllPrices() || {};
      const stocks = ['AAPL', 'MSFT', 'TSLA'];
      const stockData = {};
      
      // Use a timeout for the data gathering phase
      const dataFetchPromise = (async () => {
        for (const symbol of stocks) {
          try {
            const data = await stockService.getStockData(symbol);
            if (data) stockData[symbol] = data;
          } catch (sErr) {
            console.warn(`Stock data fetch failed for ${symbol}:`, sErr.message);
          }
        }
      })();

      await Promise.race([
        dataFetchPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Data fetch timeout')), 5000))
      ]).catch(e => console.warn('Market data fetch partial or timed out:', e.message));

      // Check if we have at least SOME data to analyze
      const hasCrypto = Object.keys(cryptoPrices).length > 0;
      const hasStocks = Object.keys(stockData).length > 0;

      if (!hasCrypto && !hasStocks) {
        return; // Silent return, handled by UI
      }

      const marketData = {
        crypto: cryptoPrices,
        stocks: stockData,
        timestamp: new Date().toISOString(),
        isMock: useMockData
      };

      const result = await aiService.analyzeMarketData(marketData);
      if (!result) {
        setInsight('جاري مسح الأسواق... (Market Scan in Progress)');
      } else {
        setInsight(result);
      }
      setIsInitializing(false);
    } catch (err) {
      console.warn('AI insight generation failed:', err.message);
      setError('فشل في إنشاء التحليل الذكي. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
  }, []);

  return (
    <div className="ai-analyst-container" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <FaRobot style={styles.icon} />
          <h3 style={styles.title}>المحلل الذكي (Smart AI Analyst)</h3>
        </div>
        <button 
          onClick={generateInsight} 
          disabled={loading}
          style={styles.refreshBtn}
          title="تحديث التحليل"
        >
          <FaSyncAlt className={loading ? 'fa-spin' : ''} />
        </button>
      </div>

      <div style={styles.content}>
        {loading || isInitializing ? (
          <div style={styles.loading}>
            <div className="spinner" style={styles.spinner}></div>
            <span>{isInitializing ? 'جاري مسح الأسواق... (Market Scan in Progress)' : 'جاري تحليل بيانات السوق...'}</span>
          </div>
        ) : error ? (
          <div style={styles.error}>
            <FaLightbulb style={{ marginLeft: '10px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <span>{error}</span>
              <button 
                onClick={generateInsight}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                إعادة المحاولة (Retry)
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.insight}>
            <FaLightbulb style={styles.insightIcon} />
            <p style={styles.text}>{insight}</p>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.tag}>
          {useMockData ? '⚠️ وضع المحاكاة' : '✅ بيانات حقيقية'}
        </span>
        <span style={styles.modelTag}>Powered by Gemini 1.5 Flash</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem',
    direction: 'rtl',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '1rem',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  icon: {
    fontSize: '1.5rem',
    color: '#3b82f6',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  refreshBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    minHeight: '80px',
  },
  insight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '12px',
    borderRight: '4px solid #3b82f6',
  },
  insightIcon: {
    color: '#f59e0b',
    fontSize: '1.25rem',
    marginTop: '0.25rem',
    flexShrink: 0,
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#334155',
    margin: 0,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    padding: '1rem',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
  },
  tag: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    fontWeight: '600',
  },
  modelTag: {
    color: '#94a3b8',
    fontStyle: 'italic',
  }
};

// Add keyframes for spinner in a style tag or CSS file
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default SmartAIAnalyst;
