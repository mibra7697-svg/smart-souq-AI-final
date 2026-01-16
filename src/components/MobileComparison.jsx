import React, { useState, useEffect } from 'react';
import { FaMobileAlt, FaStore, FaTag, FaStar, FaRobot, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { ENV } from '@/config/env';

const MobileComparison = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch with loading state
    const fetchMobiles = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        // In production: use real API for fetching data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock Data (In production, this would come from an API)
        const data = [
          {
            name: 'آيفون 15 برو',
            image: '📱',
            prices: [
              { store: 'سوق كوم', price: '4,650 ريال' },
              { store: 'نون', price: '4,800 ريال' },
              { store: 'إكسترا', price: '4,550 ريال' },
            ],
            rating: 4.8,
            prediction: '⏳ نصيحة AI: انتظر قليلاً، نتوقع انخفاض السعر',
            predictionColor: '#3b82f6', // blue
            features: ['شريحة A17 برو', 'كاميرا 48 ميجابكسل', 'بطارية 3650 مللي أمبير']
          },
          {
            name: 'سامسونج S24 Ultra',
            image: '📱',
            prices: [
              { store: 'سوق كوم', price: '4,200 ريال' },
              { store: 'نون', price: '4,350 ريال' },
              { store: 'إكسترا', price: '4,150 ريال' },
            ],
            rating: 4.7,
            prediction: '⏳ نصيحة AI: انتظر قليلاً، نتوقع انخفاض السعر',
            predictionColor: '#22c55e', // green
            features: ['شريحة Snapdragon 8', 'كاميرا 200 ميجابكسل', 'قلم S-Pen']
          },
          {
            name: 'شاومي 13 برو',
            image: '📱',
            prices: [
              { store: 'سوق كوم', price: '2,300 ريال' },
              { store: 'نون', price: '2,450 ريال' },
              { store: 'إكسترا', price: '2,200 ريال' },
            ],
            rating: 4.5,
            prediction: '✅ فرصة شراء: السعر حالياً مثالي',
            predictionColor: '#f59e0b', // amber
            features: ['شريحة Snapdragon 8', 'كاميرا 50 ميجابكسل', 'شحن 120 واط']
          }
        ];
        setMobiles(data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
        console.error("Error fetching mobiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMobiles();
  }, []);

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
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
      maxWidth: '600px',
      margin: '0 auto',
    },
    mobilesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginTop: '3rem',
    },
    mobileCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
    },
    mobileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    mobileIcon: {
      fontSize: '3rem',
    },
    mobileName: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    priceSection: {
      marginBottom: '1.5rem',
    },
    priceTitle: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    priceItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      marginBottom: '0.5rem',
    },
    storeName: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#475569',
    },
    price: {
      fontWeight: '600',
      color: '#22c55e',
    },
    bestPrice: {
      backgroundColor: '#f0fdf4',
      border: '2px solid #22c55e',
    },
    featuresList: {
      marginTop: '1.5rem',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
      color: '#475569',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
      color: '#f59e0b',
    },
    aiBadge: {
      backgroundColor: '#f59e0b',
      color: 'white',
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.7rem',
      marginRight: '0.5rem',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    prediction: {
      fontSize: '0.9rem',
      marginTop: '1rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    freeDisclaimer: {
      backgroundColor: '#eff6ff',
      color: '#1e40af',
      padding: '1rem',
      borderRadius: '8px',
      marginTop: '1rem',
      border: '1px solid #bfdbfe',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: '#64748b',
    },
    spinner: {
      fontSize: '3rem',
      marginBottom: '1rem',
      animation: 'spin 1s linear infinite',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '2rem',
      color: '#ef4444',
      backgroundColor: '#fee2e2',
      borderRadius: '12px',
      margin: '2rem auto',
      maxWidth: '600px',
    },
  };

  const findBestPrice = (prices) => {
    return prices.reduce((min, price) => {
      const priceNum = parseInt(price.price.replace(/[^\d]/g, ''));
      const minNum = parseInt(min.price.replace(/[^\d]/g, ''));
      return priceNum < minNum ? price : min;
    });
  };

  if (loading) {
    return (
      <section id="mobiles" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <FaSpinner className="spin-animation" style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }} />
            <p>جاري جلب أحدث الأسعار والمواصفات...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .spin-animation { animation: spin 1s linear infinite; }
            `}</style>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="mobiles" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <FaExclamationCircle style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mobiles" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>مقارنة أسعار الموبايلات</h2>
          <p style={styles.subtitle}>
            قارن أسعار أحدث الموبايلات بين مختلف المتاجر الإلكترونية ووفر حتى 30%
          </p>
          <div style={styles.freeDisclaimer}>
            💡 التسوق من خلالنا مجاني للمشترين؛ نحن نضمن لك الخصم، والمتجر يدفع لنا.
          </div>
        </div>

        <div style={styles.mobilesGrid}>
          {mobiles.map((mobile, index) => {
            const bestPrice = findBestPrice(mobile.prices);
            
            return (
              <div 
                key={index}
                style={styles.mobileCard}
                className="card-hover"
              >
                <div style={styles.mobileHeader}>
                  <div style={styles.mobileIcon}>{mobile.image}</div>
                  <div>
                    <h3 style={styles.mobileName}>{mobile.name}</h3>
                    <div style={styles.rating}>
                      <FaStar />
                      <span>{mobile.rating}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.priceSection}>
                  <h4 style={styles.priceTitle}>
                    <FaTag /> الأسعار بين المتاجر
                  </h4>
                  {mobile.prices.map((price, idx) => (
                    <div 
                      key={idx}
                      style={{
                        ...styles.priceItem,
                        ...(price.store === bestPrice.store ? styles.bestPrice : {})
                      }}
                    >
                      <div style={styles.storeName}>
                        <FaStore />
                        {price.store}
                        {price.store === bestPrice.store && (
                          <span style={styles.aiBadge}>✨ توصية الذكاء الاصطناعي (أفضل سعر)</span>
                        )}
                      </div>
                      <div style={styles.price}>{price.price}</div>
                    </div>
                  ))}
                  
                  {/* AI Prediction Section */}
                  <div style={{ ...styles.prediction, color: mobile.predictionColor }}>
                    <FaRobot /> 
                    <span>توقعات AI: {mobile.prediction}</span>
                  </div>
                </div>

                <div style={styles.featuresList}>
                  <h4 style={styles.priceTitle}>
                    <FaMobileAlt /> المميزات الرئيسية
                  </h4>
                  {mobile.features.map((feature, idx) => (
                    <div key={idx} style={styles.featureItem}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MobileComparison;
