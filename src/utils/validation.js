import { ENV } from '@/config/env';
import { web3Utils } from '@/utils/web3Utils';

/**
 * Robust environment validation utilities for Smart Souq AI
 * Ensures the app handles missing keys gracefully without crashing.
 */

export const validateUrl = (url, required = true) => {
  if (!url && !required) return { valid: true, url: null };
  if (!url && required) return { valid: false, error: 'URL is required' };
  
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }
    const urlObj = new URL(url);
    if (!urlObj.hostname) {
      return { valid: false, error: 'Invalid URL hostname' };
    }
    return { valid: true, url };
  } catch (error) {
    return { valid: false, error: `Invalid URL format: ${error.message}` };
  }
};

export const validateApiKey = (key, serviceName, required = true) => {
  if (!key && !required) return { valid: true, key: null };
  if (!key && required) return { valid: false, error: `${serviceName} API key is required` };
  
  if (key && key.length < 5) {
    return { valid: false, error: `${serviceName} API key too short` };
  }
  
  if (key && (key.includes('demo') || key.includes('placeholder') || key.includes('example'))) {
    return { valid: false, error: `${serviceName} demo/placeholder key detected` };
  }
  
  return { valid: true, key };
};

export const validateWalletAddress = (address, label, chain, required = true) => {
  if (!address && !required) return { valid: true, address: null };
  if (!address && required) return { valid: false, error: `${label} is required` };

  const valid = web3Utils.validateAddress(address, chain);
  if (!valid) {
    return { valid: false, error: `${label} is invalid` };
  }

  return { valid: true, address };
};

/**
 * Completes the environment validation process.
 * Returns a comprehensive report used by the app to decide whether to use mock data or real APIs.
 */
export const validateEnvironment = () => {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    services: {},
    timestamp: new Date().toISOString()
  };

  // 1. Payment/Blockchain (Admin Wallet is critical now)
  const adminWalletVal = validateWalletAddress(ENV.payment.adminWallet, 'Admin Wallet (USDT/TRC20)', 'tron', true);
  
  results.services.blockchain = { 
    wallet: adminWalletVal, 
    isReady: adminWalletVal.valid 
  };
  
  if (!results.services.blockchain.isReady) {
    results.valid = false;
    results.errors.push('Critical: Admin Wallet configuration is missing.');
  }

  // 2. Optional: Alpha Vantage (Stock Data)
  const alphaVantageVal = validateApiKey(ENV.api.alphaVantage, 'Alpha Vantage', false);
  results.services.alphaVantage = {
    key: alphaVantageVal,
    isReady: alphaVantageVal.valid && !!ENV.api.alphaVantage
  };
  if (!results.services.alphaVantage.isReady) {
    results.warnings.push('Stock market data will use fallbacks (Missing/Invalid VITE_ALPHAVANTAGE_API_KEY).');
  }

  // 3. System Checks
  if (!ENV.api.corsProxy && ENV.isProduction) {
    results.warnings.push('No CORS Proxy configured. Some API calls might fail in production.');
  }

  const env = import.meta.env || {};
  const riskyKeys = Object.keys(env).filter((k) =>
    /PRIVATE|MNEMONIC|SEED|SECRET/i.test(k)
  );
  if (riskyKeys.length > 0) {
    results.valid = false;
    results.errors.push('Critical: Detected private key-like variables in Vite env (VITE_*).');
  }

  // Determine if we should force mock data
  results.useMockData = !results.valid;
  
  return results;
};

export const getServiceStatus = () => {
  const validation = validateEnvironment();
  return {
    marketData: validation.services.alphaVantage.isReady,
    isValid: validation.valid,
    useMockData: validation.useMockData,
    errors: validation.errors,
    warnings: validation.warnings
  };
};

export const getEnvironmentConfig = () => {
  return {
    mode: ENV.isProduction ? 'production' : 'development',
    isProduction: ENV.isProduction,
    services: {
      blockchain: ENV.payment.adminWallet ? 'Configured' : 'Missing',
      alphaVantage: ENV.api.alphaVantage ? 'Configured' : 'Missing'
    }
  };
};

export default {
  validateUrl,
  validateApiKey,
  validateEnvironment,
  getServiceStatus,
  getEnvironmentConfig
};
