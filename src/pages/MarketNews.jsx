import React, { useState } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { FaNewspaper, FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaExternalLinkAlt, FaClock, FaSearch } from 'react-icons/fa';

const MarketNews = () => {
  const { news, stocks, loading, error, getLatestNews, getEGX30, getGainers, getLosers } = useMarketData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const latestNews = getLatestNews(5);
  const egx30 = getEGX30();
  const gainers = getGainers(5);
  const losers = getLosers(5);

  const formatChange = (change, changePercent) => {
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
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'أمس';
    return date.toLocaleDateString('ar-EG');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          Loading market data...
        </div>
      </div>
    );
  }

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
            <FaNewspaper style={{ color: '#3b82f6' }} />
            Market News & Analysis
          </h1>
          <p style={{ color: '#64748b' }}>
            Real-time news and market data from the Middle East
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Main Content */}
        <div>
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
                  placeholder="Search news..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          {/* News Articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredNews.map(article => (
              <div key={article.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '1.5rem'
              }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{
                    width: '200px',
                    height: '150px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      margin: 0, 
                      color: '#1e293b',
                      lineHeight: '1.4'
                    }}>
                      {article.title}
                    </h3>
                    <span style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {article.category}
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: '#64748b', 
                    margin: '0.5rem 0',
                    lineHeight: '1.5'
                  }}>
                    {article.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: '#64748b',
                      fontSize: '0.9rem'
                    }}>
                      <FaClock />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Read More
                      <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Market Overview */}
          {egx30 && (
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
                color: '#1e293b'
              }}>
                <FaChartLine />
                Market Overview
              </h3>
              
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500', color: '#1e293b' }}>EGX 30</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>
                      {egx30.price.toLocaleString()}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: formatChange(egx30.change, egx30.changePercent).color,
                      fontSize: '0.9rem'
                    }}>
                      {formatChange(egx30.change, egx30.changePercent).icon}
                      <span>{Math.abs(egx30.changePercent).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Gainers */}
          {gainers.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem', 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaArrowUp style={{ color: '#10b981' }} />
                Top Gainers
              </h3>
              
              {gainers.map(stock => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{stock.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {stock.price.toFixed(2)}
                    </div>
                    <div style={{
                      color: '#10b981',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <FaArrowUp />
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top Losers */}
          {losers.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem', 
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaArrowDown style={{ color: '#ef4444' }} />
                Top Losers
              </h3>
              
              {losers.map(stock => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{stock.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {stock.price.toFixed(2)}
                    </div>
                    <div style={{
                      color: '#ef4444',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <FaArrowDown />
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketNews;
