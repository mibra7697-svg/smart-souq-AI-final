/**
 * ثوابت العمولة والإعدادات القانونية
 * ملاحظة: يجب تحديث هذه النسب حسب سياسات كل متجر
 */

export const COMMISSION_CONFIG = {
    DEFAULT_RATE: 0.05, // 5% عمولة وساطة أساسية
    DISPLAY_COMMISSION: true, // إظهار العمولة للمستخدم
    CURRENCY: 'ريال سعودي', // أو العملة المحلية
    DECIMAL_PLACES: 2
};

export const LEGAL_DISCLAIMERS = {
    PRICING: 'الأسعار المعروضة تشمل عمولة الوساطة وتخضع للتغيير حسب المتاجر',
    AVAILABILITY: 'المنتجات والاسعار للمقارنة فقط، التوفر يخضع لشروط المتجر الأصلي',
    COMMISSION: 'نحن وسيط مستقل، العمولة تدفع من قبل المتاجر ولا تؤثر على سعرك النهائي'
};

export const SEARCH_CONFIG = {
    TIMEOUT_MS: 1500,
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS: 50
};
