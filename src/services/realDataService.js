/**
 * خدمة لجلب بيانات حقيقية من APIs المتاجر
 */

import { ComparisonService } from '@/services/comparisonService';
import { ENV } from '@/config/env';

export class RealDataService extends ComparisonService {
    constructor() {
        super();
        this.useRealData = !ENV.isProduction; // Enable real data by default in dev
        this.APIS = {
            amazon: {
                endpoint: 'https://api.rainforestapi.com/request',
                apiKey: null, // Removed deprecated fallback
                requiresAuth: true
            },
            noon: {
                endpoint: 'https://api.noon.com/v1/search',
                apiKey: null // Removed deprecated fallback
            },
            localStores: [
                'https://api.extra.com/products',
                'https://api.jarir.com/v2/search'
            ]
        };
    }
    
    /**
     * البحث في مصادر متعددة بشكل متوازي
     */
    async searchProducts(query, category, options = {}) {
        if (!this.isValidQuery(query)) {
            return this.createErrorResponse('استخدم مصطلح بحث يتكون من حرفين على الأقل');
        }

        const hasRealApis = this.APIS.amazon.apiKey || this.APIS.noon.apiKey;
        
        if (hasRealApis) {
            const results = await this.searchRealProducts(query, category);
            if (results && results.length > 0) {
                return this.createSuccessResponse(results, query);
            }
        }

        return super.searchProducts(query, category, options);
    }

    async searchRealProducts(query, category) {
        try {
            // 1. البحث المحلي أولاً (أسرع)
            const localResults = this.performLocalSearch(query, category);
            
            // 2. البحث في APIs الخارجية بالتوازي
            const externalPromises = [
                this.searchAmazon(query, category),
                this.searchNoon(query, category),
                // this.searchExtra(query, category),
                // this.searchJarir(query, category)
            ];
            
            const [amazonResults, noonResults] = await Promise.allSettled(externalPromises);
            
            // 3. دمج النتائج مع إزالة التكرارات
            const allResults = this.mergeResults([
                localResults,
                this.getFulfilledResult(amazonResults),
                this.getFulfilledResult(noonResults)
            ]);
            
            // 4. تحسين النتائج
            return this.enhanceWithMarketInfo(allResults);
            
        } catch (error) {
            console.error('Real data search failed:', error);
            // العودة للبيانات المحلية في حالة فشل APIs
            return this.enhanceWithMarketInfo(
                this.performLocalSearch(query, category)
            );
        }
    }
    
    /**
     * البحث في Amazon Product API
     */
    async searchAmazon(query, category) {
        if (!this.APIS.amazon.apiKey) {
            console.warn('Amazon API key not configured');
            return [];
        }
        
        try {
            const params = {
                api_key: this.APIS.amazon.apiKey,
                type: 'search',
                amazon_domain: 'amazon.sa',
                search_term: query,
                category_id: this.mapCategoryToAmazonId(category),
                sort_by: 'price_low_to_high',
                page: 1,
                output: 'json'
            };
            
            const response = await fetch(
                `${this.APIS.amazon.endpoint}?${new URLSearchParams(params)}`,
                { timeout: 5000 }
            );
            
            if (!response.ok) throw new Error(`Amazon API: ${response.status}`);
            
            const data = await response.json();
            return this.transformAmazonResults(data.search_results || []);
            
        } catch (error) {
            console.error('Amazon search error:', error);
            return [];
        }
    }
    
