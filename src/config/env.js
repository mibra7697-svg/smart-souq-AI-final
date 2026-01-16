const _env = import.meta.env;

export const ENV = Object.freeze({
  payment: {
    wallets: {
      usdt: _env.VITE_ADMIN_WALLET_USDT || 'TL97zgY2KWBswbsicdHfJ9am1dzvnWXFmw',
      btc: _env.VITE_ADMIN_WALLET_BTC || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      eth: _env.VITE_ADMIN_WALLET_ETH || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    },
    adminWallet: _env.VITE_ADMIN_WALLET_USDT || 'TL97zgY2KWBswbsicdHfJ9am1dzvnWXFmw', // Legacy support
    tronGridKey: _env.VITE_TRONGRID_API_KEY || null,
    oxaPayKey: _env.VITE_OXAPAY_PUBLIC_KEY || null,
    commissionRate: parseFloat(_env.VITE_PLATFORM_COMMISSION_RATE) || 0.05,
    minWithdrawal: Number(_env.VITE_MIN_WITHDRAWAL_AMOUNT) || 10,
  },
  telegram: {
    adminChatId: _env.VITE_ADMIN_CHAT_ID,
  },
  api: {
    corsProxy: _env.VITE_CORS_PROXY || '', // Use vite.config.js proxy instead
    binance: _env.VITE_BINANCE_API_KEY,
    coingecko: _env.VITE_COINGECKO_API_KEY,
    alphaVantage: _env.VITE_ALPHAVANTAGE_API_KEY,
  },
  isProduction: _env.PROD,
  merchantDashboard: _env.VITE_MERCHANT_DASHBOARD_URL
});

export const validateEnv = () => {
  const essential = ['VITE_ADMIN_WALLET_USDT'];
  const optional = ['VITE_ADMIN_CHAT_ID'];
  
  const missingEssential = essential.filter(key => !import.meta.env[key]);
  const missingOptional = optional.filter(key => !import.meta.env[key]);

  if (missingEssential.length > 0) {
    console.error('❌ Smart Souq Critical Error: Missing Essential Keys', missingEssential);
    return false;
  }

  if (missingOptional.length > 0) {
    console.warn('⚠️ Smart Souq Synchronization Note: Missing optional Telegram keys. Notifications will be disabled, but core services will remain functional.', missingOptional);
  }

  console.log('✅ Environment Configuration: Synchronized');
  return true;
};
