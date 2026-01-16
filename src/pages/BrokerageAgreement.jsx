import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaFileSignature, FaUserTie, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import LogoSimple from '@/components/LogoSimple';
import AdUnit from '@/components/AdUnit';

const BrokerageAgreement = () => {
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      padding: '3rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      borderBottom: '2px solid #f1f5f9',
      paddingBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      color: '#1e293b',
      marginBottom: '1rem',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
      lineHeight: '1.6',
    },
    date: {
      color: '#94a3b8',
      fontSize: '0.9rem',
      marginTop: '1rem',
    },
    section: {
      marginBottom: '2.5rem',
    },
    sectionTitle: {
      fontSize: '1.4rem',
      color: '#3b82f6',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    content: {
      color: '#475569',
      lineHeight: '1.8',
      fontSize: '1rem',
    },
    list: {
      paddingRight: '2rem',
      marginTop: '1rem',
    },
    listItem: {
      marginBottom: '0.75rem',
      position: 'relative',
      paddingRight: '1.5rem',
    },
    highlight: {
      backgroundColor: '#fef3c7',
      padding: '1rem',
      borderRadius: '12px',
      borderRight: '4px solid #f59e0b',
      margin: '1.5rem 0',
    },
    info: {
      backgroundColor: '#e0f2fe',
      padding: '1rem',
      borderRadius: '12px',
      borderRight: '4px solid #0ea5e9',
      margin: '1.5rem 0',
    },
    contact: {
      backgroundColor: '#f0fdf4',
      padding: '1.5rem',
      borderRadius: '12px',
      marginTop: '2rem',
      textAlign: 'center',
    },
    contactTitle: {
      color: '#166534',
      marginBottom: '0.5rem',
      fontWeight: '600',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      marginTop: '2rem',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <LogoSimple type="horizontal" size="large" color="gradient" />
          <h1 style={styles.title}>
            <FaHandshake /> اتفاقية الوساطة التجارية
          </h1>
          <p style={styles.subtitle}>
            اتفاقية تنظيم العلاقة بين منصة سمارت سوق AI والشركاء والمستخدمين.
          </p>
          <div style={styles.date}>
            تاريخ السريان: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        {/* القسم 1: الأطراف */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaUserTie /> 1. أطراف الاتفاقية
          </h2>
          <div style={styles.content}>
            <p>
              هذه الاتفاقية مبرمة بين:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>الطرف الأول:</strong> شركة سمارت سوق AI (المنصة/الوسيط)</li>
              <li style={styles.listItem}><strong>الطرف الثاني:</strong> المستخدم أو الشريك (أنت)</li>
            </ul>
            <p>
              بمجرد استخدامك لخدماتنا أو التسجيل كشريك، فإنك توافق على الالتزام بشروط هذه الاتفاقية.
            </p>
          </div>
        </div>

        {/* القسم 2: طبيعة العلاقة */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. طبيعة العلاقة (الوساطة)</h2>
          <div style={styles.content}>
            <div style={styles.info}>
              <p>
                نحن نعمل كـ <strong>وسيط إلكتروني ذكي</strong> يربط بين المستخدمين ومزودي الخدمات/المنتجات.
                لسنا مالكين للمنتجات ولا نقدم الخدمات المالية بشكل مباشر.
              </p>
            </div>
          </div>
        </div>

        <AdUnit />

        {/* القسم 3: التزامات المنصة */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaShieldAlt /> 3. التزامات المنصة
          </h2>
          <div style={styles.content}>
            <p>تلتزم المنصة بما يلي:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>توفير بيانات دقيقة ومحدثة قدر الإمكان عن الأسعار والمنتجات.</li>
              <li style={styles.listItem}>حماية بيانات المستخدمين وفقاً لسياسة الخصوصية.</li>
              <li style={styles.listItem}>توفير أدوات مقارنة وتحليل محايدة ومدعومة بالذكاء الاصطناعي.</li>
              <li style={styles.listItem}>الشفافية في عرض العمولات والرسوم إن وجدت.</li>
            </ul>
          </div>
        </div>

        {/* القسم 4: العمولات والدفعات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaMoneyBillWave /> 4. العمولات والدفعات
          </h2>
          <div style={styles.content}>
            <p>
              تخضع العمولات للهيكلة التالية:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}><strong>المستخدم العادي:</strong> الخدمة مجانية تماماً.</li>
              <li style={styles.listItem}><strong>الشركاء:</strong> يتم الاتفاق على نسب العمولة في عقود منفصلة.</li>
              <li style={styles.listItem}><strong>عمولات المنصة:</strong> نحصل على عمولة تسويق من المتاجر عند الشراء عبر روابطنا.</li>
            </ul>
            <div style={styles.highlight}>
              <strong>تنبيه:</strong> المنصة لا تطلب من المستخدمين تحويل أموال مباشرة لشراء منتجات. 
              جميع عمليات الدفع تتم على مواقع المتاجر الرسمية.
            </div>
          </div>
        </div>

        {/* القسم 5: التوقيع والإقرار */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaFileSignature /> 5. الإقرار والموافقة
          </h2>
          <div style={styles.content}>
            <p>
              استخدامك للمنصة يعتبر توقيعاً إلكترونياً وموافقة صريحة على جميع بنود هذه الاتفاقية.
            </p>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div style={styles.contact}>
          <h3 style={styles.contactTitle}>لديك استفسار حول الاتفاقية؟</h3>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            فريقنا القانوني جاهز للإجابة على استفساراتك
          </p>
          <p style={{ color: '#3b82f6', fontWeight: '600' }}>
            partners@smartsouq-ai.com
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{...styles.backButton, background: '#f1f5f9', color: '#475569'}}>
            ← العودة للرئيسية
          </Link>
          
          <Link to="/checkout" style={{...styles.backButton, flex: 1, justifyContent: 'center'}}>
            <FaHandshake /> موافق، ابدأ الآن
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrokerageAgreement;
