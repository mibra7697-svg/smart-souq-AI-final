// Web3 utilities for non-blocking initialization
export class Web3Manager {
  constructor() {
    this.isInitialized = false;
    this.isInitializing = false;
    this.tronWeb = null;
    this.tronLink = null;
    this.initPromise = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Non-blocking initialization with timeout
  async initialize(timeout = 5000) {
    if (this.isInitialized) return this.tronWeb;
    if (this.isInitializing) return this.initPromise;

    this.isInitializing = true;
    
    this.initPromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.warn('Web3 initialization timeout - continuing without Web3');
        this.isInitializing = false;
        resolve(null); // Resolve with null instead of rejecting
      }, timeout);

      this.doInitialize()
        .then(result => {
          clearTimeout(timeoutId);
          this.isInitialized = true;
          this.isInitializing = false;
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          this.isInitializing = false;
          console.warn('Web3 initialization failed:', error);
          resolve(null); // Resolve with null instead of rejecting
        });
    });

    return this.initPromise;
  }

  async doInitialize() {
    try {
      // Check if TronLink is available
      if (typeof window !== 'undefined' && window.tronLink) {
        this.tronLink = window.tronLink;
        
        // Request account access
        await this.tronLink.request({
          method: 'tron_requestAccounts'
        });

        // Get TronWeb instance
        this.tronWeb = this.tronLink.tronWeb;
        
        return this.tronWeb;
      } else {
        return null;
      }
    } catch (error) {
      console.error('TronWeb initialization error:', error);
      throw error;
    }
  }

  // Get TronWeb instance (non-blocking)
  async getTronWeb() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.tronWeb;
  }

  // Check if Web3 is available
  isWeb3Available() {
    return typeof window !== 'undefined' && 
           (window.tronLink || window.tronWeb || window.ethereum);
  }

  // Get current account
  async getCurrentAccount() {
    try {
      const tronWeb = await this.getTronWeb();
      if (tronWeb) {
        return tronWeb.defaultAddress.base58;
      }
      return null;
    } catch (error) {
      console.warn('Failed to get current account:', error);
      return null;
    }
  }

  // Get balance
  async getBalance(address) {
    try {
      const tronWeb = await this.getTronWeb();
      if (tronWeb) {
        const balance = await tronWeb.trx.getBalance(address);
        return tronWeb.fromSun(balance);
      }
      return 0;
    } catch (error) {
      console.warn('Failed to get balance:', error);
      return 0;
    }
  }

  // Send transaction with timeout
  async sendTransaction(to, amount, options = {}) {
    try {
      const tronWeb = await this.getTronWeb();
      if (!tronWeb) {
        throw new Error('TronWeb not available');
      }

      const transaction = await tronWeb.transactionBuilder.sendTrx(
        to,
        tronWeb.toSun(amount),
        tronWeb.defaultAddress.base58
      );

      const signedTransaction = await tronWeb.trx.sign(transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Reset for retry
  reset() {
    this.isInitialized = false;
    this.isInitializing = false;
    this.initPromise = null;
    this.retryCount = 0;
  }
}

// Singleton instance
export const web3Manager = new Web3Manager();

// Web Worker for heavy Web3 operations
export class Web3Worker {
  constructor() {
    this.worker = null;
    this.isSupported = typeof Worker !== 'undefined';
  }

  // Initialize Web Worker for Web3 operations
  async initializeWorker() {
    if (!this.isSupported) {
      console.warn('Web Workers not supported');
      return false;
    }

    try {
      // Create worker code as blob
      const workerCode = `
        // Web3 Worker code
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'calculate_hash':
              // Simulate heavy calculation
              const hash = btoa(JSON.stringify(data)).slice(0, 16);
              self.postMessage({ type: 'hash_result', data: hash });
              break;
              
            case 'validate_address':
              // Simple address validation
              const isValid = typeof data === 'string' && data.length > 20;
              self.postMessage({ type: 'validation_result', data: isValid });
              break;
              
            default:
              self.postMessage({ type: 'error', data: 'Unknown operation' });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Web3 worker:', error);
      return false;
    }
  }

  // Execute operation in worker
  async executeInWorker(type, data, timeout = 3000) {
    if (!this.worker) {
      await this.initializeWorker();
    }

    if (!this.worker) {
      throw new Error('Worker not available');
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Worker operation timeout'));
      }, timeout);

      const handleMessage = (e) => {
        clearTimeout(timeoutId);
        this.worker.removeEventListener('message', handleMessage);
        this.worker.removeEventListener('error', handleError);
        
        if (e.data.type === 'error') {
          reject(new Error(e.data.data));
        } else {
          resolve(e.data.data);
        }
      };

      const handleError = (error) => {
        clearTimeout(timeoutId);
        this.worker.removeEventListener('message', handleMessage);
        this.worker.removeEventListener('error', handleError);
        reject(error);
      };

      this.worker.addEventListener('message', handleMessage);
      this.worker.addEventListener('error', handleError);
      
      this.worker.postMessage({ type, data });
    });
  }

  // Terminate worker
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Singleton worker instance
export const web3Worker = new Web3Worker();

// Utility functions
export const web3Utils = {
  // Format address
  formatAddress(address) {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Format balance
  formatBalance(balance, decimals = 2) {
    if (!balance || isNaN(balance)) return '0';
    return parseFloat(balance).toFixed(decimals);
  },

  // Validate address
  validateAddress(address, chain) {
    if (typeof address !== 'string') return false;
    const value = address.trim();
    if (!value) return false;

    const tron = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    const eth = /^0x[a-fA-F0-9]{40}$/;
    const btc = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/;

    if (chain === 'tron') return tron.test(value);
    if (chain === 'eth') return eth.test(value);
    if (chain === 'btc') return btc.test(value);

    return tron.test(value) || eth.test(value) || btc.test(value) || value.length > 20;
  },

  // Convert to TRX
  toTrx(amount) {
    return parseFloat(amount) / 1000000;
  },

  // Convert from TRX
  fromTrx(amount) {
    return parseFloat(amount) * 1000000;
  },

  // Generate random address (for testing)
  generateRandomAddress() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let address = 'T';
    for (let i = 0; i < 33; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  }
};

export default web3Manager;
