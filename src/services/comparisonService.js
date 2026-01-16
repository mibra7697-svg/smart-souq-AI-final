import { products } from '@/data/products';
import { PricingCalculator } from '@/utils/pricingCalculator';
import { COMMISSION_CONFIG, LEGAL_DISCLAIMERS, SEARCH_CONFIG } from '@/constants/commission';

/**
 * خدمة البحث والمقارنة الشفافة والقانونية
 */
export class ComparisonService {
    constructor() {
        this.commissionRate = COMMISSION_CONFIG.DEFAULT_RATE;
        this.disclaimers = LEGAL_DISCLAIMERS;
    }
    
    /**
     * البحث الذكي مع مراعاة الجوانب القانونية
     */
    async searchProducts(query, category = 'all', options = {}) {
        // التحقق من صحة المدخلات
        if (!this.isValidQuery(query)) {
            return this.createErrorResponse('استخدم مصطلح بحث يتكون من حرفين على الأقل');
        }
        
        try {
            // محاكاة البحث غير المتزامن
            const results = await this.simulateAsyncSearch(query, category, options);
            
            if (results.length === 0) {
                return this.createNoResultsResponse(query);
            }
            
            return this.createSuccessResponse(results, query);
            
        } catch (error) {
            console.error('Search error:', error);
            return this.createErrorResponse('حدث خطأ في البحث، يرجى المحاولة لاحقاً');
        }
    }
    
    /**
     * البحث المحلي مع فلترة ذكية
     */
    performLocalSearch(query, category) {
        return products.filter(product => {
            const matchesText = product.name?.toLowerCase().includes(query.toLowerCase()) ||
                              product.description?.toLowerCase().includes(query.toLowerCase());
            
            const matchesCategory = category === 'all' || 
                                   product.category === category;
            
            // يمكن إضافة المزيد من شروط الفلترة
            const isAvailable = product.availability !== false;
            
            return matchesText && matchesCategory && isAvailable;
        });
    }
    
    /**
     * إضافة معلومات السوق الشفافة (بدون ادعاءات مزيفة)
     */
    enhanceWithMarketInfo(products) {
        return products.map(product => {
            const pricing = PricingCalculator.calculateFinalPrice(
                product.price, 
                product.customCommissionRate || this.commissionRate
            );
            
            return {
                // المعلومات الأساسية
                id: product.id,
                name: product.name,
                category: product.category,
                brand: product.brand,
                imageUrl: product.imageUrl,
                
                // المعلومات المالية الشفافة
                pricing: {
                    ...pricing,
                    display: PricingCalculator.formatPriceDisplay(pricing)
                },
                
                // معلومات المتجر (إن وجدت)
                store: product.store || 'متجر شريك',
                storeRating: product.rating || null,
                
                // معلومات إضافية واقعية
                shippingInfo: product.freeShipping ? 'شحن مجاني' : 'رسوم شحن تطبق',
                lastUpdated: new Date().toISOString().split('T')[0],
                
                // روابط واضحة
                affiliateLink: product.affiliateLink || '#',
                productPage: product.productPage || '#',
                
                // 🚫 لا توجد ادعاءات توفير مزيفة
                // يتم استبدالها بمعلومات واقعية إن وجدت
                badges: this.getRealisticBadge(product)
            };
        });
    }
    
    /**
     * شارات واقعية (فقط إذا كانت مدعومة ببيانات)
     */
    getRealisticBadge(product) {
        const badges = [];
        
        if (product.isBestSeller) {
            badges.push({ text: 'الأكثر مبيعاً', type: 'success' });
        }
        
        if (product.freeShipping) {
            badges.push({ text: 'شحن مجاني', type: 'info' });
        }
        
        if (product.stockLevel === 'low') {
            badges.push({ text: 'كمية محدودة', type: 'warning' });
        }
        
        // 🚫 لا نضيف "وفر X%" إلا إذا كان لدينا بيانات مقارنة حقيقية
        if (product.verifiedSavings) {
            badges.push({ 
                text: `وفر ${product.verifiedSavings}%`, 
                type: 'savings',
                verified: true 
            });
        }
        
        return badges;
    }
    
    /**
     * محاكاة البحث غير المتزامن
     */
    simulateAsyncSearch(query, category, options) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const localResults = this.performLocalSearch(query, category);
                const enhancedResults = this.enhanceWithMarketInfo(localResults);
                
                // تطبيق حدود النتائج
                const maxResults = options.maxResults || SEARCH_CONFIG.MAX_RESULTS;
                const limitedResults = enhancedResults.slice(0, maxResults);
                
                resolve(limitedResults);
                
            }, this.getRealisticDelay());
        });
    }
    
    /**
     * تأخير واقعي للمحاكاة
     */
    getRealisticDelay() {
        return SEARCH_CONFIG.TIMEOUT_MS + (Math.random() * 1000);
    }
    
    /**
     * إنشاء استجابات منظمة
     */
    createSuccessResponse(results, query) {
        return {
            status: 'success',
            timestamp: new Date().toISOString(),
            metadata: {
                query,
                resultsCount: results.length,
                searchTime: Date.now(),
                commissionRate: this.commissionRate * 100
            },
            data: results,
            disclaimers: [
                this.disclaimers.PRICING,
                this.disclaimers.AVAILABILITY
            ],
            suggestions: this.generateSuggestions(query)
        };
    }
    
    createNoResultsResponse(query) {
        return {
            status: 'no_results',
            timestamp: new Date().toISOString(),
            message: `لم نعثر على نتائج لـ "${query}"`,
            suggestions: [
                'تأكد من كتابة المصطلح بشكل صحيح',
                'جرب مصطلحات بحث أوسع',
                'استعرض الفئات الرئيسية'
            ],
            disclaimers: [this.disclaimers.AVAILABILITY]
        };
    }
    
    createErrorResponse(message) {
        return {
            status: 'error',
            timestamp: new Date().toISOString(),
            message,
            errorCode: 'SEARCH_ERROR',
            recoverySteps: [
                'تحديث الصفحة والمحاولة مرة أخرى',
                'التأكد من اتصال الإنترنت'
            ]
        };
    }
    
    /**
     * توليد اقتراحات بحث واقعية
     */
    generateSuggestions(query) {
        const suggestions = [];
        
        if (query.length < 3) {
            suggestions.push('جرب مصطلحات بحث أطول للحصول على نتائج أدق');
        }
        
        // يمكن إضافة اقتراحات بناءً على الفئات الشائعة
        const popularCategories = ['إلكترونيات', 'ملابس', 'أجهزة منزلية'];
        suggestions.push(`جرب البحث في فئة: ${popularCategories.join('، ')}`);
        
        return suggestions;
    }
    
    /**
     * التحقق من صحة استعلام البحث
     */
    isValidQuery(query) {
        return query && 
               query.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH &&
               query.trim().length <= 100;
    }
}

/**
 * دالة التصدير الرئيسية (للتطبيقات غير الموجهة بالكائنات)
 */
export const sendToAI = async (query, category = 'all', options = {}) => {
    try {
        // Dynamic import to break circular dependency
        const { RealDataService } = await import('./realDataService');
        const service = new RealDataService();
        return await service.searchProducts(query, category, options);
    } catch (error) {
        console.warn('RealDataService failed to load, falling back to ComparisonService', error);
        const service = new ComparisonService();
        return await service.searchProducts(query, category, options);
    }
};