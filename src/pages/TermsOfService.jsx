import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaExclamationTriangle, FaUserShield, FaBalanceScale, FaGavel } from 'react-icons/fa';
import LogoSimple from '@/components/LogoSimple';

const TermsOfService = () => {
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
    warning: {
      backgroundColor: '#fee2e2',
      padding: '1rem',
      borderRadius: '12px',
      borderRight: '4px solid #ef4444',
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
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '1.5rem 0',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '1rem',
      textAlign: 'right',
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0',
      color: '#475569',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <LogoSimple type="horizontal" size="large" color="gradient" />
          <h1 style={styles.title}>
            <FaFileContract /> شروط وأحكام استخدام منصة سمارت سوق AI
          </h1>
          <p style={styles.subtitle}>
            الرجاء قراءة هذه الشروط بعناية قبل استخدام منصتنا. استخدامك للمنصة يعني موافقتك على هذه الشروط.
          </p>
          <div style={styles.date}>
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        {/* القسم 1: مقدمة */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaExclamationTriangle /> 1. مقدمة وقبول الشروط
          </h2>
          <div style={styles.content}>
            <p>
              مرحباً بك في منصة <strong>سمارت سوق AI</strong>. نحن منصة وساطة تجارية 
              تربط بين المستخدمين ومنصات التجارة الإلكترونية العالمية عبر برامج الشركاء التابعين (Affiliate Programs).
            </p>
            <div style={styles.highlight}>
              <strong>ملاحظة مهمة:</strong> نحن <strong>لسنا بائعين مباشرين</strong> ولا نتحكم في المنتجات أو الأسعار.
              جميع المعاملات تتم مباشرة عبر المنصات الأصلية.
            </div>
          </div>
        </div>

        {/* القسم 2: وصف الخدمة */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. وصف الخدمة</h2>
          <div style={styles.content}>
            <p>تقدم المنصة الخدمات التالية:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>عرض منتجات من منصات تجارة إلكترونية عالمية</li>
              <li style={styles.listItem}>توفير روابط تابعة (Affiliate Links) للمنتجات</li>
              <li style={styles.listItem}>مقارنة أسعار المنتجات من مصادر مختلفة</li>
              <li style={styles.listItem}>تقديم أخبار وتحليلات في مجالات التكنولوجيا والاقتصاد</li>
              <li style={styles.listItem}>توصيات ذكية باستخدام تقنيات الذكاء الاصطناعي</li>
            </ul>
          </div>
        </div>

        {/* القسم 3: العمولات والمبيعات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaBalanceScale /> 3. سياسة العمولات والمبيعات
          </h2>
          <div style={styles.content}>
            <div style={styles.info}>
              <p>
                <strong>كيف تعمل العمولات؟</strong> نربح عمولة صغيرة عندما تشتري عبر روابطنا. 
                هذه العمولة تدفعها المنصات الأصلية ولا تؤثر على سعر المنتج الذي تدفعه.
              </p>
            </div>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>النقطة</th>
                  <th style={styles.tableHeader}>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tableCell}>طريقة الربح</td>
                  <td style={styles.tableCell}>عمولة من المنصات الأصلية عند الشراء عبر روابطنا</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>نسبة العمولة</td>
                  <td style={styles.tableCell}>تختلف حسب المنصة والمنتج (1% - 15%)</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>دفع العمولة</td>
                  <td style={styles.tableCell}>تتم من قبل المنصة الأصلية بعد تأكيد عملية الشراء</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>تأثير على السعر</td>
                  <td style={styles.tableCell}>لا يوجد - تدفع نفس السعر الموجود على المنصة الأصلية</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* القسم 4: المسؤولية */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaUserShield /> 4. إخلاء المسؤولية والحدود
          </h2>
          <div style={styles.content}>
            <div style={styles.warning}>
              <strong>إخلاء مسؤولية هام:</strong> نحن نعرض منتجات من منصات طرف ثالث. 
              لا نتحمل مسؤولية عن:
            </div>
            
            <ul style={styles.list}>
              <li style={styles.listItem}>جودة المنتجات أو توفرها</li>
              <li style={styles.listItem}>توصيل المنتجات أو التأخير في التوصيل</li>
              <li style={styles.listItem}>أي أخطاء في الأسعار أو العروض</li>
              <li style={styles.listItem}>سياسات الإرجاع والاستبدال الخاصة بالمتاجر</li>
              <li style={styles.listItem}>أي خسائر أو أضرار ناتجة عن استخدام المنتجات</li>
            </ul>
            
            <p>
              جميع المعاملات تتم بينك وبين المنصة الأصلية. نحن مجرد وسيط نربط بين الطرفين.
            </p>
          </div>
        </div>

        {/* القسم 5: الملكية الفكرية */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. الملكية الفكرية</h2>
          <div style={styles.content}>
            <p>جميع محتويات المنصة محمية بحقوق الملكية الفكرية وتشمل:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>شعار وتصميم المنصة</li>
              <li style={styles.listItem}>واجهة المستخدم والتجربة</li>
              <li style={styles.listItem}>الأكواد والبرمجيات</li>
              <li style={styles.listItem}>المحتوى المكتوب والمراجعات</li>
            </ul>
            <p>
              يحظر نسخ أو توزيع أو تعديل أي جزء من المنصة دون إذن كتابي مسبق.
            </p>
          </div>
        </div>

        {/* القسم 6: التعديلات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaGavel /> 6. التعديلات والإلغاء
          </h2>
          <div style={styles.content}>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بنشر الإشعار بالتعديلات على المنصة.
              استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على الشروط المعدلة.
            </p>
            <p>
              نحتفظ بالحق في إيقاف أو تعليق حساب أي مستخدم يخالف هذه الشروط.
            </p>
          </div>
        </div>

        {/* القسم 7: الاتصال */}
        <div style={styles.contact}>
          <h3 style={styles.contactTitle}>للاستفسارات القانونية</h3>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            إذا كان لديك أي استفسارات حول هذه الشروط، يرجى التواصل معنا عبر:
          </p>
          <p style={{ color: '#3b82f6', fontWeight: '600' }}>
            البريد الإلكتروني: legal@smartsouq-ai.com
          </p>
        </div>

        {/* زر العودة */}
        <Link to="/" style={styles.backButton}>
          ← العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default TermsOfService;