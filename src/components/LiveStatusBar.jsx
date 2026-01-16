
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import blockchainService from '@/services/blockchainService';

const LiveStatusBar = ({ orderId, expectedAmount, onPaymentVerified }) => {
  const [status, setStatus] = useState('pending'); // pending, verifying, completed, error
  const [message, setMessage] = useState('Awaiting payment...');

  useEffect(() => {
    if (!orderId || !expectedAmount) return;

    const interval = setInterval(async () => {
      if (status === 'completed') {
        clearInterval(interval);
        return;
      }

      try {
        setStatus('verifying');
        setMessage('Checking for transaction...');
        const transaction = await blockchainService.verifyTransaction(orderId, expectedAmount);

        if (transaction) {
          setStatus('completed');
          setMessage('Payment confirmed!');
          if (onPaymentVerified) {
            onPaymentVerified();
          }
          clearInterval(interval);
        } else {
          setStatus('pending');
          setMessage('Awaiting payment...');
        }
      } catch (error) {
        console.error('Status bar verification error:', error);
        setStatus('error');
        setMessage('Error during verification.');
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [orderId, expectedAmount, status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'verifying':
        return <FaSpinner className="animate-spin text-blue-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 flex items-center justify-between z-40"
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <p className="font-semibold text-gray-800">Payment Status</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
      <p className="text-sm font-mono text-gray-500">Order: {orderId}</p>
    </motion.div>
  );
};

export default LiveStatusBar;
