import React from 'react';
import { 
  FaBrain, 
  FaChartLine, 
  FaRobot, 
  FaLightbulb, 
  FaDatabase, 
  FaShieldAlt,
  FaBolt,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const AISection = () => {
  const aiFeatures = [
    {
      icon: <FaBrain />,
      title: 'تحليل ذكي',
      description: 'تحليل البيانات باستخدام خوارزميات الذكاء الاصطناعي المتقدمة'
    },
    {
      icon: <FaChartLine />,
      title: 'تنبؤات دقيقة',
      description: 'توقعات ذكية لأسعار الموبايلات والأسهم بناءً على البيانات التاريخية'
    },
    {
      icon: <FaRobot />,
      title: 'توصيات ذكية',
      description: 'توصيات مخصصة بناءً على سلوك المستخدم والتفضيلات'
    },
    {
      icon: <FaLightbulb />,
      title: 'رؤى استباقية',
      description: 'اكتشاف الأنماط والفرص قبل ظهورها في السوق'
    },
    {
      icon: <FaDatabase />,
      title: 'معالجة البيانات',
      description: 'معالجة وتحليل ملايين نقاط البيانات لحظة بلحظة'
    },
    {
      icon: <FaShieldAlt />,
      title: 'تحليل آمن',
      description: 'تحليل البيانات مع الحفاظ على خصوصية وأمان المعلومات'
    }
  ];

  const predictions = [
    { product: 'آيفون 15', currentPrice: '4,500 ريال', predictedPrice: '4,200 ريال', trend: 'down', accuracy: 85 },
    { product: 'سامسونج S24', currentPrice: '3,800 ريال', predictedPrice: '3,900 ريال', trend: 'up', accuracy: 92 },
    { product: 'شاومي 13', currentPrice: '2,200 ريال', predictedPrice: '2,000 ريال', trend: 'down', accuracy: 88 },
    { product: 'هواوي P60', currentPrice: '2,800 ريال', predictedPrice: '2,700 ريال', trend: 'down', accuracy: 79 }
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
      marginBottom: '4rem',
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
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '4rem',
    },
    featureCard: {
      backgroundColor: '#f8fafc',
      padding: '2rem',
      borderRadius: '16px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    icon: {
      fontSize: '3rem',
      color: '#22c55e',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: '1.25rem',
      color: '#1e293b',
      marginBottom: '0.75rem',
      fontWeight: '600',
    },
    featureDescription: {
      color: '#64748b',
      lineHeight: '1.6',
      fontSize: '0.95rem',
    },
    predictionsSection: {
      backgroundColor: '#f0fdf4',
      padding: '3rem',
      borderRadius: '16px',
      marginTop: '3rem',
    },
    predictionsTitle: {
      fontSize: '2rem',
      color: '#166534',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    predictionsTable: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    tableHeader: {
      backgroundColor: '#22c55e',
      color: 'white',
      padding: '1rem',
      fontWeight: '600',
      textAlign: 'center',
    },
    tableCell: {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #e2e8f0',
    },
    trendUp: {
      color: '#16a34a',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    trendDown: {
      color: '#ef4444',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    aiStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      marginTop: '3rem',
      flexWrap: 'wrap',
    },
    statItem: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#22c55e',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: '#64748b',
      fontSize: '0.9rem',
    },
    progressBar: {
      backgroundColor: '#f1f5f9',
      borderRadius: '20px',
      height: '8px',
      width: '100%',
      margin: '0.5rem auto',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '20px',
      transition: 'width 0.3s ease',
    },
  };

  // دالة للحصول على لون شريط التقدم بناءً على الدقة
  const getProgressColor = (accuracy) => {
    if (accuracy >= 90) return '#22c55e';
    if (accuracy >= 80) return '#3b82f6';
    if (accuracy >= 70) return '#f59e0b';
    return '#ef4444';
  };

  // دالة لتحديد لون الصف في الجدول
  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
    transition: 'background-color 0.2s ease',
  });

  return (
    <section id="ai" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>الذكاء الاصطناعي المتقدم</h2>
          <p style={styles.subtitle}>
            استخدم قوة الذكاء الاصطناعي للحصول على رؤى وتحليلات ذكية تساعدك في اتخاذ قرارات استثمارية أفضل
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {aiFeatures.map((feature, index) => (
            <div 
              key={index}
              style={styles.featureCard}
              className="card-hover"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
              }}
            >
              <div style={styles.icon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={styles.predictionsSection}>
          <h3 style={styles.predictionsTitle}>تنبؤات أسعار الموبايلات</h3>
          <table style={styles.predictionsTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>المنتج</th>
                <th style={styles.tableHeader}>السعر الحالي</th>
                <th style={styles.tableHeader}>السعر المتوقع</th>
                <th style={styles.tableHeader}>الاتجاه</th>
                <th style={styles.tableHeader}>الدقة</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item, index) => (
                <tr key={index} style={getRowStyle(index)}>
                  <td style={styles.tableCell}>{item.product}</td>
                  <td style={styles.tableCell}>{item.currentPrice}</td>
                  <td style={styles.tableCell}>{item.predictedPrice}</td>
                  <td style={styles.tableCell}>
                    <span style={item.trend === 'up' ? styles.trendUp : styles.trendDown}>
                      {item.trend === 'up' ? (
                        <>
                          <FaArrowUp /> صاعد
                        </>
                      ) : (
                        <>
                          <FaArrowDown /> هابط
                        </>
                      )}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${item.accuracy}%`,
                        backgroundColor: getProgressColor(item.accuracy)
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {item.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.aiStats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>دقة التوقعات</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>+10M</div>
            <div style={styles.statLabel}>نقطة بيانات يومياً</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>50ms</div>
            <div style={styles.statLabel}>زمن التحليل</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>مراقبة مستمرة</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;