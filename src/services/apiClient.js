import axios from 'axios';
import { ENV } from '@/config/env';

/**
 * Unified API Client for Smart Souq AI
 * Handles proxy routing and CORS bypass via local Vite server (Port 3002)
 */
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Force port 3002 in development, use origin in production
    if (window.location.port && window.location.port !== '3002' && !ENV.isProduction) {
      return `http://localhost:3002`;
    }
    return window.location.origin;
  }
  return 'http://localhost:3002';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Proxy routes defined in vite.config.js
export const PROXY_ROUTES = {
  BINANCE: '/api/binance',
  COINGECKO: '/api/coingecko',
  IPAPI: '/api/ipapi',
  GEMINI: '/api/gemini',
  ALPHA_VANTAGE: '/api/alphavantage',
  TRONGRID: '/api/trongrid'
};

/**
 * Helper to get proxied URL for Binance or CoinGecko
 * @param {string} originalUrl The full external URL
 * @param {'binance' | 'coingecko'} type The service type
 * @returns {string} The local proxy URL
 */
export const getProxiedPath = (originalUrl, type) => {
  if (!originalUrl) return '';
  
  const domain = type === 'binance' ? 'api.binance.com' : 'api.coingecko.com';
  const proxyBase = type === 'binance' ? PROXY_ROUTES.BINANCE : PROXY_ROUTES.COINGECKO;
  
  // Extract path after domain and remove /api/v3 since proxy rewrite adds it
  const pathParts = originalUrl.split(domain);
  if (pathParts.length < 2) return originalUrl;
  
  let apiPath = pathParts[1].replace(/^\/api\/v3/, '');
  return `${proxyBase}${apiPath}`;
};

// Response interceptor for unified error handling and JSON validation
apiClient.interceptors.response.use(
  (response) => {
    // Validate that response is JSON, not HTML
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      // Check if response body looks like HTML
      const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
        console.error(`[API Client] Received HTML instead of JSON from ${response.config?.url}`);
        throw new Error('Received HTML response instead of JSON. Check proxy configuration.');
      }
    }
    return response;
  },
  (error) => {
    // Check if error response contains HTML
    if (error.response) {
      const contentType = error.response.headers['content-type'] || '';
      const dataStr = typeof error.response.data === 'string' 
        ? error.response.data 
        : JSON.stringify(error.response.data || '');
      
      if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
        console.error(`[API Client] Error response is HTML from ${error.config?.url}`);
        error.message = 'Server returned HTML instead of JSON. Check API endpoint and proxy configuration.';
      }
    }
    console.error(`[API Client Error] ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
