import exchangeRateService from '@/services/exchangeRateService';
import blockchainService from '@/services/blockchainService';
import cryptoService from '@/services/cryptoService';
import { ENV } from '@/config/env';

const ADMIN_WALLETS = ENV.payment.wallets;
const PAYMENT_STORAGE_KEY = 'smartSouq:payments';
const PAYMENT_LOGS_KEY = 'smartSouq:paymentLogs';

const redact = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  if (value.length <= 8) return '***';
  return `${value.slice(0, 4)}***${value.slice(-2)}`;
};

const sanitize = (payload) => {
  try {
    if (!payload || typeof payload !== 'object') return payload;
    const out = Array.isArray(payload) ? [] : {};
    Object.entries(payload).forEach(([k, v]) => {
      if (/key|secret|token|private|mnemonic|seed/i.test(k)) {
        out[k] = redact(String(v || ''));
        return;
      }
      if (v && typeof v === 'object') {
        out[k] = sanitize(v);
        return;
      }
      out[k] = v;
    });
    return out;
  } catch {
    return null;
  }
};

class PaymentService {
  constructor() {
    this.proxyUrl = ENV.api.corsProxy;
  }

  calculateCommission(amount) {
    return amount * ENV.payment.commissionRate;
  }

  async createPayment(orderId, amount, currency) {
    try {
      const normalizedCurrency = currency.toLowerCase();
      const depositAddress = ADMIN_WALLETS[normalizedCurrency] || ADMIN_WALLETS.usdt;

      let usdtAmount = amount;
      if (normalizedCurrency !== 'usdt') {
        usdtAmount = await this.convertToUSDT(amount, currency);
      }

      const paymentData = {
        orderId,
        usdtAmount,
        originalAmount: amount,
        originalCurrency: currency,
        depositAddress,
        status: 'pending',
        statusHistory: [
          { status: 'pending', message: 'Payment created', at: Date.now() }
        ],
        createdAt: Date.now(),
      };

      this.storePaymentInfo(paymentData);
      this.logPaymentEvent('payment_created', { orderId, currency, amount, depositAddress });
      return paymentData;
    } catch (error) {
      this.logPaymentEvent('payment_create_failed', { orderId, currency, amount, error: error?.message });
      throw new Error('Failed to create payment.');
    }
  }

  async verifyPayment(orderId) {
    const paymentInfo = this.getStoredPaymentInfo(orderId);
    if (!paymentInfo) {
      throw new Error('Payment not found.');
    }

    if (paymentInfo.status === 'completed') {
      return paymentInfo;
    }

    this.updatePaymentStatus(orderId, 'verifying', 'Verifying blockchain transfer...');

    let transaction = null;
    try {
      transaction = await blockchainService.verifyTransaction(orderId, paymentInfo.usdtAmount);
    } catch (error) {
      this.logPaymentEvent('payment_verify_failed', { orderId, error: error?.message });
      this.updatePaymentStatus(orderId, 'failed', 'Verification failed', { error: error?.message });
      throw error;
    }

    if (transaction) {
      const commission = this.calculateCommission(paymentInfo.usdtAmount);
      const updatedPaymentInfo = {
        ...paymentInfo,
        status: 'completed',
        txID: transaction.txID,
        commission,
        netAmount: paymentInfo.usdtAmount - commission,
        verifiedAt: Date.now(),
      };
      this.storePaymentInfo(updatedPaymentInfo);
      this.logPaymentEvent('payment_completed', { orderId, txID: transaction.txID, amount: paymentInfo.usdtAmount });
      return updatedPaymentInfo;
    }

    this.updatePaymentStatus(orderId, 'pending', 'Waiting for transfer confirmation...');
    return paymentInfo;
  }

  async manualVerify(orderId, txid) {
    const paymentInfo = this.getStoredPaymentInfo(orderId);
    if (!paymentInfo) {
      throw new Error('Payment not found.');
    }

    if (paymentInfo.status === 'completed') {
      return paymentInfo;
    }

    this.updatePaymentStatus(orderId, 'verifying', 'Verifying by TXID...');

    let transaction = null;
    try {
      transaction = await blockchainService.verifyTransactionByTxid(txid, paymentInfo.usdtAmount);
    } catch (error) {
      this.logPaymentEvent('payment_manual_verify_failed', { orderId, txid, error: error?.message });
      this.updatePaymentStatus(orderId, 'failed', 'Manual verification failed', { error: error?.message });
      throw error;
    }

    if (transaction) {
      const commission = this.calculateCommission(paymentInfo.usdtAmount);
      const updatedPaymentInfo = {
        ...paymentInfo,
        status: 'completed',
        txID: transaction.txID,
        commission,
        netAmount: paymentInfo.usdtAmount - commission,
        verifiedAt: Date.now(),
      };
      this.storePaymentInfo(updatedPaymentInfo);
      this.logPaymentEvent('payment_manual_completed', { orderId, txID: transaction.txID, amount: paymentInfo.usdtAmount });
      return updatedPaymentInfo;
    }

    this.updatePaymentStatus(orderId, 'pending', 'TXID not found yet');
    return paymentInfo;
  }

