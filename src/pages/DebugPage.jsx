import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaRobot, FaCoins, FaWallet, FaServer } from 'react-icons/fa';
import { ENV } from '@/config/env';
import aiService from '@/services/aiService';
import cryptoService from '@/services/cryptoService';
import exchangeRateService from '@/services/exchangeRateService';
import apiClient from '@/services/apiClient';

const DebugPage = () => {
  const [healthStatus, setHealthStatus] = useState({
    gemini: { status: 'checking', message: '', timestamp: null },
    binance: { status: 'checking', message: '', timestamp: null },
    coingecko: { status: 'checking', message: '', timestamp: null },
    trustWallet: { status: 'checking', message: '', timestamp: null },
    overall: { status: 'checking', message: '' }
  });

  const [isRunning, setIsRunning] = useState(false);

  const testGeminiAI = async () => {
    try {
      const testPrompt = 'Say "Hello" in Arabic';
      const response = await aiService.sendToAI(testPrompt);
      
      if (response && response.length > 0) {
        setHealthStatus(prev => ({
          ...prev,
          gemini: {
            status: 'success',
            message: `Connected successfully. Response: ${response.substring(0, 50)}...`,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        gemini: {
          status: 'error',
          message: `Connection failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const testBinanceAPI = async () => {
    try {
      // Test Binance API via proxy
      const response = await apiClient.get('/api/binance/ticker/price?symbol=BTCUSDT', {
        timeout: 5000
      });
      
      if (response.data && response.data.price) {
        setHealthStatus(prev => ({
          ...prev,
          binance: {
            status: 'success',
            message: `Connected successfully. BTC Price: $${parseFloat(response.data.price).toFixed(2)}`,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        binance: {
          status: 'error',
          message: `Connection failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const testCoinGeckoAPI = async () => {
    try {
      // Test CoinGecko API via proxy
      const response = await apiClient.get('/api/coingecko/simple/price?ids=bitcoin&vs_currencies=usd', {
        timeout: 5000
      });
      
      if (response.data && response.data.bitcoin) {
        setHealthStatus(prev => ({
          ...prev,
          coingecko: {
            status: 'success',
            message: `Connected successfully. BTC Price: $${response.data.bitcoin.usd.toFixed(2)}`,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        coingecko: {
          status: 'error',
          message: `Connection failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const testTrustWalletBridge = async () => {
    try {
      // Check if wallet addresses are configured
      const wallets = ENV.payment?.wallets || {};
      const hasWallets = wallets.usdt || wallets.btc || wallets.eth;
      
      if (!hasWallets) {
        throw new Error('Wallet addresses not configured');
      }

      // Test if we can access payment service
      const testWallets = {
        usdt: wallets.usdt ? 'Configured' : 'Missing',
        btc: wallets.btc ? 'Configured' : 'Missing',
        eth: wallets.eth ? 'Configured' : 'Missing'
      };

      setHealthStatus(prev => ({
        ...prev,
        trustWallet: {
          status: 'success',
          message: `Payment bridge configured. Wallets: USDT(${testWallets.usdt}), BTC(${testWallets.btc}), ETH(${testWallets.eth})`,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setHealthStatus(prev => ({
        ...prev,
        trustWallet: {
          status: 'error',
          message: `Payment bridge error: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Reset all statuses
    setHealthStatus({
      gemini: { status: 'checking', message: 'Testing...', timestamp: null },
      binance: { status: 'checking', message: 'Testing...', timestamp: null },
      coingecko: { status: 'checking', message: 'Testing...', timestamp: null },
      trustWallet: { status: 'checking', message: 'Testing...', timestamp: null },
      overall: { status: 'checking', message: 'Running health checks...' }
    });

    // Run all tests in parallel
    await Promise.allSettled([
      testGeminiAI(),
      testBinanceAPI(),
      testCoinGeckoAPI(),
      testTrustWalletBridge()
    ]);

    // Calculate overall status
    const statuses = [
      healthStatus.gemini.status,
      healthStatus.binance.status,
      healthStatus.coingecko.status,
      healthStatus.trustWallet.status
    ];
    
    const successCount = statuses.filter(s => s === 'success').length;
    const errorCount = statuses.filter(s => s === 'error').length;
    
    setHealthStatus(prev => ({
      ...prev,
      overall: {
        status: errorCount === 0 ? 'success' : (successCount > 0 ? 'warning' : 'error'),
        message: `${successCount}/4 services operational`
      }
    }));

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run tests on mount
    runAllTests();
  }, []);

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case 'checking':
        return <FaSpinner className="text-blue-500 text-2xl animate-spin" />;
      default:
        return <FaSpinner className="text-gray-500 text-2xl animate-spin" />;
    }
  };

  const StatusCard = ({ title, icon: Icon, status, message, timestamp }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="text-2xl text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <StatusIcon status={status} />
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{message || 'Waiting for test...'}</p>
      {timestamp && (
        <p className="text-xs text-gray-400">Last checked: {new Date(timestamp).toLocaleString()}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            System Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor connections to Gemini AI, Binance, CoinGecko, and Trust Wallet payment bridge
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Overall System Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {healthStatus.overall.message || 'Initializing...'}
              </p>
            </div>
            <StatusIcon status={healthStatus.overall.status} />
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaServer className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running Tests...' : 'Run Health Checks'}
          </button>
        </div>

        {/* Service Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusCard
            title="Gemini AI"
            icon={FaRobot}
            status={healthStatus.gemini.status}
            message={healthStatus.gemini.message}
            timestamp={healthStatus.gemini.timestamp}
          />
          <StatusCard
            title="Binance API"
            icon={FaCoins}
            status={healthStatus.binance.status}
            message={healthStatus.binance.message}
            timestamp={healthStatus.binance.timestamp}
          />
          <StatusCard
            title="CoinGecko API"
            icon={FaCoins}
            status={healthStatus.coingecko.status}
            message={healthStatus.coingecko.message}
            timestamp={healthStatus.coingecko.timestamp}
          />
          <StatusCard
            title="Trust Wallet Bridge"
            icon={FaWallet}
            status={healthStatus.trustWallet.status}
            message={healthStatus.trustWallet.message}
            timestamp={healthStatus.trustWallet.timestamp}
          />
        </div>

        {/* Environment Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Environment Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Port:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">3002</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Environment:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {ENV.isProduction ? 'Production' : 'Development'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Gemini API:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {ENV.api?.gemini ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">CORS Proxy:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {ENV.api?.corsProxy ? 'External' : 'Local (Vite)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
