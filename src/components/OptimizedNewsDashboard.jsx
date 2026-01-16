import React, { useState, memo, useMemo, useCallback, Suspense, lazy } from 'react';
import { useCombinedArabicNews } from '@/hooks/useNewsData';
import { FaNewspaper, FaClock, FaExternalLinkAlt, FaSearch, FaFilter, FaSync } from 'react-icons/fa';

// Skeleton loaders
const ArticleSkeleton = memo(() => (
  <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div style={{
        width: '120px',
        height: '80px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        flexShrink: 0
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          height: '20px',
          backgroundColor: '#f1f5f9',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          width: '80%'
        }} />
        <div style={{
          height: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          width: '100%'
        }} />
        <div style={{
          height: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '4px',
          marginBottom: '1rem',
          width: '60%'
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            height: '14px',
            backgroundColor: '#f1f5f9',
            borderRadius: '4px',
            width: '150px'
          }} />
          <div style={{
            height: '14px',
            backgroundColor: '#f1f5f9',
            borderRadius: '4px',
            width: '80px'
          }} />
        </div>
      </div>
    </div>
  </div>
));

const HeaderSkeleton = memo(() => (
  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
    <div style={{
      height: '24px',
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
      marginBottom: '0.5rem',
      width: '200px'
    }} />
    <div style={{
      height: '16px',
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
      width: '300px'
    }} />
  </div>
));

const SearchSkeleton = memo(() => (
  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
    <div style={{
      display: 'flex',
      gap: '1rem'
    }}>
      <div style={{
        flex: 1,
        height: '44px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '16px',
          backgroundColor: '#e2e8f0',
          borderRadius: '50%'
        }} />
      </div>
      <div style={{
        height: '44px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        width: '150px'
      }} />
    </div>
  </div>
));

const OptimizedNewsDashboard = memo(() => {
  const { articles, isLoading, error, techCount, financeCount, mutate } = useCombinedArabicNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized filtered articles
  const filteredArticles = useMemo(() => {
    if (!articles || !Array.isArray(articles)) return [];
    
    return articles.filter(article => {
      const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Memoized category data
  const categoryData = useMemo(() => ({
    tech: { count: techCount, color: '#3b82f6', label: 'تقنية' },
    business: { count: financeCount, color: '#10b981', label: 'أعمال' }
  }), [techCount, financeCount]);

  // Optimized date formatter
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'الآن';
      if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
      if (diffInHours < 48) return 'أمس';
      return date.toLocaleDateString('ar-EG');
    } catch (error) {
      return 'غير معروف';
    }
  }, []);

  // Optimized category helpers
  const getCategoryColor = useCallback((category) => {
    return categoryData[category]?.color || '#64748b';
  }, [categoryData]);

  const getCategoryLabel = useCallback((category) => {
    return categoryData[category]?.label || 'أخرى';
  }, [categoryData]);

  // Optimized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleArticleClick = useCallback((articleId) => {
    setExpandedArticle(prev => prev === articleId ? null : articleId);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } catch (error) {
      console.warn('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  const handleArticleLinkClick = useCallback((e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Loading state
  if (isLoading && !articles) {
    return (
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <HeaderSkeleton />
        <SearchSkeleton />
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {[1, 2, 3, 4, 5].map(i => <ArticleSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error && !articles) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <FaNewspaper style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }} />
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>News Loading Error</h3>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          {error.message || 'Failed to load news articles'}
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            backgroundColor: isRefreshing ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          <FaSync style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          {isRefreshing ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1e293b'
          }}>
            <FaNewspaper style={{ color: '#3b82f6' }} />
            Arabic News Dashboard
          </h2>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Tech: {techCount}</span>
            <span>Business: {financeCount}</span>
            <span>Total: {filteredArticles.length}</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          style={{
            backgroundColor: isRefreshing || isLoading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: isRefreshing || isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <FaSync style={{ animation: isRefreshing || isLoading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
              onChange={handleSearchChange}
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
            onChange={handleCategoryChange}
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
          </select>
        </div>
      </div>

      {/* News Articles */}
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {filteredArticles.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#64748b'
          }}>
            <FaNewspaper style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <p>No articles found matching your criteria</p>
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <div
              key={article.id}
              style={{
                padding: '1.5rem',
                borderBottom: index < filteredArticles.length - 1 ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => handleArticleClick(article.id)}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Image */}
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      flexShrink: 0
                    }}
                    loading="lazy"
                  />
                )}
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      margin: 0, 
                      color: '#1e293b',
                      lineHeight: '1.4',
                      flex: 1
                    }}>
                      {article.title}
                    </h3>
                    <span style={{
                      backgroundColor: getCategoryColor(article.category),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      marginRight: '0.5rem'
                    }}>
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: '#64748b', 
                    margin: '0.5rem 0',
                    lineHeight: '1.5',
                    fontSize: '0.9rem'
                  }}>
                    {expandedArticle === article.id ? article.content : article.description}
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
                      fontSize: '0.8rem'
                    }}>
                      <FaClock />
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.source}</span>
                    </div>
                    
                    <a
                      href={article.url}
                      onClick={(e) => handleArticleLinkClick(e, article.url)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      Read More
                      <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <p>Smart Souq AI News Service • System Status: Active (Mock Mode)</p>
      </div>
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

OptimizedNewsDashboard.displayName = 'OptimizedNewsDashboard';

export default OptimizedNewsDashboard;
