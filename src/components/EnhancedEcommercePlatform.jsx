import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaAmazon, 
  FaEbay, 
  FaShopify, 
  FaStore, 
  FaPercentage, 
  FaShareAlt, 
  FaChartBar,
  FaShoppingCart,
  FaDollarSign,
  FaTag,
  FaFire,
  FaStar,
  FaShoppingBag,
  FaBoxOpen,
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaGamepad,
  FaHome,
  FaTshirt,
  FaInfoCircle,
  FaBell
} from 'react-icons/fa';
import Disclaimer from './Disclaimer';

const EnhancedEcommercePlatform = () => {
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro Max',
      price: 1099,
      originalPrice: 1199,
      discount: '8%',
      commission: '4.5%',
      store: 'Amazon',
      storeIcon: <FaAmazon />,
      rating: 4.8,
      image: <FaMobileAlt />,
      category: 'electronics',
      affiliateLink: '#',
      sales: 1245,
      trending: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 899,
      originalPrice: 999,
      discount: '10%',
      commission: '5%',
      store: 'Ebay',
      storeIcon: <FaEbay />,
      rating: 4.7,
      image: <FaMobileAlt />,
      category: 'electronics',
      affiliateLink: '#',
      sales: 987,
      trending: true
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Headphones',
      price: 349,
      originalPrice: 399,
      discount: '12%',
      commission: '6%',
      store: 'Shopify',
      storeIcon: <FaShopify />,
      rating: 4.9,
      image: <FaHeadphones />,
      category: 'electronics',
      affiliateLink: '#',
      sales: 2156,
      trending: false
    },
    {
      id: 4,
      name: 'MacBook Pro 16" M3 Max',
      price: 2499,
      originalPrice: 2799,
      discount: '11%',
      commission: '3.5%',
      store: 'Amazon',
      storeIcon: <FaAmazon />,
      rating: 4.9,
      image: <FaLaptop />,
      category: 'electronics',
      affiliateLink: '#',
      sales: 743,
      trending: false
    },
    {
      id: 5,
      name: 'Dyson V15 Detect Vacuum',
      price: 699,
      originalPrice: 799,
      discount: '12%',
      commission: '7%',
      store: 'Noon',
      storeIcon: <FaStore />,
      rating: 4.6,
      image: <FaHome />,
      category: 'home',
      affiliateLink: '#',
      sales: 1123,
      trending: true
    },
    {
      id: 6,
      name: 'Nintendo Switch OLED',
      price: 349,
      originalPrice: 399,
      discount: '12%',
      commission: '6.5%',
      store: 'Ebay',
      storeIcon: <FaEbay />,
      rating: 4.8,
      image: <FaGamepad />,
      category: 'gaming',
      affiliateLink: '#',
      sales: 1854,
      trending: true
    },
  ];

  const platformInfo = [
    { 
      id: 'amazon', 
      name: 'Amazon', 
      icon: <FaAmazon />, 
      commission: '3-10%', 
      products: 1200,
      description: 'أكبر منصة تسوق عالمية',
      partnership: 'برنامج الشركاء التابعين (Amazon Associates)' 
    },
    { 
      id: 'ebay', 
      name: 'Ebay', 
      icon: <FaEbay />, 
      commission: '2-8%', 
      products: 850,
      description: 'منصة المزادات والتسوق العالمية',
      partnership: 'برنامج eBay Partner Network' 
    },
    { 
      id: 'shopify', 
      name: 'Shopify', 
      icon: <FaShopify />, 
      commission: '4-12%', 
      products: 650,
      description: 'منصة متاجر إلكترونية مستقلة',
      partnership: 'برنامج Shopify Affiliate' 
    },
    { 
      id: 'noon', 
      name: 'Noon', 
      icon: <FaStore />, 
      commission: '5-15%', 
      products: 750,
      description: 'منصة تسوق رائدة في الشرق الأوسط',
      partnership: 'برنامج Noon Affiliates' 
    },
  ];

  const styles = {
    section: {
      padding: '3rem 1rem',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      borderRadius: '20px',
      marginBottom: '2rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      position: 'relative',
    },
    title: {
      fontSize: '2.2rem',
      color: '#1e293b',
      marginBottom: '0.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    disclaimerContainer: {
      maxWidth: '800px',
      margin: '0 auto 2rem',
    },
    infoNote: {
      backgroundColor: '#e0f2fe',
      border: '1px solid #0ea5e9',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
    },
    infoIcon: {
      color: '#0ea5e9',
      fontSize: '1.2rem',
      marginTop: '0.2rem',
    },
    infoText: {
      color: '#0369a1',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      flex: 1,
    },
    highlight: {
      fontWeight: 'bold',
      color: '#1e40af',
    },
    categories: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '2rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
    },
    categoryButton: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: isActive ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f1f5f9',
      color: isActive ? 'white' : '#64748b',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      boxShadow: isActive ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
    }),
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    productCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '1.5rem',
      position: 'relative',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(226, 232, 240, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    productImage: {
      fontSize: '3rem',
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#3b82f6',
      background: 'linear-gradient(135deg, #e0f2ff, #f0f9ff)',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
    },
    productName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
      height: '2.8rem',
      overflow: 'hidden',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    currentPrice: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    originalPrice: {
      fontSize: '0.9rem',
      color: '#94a3b8',
      textDecoration: 'line-through',
    },
    discountBadge: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
    },
    trendingBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
    },
    storeInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem',
      fontSize: '0.85rem',
      color: '#64748b',
    },
    commissionBadge: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      padding: '0.5rem 0.75rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem',
      width: 'fit-content',
      boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginBottom: '0.75rem',
      color: '#f59e0b',
    },
    salesInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.8rem',
      color: '#64748b',
      marginBottom: '1rem',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: 'auto',
    },
    buyButton: {
      flex: 2,
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    shareButton: {
      flex: 1,
      padding: '0.75rem',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    platformsSection: {
      marginTop: '3rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.6)',
    },
    platformsTitle: {
      fontSize: '1.8rem',
      color: '#1e293b',
      marginBottom: '1.5rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #1e293b, #475569)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    platformNote: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '2rem',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto 2rem',
      backgroundColor: '#f8fafc',
      padding: '1.5rem',
      borderRadius: '12px',
      borderLeft: '4px solid #3b82f6',
    },
    noteHighlight: {
      color: '#3b82f6',
      fontWeight: 'bold',
    },
    platformsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    platformCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '1.5rem',
      borderRadius: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(226, 232, 240, 0.6)',
    },
    platformIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    platformName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    platformCommission: {
      color: '#3b82f6',
      fontWeight: 'bold',
      fontSize: '1rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    platformProducts: {
      color: '#64748b',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    platformDescription: {
      color: '#475569',
      fontSize: '0.85rem',
      lineHeight: '1.4',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px dashed #e2e8f0',
    },
    earningsCalculator: {
      marginTop: '3rem',
      padding: '2.5rem',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    },
    calculatorTitle: {
      fontSize: '1.8rem',
      color: '#166534',
      marginBottom: '1.5rem',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    calculatorContent: {
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
    },
    calculatorInput: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #22c55e',
      borderRadius: '12px',
      fontSize: '1rem',
      marginBottom: '1rem',
      textAlign: 'center',
      background: 'white',
      transition: 'all 0.3s ease',
    },
    calculatorResult: {
      fontSize: '1.8rem',
      color: '#166534',
      fontWeight: 'bold',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      background: 'rgba(34, 197, 94, 0.1)',
      padding: '1rem',
      borderRadius: '12px',
    },
    calculatorNote: {
      color: '#64748b',
      fontSize: '0.9rem',
      marginTop: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '0.75rem',
      borderRadius: '8px',
    },
  };

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  const calculateEarnings = (sales) => {
    const avgCommission = 0.05; // 5% average
    return (sales * avgCommission).toFixed(2);
  };

  return (
    <section id="ecommerce" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>منصة الوساطة التجارية</h2>
          <p style={styles.subtitle}>
            نعرض منتجات من منصات التسوق العالمية. نربح عمولة من كل عملية بيع تتم عبر روابطنا.
            <br />
            <small style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              نحن وسيط ولسنا بائعين مباشرين. جميع المعاملات تتم عبر المنصات الأصلية.
            </small>
          </p>
        </div>

        {/* إخلاء المسؤولية */}
        <div style={styles.disclaimerContainer}>
          <Disclaimer />
        </div>

        {/* ملاحظة هامة */}
        <div style={styles.infoNote}>
          <FaInfoCircle style={styles.infoIcon} />
          <div style={styles.infoText}>
            <span style={styles.highlight}>معلومة مهمة:</span> نحن لسنا شركاء رسميين للمتاجر المعروضة. 
            نعمل عبر <span style={styles.highlight}>برامج الشركاء التابعين (Affiliate Programs)</span> 
            حيث نربح عمولة عند الشراء عبر روابطنا. العمولة تدفع من قبل المتاجر ولا تؤثر على سعر المنتج.
          </div>
        </div>

        {/* فئات المنتجات */}
        <div style={styles.categories}>
          <button 
            style={styles.categoryButton(activeTab === 'all')}
            onClick={() => setActiveTab('all')}
          >
            <FaShoppingBag /> جميع المنتجات
          </button>
          <button 
            style={styles.categoryButton(activeTab === 'electronics')}
            onClick={() => setActiveTab('electronics')}
          >
            <FaMobileAlt /> إلكترونيات
          </button>
          <button 
            style={styles.categoryButton(activeTab === 'home')}
            onClick={() => setActiveTab('home')}
          >
            <FaHome /> أدوات منزلية
          </button>
          <button 
            style={styles.categoryButton(activeTab === 'gaming')}
            onClick={() => setActiveTab('gaming')}
          >
            <FaGamepad /> ألعاب
          </button>
        </div>

        {/* شبكة المنتجات */}
        <div style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              style={styles.productCard}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              className="card"
            >
              <div style={styles.discountBadge}>
                <FaTag /> خصم {product.discount}
              </div>
              
              {product.trending && (
                <div style={styles.trendingBadge}>
                  <FaFire /> ترند
                </div>
              )}
              
              <div style={styles.productImage}>{product.image}</div>
              
              <h3 style={styles.productName}>{product.name}</h3>
              
              <div style={styles.priceContainer}>
                <div style={styles.currentPrice}>
                  <FaDollarSign /> {product.price}
                </div>
                <div style={styles.originalPrice}>${product.originalPrice}</div>
              </div>
              
              <div style={styles.storeInfo}>
                {product.storeIcon} متوفر على {product.store}
              </div>
              
              <div style={styles.commissionBadge}>
                <FaPercentage /> عمولة: {product.commission}
              </div>
              
              <div style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} style={{ 
                    color: i < Math.floor(product.rating) ? '#f59e0b' : '#e2e8f0',
                    fontSize: '0.9rem'
                  }} />
                ))}
                <span style={{ color: '#64748b', marginRight: '0.5rem', fontSize: '0.85rem' }}>
                  {product.rating}
                </span>
              </div>
              
              <div style={styles.salesInfo}>
                <FaShoppingCart /> تم بيع {product.sales} قطعة
              </div>
              
              <div style={styles.actionButtons}>
                <motion.button 
                  style={styles.buyButton}
                  onClick={() => window.open(product.affiliateLink, '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart /> شراء والربح
                </motion.button>
                <motion.button 
                  style={{...styles.shareButton, flex: 2, background: '#e0f2fe', color: '#0284c7', fontWeight: 'bold'}}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://t.me/SmartSouqBot?start=track_${product.id}`, '_blank')}
                >
                  <FaBell /> راقب السعر
                </motion.button>
                <motion.button 
                  style={styles.shareButton}
                  title="مشاركة الرابط"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + product.affiliateLink);
                    alert('تم نسخ رابط المنتج! يمكنك الآن مشاركته لكسب العمولة.');
                  }}
                  whileHover={{ backgroundColor: '#e2e8f0' }}
                >
                  <FaShareAlt />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* قسم المنصات */}
        <div style={styles.platformsSection}>
          <h3 style={styles.platformsTitle}>المنصات العالمية التي نعرض منتجاتها</h3>
          
          <div style={styles.platformNote}>
            <p>
              <span style={styles.noteHighlight}>ملاحظة هامة:</span> نحن لسنا شركاء رسميين لهذه المنصات. 
              نعمل عبر <span style={styles.noteHighlight}>برامج الشركاء التابعين (Affiliate Programs)</span> 
              حيث نربح عمولة عند الشراء عبر روابطنا. هذه ليست شراكات تجارية بالمعنى التقليدي.
            </p>
          </div>
          
          <div style={styles.platformsGrid}>
            {platformInfo.map((platform) => (
              <motion.div 
                key={platform.id} 
                style={styles.platformCard}
                whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                className="card"
              >
                <div style={styles.platformIcon}>{platform.icon}</div>
                <h4 style={styles.platformName}>{platform.name}</h4>
                <div style={styles.platformCommission}>
                  <FaPercentage /> معدل العمولة: {platform.commission}
                </div>
                <div style={styles.platformProducts}>
                  <FaBoxOpen /> +{platform.products} منتج
                </div>
                <p style={styles.platformDescription}>
                  {platform.description}
                  <br />
                  <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    عبر {platform.partnership}
                  </small>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* حاسبة الأرباح */}
        <div style={styles.earningsCalculator}>
          <h3 style={styles.calculatorTitle}>
            <FaChartBar /> احسب أرباحك
          </h3>
          <div style={styles.calculatorContent}>
            <input
              type="number"
              placeholder="أدخل مبيعاتك المتوقعة ($)"
              style={styles.calculatorInput}
              onChange={(e) => {
                const sales = parseFloat(e.target.value) || 0;
                document.getElementById('earningsResult').textContent = 
                  `أرباحك التقريبية: $${calculateEarnings(sales)}`;
              }}
              onFocus={(e) => e.target.style.borderColor = '#16a34a'}
              onBlur={(e) => e.target.style.borderColor = '#22c55e'}
            />
            <div id="earningsResult" style={styles.calculatorResult}>
              <FaDollarSign /> أرباحك التقريبية: $0.00
            </div>
            <div style={styles.calculatorNote}>
              <p>
                معدل العمولة المتوسط هو 5% من كل عملية بيع. 
                العمولة تختلف حسب المتجر والمنتج وتدفع من قبل المتاجر.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedEcommercePlatform;