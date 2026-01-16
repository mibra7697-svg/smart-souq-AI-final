import React from 'react';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';

const CryptoPriceTicker = () => {
  const { prices, loading, error } = useCryptoPrices();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        gap: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <span>Loading prices...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        gap: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#ef4444'
      }}>
        <span>Price data unavailable</span>
      </div>
    );
  }

  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', icon: <FaBitcoin />, color: '#f7931a' },
    { symbol: 'ETH', name: 'Ethereum', icon: <FaEthereum />, color: '#627eea' },
    { symbol: 'BNB', name: 'Binance Coin', icon: '🔶', color: '#f3ba2f' },
    { symbol: 'ADA', name: 'Cardano', icon: '₳', color: '#0033ad' },
    { symbol: 'DOT', name: 'Polkadot', icon: '●', color: '#e6007a' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      overflow: 'hidden'
    }}>
      {cryptoData.map(crypto => {
        const price = prices[crypto.symbol];
        if (!price) return null;

        return (
          <div
            key={crypto.symbol}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: crypto.color,
              fontWeight: '500'
            }}
          >
            <span style={{ fontSize: '1rem' }}>
              {typeof crypto.icon === 'string' ? crypto.icon : crypto.icon}
            </span>
            <span>{crypto.symbol}</span>
            <span>${price.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoPriceTicker;
