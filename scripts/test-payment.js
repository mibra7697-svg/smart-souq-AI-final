import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';

const redact = (value) => {
  if (!value) return value;
  const s = String(value);
  if (s.length <= 10) return '***';
  return `${s.slice(0, 4)}***${s.slice(-4)}`;
};

const loadEnv = () => {
  const root = process.cwd();
  const candidates = [
    path.join(root, '.env.local'),
    path.join(root, '.env'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
    }
  }
};

const getEnv = (name, { required = false, allowEmpty = false } = {}) => {
  const value = process.env[name];
  if (value === undefined) {
    if (required) throw new Error(`Missing env var: ${name}`);
    return undefined;
  }
  if (!allowEmpty && String(value).trim() === '') {
    if (required) throw new Error(`Empty env var: ${name}`);
    return undefined;
  }
  return value;
};

const isTronAddress = (address) => {
  if (!address) return false;
  const a = String(address).trim();
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(a);
};

const isEthAddress = (address) => {
  if (!address) return false;
  const a = String(address).trim();
  return /^0x[a-fA-F0-9]{40}$/.test(a);
};

const isBtcAddress = (address) => {
  if (!address) return false;
  const a = String(address).trim();
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,60}$/.test(a);
};

const signBody = (rawBody, secret) => {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
};

const postJson = async (url, payload, { headers } = {}) => {
  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    timeout: 15000,
    validateStatus: () => true,
  });
  return response;
};

async function main() {
  loadEnv();

  const args = new Set(process.argv.slice(2));
  const shouldStartWebhook = args.has('--webhook') || args.has('--listen') || getEnv('PAYMENT_WEBHOOK_AUTO_START') === 'true';

  let oxapayPublicKey = getEnv('VITE_OXAPAY_PUBLIC_KEY') || getEnv('OXAPAY_API_KEY');
  if (oxapayPublicKey && /your_oxapay_key_here/i.test(oxapayPublicKey)) {
    oxapayPublicKey = undefined;
  }
  const adminWalletUsdt = getEnv('ADMIN_WALLET_USDT') || getEnv('VITE_ADMIN_WALLET_USDT');
  const adminWalletBtc = getEnv('ADMIN_WALLET_BTC') || getEnv('VITE_ADMIN_WALLET_BTC');
  const adminWalletEth = getEnv('ADMIN_WALLET_ETH') || getEnv('VITE_ADMIN_WALLET_ETH');

  console.log('--- Smart Souq Payment Script ---');
  console.log('OxaPay Key:', oxapayPublicKey ? redact(oxapayPublicKey) : '(not set)');
  console.log('Trust Wallet (USDT/TRC20):', adminWalletUsdt || '(not set)');
  console.log('Trust Wallet (BTC):', adminWalletBtc || '(not set)');
  console.log('Trust Wallet (ETH):', adminWalletEth || '(not set)');

  const walletErrors = [];
  if (adminWalletUsdt && !isTronAddress(adminWalletUsdt)) walletErrors.push('USDT wallet does not look like a TRON address');
  if (adminWalletBtc && !isBtcAddress(adminWalletBtc)) walletErrors.push('BTC wallet does not look like a BTC address');
  if (adminWalletEth && !isEthAddress(adminWalletEth)) walletErrors.push('ETH wallet does not look like an EVM address');

  if (!adminWalletUsdt) walletErrors.push('Missing ADMIN_WALLET_USDT (or VITE_ADMIN_WALLET_USDT)');
  if (walletErrors.length) {
    console.error('❌ Wallet configuration issues:');
    for (const e of walletErrors) console.error(`- ${e}`);
  } else {
    console.log('✅ Wallet configuration looks valid');
  }

  const cryptoPaymentServiceUrl = getEnv('CRYPTO_PAYMENT_SERVICE_URL');
  const paymentVerifyApiUrl = getEnv('PAYMENT_VERIFY_API_URL') || cryptoPaymentServiceUrl;

  if (cryptoPaymentServiceUrl) {
    const createOrderUrl = `${cryptoPaymentServiceUrl.replace(/\/$/, '')}/api/create-order`;
    const createPayload = {
      amount: 10,
      crypto: 'usdt',
      customerEmail: 'test@local.dev',
      customerName: 'Test User',
    };
    const response = await postJson(createOrderUrl, createPayload);
    if (response.status >= 200 && response.status < 300) {
      const orderId = response?.data?.order?.id;
      const wallet = response?.data?.order?.adminWallet;
      console.log('✅ Order created:', orderId || '(unknown)');
      console.log('Deposit wallet for this order:', wallet || '(unknown)');
    } else {
      console.log(`ℹ️  Could not create order via CRYPTO_PAYMENT_SERVICE_URL (${response.status})`);
    }
  }

  if (!shouldStartWebhook) {
    console.log('ℹ️  Webhook server is not running. Start with: node scripts/test-payment.js --webhook');
    return;
  }

  const app = express();

  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }));

  const webhookPort = Number(getEnv('PAYMENT_WEBHOOK_PORT') || 3010);
  const webhookPath = getEnv('PAYMENT_WEBHOOK_PATH') || '/webhook/payment';
  const webhookSecret = getEnv('PAYMENT_WEBHOOK_SECRET');

  app.post(webhookPath, async (req, res) => {
    try {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body || {});
      const signatureHeader = String(req.headers['x-webhook-signature'] || '').trim();

      const isLocal = req.ip === '127.0.0.1' || req.ip === '::1' || String(req.ip || '').endsWith('127.0.0.1');
      if (webhookSecret) {
        const expected = signBody(rawBody, webhookSecret);
        if (!signatureHeader || signatureHeader !== expected) {
          res.status(401).json({ ok: false, error: 'Invalid signature' });
          return;
        }
      } else if (!isLocal) {
        res.status(401).json({ ok: false, error: 'Webhook secret not configured' });
        return;
      }

      const { orderId, crypto: cryptoSymbol, txHash } = req.body || {};
      if (!orderId || !cryptoSymbol || !txHash) {
        res.status(400).json({ ok: false, error: 'Missing orderId/crypto/txHash' });
        return;
      }

      if (!paymentVerifyApiUrl) {
        res.json({ ok: true, verified: false, message: 'PAYMENT_VERIFY_API_URL not configured' });
        return;
      }

      const url = `${paymentVerifyApiUrl.replace(/\/$/, '')}/api/check-payment`;
      const verifyResponse = await postJson(url, { orderId, crypto: cryptoSymbol, txHash });

      res.status(verifyResponse.status >= 200 && verifyResponse.status < 300 ? 200 : 502).json({
        ok: verifyResponse.status >= 200 && verifyResponse.status < 300,
        upstreamStatus: verifyResponse.status,
        data: verifyResponse.data,
      });
    } catch (e) {
      res.status(500).json({ ok: false, error: e?.message || 'Unknown error' });
    }
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.listen(webhookPort, () => {
    if (!webhookSecret) {
      console.log('ℹ️  PAYMENT_WEBHOOK_SECRET not set. Accepting only localhost requests.');
    }
    console.log(`✅ Webhook middleware listening on http://localhost:${webhookPort}${webhookPath}`);
  });
}

main().catch((e) => {
  console.error('❌ Payment script failed:', e?.message || e);
  process.exitCode = 1;
});
