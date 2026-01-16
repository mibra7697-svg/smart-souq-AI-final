import { COMMISSION_CONFIG } from '@/constants/commission';

/**
 * حساب الأسعار الشفاف والقانوني
 */
export class PricingCalculator {
    static calculateFinalPrice(originalPrice, commissionRate = null) {
        const rate = commissionRate || COMMISSION_CONFIG.DEFAULT_RATE;
        
        // تقريب الرياضيات المالية
        const commissionAmount = this.roundToDecimal(
            originalPrice * rate, 
            COMMISSION_CONFIG.DECIMAL_PLACES
        );
        
        const finalPrice = this.roundToDecimal(
            originalPrice + commissionAmount, 
            COMMISSION_CONFIG.DECIMAL_PLACES
        );
        
        return {
            originalPrice,
            commissionRate: rate * 100, // كنسبة مئوية
            commissionAmount,
            finalPrice,
            currency: COMMISSION_CONFIG.CURRENCY
        };
    }
    
    static roundToDecimal(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
    
    /**
     * تنسيق السعر للعرض (بدون ادعاءات توفير مزيفة)
     */
    static formatPriceDisplay(pricingData) {
        return {
            displayText: `${pricingData.finalPrice} ${pricingData.currency}`,
            breakdown: `يشمل عمولة وساطة ${pricingData.commissionRate}%`,
            isCommissionIncluded: true
        };
    }
}