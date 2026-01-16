import React, { memo, useMemo, useEffect, useState } from 'react';
import { useLiveMarketTicker } from '@/hooks/useLiveMarketData';
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaBitcoin, FaEthereum, FaSpinner } from 'react-icons/fa';

// Skeleton loader
const SkeletonLoader = memo(() => (
  <div style={{
    display: 'flex',
    gap: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    alignItems: 'center'
  }}>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    }}>
      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#64748b' }}>Loading market data...</span>
    </div>
    
    {/* Crypto skeletons */}
    {['BTC', 'ETH', 'BNB'].map(symbol => (
      <div key={symbol} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '16px',
          height: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '50%'
        }} />
        <div style={{
          width: '60px',
          height: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '4px'
        }} />
        <div style={{
          width: '40px',
          height: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '4px'
        }} />
      </div>
    ))}
  </div>
));

const LiveMarketTicker = memo(() => {
  const { egx30, crypto, isLoading, isLive, status, lastUpdate } = useLiveMarketTicker();

  // Memoized change formatter
  const formatChange = useMemo(() => (change, changePercent) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    let icon = <FaMinus />;
    let color = '#64748b';
    
    if (isPositive) {
      icon = <FaArrowUp />;
      color = '#10b981';
    } else if (isNegative) {
      icon = <FaArrowDown />;
      color = '#ef4444';
    }

    return { icon, color };
  }, []);

  // Memoized price formatter
  const formatPrice = useMemo(() => (price, currency = 'USD') => {
    if (currency === 'EGP') {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }, []);

  // Show skeleton while loading
  if (isLoading && !egx30 && !crypto.length) {
    return <SkeletonLoader />;
  }

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      overflow: 'hidden',
      alignItems: 'center',
      position: 'relative',
      border: !isLive ? '1px dashed #f59e0b' : '1px solid transparent'
    }}>
      {/* Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginRight: '0.5rem',
        padding: '0.25rem 0.5rem',
        backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        <FaChartLine style={{ 
          color: isLive ? '#10b981' : '#f59e0b',
          fontSize: '0.9rem'
        }} />
        <span style={{ 
          color: isLive ? '#10b981' : '#f59e0b',
          fontWeight: '500'
        }}>
          {status}
        </span>
      </div>

      {/* EGX 30 */}
      {egx30 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '500',
          padding: '0.25rem 0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '6px',
          border: egx30.source === 'fallback' ? '1px dashed #f59e0b' : '1px solid transparent',
          transition: 'all 0.2s ease'
        }}>
          <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>EGX 30:</span>
          <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>
            {formatPrice(egx30.price, 'EGP')}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: formatChange(egx30.change, egx30.changePercent).color,
            fontSize: '0.8rem'
          }}>
            {formatChange(egx30.change, egx30.changePercent).icon}
            <span>{Math.abs(egx30.changePercent).toFixed(2)}%</span>
          </div>
        </div>
      )}

      {/* Cryptocurrencies */}
      {crypto && Array.isArray(crypto) && crypto.map(cryptoData => {
        const { icon, color } = formatChange(cryptoData.change, cryptoData.changePercent);
        const CryptoIcon = cryptoData.symbol === 'BTC' ? FaBitcoin : 
                          cryptoData.symbol === 'ETH' ? FaEthereum : FaChartLine;
        
        return (
          <div
            key={cryptoData.symbol}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '6px',
              border: cryptoData.source === 'fallback' ? '1px dashed #f59e0b' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <CryptoIcon style={{ color: '#f59e0b', fontSize: '0.8rem' }} />
            <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>
              {cryptoData.symbol}:
            </span>
            <span style={{ color: '#1e293b', fontSize: '0.9rem' }}>
              {formatPrice(cryptoData.price)}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: color,
              fontSize: '0.8rem'
            }}>
              {icon}
              <span>{Math.abs(cryptoData.changePercent).toFixed(2)}%</span>
            </div>
          </div>
        );
      })}

      {/* Loading indicator for partial loading */}
      {isLoading && (egx30 || crypto.length > 0) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#64748b',
          fontSize: '0.8rem'
        }}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
          <span>Updating...</span>
        </div>
      )}

      {/* Last update */}
      {lastUpdate && (
        <div style={{
          position: 'absolute',
          right: '1rem',
          bottom: '-6px',
          fontSize: '0.7rem',
          color: '#94a3b8',
          opacity: 0.7
        }}>
          {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      )}

      {/* Demo mode indicator */}
      {!isLive && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '1rem',
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600'
        }}>
          Demo Mode
        </div>
      )}
    </div>
  );
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

LiveMarketTicker.displayName = 'LiveMarketTicker';

export default LiveMarketTicker;
