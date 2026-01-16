import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaDatabase, FaUserLock, FaCookie, FaEye } from 'react-icons/fa';
import LogoSimple from '@/components/LogoSimple';

const PrivacyPolicy = () => {
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
      backgroundColor: '#f0f9ff',
      padding: '1rem',
      borderRadius: '12px',
      borderRight: '4px solid #0ea5e9',
      margin: '1.5rem 0',
    },
    warning: {
      backgroundColor: '#fef3c7',
      padding: '1rem',
      borderRadius: '12px',
      borderRight: '4px solid #f59e0b',
      margin: '1.5rem 0',
    },
    card: {
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '12px',
      margin: '1.5rem 0',
      borderLeft: '4px solid #10b981',
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
            <FaShieldAlt /> سياسة الخصوصية
          </h1>
          <p style={styles.subtitle}>
            نحن نحمي خصوصيتك. تعرف على كيفية جمعنا واستخدامنا ومشاركتنا لمعلوماتك.
          </p>
          <div style={styles.date}>
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        {/* القسم 1: مقدمة */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. مقدمة</h2>
          <div style={styles.content}>
            <p>
              في <strong>سمارت سوق AI</strong>، نعتبر خصوصيتك أمراً بالغ الأهمية. 
              توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا ومشاركتنا وحمايتنا لمعلوماتك.
            </p>
            <div style={styles.highlight}>
              <strong>ملاحظة مهمة:</strong> نحن منصة وساطة ولا نجمع معلومات دفع أو بيانات مالية حساسة.
              جميع المعاملات تتم على المنصات الأصلية.
            </div>
          </div>
        </div>

        {/* القسم 2: المعلومات التي نجمعها */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaDatabase /> 2. المعلومات التي نجمعها
          </h2>
          <div style={styles.content}>
            <p>نجمع الأنواع التالية من المعلومات:</p>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>نوع المعلومات</th>
                  <th style={styles.tableHeader}>الغرض من الجمع</th>
                  <th style={styles.tableHeader}>مثال</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tableCell}>معلومات الاستخدام</td>
                  <td style={styles.tableCell}>تحسين تجربة المستخدم</td>
                  <td style={styles.tableCell}>الصفحات التي تزورها، وقت الزيارة</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>معلومات الجهاز</td>
                  <td style={styles.tableCell}>تحسين التوافق</td>
                  <td style={styles.tableCell}>نوع المتصفح، نظام التشغيل</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>تفضيلات المستخدم</td>
                  <td style={styles.tableCell}>تخصيص المحتوى</td>
                  <td style={styles.tableCell}>المنتجات المهتم بها</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}>ملفات تعريف الارتباط</td>
                  <td style={styles.tableCell}>تحسين الأداء</td>
                  <td style={styles.tableCell}>جلسات المستخدم، التفضيلات</td>
                </tr>
              </tbody>
            </table>

            <div style={styles.warning}>
              <strong>ما لا نجمع:</strong> 
              <ul style={{ marginTop: '0.5rem', paddingRight: '1rem' }}>
                <li>معلومات الدفع أو البطاقات الائتمانية</li>
                <li>العنوان البريدي الكامل</li>
                <li>أرقام الهواتف الشخصية</li>
                <li>معلومات حساسة أخرى</li>
              </ul>
            </div>
          </div>
        </div>

        {/* القسم 3: كيفية استخدام المعلومات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. كيفية استخدام المعلومات</h2>
          <div style={styles.content}>
            <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>تقديم وتحسين خدمات المنصة</li>
              <li style={styles.listItem}>تخصيص تجربة المستخدم وتقديم توصيات ذكية</li>
              <li style={styles.listItem}>تحليل أداء المنصة وتحديد المجالات التي تحتاج تحسين</li>
              <li style={styles.listItem}>الكشف عن ومنع الاحتيال والأنشطة غير المصرح بها</li>
              <li style={styles.listItem}>الامتثال للالتزامات القانونية</li>
            </ul>
          </div>
        </div>

        {/* القسم 4: ملفات تعريف الارتباط */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaCookie /> 4. ملفات تعريف الارتباط (Cookies)
          </h2>
          <div style={styles.content}>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. ملفات تعريف الارتباط هي ملفات نصية صغيرة 
              يتم حفظها على جهازك لمساعدة المنصة على تذكر معلومات معينة.
            </p>
            
            <div style={styles.card}>
              <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>أنواع ملفات تعريف الارتباط:</h3>
              <ul>
                <li><strong>ملفات أساسية:</strong> ضرورية لتشغيل المنصة</li>
                <li><strong>ملفات أداء:</strong> تساعدنا على فهم كيفية استخدام المنصة</li>
                <li><strong>ملفات وظيفية:</strong> تذكر خياراتك وتفضيلاتك</li>
                <li><strong>ملفات إعلانية:</strong> تعرض إعلانات أكثر صلة باهتماماتك</li>
              </ul>
            </div>
            
            <p>
              يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح. 
              ملاحظة: تعطيل بعض ملفات تعريف الارتباط قد يؤثر على وظائف المنصة.
            </p>
          </div>
        </div>

        {/* القسم 5: مشاركة المعلومات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaEye /> 5. مشاركة المعلومات مع أطراف ثالثة
          </h2>
          <div style={styles.content}>
            <p>نحن <strong>لا نبيع</strong> معلوماتك الشخصية لأي طرف ثالث. قد نشارك المعلومات مع:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>مزودي الخدمة:</strong> شركات تساعدنا في تشغيل المنصة (استضافة، تحليلات)
              </li>
              <li style={styles.listItem}>
                <strong>السلطات القانونية:</strong> عند الضرورة للامتثال للقانون أو حماية حقوقنا
              </li>
              <li style={styles.listItem}>
                <strong>المنصات الأصلية:</strong> عند استخدام روابط تابعة (فقط معلومات تجميعية)
              </li>
            </ul>
            
            <div style={styles.highlight}>
              <strong>ملاحظة:</strong> عندما تنتقل إلى منصات الطرف الثالث عبر روابطنا، 
              تخضع لسياسة خصوصية تلك المنصات وليس لسياستنا.
            </div>
          </div>
        </div>

        {/* القسم 6: حقوق المستخدم */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FaUserLock /> 6. حقوق المستخدم
          </h2>
          <div style={styles.content}>
            <p>لديك الحق في:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>الوصول إلى معلوماتك الشخصية التي نحتفظ بها</li>
              <li style={styles.listItem}>طلب تصحيح أي معلومات غير دقيقة</li>
              <li style={styles.listItem}>طلب حذف معلوماتك الشخصية</li>
              <li style={styles.listItem}>الاعتراض على معالجة معلوماتك</li>
              <li style={styles.listItem}>طلب نسخة من معلوماتك بتنسيق قابل للقراءة آلياً</li>
            </ul>
            
            <p>
              لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني المذكور أدناه.
            </p>
          </div>
        </div>

        {/* القسم 7: أمان المعلومات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. أمان المعلومات</h2>
          <div style={styles.content}>
            <p>
              نستخدم إجراءات أمنية معقولة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء أو التدمير.
            </p>
            <p>
              تشمل هذه الإجراءات تشفير البيانات، التحكم في الوصول، والمراقبة المنتظمة.
            </p>
          </div>
        </div>

        {/* القسم 8: التعديلات */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. التعديلات على السياسة</h2>
          <div style={styles.content}>
            <p>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية 
              من خلال نشر الإشعار على المنصة أو إرسال إشعار مباشر إن أمكن.
            </p>
            <p>
              ننصحك بمراجعة هذه السياسة بشكل دوري للبقاء على علم بأي تحديثات.
            </p>
          </div>
        </div>

        {/* قسم الاتصال */}
        <div style={styles.contact}>
          <h3 style={styles.contactTitle}>للاستفسارات والطلبات المتعلقة بالخصوصية</h3>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية أو حقوقك، يرجى التواصل معنا عبر:
          </p>
          <p style={{ color: '#3b82f6', fontWeight: '600' }}>
            البريد الإلكتروني: privacy@smartsouq-ai.com
          </p>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            سنرد على استفساراتك في غضون 30 يوماً عمل.
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

export default PrivacyPolicy;