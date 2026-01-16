import React from 'react';
import { FaMicrochip, FaRobot, FaMobileAlt, FaLaptop, FaSatellite } from 'react-icons/fa';

const TechNews = () => {
  const news = [
    {
      id: 1,
      title: 'ثورة جديدة في الذكاء الاصطناعي',
      category: 'ذكاء اصطناعي',
      date: 'قبل 3 ساعات',
      excerpt: 'شركة عالمية تعلن عن نموذج ذكاء اصطناعي يفوق القدرات البشرية في التحليل...',
      image: '🤖',
      trending: true,
    },
    {
      id: 2,
      title: 'أحدث موبايلات 2024 تنطلق اليوم',
      category: 'موبايلات',
      date: 'قبل 6 ساعات',
      excerpt: 'إطلاق رسمي لأحدث هواتف الذكية مع ميزات تصوير مبتكرة...',
      image: '📱',
      trending: false,
    },
    {
      id: 3,
      title: 'تطورات تقنية في عالم التشفير',
      category: 'تكنولوجيا',
      date: 'قبل يوم',
      excerpt: 'باحثون يطورون نظام تشفير كمومي يحمي البيانات من الاختراقات...',
      image: '🔐',
      trending: true,
    },
    {
      id: 4,
      title: 'ثورة في بطاريات السيارات الكهربائية',
      category: 'تكنولوجيا',
      date: 'قبل يومين',
      excerpt: 'ابتكار جديد يضاعف عمر بطاريات السيارات الكهربائية...',
      image: '🔋',
      trending: false,
    },
  ];

  const categories = [
    { icon: <FaMicrochip />, name: 'ذكاء اصطناعي', count: 24 },
    { icon: <FaMobileAlt />, name: 'موبايلات', count: 18 },
    { icon: <FaLaptop />, name: 'أجهزة كمبيوتر', count: 15 },
    { icon: <FaSatellite />, name: 'تقنيات جديدة', count: 12 },
  ];

  const styles = {
    section: {
      padding: '5rem 2rem',
      backgroundColor: '#f8fafc',
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
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    newsCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
    },
    trendingBadge: {
      backgroundColor: '#f59e0b',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-block',
      marginBottom: '1rem',
    },
    newsHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },
    newsImage: {
      fontSize: '3rem',
    },
    newsContent: {
      flex: 1,
    },
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
      color: '#22c55e',
      fontWeight: '600',
    },
    newsExcerpt: {
      color: '#475569',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginTop: '3rem',
    },
    categoryCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
    },
    categoryIcon: {
      fontSize: '2rem',
      color: '#22c55e',
      marginBottom: '1rem',
    },
    categoryName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    newsCount: {
      color: '#64748b',
      fontSize: '0.9rem',
    },
  };

  return (
    <section id="tech-news" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>أخبار التكنولوجيا</h2>
          <p style={styles.subtitle}>
            أحدث الأخبار والتطورات التقنية من العالم العربي والعالمي
          </p>
        </div>

        <div style={styles.newsGrid}>
          {news.map((item) => (
            <div 
              key={item.id}
              style={styles.newsCard}
              className="card-hover"
            >
              {item.trending && <div style={styles.trendingBadge}>🔥 ترند الآن</div>}
              
              <div style={styles.newsHeader}>
                <div style={styles.newsImage}>{item.image}</div>
                <div style={styles.newsContent}>
                  <h3 style={styles.newsTitle}>{item.title}</h3>
                  <div style={styles.newsMeta}>
                    <span style={styles.newsCategory}>{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
              
              <p style={styles.newsExcerpt}>{item.excerpt}</p>
              
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}>
                اقرأ المزيد →
              </button>
            </div>
          ))}
        </div>

        <div style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div 
              key={index}
              style={styles.categoryCard}
              className="card-hover"
            >
              <div style={styles.categoryIcon}>{category.icon}</div>
              <h3 style={styles.categoryName}>{category.name}</h3>
              <div style={styles.newsCount}>{category.count} خبر جديد</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechNews;