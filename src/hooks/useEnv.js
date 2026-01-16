import { useMemo } from 'react';
import { ENV } from '@/config/env';

/**
 * Hook للوصول الآمن لمتغيرات البيئة
 */
export function useEnv() {
  const config = useMemo(() => {
    return {
      // Alpha Vantage API
      hasAlphaVantage: !!ENV.api.alphaVantage,
      alphaVantage: {
        apiKey: ENV.api.alphaVantage,
      },
      
      // وضع التشغيل
      isDev: !ENV.isProduction,
      isProd: ENV.isProduction,
    };
  }, []);

  return config;
}

/**
 * Hook للتحقق من جاهزية خدمة معينة
 */
export function useServiceStatus(serviceName) {
  const env = useEnv();
  
  const status = useMemo(() => {
    switch (serviceName) {
      case 'alphavantage':
        return {
          isAvailable: env.hasAlphaVantage,
          message: env.hasAlphaVantage
            ? 'Alpha Vantage API is configured'
            : 'Alpha Vantage API key missing - using mock data',
        };
      
      default:
        return { isAvailable: false, message: 'Unknown service' };
    }
  }, [serviceName, env]);

  return status;
}
