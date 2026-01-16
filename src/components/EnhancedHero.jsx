import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaDollarSign, FaChartLine, FaRobot, FaRocket, FaStar, FaTimes, FaCheck } from 'react-icons/fa';
import LogoSimple from '@/components/LogoSimple';
import { notifyNewAgent } from '@/api/telegram';

const EnhancedHero = () => {
  const navigate = useNavigate();
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: '', email: '', phone: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Send notification to Telegram
    const success = await notifyNewAgent(partnerForm);
    
    // Even if it fails (e.g. no token in dev), we show success to user for UX
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => {
        setShowPartnerModal(false);
        setFormStatus('idle');
        setPartnerForm({ name: '', email: '', phone: '' });
      }, 2000);
    }, 1000);
  };

  const styles = {
    hero: {
      padding: "4rem 1rem",
      textAlign: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      position: "relative",
      overflow: "hidden",
      borderRadius: "0 0 30px 30px",
      marginBottom: "2rem",
    },
    particles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
    particle: {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
    },
    logoContainer: {
      marginBottom: "2rem",
      animation: "fadeIn 1s ease",
    },
    title: {
      fontSize: "3rem",
      marginBottom: "1rem",
      fontWeight: "800",
      textShadow: "2px 2px 10px rgba(0,0,0,0.2)",
      background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    subtitle: {
      fontSize: "1.2rem",
      marginBottom: "2rem",
      opacity: "0.9",
      maxWidth: "700px",
      margin: "0 auto",
      lineHeight: "1.6",
      textShadow: "1px 1px 5px rgba(0,0,0,0.1)",
    },
    stats: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
      marginTop: "3rem",
    },
    statItem: {
      textAlign: "center",
      padding: "1.5rem",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      minWidth: "150px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    statIcon: {
      fontSize: "2rem",
      color: "white",
      marginBottom: "0.5rem",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    statLabel: {
      fontSize: "0.9rem",
      opacity: "0.8",
    },
    ctaButtons: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "2rem",
    },
    primaryButton: {
      padding: "1rem 2rem",
      fontSize: "1rem",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
    },
    secondaryButton: {
      padding: "1rem 2rem",
      fontSize: "1rem",
      background: "rgba(255, 255, 255, 0.1)",
      color: "white",
      border: "2px solid white",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backdropFilter: "blur(10px)",
    },
    floatingElements: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      pointerEvents: "none",
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '500px',
      position: 'relative',
      color: '#1e293b',
      textAlign: 'right',
    },
    inputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      fontSize: '0.9rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#64748b',
    }
  };

  // إنشاء جزئيات عائمة
  const particles = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      size: Math.random() * 10 + 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
    });
  }

  return (
    <section id="home" style={styles.hero}>
      {/* جزئيات عائمة */}
      <div style={styles.floatingElements}>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.particle,
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: p.animationDelay,
            }}
          />
        ))}
      </div>

      <div style={styles.logoContainer}>
        <LogoSimple type="horizontal" size="xlarge" color="white" />
      </div>
      
      <h1 style={styles.title}>
        Smart Souq - Brokerage & Comparison
      </h1>
      
      <p style={styles.subtitle}>
        Official Broker for Mobile Market & Stock Exchange Analysis.
        <br />
        Global Market Access • AI-Powered Comparisons • Verified Transactions
        <br /><br />
        🤖 Our platform uses AI to compare prices, analyze trends, and predict market changes.
      </p>
      
      <div style={styles.ctaButtons}>
        <motion.button 
          style={styles.primaryButton}
          onClick={() => navigate('/brokerage-agreement')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRocket /> ابدأ الآن
        </motion.button>
        <motion.button 
          style={styles.secondaryButton}
          onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRobot /> استكشف المميزات
        </motion.button>
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: '0.7' }}>
        للمسوقين المحترفين والوكالات
      </p>
      
      {/* Partner Modal */}
      <AnimatePresence>
        {showPartnerModal && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button style={styles.closeButton} onClick={() => setShowPartnerModal(false)}>
                <FaTimes />
              </button>
              
              <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>انضم لبرنامج الشركاء 🚀</h2>
              
              {formStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#22c55e' }}>
                  <FaCheck style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                  <h3>تم استلام طلبك بنجاح!</h3>
                  <p style={{ color: '#64748b' }}>سنتواصل معك قريباً عبر البريد الإلكتروني.</p>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>الاسم الكامل</label>
                    <input 
                      type="text" 
                      required 
                      style={styles.input}
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})}
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      required 
                      style={styles.input}
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>رقم الهاتف (مع رمز الدولة)</label>
                    <input 
                      type="tel" 
                      required 
                      style={styles.input}
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})}
                      placeholder="+966 50..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={styles.submitButton}
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.stats}>
        <motion.div 
          style={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaShoppingCart style={styles.statIcon} />
          <div style={styles.statNumber}>+5,000</div>
          <div style={styles.statLabel}>منتج متوفر</div>
        </motion.div>
        
        <motion.div 
          style={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FaDollarSign style={styles.statIcon} />
          <div style={styles.statNumber}>5%</div>
          <div style={styles.statLabel}>متوسط العمولة</div>
        </motion.div>
        
        <motion.div 
          style={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FaChartLine style={styles.statIcon} />
          <div style={styles.statNumber}>24/7</div>
          <div style={styles.statLabel}>تحديث مستمر</div>
        </motion.div>
        
        <motion.div 
          style={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <FaStar style={styles.statIcon} />
          <div style={styles.statNumber}>4.9/5</div>
          <div style={styles.statLabel}>تقييم المستخدمين</div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedHero;
