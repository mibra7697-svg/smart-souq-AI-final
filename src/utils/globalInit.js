import { web3Manager } from '@/utils/web3Utils';
import affiliateService from '@/services/affiliateService.js';

// Global initialization manager to prevent redundant calls
class GlobalInitManager {
  constructor() {
    this.isInitialized = {
      theme: false,
      auth: false,
      currency: false,
      web3: false,
      services: false
    };
    this.initPromises = {};
  }

  // Initialize once with promise tracking
  async initializeOnce(key, initFunction) {
    if (this.isInitialized[key]) {
      return this.initPromises[key];
    }

    this.isInitialized[key] = true;
    
    this.initPromises[key] = initFunction()
      .then(result => {
        return result;
      })
      .catch(error => {
        console.error(`❌ ${key} initialization failed:`, error);
        this.isInitialized[key] = false; // Allow retry on failure
        throw error;
      });
    
    return this.initPromises[key];
  }

  // Check if initialized
  isReady(key) {
    return this.isInitialized[key];
  }

  // Reset initialization (for development)
  reset(key) {
    this.isInitialized[key] = false;
    delete this.initPromises[key];
  }

  // Get initialization status
  getStatus() {
    return { ...this.isInitialized };
  }
}

// Global instance
export const globalInit = new GlobalInitManager();

// Safe initialization wrapper
export const safeInitialize = async (key, initFunction, options = {}) => {
  const { timeout = 5000, fallback = null } = options;
  
  try {
    const result = await Promise.race([
      globalInit.initializeOnce(key, initFunction),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${key} initialization timeout`)), timeout)
      )
    ]);
    
    return result;
  } catch (error) {
    console.warn(`⚠️ ${key} initialization failed:`, error.message);
    return fallback;
  }
};

// Web3 safe initialization
export const initializeWeb3 = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return safeInitialize('web3', async () => {
    // Check for TronLink
    if (window.tronLink) {
      try {
        await window.tronLink.request({
          method: 'tron_requestAccounts'
        });
        return window.tronLink.tronWeb;
      } catch (error) {
        console.warn('TronLink initialization failed:', error);
        return null;
      }
    } else {
      return null;
    }
  }, { timeout: 3000 });
};

// Services safe initialization
export const initializeServices = async () => {
  return safeInitialize('services', async () => {
    // Initialize affiliate service
    if (typeof window !== 'undefined') {
      if (affiliateService && !affiliateService.isInitialized) {
        affiliateService.initialize();
      }
      
      // Initialize other services here
      // cryptoService, newsService, etc.
    }
    
    return true;
  }, { timeout: 2000 });
};

// Theme safe initialization
export const initializeTheme = async () => {
  return safeInitialize('theme', async () => {
    if (typeof window !== 'undefined') {
      // Apply any saved theme preferences
      const savedTheme = localStorage.getItem('theme-preferences');
      if (savedTheme) {
        try {
          const theme = JSON.parse(savedTheme);
          // Apply theme to CSS variables
          Object.entries(theme).forEach(([key, value]) => {
            if (key.startsWith('--')) {
              document.documentElement.style.setProperty(key, value);
            }
          });
        } catch (error) {
          console.warn('Failed to apply saved theme:', error);
        }
      }
    }
    
    return true;
  }, { timeout: 1000 });
};

// Auto-initialize on client side
export const autoInitialize = async () => {
  if (typeof window === 'undefined') {
    console.log('🖥️ Server-side: skipping auto-initialization');
    return;
  }

  console.log('🚀 Starting auto-initialization...');
  
  try {
    // Initialize in parallel with delays to prevent blocking
    const [theme, services, web3] = await Promise.allSettled([
      initializeTheme(),
      initializeServices(),
      initializeWeb3()
    ]);

    console.log('✅ Auto-initialization complete:', {
      theme: theme.status === 'fulfilled',
      services: services.status === 'fulfilled',
      web3: web3.status === 'fulfilled'
    });

    return {
      success: true,
      initialized: {
        theme: theme.status === 'fulfilled',
        services: services.status === 'fulfilled',
        web3: web3.status === 'fulfilled'
      }
    };
  } catch (error) {
    console.error('❌ Auto-initialization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default globalInit;
