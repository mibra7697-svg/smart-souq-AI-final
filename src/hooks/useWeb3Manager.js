import { useState, useEffect, useCallback, useMemo } from 'react';
import { web3Manager, web3Worker, web3Utils } from '@/utils/web3Utils';

export const useWeb3Manager = (options = {}) => {
  const { 
    autoInitialize = true, 
    timeout = 5000, 
    retryOnError = true,
    maxRetries = 3 
  } = options;

  const [state, setState] = useState({
    isInitialized: false,
    isInitializing: false,
    error: null,
    account: null,
    balance: '0',
    network: null
  });

  const [retryCount, setRetryCount] = useState(0);

  // Initialize Web3 with delay to prevent blocking
  const initialize = useCallback(async () => {
    if (state.isInitializing || state.isInitialized) return;

    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      // Add small delay to prevent blocking main thread
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const tronWeb = await web3Manager.initialize(timeout);
      
      if (tronWeb) {
        const account = await web3Manager.getCurrentAccount();
        const balance = account ? await web3Manager.getBalance(account) : '0';
        
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isInitializing: false,
          account,
          balance,
          network: 'TRON',
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          isInitialized: false,
          isInitializing: false,
          error: 'Web3 not available'
        }));
      }
    } catch (error) {
      const errorMessage = error.message || 'Web3 initialization failed';
      
      setState(prev => ({
        ...prev,
        isInitialized: false,
        isInitializing: false,
        error: errorMessage
      }));

      // Retry logic
      if (retryOnError && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => initialize(), 2000 * (retryCount + 1));
      }
    }
  }, [state.isInitializing, state.isInitialized, timeout, retryOnError, maxRetries, retryCount]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !state.isInitialized && !state.isInitializing) {
      initialize();
    }
  }, [autoInitialize, state.isInitialized, state.isInitializing, initialize]);

  // Refresh account and balance
  const refreshAccount = useCallback(async () => {
    if (!state.isInitialized) return;

    try {
      const account = await web3Manager.getCurrentAccount();
      const balance = account ? await web3Manager.getBalance(account) : '0';
      
      setState(prev => ({
        ...prev,
        account,
        balance
      }));
    } catch (error) {
      console.warn('Failed to refresh account:', error);
    }
  }, [state.isInitialized]);

  // Send transaction
  const sendTransaction = useCallback(async (to, amount) => {
    if (!state.isInitialized) {
      throw new Error('Web3 not initialized');
    }

    try {
      const result = await web3Manager.sendTransaction(to, amount);
      
      // Refresh balance after transaction
      await refreshAccount();
      
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [state.isInitialized, refreshAccount]);

  // Disconnect
  const disconnect = useCallback(() => {
    web3Manager.reset();
    setState({
      isInitialized: false,
      isInitializing: false,
      error: null,
      account: null,
      balance: '0',
      network: null
    });
    setRetryCount(0);
  }, []);

  // Memoized formatted values
  const formattedValues = useMemo(() => ({
    formattedAddress: state.account ? web3Utils.formatAddress(state.account) : 'Not Connected',
    formattedBalance: web3Utils.formatBalance(state.balance),
    isConnected: state.isInitialized && !!state.account,
    isWeb3Available: web3Manager.isWeb3Available()
  }), [state.account, state.balance, state.isInitialized]);

  return {
    ...state,
    ...formattedValues,
    initialize,
    refreshAccount,
    sendTransaction,
    disconnect,
    retryCount
  };
};

// Hook for Web3 Worker operations
export const useWeb3Worker = () => {
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [workerError, setWorkerError] = useState(null);

  useEffect(() => {
    const initWorker = async () => {
      try {
        const success = await web3Worker.initializeWorker();
        setIsWorkerReady(success);
        if (!success) {
          setWorkerError('Worker initialization failed');
        }
      } catch (error) {
        setWorkerError(error.message);
      }
    };

    initWorker();

    return () => {
      web3Worker.terminate();
    };
  }, []);

  // Execute operation in worker
  const executeInWorker = useCallback(async (type, data, timeout = 3000) => {
    if (!isWorkerReady) {
      throw new Error('Worker not ready');
    }

    try {
      return await web3Worker.executeInWorker(type, data, timeout);
    } catch (error) {
      console.error('Worker operation failed:', error);
      throw error;
    }
  }, [isWorkerReady]);

  return {
    isWorkerReady,
    workerError,
    executeInWorker
  };
};

// Hook for Web3 utilities
export const useWeb3Utils = () => {
  return {
    formatAddress: web3Utils.formatAddress,
    formatBalance: web3Utils.formatBalance,
    validateAddress: web3Utils.validateAddress,
    toTrx: web3Utils.toTrx,
    fromTrx: web3Utils.fromTrx,
    generateRandomAddress: web3Utils.generateRandomAddress
  };
};

export default useWeb3Manager;
