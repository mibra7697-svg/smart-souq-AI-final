import React from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaClock, FaSignal, FaExclamationTriangle } from 'react-icons/fa';

const PredictionCard = ({ analysis, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: '#64748b' }}>Analyzing {analysis?.symbol}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <FaExclamationTriangle style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }} />
        <p style={{ color: '#ef4444' }}>Error: {error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'BUY': return '#10b981';
      case 'SELL': return '#ef4444';
      case 'HOLD': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'BUY_NOW': return '#10b981';
      case 'WAIT': return '#f59e0b';
      case 'MONITOR': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 0.5rem 0',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {analysis.symbol}
            <span style={{
              fontSize: '0.8rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              color: '#64748b'
            }}>
              {analysis.type.toUpperCase()}
            </span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              {formatPrice(analysis.currentPrice)}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: analysis.change >= 0 ? '#10b981' : '#ef4444',
              fontSize: '0.9rem'
            }}>
              {analysis.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {analysis.changePercent >= 0 ? '+' : ''}{analysis.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <FaChartLine />
        </button>
      </div>

      {/* Recommendation */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: getRecommendationColor(analysis.recommendation),
          marginBottom: '0.5rem'
        }}>
          {analysis.recommendation}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Target: {formatPrice(analysis.targetPrice)}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
            Confidence
          </div>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: '#10b981' 
          }}>
            {analysis.confidence}%
          </div>
        </div>
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
            Risk Level
          </div>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: getRiskColor(analysis.riskLevel) 
          }}>
            {analysis.riskLevel}
          </div>
        </div>
      </div>

      {/* Time to Buy */}
      <div style={{
        backgroundColor: '#eff6ff',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <FaClock style={{ color: '#3b82f6' }} />
          <span style={{ fontWeight: '500', color: '#1e293b' }}>
            Best Time to Buy
          </span>
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: getActionColor(analysis.timeToBuy.action),
          marginBottom: '0.5rem'
        }}>
          {analysis.timeToBuy.action.replace('_', ' ')}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
          {analysis.timeToBuy.reason}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.5rem' }}>
          Timeframe: {analysis.timeToBuy.timeframe}
        </div>
      </div>

      {/* Technical Indicators */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          margin: '0 0 1rem 0',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FaSignal />
          Technical Indicators
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>RSI:</span>
            <span style={{ fontWeight: '500' }}>{analysis.indicators.rsi.toFixed(1)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>SMA20:</span>
            <span style={{ fontWeight: '500' }}>{formatPrice(analysis.indicators.sma20)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>SMA50:</span>
            <span style={{ fontWeight: '500' }}>{formatPrice(analysis.indicators.sma50)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Volume:</span>
            <span style={{ fontWeight: '500' }}>
              {(analysis.indicators.volume / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>

      {/* Prediction Signals */}
      <div>
        <h4 style={{ 
          fontSize: '1rem', 
          margin: '0 0 1rem 0',
          color: '#1e293b'
        }}>
          Signals
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {analysis.prediction.slice(0, 3).map((signal, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              backgroundColor: signal.type === 'bullish' ? '#f0fdf4' : 
                           signal.type === 'bearish' ? '#fef2f2' : '#f8fafc',
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: signal.type === 'bullish' ? '#10b981' : 
                                 signal.type === 'bearish' ? '#ef4444' : '#64748b'
              }}></div>
              <span style={{ color: '#1e293b' }}>{signal.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
