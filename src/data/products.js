/**
 * بيانات المنتجات النموذجية
 * ملاحظة: في التطبيق الحقيقي، هذه البيانات تأتي من قاعدة بيانات أو APIs
 */

export const products = [
    {
        id: 'prod_001',
        name: 'سماعات لاسلكية بلوتوث',
        description: 'سماعات عالية الجودة مع عزل ضوضاء',
        category: 'إلكترونيات',
        brand: 'سوني',
        price: 299.99,
        customCommissionRate: 0.04, // 4% عمولة خاصة لهذا المنتج
        imageUrl: '/images/products/headphones.jpg',
        store: 'متجر إلكترونيات',
        rating: 4.5,
        freeShipping: true,
        stockLevel: 'high',
        isBestSeller: true,
        affiliateLink: 'https://example.store.com/affiliate/prod_001',
        productPage: 'https://example.store.com/products/headphones',
        // 🚫 لا نضيف ادعاءات توفير غير مثبتة
        // verifiedSavings: 10 // فقط إذا كانت بيانات حقيقية
    },
    {
        id: 'prod_002',
        name: 'ساعة ذكية رياضية',
        description: 'ساعة تتبع اللياقة البدنية مع شاشة لمس',
        category: 'إلكترونيات',
        brand: 'سامسونج',
        price: 199.50,
        imageUrl: '/images/products/smartwatch.jpg',
        store: 'متجر الأجهزة الذكية',
        rating: 4.2,
        freeShipping: false,
        stockLevel: 'medium',
        affiliateLink: 'https://example.store.com/affiliate/prod_002',
        productPage: 'https://example.store.com/products/smartwatch'
    },
    {
        id: 'prod_003',
        name: 'حقيبة لابتوب 15 بوصة',
        description: 'حقيبة مقاومة للماء مع حشوة واقية',
        category: 'ملحقات',
        brand: 'ديل',
        price: 89.99,
        imageUrl: '/images/products/laptop-bag.jpg',
        store: 'متجر الملحقات',
        rating: 4.0,
        freeShipping: true,
        stockLevel: 'low',
        affiliateLink: 'https://example.store.com/affiliate/prod_003',
        productPage: 'https://example.store.com/products/laptop-bag'
    }
];

/**
 * دالة مساعدة للحصول على المنتجات بالفئة
 */
export const getProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
};