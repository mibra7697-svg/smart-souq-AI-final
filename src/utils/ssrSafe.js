// SSR-safe utilities to prevent client-side code from running on server
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';
export const isServer = !isClient;

// Safe localStorage access
export const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    if (!isClient) return defaultValue;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage access error:', error);
      return defaultValue;
    }
  },
  
  setItem: (key, value) => {
    if (!isClient) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage set error:', error);
      return false;
    }
  },
  
  removeItem: (key) => {
    if (!isClient) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage remove error:', error);
      return false;
    }
  },
  
  clear: () => {
    if (!isClient) return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('localStorage clear error:', error);
      return false;
    }
  }
};

// Safe sessionStorage access
export const safeSessionStorage = {
  getItem: (key, defaultValue = null) => {
    if (!isClient) return defaultValue;
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('sessionStorage access error:', error);
      return defaultValue;
    }
  },
  
  setItem: (key, value) => {
    if (!isClient) return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('sessionStorage set error:', error);
      return false;
    }
  }
};

// Safe window access
export const safeWindow = {
  get: (property, defaultValue = null) => {
    if (!isClient) return defaultValue;
    try {
      return window[property];
    } catch (error) {
      console.warn(`Window access error for ${property}:`, error);
      return defaultValue;
    }
  },
  
  set: (property, value) => {
    if (!isClient) return false;
    try {
      window[property] = value;
      return true;
    } catch (error) {
      console.warn(`Window set error for ${property}:`, error);
      return false;
    }
  }
};

// Safe document access
export const safeDocument = {
  get: (property, defaultValue = null) => {
    if (!isClient) return defaultValue;
    try {
      return document[property];
    } catch (error) {
      console.warn(`Document access error for ${property}:`, error);
      return defaultValue;
    }
  },
  
  getElementById: (id) => {
    if (!isClient) return null;
    try {
      return document.getElementById(id);
    } catch (error) {
      console.warn(`getElementById error for ${id}:`, error);
      return null;
    }
  },
  
  querySelector: (selector) => {
    if (!isClient) return null;
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`querySelector error for ${selector}:`, error);
      return null;
    }
  }
};

// Safe navigator access
export const safeNavigator = {
  get: (property, defaultValue = null) => {
    if (!isClient) return defaultValue;
    try {
      return navigator[property];
    } catch (error) {
      console.warn(`Navigator access error for ${property}:`, error);
      return defaultValue;
    }
  },
  
  getUserAgent: () => {
    if (!isClient) return 'SSR-Agent';
    try {
      return navigator.userAgent;
    } catch (error) {
      return 'Unknown-Agent';
    }
  }
};

// Environment variable checker
export const checkEnvVariable = (name, required = true) => {
  // Use import.meta.env for Vite environment
  const env = import.meta.env || {};
  const value = env[name];
  
  if (required && !value) {
    console.warn(`❌ Missing required environment variable: ${name}`);
    return null;
  }
  
  if (!value) {
    console.info(`ℹ️ Optional environment variable not set: ${name}`);
    return null;
  }
  
  console.info(`✅ Environment variable found: ${name}`);
  return value;
};

// API key validator
export const validateApiKey = (key, serviceName) => {
  if (!key || typeof key !== 'string') {
    console.warn(`❌ Invalid API key for ${serviceName}`);
    return false;
  }
  
  if (key.length < 10) {
    console.warn(`❌ API key too short for ${serviceName}`);
    return false;
  }
  
  console.info(`✅ Valid API key format for ${serviceName}`);
  return true;
};

// Safe fetch wrapper
export const safeFetch = async (url, options = {}, timeout = 10000) => {
  if (!isClient) {
    console.warn('⚠️ Fetch called on server-side, skipping');
    return { data: null, error: 'Server-side fetch not allowed' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.warn('Fetch error:', error.message);
    return { data: null, error: error.message };
  }
};

// Safe timeout wrapper
export const safeTimeout = (callback, delay) => {
  if (!isClient) return null;
  return setTimeout(callback, delay);
};

// Safe interval wrapper
export const safeInterval = (callback, delay) => {
  if (!isClient) return null;
  return setInterval(callback, delay);
};

// Clear timeout/interval safely
export const safeClear = (timerId) => {
  if (!isClient || !timerId) return;
  try {
    clearTimeout(timerId);
    clearInterval(timerId);
  } catch (error) {
    console.warn('Timer clear error:', error);
  }
};

export default {
  isClient,
  isServer,
  safeLocalStorage,
  safeSessionStorage,
  safeWindow,
  safeDocument,
  safeNavigator,
  checkEnvVariable,
  validateApiKey,
  safeFetch,
  safeTimeout,
  safeInterval,
  safeClear
};
