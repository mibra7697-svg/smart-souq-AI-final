import { ENV } from '@/config/env';
import apiClient, { PROXY_ROUTES } from './apiClient';
import axios from 'axios';

/**
 * Geolocation Service for detecting user's country based on IP
 */

const GEOLOCATION_APIS = {
  primary: PROXY_ROUTES.IPAPI + '/json/',
  fallback: 'https://ipapi.com/json/',
  backup: 'https://freeipapi.com/api/json/'
};

const COUNTRY_CURRENCY_MAP = {
  'SY': { 
    currency: 'SYP', 
    name: 'Syria', 
    paymentRouting: 'local',
    symbol: '£S',
    decimals: 2
  },
  'EG': { 
    currency: 'EGP', 
    name: 'Egypt', 
    paymentRouting: 'local',
    symbol: '£E',
    decimals: 2
  },
  'IQ': { 
    currency: 'IQD', 
    name: 'Iraq', 
    paymentRouting: 'local',
    symbol: 'ع.د',
    decimals: 3
  },
  'LY': { 
    currency: 'LYD', 
    name: 'Libya', 
    paymentRouting: 'local',
    symbol: 'ل.د',
    decimals: 3
  },
  'JO': { 
    currency: 'JOD', 
    name: 'Jordan', 
    paymentRouting: 'local',
    symbol: 'د.أ',
    decimals: 3
  },
  'SA': { 
    currency: 'SAR', 
    name: 'Saudi Arabia', 
    paymentRouting: 'gcc',
    symbol: 'ر.س',
    decimals: 2
  },
  'AE': { 
    currency: 'AED', 
    name: 'UAE', 
    paymentRouting: 'gcc',
    symbol: 'د.إ',
    decimals: 2
  },
  'KW': { 
    currency: 'KWD', 
    name: 'Kuwait', 
    paymentRouting: 'gcc',
    symbol: 'د.ك',
    decimals: 3
  },
  'QA': { 
    currency: 'QAR', 
    name: 'Qatar', 
    paymentRouting: 'gcc',
    symbol: 'ر.ق',
    decimals: 2
  },
  'BH': { 
    currency: 'BHD', 
    name: 'Bahrain', 
    paymentRouting: 'gcc',
    symbol: 'د.ب',
    decimals: 3
  },
  'OM': { 
    currency: 'OMR', 
    name: 'Oman', 
    paymentRouting: 'gcc',
    symbol: 'ر.ع',
    decimals: 3
  },
  'default': { 
    currency: 'USD', 
    name: 'Global', 
    paymentRouting: 'crypto',
    symbol: '$',
    decimals: 2
  }
};

class GeolocationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 1000 * 60 * 30; // 30 minutes
  }

  /**
   * Get user's location with fallback mechanism
   */
  async getUserLocation() {
    // Fast-Fail: 1s timeout for geolocation to prevent blocking the app
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        // Silent fallback to default location
        resolve(this.getDefaultLocation());
      }, 1000);
    });

    const locationPromise = (async () => {
      try {
        // Try to get from cache first
        const cached = this.getFromCache();
        if (cached) return cached;

        // Try primary API (ipapi.co)
        let location = await this.fetchFromAPI(GEOLOCATION_APIS.primary);
        
        // Fallback to other APIs if primary fails
        if (!location) {
          location = await this.fetchFromAPI(GEOLOCATION_APIS.fallback);
        }
        
        if (!location) {
          location = await this.fetchFromAPI(GEOLOCATION_APIS.backup);
        }

        // Final fallback to browser geolocation
        if (!location) {
          location = await this.getBrowserLocation();
        }

        // Default fallback to USD
        if (!location) {
          location = this.getDefaultLocation();
        }

        // Cache the result
        this.setCache(location);
        
        return location;
      } catch (error) {
        console.warn('Geolocation service encountered an error, defaulting to USD:', error.message);
        return this.getDefaultLocation();
      }
    })();

    // Race the geolocation logic against the 1.5s timeout
    return Promise.race([locationPromise, timeoutPromise]);
  }

  /**
   * Fetch location data from API with CORS proxy support
   */
  async fetchFromAPI(url) {
    try {
      // Use apiClient for proxied routes, otherwise use axios directly if needed
      // Since GEOLOCATION_APIS.primary is already a relative path (/api/ipapi/json/)
      // it will work with apiClient's baseURL
      const response = await apiClient.get(url, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      // Validate JSON response
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('application/json')) {
        const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (dataStr.trim().startsWith('<!DOCTYPE') || dataStr.trim().startsWith('<html')) {
          throw new Error('Received HTML instead of JSON');
        }
      }

      const data = response.data;
      
      // Handle different API response formats
      const countryCode = data.country_code || data.country || data.code;
      const currency = this.getCurrencyForCountry(countryCode);
      
      return {
        country: countryCode,
        currency: currency,
        region: data.region || data.region_name,
        city: data.city,
        ip: data.ip,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Get proxy URL for CORS handling (especially for Syria)
   */
  getProxyUrl(url) {
    // Use environment variable for proxy or fallback to direct URL
    const proxyBase = ENV.api.corsProxy;
    
    // For Syria and restricted regions, use proxy
    if (proxyBase && this.isRestrictedRegion()) {
      return `${proxyBase}${url}`;
    }
    
    return url;
  }

  /**
   * Check if current region requires proxy
   */
  isRestrictedRegion() {
    // This would be determined by the geolocation service
    // For now, return true to always use proxy in sensitive regions
    return true;
  }

  /**
   * Get browser geolocation as fallback
   */
  async getBrowserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode coordinates to country
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
              { timeout: 3000 }
            );

            const countryCode = this.extractCountryCode(response.data?.address);
            const currency = this.getCurrencyForCountry(countryCode);

            resolve({
              country: countryCode,
              currency: currency,
              region: response.data?.address?.state,
              city: response.data?.address?.city,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now()
            });
          } catch (error) {
            console.warn('Browser geocoding failed:', error);
            resolve(null);
          }
        },
        (error) => {
          console.warn('Browser geolocation failed:', error);
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  }

  /**
   * Extract country code from address data
   */
  extractCountryCode(address) {
    if (!address) return 'default';
    
    // Map common country names to codes
    const countryMap = {
      'Syria': 'SY',
      'Egypt': 'EG',
      'Iraq': 'IQ',
      'Libya': 'LY',
      'Jordan': 'JO',
      'Saudi Arabia': 'SA',
      'United Arab Emirates': 'AE',
      'Kuwait': 'KW',
      'Qatar': 'QA',
      'Bahrain': 'BH',
      'Oman': 'OM'
    };

    const countryName = address.country;
    return countryMap[countryName] || 'default';
  }

  /**
   * Get currency configuration for country
   */
  getCurrencyForCountry(countryCode) {
    return COUNTRY_CURRENCY_MAP[countryCode] || COUNTRY_CURRENCY_MAP.default;
  }

  /**
   * Get default location (fallback)
   */
  getDefaultLocation() {
    return {
      country: 'default',
      currency: COUNTRY_CURRENCY_MAP.default,
      region: 'Global',
      city: 'Unknown',
      timestamp: Date.now()
    };
  }

  /**
   * Cache management
   */
  getFromCache() {
    const cached = this.cache.get('location');
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached;
    }
    return null;
  }

  setCache(location) {
    this.cache.set('location', location);
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount, currencyCode, locale = 'en-US') {
    const currency = this.getCurrencyForCountry(currencyCode);
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.currency,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
    }
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies() {
    return Object.values(COUNTRY_CURRENCY_MAP).reduce((acc, currency) => {
      if (!acc.find(c => c.currency === currency.currency)) {
        acc.push(currency);
      }
      return acc;
    }, []);
  }

  /**
   * Validate if country is supported
   */
  isCountrySupported(countryCode) {
    return !!COUNTRY_CURRENCY_MAP[countryCode];
  }
}

export default new GeolocationService();