  async convertFiatToCrypto(amount, fromCurrency, toCrypto) {
    const fiat = (fromCurrency || 'USD').toUpperCase();
    const to = (toCrypto || 'USDT').toUpperCase();

    if (!amount || isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    if (to === 'USDT') {
      if (fiat === 'USDT' || fiat === 'USD') return Number(amount);
      const rate = await exchangeRateService.getRate(fiat, 'USDT');
      return Number(amount) * rate;
    }

    if (to === 'BTC' || to === 'ETH') {
      if (fiat !== 'USD' && fiat !== 'USDT') {
        const usdtAmount = await this.convertToUSDT(Number(amount), fiat);
        const usdAmount = usdtAmount;
        const cryptoAmount = cryptoService.convertFromUSD(to, usdAmount);
        if (!cryptoAmount) {
          throw new Error(`${to} price is unavailable`);
        }
        return cryptoAmount;
      }

      const usdAmount = Number(amount);
      const cryptoAmount = cryptoService.convertFromUSD(to, usdAmount);
      if (!cryptoAmount) {
        throw new Error(`${to} price is unavailable`);
      }
      return cryptoAmount;
    }

    throw new Error(`Unsupported target crypto: ${to}`);
  }

  updatePaymentStatus(orderId, status, message, meta = {}) {
    const existing = this.getStoredPaymentInfo(orderId);
    if (!existing) return;
    const last = existing.statusHistory?.[existing.statusHistory.length - 1];
    const isNew = !last || last.status !== status || last.message !== message;

    const updated = {
      ...existing,
      status,
      statusHistory: [
        ...(existing.statusHistory || []),
        ...(isNew ? [{ status, message, at: Date.now(), meta }] : [])
      ],
      updatedAt: Date.now()
    };
    this.storePaymentInfo(updated, { merge: false, appendHistory: false });
    this.logPaymentEvent('payment_status', { orderId, status, message, meta });
  }

  logPaymentEvent(type, payload = {}) {
    try {
      const current = JSON.parse(localStorage.getItem(PAYMENT_LOGS_KEY) || '[]');
      const entry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        at: Date.now(),
        payload: sanitize(payload)
      };
      const next = [entry, ...current].slice(0, 500);
      localStorage.setItem(PAYMENT_LOGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  getPaymentLogs(limit = 200) {
    try {
      const logs = JSON.parse(localStorage.getItem(PAYMENT_LOGS_KEY) || '[]');
      return Array.isArray(logs) ? logs.slice(0, limit) : [];
    } catch {
      return [];
    }
  }

  async convertToUSDT(amount, currency) {
    try {
      const rate = await exchangeRateService.getRate(currency, 'USDT');
      return amount * rate;
    } catch (error) {
      console.error(`Failed to convert ${currency} to USDT:`, error);
      throw new Error(`Currency conversion for ${currency} is currently unavailable.`);
    }
  }

  storePaymentInfo(paymentData, options = {}) {
    const { merge = true, appendHistory = true } = options;
    try {
      const payments = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || '{}');
      const existing = payments[paymentData.orderId] || null;
      const next = merge && existing ? { ...existing, ...paymentData } : paymentData;

      if (appendHistory && paymentData.status) {
        const last = next.statusHistory?.[next.statusHistory.length - 1];
        if (!last || last.status !== paymentData.status) {
          next.statusHistory = [
            ...(next.statusHistory || []),
            { status: paymentData.status, message: paymentData.message || paymentData.status, at: Date.now() }
          ];
        }
      }

      payments[paymentData.orderId] = next;
      localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
    } catch (error) {
      console.error('Failed to store payment info:', error);
    }
  }

  getStoredPaymentInfo(orderId) {
    try {
      const payments = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || '{}');
      return payments[orderId] || null;
    } catch (error) {
      console.error('Failed to retrieve stored payment info:', error);
      return null;
    }
  }

  getAllTransactions() {
    try {
      const payments = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || '{}');
      return Object.values(payments).sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }
}

export default new PaymentService();
