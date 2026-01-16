/**
 * Unified Proxy Handler for External API Calls
 * Provides CORS-safe access to external APIs through Vite proxy
 */

import apiClient from '@/services/apiClient';

/**
 * Proxy route mappings
 */
export const PROXY_ROUTES = {
  BINANCE: '/api/binance',
  COINGECKO: '/api/coingecko',
  IPAPI: '/api/ipapi',
  GEMINI: '/api/gemini',
  ALPHA_VANTAGE: '/api/alphavantage',
  TRONGRID: '/api/trongrid'
};

/**
 * Convert external API URL to internal proxy route
 */
export const getProxyRoute = (url, apiType) => {
  if (!url) return null;

  // If already a proxy route, return as-is
  if (url.startsWith('/api/')) {
    return url;
  }

  // Binance API
  if (url.includes('api.binance.com') || apiType === 'binance') {
    const path = url.split('api.binance.com')[1] || url.split('/api/v3')[1] || url;
    return `${PROXY_ROUTES.BINANCE}${path.startsWith('/') ? path : '/' + path}`;
  }

  // CoinGecko API
  if (url.includes('api.coingecko.com') || apiType === 'coingecko') {
    const path = url.split('api.coingecko.com')[1] || url.split('/api/v3')[1] || url;
    return `${PROXY_ROUTES.COINGECKO}${path.startsWith('/') ? path : '/' + path}`;
  }

  // IP API
  if (url.includes('ipapi.co') || apiType === 'ipapi') {
    const path = url.split('ipapi.co')[1] || url;
    return `${PROXY_ROUTES.IPAPI}${path.startsWith('/') ? path : '/' + path}`;
  }

  // Gemini AI
  if (url.includes('generativelanguage.googleapis.com') || apiType === 'gemini') {
    const path = url.split('generativelanguage.googleapis.com')[1] || url.split('/v1beta')[1] || url;
    return `${PROXY_ROUTES.GEMINI}${path.startsWith('/') ? path : '/' + path}`;
  }

  // Alpha Vantage
  if (url.includes('alphavantage.co') || apiType === 'alphavantage') {
    const path = url.split('alphavantage.co')[1] || url.split('/query')[1] || url;
    return `${PROXY_ROUTES.ALPHA_VANTAGE}${path.startsWith('/') ? path : '/' + path}`;
  }

  // TronGrid
  if (url.includes('trongrid.io') || apiType === 'trongrid') {
    const path = url.split('trongrid.io')[1] || url;
    return `${PROXY_ROUTES.TRONGRID}${path.startsWith('/') ? path : '/' + path}`;
  }

  return null;
};

/**
 * Make proxied API request with error handling and fallback
 */
export const proxiedRequest = async (url, options = {}) => {
  const {
    apiType,
    timeout = 10000,
    retries = 2,
    fallback = null,
    validateResponse = true
  } = options;

  const proxyRoute = getProxyRoute(url, apiType);

  if (!proxyRoute) {
    throw new Error(`Unable to create proxy route for: ${url}`);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiClient.get(proxyRoute, {
        timeout,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers
        },
        params: options.params,
        validateStatus: (status) => status < 500
      });

      // Validate JSON response
      if (validateResponse) {
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
          const dataStr = typeof response.data === 'string' 
            ? response.data 
            : JSON.stringify(response.data || '');
          
          if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
            throw new Error('Received HTML instead of JSON. Proxy misconfigured.');
          }
        }
      }

      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      if (isLastAttempt) {
        console.error(`[Proxy] Request failed after ${retries + 1} attempts:`, error.message);
        
        // Return fallback if provided
        if (fallback !== null) {
          console.warn('[Proxy] Using fallback data');
          return fallback;
        }
        
        throw error;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

/**
 * POST request through proxy
 */
export const proxiedPost = async (url, data, options = {}) => {
  const {
    apiType,
    timeout = 10000,
    retries = 2
  } = options;

  const proxyRoute = getProxyRoute(url, apiType);

  if (!proxyRoute) {
    throw new Error(`Unable to create proxy route for: ${url}`);
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiClient.post(proxyRoute, data, {
        timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        },
        validateStatus: (status) => status < 500
      });

      return response.data;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

export default {
  PROXY_ROUTES,
  getProxyRoute,
  proxiedRequest,
  proxiedPost
};
