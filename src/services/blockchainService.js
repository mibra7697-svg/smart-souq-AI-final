import { ENV } from '@/config/env';
import apiClient from './apiClient';

const TRONGRID_API_KEY = ENV.payment.tronGridKey;
const ADMIN_WALLET_ADDRESS = ENV.payment.adminWallet;

class BlockchainService {
  constructor() {
    this.tronGridUrl = 'https://api.trongrid.io';
  }

  getHeaders() {
    return TRONGRID_API_KEY ? { 'TRON-PRO-API-KEY': TRONGRID_API_KEY } : {};
  }

  /**
   * Health check function to verify TronGrid API connectivity
   * @returns {Promise<{status: string, message: string, timestamp: string}>}
   */
  async healthCheck() {
    try {
      // Use proxy route for TronGrid
      const proxyUrl = `/api/trongrid/v1/accounts/${ADMIN_WALLET_ADDRESS}/transactions/trc20`;
      
      const response = await apiClient.get(proxyUrl, {
        headers: this.getHeaders(),
        params: {
          limit: 1,
          only_to: true,
          contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        },
        timeout: 5000,
        validateStatus: (status) => status < 500
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          status: 'connected',
          message: 'TronGrid API is accessible',
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('TronGrid health check failed:', error);
      return {
        status: 'error',
        message: error.response?.status ? `HTTP ${error.response.status}` : error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async verifyTransactionByTxid(txid, expectedAmount) {
    try {
      const transactions = await this.getWalletTransactions(200);
      const match = transactions.find((t) => t?.txID === txid);
      if (match && this.isMatchingAmount(match.amount, expectedAmount)) {
        return match;
      }
      return null;
    } catch (error) {
      console.error('Error verifying transaction by TXID on TronGrid:', error);
      throw new Error('Failed to verify transaction by TXID.');
    }
  }


  /**
   * Fetches all incoming USDT-TRC20 transfers for the admin wallet
   * @param {number} limit - Number of transactions to fetch (default: 100)
   * @returns {Promise<Array>} - Array of transaction objects
   */
  async getWalletTransactions(limit = 100) {
    try {
      // Use proxy route for TronGrid
      const proxyUrl = `/api/trongrid/v1/accounts/${ADMIN_WALLET_ADDRESS}/transactions/trc20`;

      const response = await apiClient.get(proxyUrl, {
        headers: this.getHeaders(),
        params: {
          limit: limit,
          only_to: true,
          contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract address
        },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      const data = response.data || response;
      if (data?.data) {
        return data.data.map(tx => ({
          txID: tx?.transaction_id,
          amount: parseInt(tx?.value || 0) / 1e6, // Convert from SUN to USDT
          timestamp: tx?.block_timestamp,
          fromAddress: tx?.from,
          toAddress: tx?.to,
          blockNumber: tx?.block_number,
          tokenInfo: tx?.token_info || {}
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching wallet transactions from TronGrid:', error);
      throw new Error('Failed to fetch wallet transactions.');
    }
  }

  /**
   * Verifies a transaction on the TRON blockchain.
   *
   * @param {string} orderId - The unique order ID.
   * @param {number} expectedAmount - The expected amount in USDT.
   * @returns {Promise<object|null>} - The verified transaction details or null.
   */
  async verifyTransaction(orderId, expectedAmount) {
    try {
      // Use proxy route for TronGrid
      const proxyUrl = `/api/trongrid/v1/accounts/${ADMIN_WALLET_ADDRESS}/transactions/trc20`;

      const response = await apiClient.get(proxyUrl, {
        headers: this.getHeaders(),
        params: {
          limit: 50,
          only_to: true,
          contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract address
        },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });

      const data = response.data || response;
      if (data?.data) {
        for (const tx of data.data) {
          const txAmount = parseInt(tx?.value || 0) / 1e6; // Convert from SUN to USDT
          if (this.isRecent(tx?.block_timestamp) && this.isMatchingAmount(txAmount, expectedAmount)) {
            // A more robust solution would be to check for a unique memo/note in the transaction
            // For now, we'll assume amount and time are sufficient
            return {
              txID: tx?.transaction_id,
              amount: txAmount,
              timestamp: tx?.block_timestamp,
              fromAddress: tx?.from,
              toAddress: tx?.to,
            };
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error verifying transaction on TronGrid:', error);
      throw new Error('Failed to verify transaction.');
    }
  }

  /**
   * Checks if a transaction is recent (e.g., within the last 15 minutes).
   * @param {number} timestamp - The transaction timestamp.
   * @returns {boolean}
   */
  isRecent(timestamp) {
    const fifteenMinutes = 15 * 60 * 1000;
    return (Date.now() - timestamp) < fifteenMinutes;
  }

  /**
   * Checks if the transaction amount matches the expected amount within a small tolerance.
   * @param {number} txAmount - The transaction amount.
   * @param {number} expectedAmount - The expected order amount.
   * @returns {boolean}
   */
  isMatchingAmount(txAmount, expectedAmount) {
    const tolerance = 0.00001; // A small tolerance for floating-point comparisons
    return Math.abs(txAmount - expectedAmount) < tolerance;
  }
}

export default new BlockchainService();