    /**
     * البحث في Noon API
     */
    async searchNoon(query, category) {
        if (!this.APIS.noon.apiKey) return [];
        
        try {
            const headers = {
                'Authorization': `Bearer ${this.APIS.noon.apiKey}`,
                'Content-Type': 'application/json'
            };
            
            const body = {
                query,
                filters: {
                    category: this.mapCategoryToNoon(category)
                },
                sort: { field: 'price', order: 'asc' },
                limit: 20
            };
            
            const response = await fetch(this.APIS.noon.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                timeout: 5000
            });
            
            const data = await response.json();
            return this.transformNoonResults(data.products || []);
            
        } catch (error) {
            console.error('Noon search error:', error);
            return [];
        }
    }
    
    /**
     * تحويل نتائج Amazon للتنسيق الموحد
     */
    transformAmazonResults(amazonProducts) {
        return amazonProducts.map(item => ({
            id: `amz_${item.asin}`,
            name: item.title,
            description: item.description,
            category: this.mapAmazonCategory(item.category),
            brand: item.brand,
            price: parseFloat(item.price?.value || item.price?.raw?.split(' ')[0] || 0),
            imageUrl: item.image,
            store: 'Amazon.sa',
            rating: parseFloat(item.ratings?.average) || null,
            freeShipping: item.delivery?.includes('FREE Shipping') || false,
            affiliateLink: item.link,
            productPage: item.link,
            // بيانات إضافية من Amazon
            isBestSeller: item.bestseller || false,
            stockLevel: item.availability ? 'high' : 'out_of_stock'
        })).filter(item => item.price > 0); // تجاهل العناصر بدون سعر
    }
    
    /**
     * تحويل نتائج Noon للتنسيق الموحد
     */
    transformNoonResults(noonProducts) {
        return noonProducts.map(item => ({
            id: `noon_${item.sku}`,
            name: item.name_en || item.name_ar,
            description: item.description,
            category: item.category?.name || 'عام',
            brand: item.brand?.name,
            price: item.sale_price || item.price,
            imageUrl: item.image_url,
            store: 'Noon',
            rating: item.rating?.average,
            freeShipping: item.free_shipping || false,
            affiliateLink: this.generateAffiliateLink('noon', item.sku),
            productPage: item.url,
            stockLevel: item.stock > 10 ? 'high' : item.stock > 0 ? 'low' : 'out_of_stock'
        }));
    }
    
    /**
     * دمج النتائج من مصادر متعددة
     */
    mergeResults(resultsArrays) {
        const merged = [];
        const seenIds = new Set();
        
        resultsArrays.flat().forEach(product => {
            if (!product || !product.id || seenIds.has(product.id)) return;
            
            // البحث عن منتجات مكررة (بنفس الاسم والماركة)
            const duplicate = merged.find(p => 
                p.name === product.name && 
                p.brand === product.brand &&
                Math.abs(p.price - product.price) < (p.price * 0.2) // فرق سعر أقل من 20%
            );
            
            if (duplicate) {
                // اختيار المنتج ذو السعر الأقل
                if (product.price < duplicate.price) {
                    const index = merged.indexOf(duplicate);
                    merged[index] = product;
                }
            } else {
                merged.push(product);
                seenIds.add(product.id);
            }
        });
        
        // ترتيب حسب السعر
        return merged.sort((a, b) => a.price - b.price);
    }
    
    /**
     * إنشاء روابط تابعة
     */
    generateAffiliateLink(store, productId) {
        const affiliateIds = {
            amazon: 'yoursmartsoq-21', // استبدل ب ID التابع الخاص بك
            noon: 'ref=abc123', // استبدل
            extra: 'affiliate=xyz'
        };
        
        const baseUrls = {
            amazon: `https://www.amazon.sa/dp/${productId}`,
            noon: `https://www.noon.com/saudi-en/${productId}`,
            extra: `https://www.extra.com/en-sa/product/${productId}`
        };
        
        const affiliateParam = affiliateIds[store];
        const baseUrl = baseUrls[store];
        
        return affiliateParam ? 
            `${baseUrl}?${affiliateParam}` : 
            baseUrl;
    }
    
    /**
     * تعيين الفئات بين أنظمتك وAPIs الخارجية
     */
    mapCategoryToAmazonId(category) {
        const mapping = {
            electronics: 'electronics',
            fashion: 'fashion',
            home: 'home-garden',
            sports: 'sports'
        };
        return mapping[category] || 'aps';
    }
    
    mapCategoryToNoon(category) {
        const mapping = {
            electronics: 'ELECTRONICS',
            fashion: 'FASHION',
            home: 'HOME_KITCHEN',
            sports: 'SPORTS'
        };
        return mapping[category] || 'ALL';
    }
    
    mapAmazonCategory(amazonCat) {
        const mapping = {
            'Electronics': 'إلكترونيات',
            'Computers': 'إلكترونيات',
            'Home & Kitchen': 'أجهزة منزلية',
            'Sports & Outdoors': 'رياضة',
            'Clothing, Shoes & Jewelry': 'موضة'
        };
        return mapping[amazonCat] || 'عام';
    }
    
    /**
     * أدوات مساعدة
     */
    getFulfilledResult(promiseResult) {
        return promiseResult.status === 'fulfilled' ? promiseResult.value : [];
    }
}

/**
 * تصدير خدمة البحث المحسنة
 */
export const searchWithRealData = async (query, category = 'all', options = {}) => {
    const service = new RealDataService();
    
    // Attempt to search with real data if keys are present
    const hasRealApis = service.APIS.amazon.apiKey || service.APIS.noon.apiKey;
    
    if (hasRealApis) {
        const results = await service.searchRealProducts(query, category);
        if (results && results.length > 0) {
            return service.createSuccessResponse(results, query);
        }
    }
    
    // Fallback to local/mock data
    return service.searchProducts(query, category, options);
};