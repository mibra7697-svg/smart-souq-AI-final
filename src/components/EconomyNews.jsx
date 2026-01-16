import React from 'react';
import { FaChartLine, FaBitcoin, FaDollarSign, FaBuilding, FaGlobe } from 'react-icons/fa';

const EconomyNews = () => {
  const economicNews = [
    {
      id: 1,
      title: 'تقلبات سوق الأسهم العالمية',
      category: 'أسهم',
      date: 'قبل ساعتين',
      impact: 'high',
      excerpt: 'سوق الأسهم يشهد تقلبات حادة مع تغير السياسات النقدية العالمية...',
      change: '-2.4%',
    },
    {
      id: 2,
      title: 'ارتفاع قياسي للبيتكوين',
      category: 'عملات رقمية',
      date: 'قبل 5 ساعات',
      impact: 'very-high',
      excerpt: 'البيتكوين يتجاوز حاجز 70,000 دولار لأول مرة هذا العام...',
      change: '+8.7%',
    },
    {
      id: 3,
      title: 'تقارير اقتصادية جديدة',
      category: 'تقارير',
      date: 'قبل يوم',
      impact: 'medium',
      excerpt: 'إطلاق تقارير اقتصادية ربع سنوية تشير إلى نمو اقتصادي...',
      change: '+1.2%',
    },
    {
      id: 4,
      title: 'تطورات النفط العالمية',
      category: 'سلع',
      date: 'قبل يومين',
      impact: 'high',
      excerpt: 'أسعار النفط تشهد استقراراً مع زيادة المعروض العالمي...',
      change: '+0.8%',
    },
  ];

  const stockIndices = [
    { name: 'تاسي', value: '12,345', change: '+1.2%', color: '#22c55e' },
    { name: 'ناسداك', value: '16,789', change: '-0.8%', color: '#ef4444' },
    { name: 'داو جونز', value: '39,456', change: '+0.5%', color: '#22c55e' },
    { name: 'S&P 500', value: '5,234', change: '+0.3%', color: '#22c55e' },
  ];

  const cryptoPrices = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$70,245', change: '+8.7%' },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,890', change: '+5.2%' },
    { name: 'Solana', symbol: 'SOL', price: '$185', change: '+12.4%' },
    { name: 'Cardano', symbol: 'ADA', price: '$0.68', change: '-1.2%' },
  ];

  const styles = {
    section: {
      padding: '5rem 2rem',
      backgroundColor: '#ffffff',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      color: '#1e293b',
      marginBottom: '1rem',
      fontWeight: '700',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    newsCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    impactBadge: (impact) => ({
      backgroundColor: impact === 'very-high' ? '#ef4444' : 
                      impact === 'high' ? '#f59e0b' : 
                      impact === 'medium' ? '#3b82f6' : '#22c55e',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-block',
      marginBottom: '1rem',
    }),
    newsTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
    },
    newsMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#64748b',
      fontSize: '0.9rem',
      marginBottom: '1rem',
    },
    newsCategory: {
      color: '#3b82f6',
      fontWeight: '600',
    },
    newsExcerpt: {
      color: '#475569',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    priceChange: (change) => ({
      color: change.startsWith('+') ? '#22c55e' : '#ef4444',
      fontWeight: 'bold',
      fontSize: '1.1rem',
    }),
    marketSection: {
      marginTop: '3rem',
      padding: '2rem',
      backgroundColor: '#f0fdf4',
      borderRadius: '16px',
    },
    marketTitle: {
      fontSize: '1.8rem',
      color: '#1e293b',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    marketGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    marketCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    },
    marketName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    marketValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    cryptoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginTop: '2rem',
    },
    cryptoCard: {
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '1rem',
      borderRadius: '12px',
      textAlign: 'center',
    },
    cryptoSymbol: {
      fontSize: '0.9rem',
      color: '#94a3b8',
      marginBottom: '0.3rem',
    },
    cryptoName: {
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    cryptoPrice: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.3rem',
    },
  };

  return (
    <section id="economy-news" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>أخبار الاقتصاد والأسواق</h2>
          <p style={styles.subtitle}>
            آخر التطورات الاقتصادية وأسعار الأسهم والعملات الرقمية
          </p>
        </div>

        <div style={styles.contentGrid}>
          {economicNews.map((item) => (
            <div 
              key={item.id}
              style={styles.newsCard}
              className="card-hover"
            >
              <div style={styles.impactBadge(item.impact)}>
                {item.impact === 'very-high' ? 'تأثير عالي جداً' :
                 item.impact === 'high' ? 'تأثير عالي' :
                 item.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض'}
              </div>
              
              <h3 style={styles.newsTitle}>{item.title}</h3>
              
              <div style={styles.newsMeta}>
                <span style={styles.newsCategory}>{item.category}</span>
                <span>{item.date}</span>
              </div>
              
              <p style={styles.newsExcerpt}>{item.excerpt}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.priceChange(item.change)}>{item.change}</span>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}>
                  تحليل مفصل →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.marketSection}>
          <h3 style={styles.marketTitle}>أسعار المؤشرات العالمية</h3>
          
          <div style={styles.marketGrid}>
            {stockIndices.map((index, idx) => (
              <div key={idx} style={styles.marketCard}>
                <div style={styles.marketName}>{index.name}</div>
                <div style={styles.marketValue}>{index.value}</div>
                <div style={{ color: index.color, fontWeight: '600' }}>
                  {index.change}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ ...styles.marketTitle, fontSize: '1.5rem', marginBottom: '1rem' }}>
              العملات الرقمية <FaBitcoin style={{ marginRight: '0.5rem' }} />
            </h3>
            
            <div style={styles.cryptoGrid}>
              {cryptoPrices.map((crypto, idx) => (
                <div key={idx} style={styles.cryptoCard}>
                  <div style={styles.cryptoSymbol}>{crypto.symbol}</div>
                  <div style={styles.cryptoName}>{crypto.name}</div>
                  <div style={styles.cryptoPrice}>{crypto.price}</div>
                  <div style={styles.priceChange(crypto.change)}>{crypto.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EconomyNews;