# Smart Souq Environment Variables Setup Guide

This guide explains all the environment variables needed for the Smart Souq multi-country brokerage platform.

## Required Variables

### Telegram Configuration
```
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_ADMIN_CHAT_ID=your_chat_id_here
```
- **VITE_TELEGRAM_BOT_TOKEN**: Your Telegram bot token for notifications
- **VITE_ADMIN_CHAT_ID**: Telegram chat ID for admin notifications

### Cryptomus Payment Gateway (USDT-TRC20)
```
VITE_CRYPTOMUS_API_KEY=your_cryptomus_api_key_here
VITE_CRYPTOMUS_MERCHANT_ID=your_cryptomus_merchant_id_here
VITE_CRYPTOMUS_WEBHOOK_SECRET=your_cryptomus_webhook_secret_here
```
- **VITE_CRYPTOMUS_API_KEY**: Your Cryptomus API key for payment processing
- **VITE_CRYPTOMUS_MERCHANT_ID**: Your Cryptomus merchant ID
- **VITE_CRYPTOMUS_WEBHOOK_SECRET**: Secret key for verifying webhook signatures

### CORS Proxy Configuration
```
VITE_CORS_PROXY=http://localhost:3002/proxy/
PROXY_PORT=3002
```
- **VITE_CORS_PROXY**: URL for the CORS proxy server (for MENA region compatibility)
- **PROXY_PORT**: Port for the CORS proxy server (default: 3002)

### Environment
```
NODE_ENV=development
```
- **NODE_ENV**: Environment mode (development/production)

## Optional Variables

### Exchange Rate API Keys (for better rate limits)
```
VITE_COINGECKO_API_KEY=your_coingecko_api_key_here
VITE_BINANCE_API_KEY=your_binance_api_key_here
VITE_COINBASE_API_KEY=your_coinbase_api_key_here
```
- These API keys provide better rate limits for exchange rate services
- Without these, the system will use public endpoints with standard limits

### Merchant Dashboard Configuration
```
VITE_MERCHANT_DASHBOARD_URL=http://localhost:3002/merchant-dashboard
VITE_TRUST_WALLET_ADDRESS=your_trust_wallet_address_here
```
- **VITE_MERCHANT_DASHBOARD_URL**: URL for the merchant dashboard
- **VITE_TRUST_WALLET_ADDRESS**: Your Trust Wallet address for auto-payouts

### Platform Commission Settings
```
VITE_PLATFORM_COMMISSION_RATE=0.05
VITE_MIN_WITHDRAWAL_AMOUNT=10
VITE_MAX_WITHDRAWAL_AMOUNT=10000
```
- **VITE_PLATFORM_COMMISSION_RATE**: Platform commission rate (5% = 0.05)
- **VITE_MIN_WITHDRAWAL_AMOUNT**: Minimum withdrawal amount in USDT
- **VITE_MAX_WITHDRAWAL_AMOUNT**: Maximum withdrawal amount in USDT

## Setup Instructions

1. **Get Cryptomus API Keys**:
   - Sign up at [Cryptomus](https://cryptomus.com)
   - Create a merchant account
   - Generate API keys from your dashboard
   - Set up webhook URL: `https://yourdomain.com/api/webhook/cryptomus`

2. **Get Exchange Rate API Keys** (Optional):
   - [CoinGecko API](https://www.coingecko.com/en/api)
   - [Binance API](https://binance.com/en/support/articles/360002502072)
   - [Coinbase API](https://developers.coinbase.com/)

3. **Configure CORS Proxy**:
   - The proxy server runs on port 3002 by default
   - Ensure it's accessible from your frontend
   - Configure firewall rules for MENA region access

4. **Trust Wallet Setup**:
   - Download Trust Wallet app
   - Create a USDT-TRC20 wallet
   - Copy your TRC20 address (starts with 'T')

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique webhook secrets
- Rotate API keys regularly
- Monitor API usage for suspicious activity
- Use HTTPS in production environments

## Testing

After setting up your environment variables:

1. Start the CORS proxy: `node proxy.js`
2. Start the development server: `npm run dev`
3. Test payment flow with small amounts first
4. Verify webhook signatures are working
5. Check merchant dashboard displays correct balances

## MENA Region Considerations

- The CORS proxy helps bypass regional restrictions
- Use reliable VPN services for testing in restricted regions
- Monitor API availability for different countries
- Have fallback mechanisms ready for blocked services