import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileContract, FaShieldAlt, FaExclamationTriangle, FaHandshake } from 'react-icons/fa';
import LogoSimple from './LogoSimple';

const EnhancedFooter = () => {
  const styles = {
    footer: {
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '4rem 1rem 2rem',
      marginTop: '3rem',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '3rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '1.5rem',
      color: '#22c55e',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    list: {
      listStyle: 'none',
      padding: 0,
    },
    listItem: {
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    link: {
      color: '#cbd5e1',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    contactInfo: {
      color: '#cbd5e1',
      fontSize: '0.9rem',
      lineHeight: '1.6',
    },
    address: {
      backgroundColor: '#2d3748',
      padding: '1rem',
      borderRadius: '12px',
      marginTop: '1rem',
      borderLeft: '4px solid #22c55e',
    },
    addressTitle: {
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#22c55e',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    addressText: {
      fontSize: '0.85rem',
      color: '#94a3b8',
      lineHeight: '1.5',
    },
    bottomBar: {
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid #334155',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '0.9rem',
    },
    disclaimerNote: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '12px',
      marginTop: '1.5rem',
      fontSize: '0.85rem',
      lineHeight: '1.6',
      borderLeft: '4px solid #f59e0b',
    },
    disclaimerTitle: {
      color: '#f59e0b',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    logoContainer: {
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'flex-start',
    },
    transparencyBanner: {
      backgroundColor: '#374151',
      color: '#fbbf24',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      textAlign: 'center',
      border: '1px solid #fbbf24',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.1)',
    },
    description: {
      color: '#94a3b8',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      marginBottom: '1rem',
    },
    legalLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1rem',
    },
    legalLink: {
      backgroundColor: '#374151',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      color: '#cbd5e1',
      textDecoration: 'none',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease',
    },
  };

  const quickLinks = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'منصة الوساطة', href: '#ecommerce', icon: '🛒' },
    { name: 'مقارنة الأسعار', href: '#mobiles', icon: '📱' },
    { name: 'أخبار التكنولوجيا', href: '#tech-news', icon: '📰' },
    { name: 'أخبار الاقتصاد', href: '#economy-news', icon: '📈' },
    { name: 'الذكاء الاصطناعي', href: '#ai', icon: '🤖' },
  ];

  const legalLinks = [
    { 
      name: 'شروط الاستخدام', 
      href: '/terms', 
      icon: <FaFileContract />,
      external: false
    },
    { 
      name: 'سياسة الخصوصية', 
      href: '/privacy', 
      icon: <FaShieldAlt />,
      external: false
    },
    { 
      name: 'اتفاقية الوساطة', 
      href: '/brokerage-agreement', 
      icon: <FaHandshake />,
      external: false
    },
    { 
      name: 'إخلاء المسؤولية', 
      href: '#disclaimer', 
      icon: <FaExclamationTriangle />,
      external: true
    },
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, text: 'info@smartsouq-ai.com', href: 'mailto:info@smartsouq-ai.com' },
    { icon: <FaGlobe />, text: 'www.smartsouq-ai.com', href: 'https://www.smartsouq-ai.com' },
  ];

  return (
    <footer style={styles.footer}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={styles.transparencyBanner}>
          نحن نؤمن بالشفافية المطلقة: تسوقك عبر سمارت سوق مجاني تماماً. نظام الذكاء الاصطناعي لدينا يضمن لك أرخص سعر متاح عالمياً، وعمولتنا البسيطة تُدفع من المتاجر (أمازون، نون، إلخ) كمكافأة لنا ولا تزيد من سعر منتجك نهائياً.
        </div>
      </div>
      <div style={styles.container}>
        {/* عن الشركة */}
        <div style={styles.section}>
          <div style={styles.logoContainer}>
            <LogoSimple type="horizontal" size="normal" color="gradient" />
          </div>
          <p style={styles.description}>
            منصة وساطة تجارية ذكية تربط بين المستخدمين ومنصات التجارة الإلكترونية العالمية.
            نعمل عبر برامج الشركاء التابعين (Affiliate Programs).
          </p>
          <div style={styles.legalLinks}>
            {legalLinks.map((link, index) => (
              link.external ? (
                <a key={index} href={link.href} style={styles.legalLink}>
                  {link.icon} {link.name}
                </a>
              ) : (
                <Link key={index} to={link.href} style={styles.legalLink}>
                  {link.icon} {link.name}
                </Link>
              )
            ))}
          </div>
        </div>

        {/* روابط سريعة */}
        <div style={styles.section}>
          <h3 style={styles.title}>روابط سريعة</h3>
          <ul style={styles.list}>
            {quickLinks.map((link, index) => (
              <li key={index} style={styles.listItem}>
                <span style={{ fontSize: '1rem' }}>{link.icon}</span>
                <a href={link.href} style={styles.link}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* معلومات الاتصال */}
        <div style={styles.section}>
          <h3 style={styles.title}>تواصل معنا</h3>
          <div style={styles.contactInfo}>
            {contactInfo.map((info, index) => (
              <div key={index} style={styles.listItem}>
                {info.icon}
                <a href={info.href} style={styles.link}>
                  {info.text}
                </a>
              </div>
            ))}
          </div>
          
          <div style={styles.address}>
            <div style={styles.addressTitle}>
              <FaMapMarkerAlt /> العنوان:
            </div>
            <div style={styles.addressText}>
              الإمارات العربية المتحدة<br />
              أبو ظبي - المنطقة الشرقية<br />
              برج الأعمال الذكي<br />
              ص.ب: 12345
            </div>
          </div>
        </div>

        {/* إخلاء مسؤولية */}
        <div style={styles.section}>
          <h3 style={styles.title}>ملاحظات هامة</h3>
          <div style={styles.disclaimerNote}>
            <div style={styles.disclaimerTitle}>
              <FaExclamationTriangle /> إخلاء مسؤولية
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              نحن منصة وساطة ولسنا بائعين مباشرين. جميع المعاملات تتم على المنصات الأصلية.
              الأسعار قابلة للتغيير بدون إشعار. العمولة تدفع من قبل المتاجر.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p>
          © {new Date().getFullYear()} <strong>سمارت سوق AI | Smart Souq AI</strong>.
          <span style={{ marginRight: '1rem', marginLeft: '1rem' }}>|</span>
          منصة وساطة تجارية - مقرها الإمارات العربية المتحدة
        </p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          نعمل كوسيط بين العملاء ومنصات التجارة الإلكترونية العالمية عبر برامج الشركاء التابعين
        </p>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
