/**
 * تعريف الأنواع لضمان سلامة الكود
 */

export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    brand?: string;
    price: number;
    customCommissionRate?: number;
    imageUrl?: string;
    store?: string;
    rating?: number;
    freeShipping?: boolean;
    stockLevel?: 'low' | 'medium' | 'high' | 'out_of_stock';
    isBestSeller?: boolean;
    affiliateLink: string;
    productPage?: string;
    verifiedSavings?: number; // فقط إذا كانت بيانات حقيقية
}

export interface PricingDetails {
    originalPrice: number;
    commissionRate: number;
    commissionAmount: number;
    finalPrice: number;
    currency: string;
    display: {
        displayText: string;
        breakdown: string;
        isCommissionIncluded: boolean;
    };
}

export interface EnhancedProduct extends Product {
    pricing: PricingDetails;
    shippingInfo: string;
    lastUpdated: string;
    badge: Array<{
        text: string;
        type: 'success' | 'info' | 'warning' | 'savings';
        verified?: boolean;
    }>;
}

export interface SearchResponse {
    status: 'success' | 'no_results' | 'error';
    timestamp: string;
    metadata?: {
        query: string;
        resultsCount: number;
        searchTime: number;
        commissionRate: number;
    };
    data?: EnhancedProduct[];
    message?: string;
    suggestions?: string[];
    disclaimers?: string[];
    errorCode?: string;
    recoverySteps?: string[];
}

export interface SearchOptions {
    maxResults?: number;
    sortBy?: 'price' | 'rating' | 'popularity';
    includeOutOfStock?: boolean;
}