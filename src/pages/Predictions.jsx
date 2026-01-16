import React, { useState } from 'react';
import { useBatchPredictions } from '@/hooks/usePrediction';
import PredictionCard from '@/components/PredictionCard';
import { FaBrain, FaSearch, FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const Predictions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const defaultSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD',
    'BTC-USD', 'ETH-USD', 'BNB-USD', 'ADA-USD', 'DOT-USD', 'SOL-USD'
  ];

  const { analyses, loading, error, refreshAnalyses } = useBatchPredictions(defaultSymbols);

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || analysis.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTopBuys = () => {
    return filteredAnalyses
      .filter(a => a.recommendation === 'BUY')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  };

  const getTopSells = () => {
    return filteredAnalyses
      .filter(a => a.recommendation === 'SELL')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  };

  const getHighConfidence = () => {
    return filteredAnalyses
      .filter(a => a.confidence >= 75)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  };

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: '#ef4444',
        fontSize: '1.2rem'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaBrain style={{ color: '#3b82f6' }} />
            AI Market Predictions
          </h1>
          <p style={{ color: '#64748b' }}>
            Technical analysis and buy/sell recommendations powered by Alpha Vantage
          </p>
        </div>
        <button
          onClick={refreshAnalyses}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaChartLine />
          {loading ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#64748b'
            }} />
            <input
              type="text"
              placeholder="Search stocks or crypto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Assets</option>
            <option value="stock">Stocks</option>
            <option value="crypto">Crypto</option>
          </select>
        </div>
      </div>

      {/* Quick Insights */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Top Buys */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#10b981'
          }}>
            <FaArrowUp />
            Top Buy Signals
          </h3>
          {getTopBuys().map((analysis, index) => (
            <div key={analysis.symbol} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < getTopBuys().length - 1 ? '1px solid #f1f5f9' : 'none'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{analysis.symbol}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  ${analysis.currentPrice.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold', 
                  color: '#10b981' 
                }}>
                  {analysis.confidence}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Target: ${analysis.targetPrice.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          {getTopBuys().length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              No buy signals detected
            </div>
          )}
        </div>

        {/* Top Sells */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#ef4444'
          }}>
            <FaArrowDown />
            Top Sell Signals
          </h3>
          {getTopSells().map((analysis, index) => (
            <div key={analysis.symbol} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < getTopSells().length - 1 ? '1px solid #f1f5f9' : 'none'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{analysis.symbol}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  ${analysis.currentPrice.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold', 
                  color: '#ef4444' 
                }}>
                  {analysis.confidence}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Target: ${analysis.targetPrice.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          {getTopSells().length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              No sell signals detected
            </div>
          )}
        </div>

        {/* High Confidence */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3b82f6'
          }}>
            <FaBrain />
            High Confidence
          </h3>
          {getHighConfidence().map((analysis, index) => (
            <div key={analysis.symbol} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < getHighConfidence().length - 1 ? '1px solid #f1f5f9' : 'none'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{analysis.symbol}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {analysis.recommendation}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold', 
                  color: '#3b82f6' 
                }}>
                  {analysis.confidence}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {analysis.riskLevel}
                </div>
              </div>
            </div>
          ))}
          {getHighConfidence().length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
              No high confidence predictions
            </div>
          )}
        </div>
      </div>

      {/* Detailed Predictions */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
          Detailed Analysis
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem'
        }}>
          {filteredAnalyses.map(analysis => (
            <PredictionCard
              key={analysis.symbol}
              analysis={analysis}
              loading={loading}
              error={error}
              onRefresh={() => refreshAnalyses()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
