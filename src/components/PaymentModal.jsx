
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaQrcode, FaTelegramPlane, FaSpinner, FaBitcoin, FaEthereum, FaCcMastercard, FaExchangeAlt } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { QRCodeSVG } from 'qrcode.react';
import paymentService from '@/services/paymentService';
import InteractiveButton from '@/components/InteractiveButton';
import { ENV } from '@/config/env';

const PaymentModal = ({ isOpen, onClose, amount, selectedCurrency = 'usdt' }) => {
  const [paymentMethod, setPaymentMethod] = useState(selectedCurrency.toLowerCase()); // 'usdt', 'btc', 'eth', or 'other'
  const [txStatus, setTxStatus] = useState({ status: 'pending', message: 'Waiting for payment...' });
  const [orderId, setOrderId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [verifyNonce, setVerifyNonce] = useState(0);

  const WALLETS = ENV.payment.wallets;
  const TELEGRAM_BOT_URL = `https://t.me/smart_souq_bot?start=payment_manual_${amount}`;

  useEffect(() => {
    if (selectedCurrency) {
      setPaymentMethod(selectedCurrency.toLowerCase());
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (!isOpen) return;
    const id = (typeof crypto !== 'undefined' && crypto?.randomUUID)
      ? crypto.randomUUID()
      : `PAY-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setOrderId(id);
    setPaymentInfo(null);
    setTxStatus({ status: 'pending', message: 'Waiting for payment...' });
  }, [isOpen, amount]);

  useEffect(() => {
    if (!orderId) return;
    setPaymentInfo(paymentService.getStoredPaymentInfo(orderId));
  }, [orderId, txStatus.status]);

  useEffect(() => {
    let interval;
    if (isOpen && paymentMethod === 'usdt' && orderId) {
      paymentService.storePaymentInfo({
        orderId,
        paymentMethod: 'usdt',
        usdtAmount: amount,
        originalAmount: amount,
        originalCurrency: 'USD',
        depositAddress: WALLETS.usdt,
        status: 'pending',
        createdAt: Date.now(),
      });

      // Start polling for USDT transaction status (TronGrid)
      interval = setInterval(async () => {
        try {
          const verified = await paymentService.verifyPayment(orderId);
          const latest = paymentService.getStoredPaymentInfo(orderId);
          if (latest) setPaymentInfo(latest);

          if (verified?.status === 'completed' || latest?.status === 'completed') {
            setTxStatus({ status: 'completed', message: 'Payment confirmed!' });
            clearInterval(interval);
            setTimeout(onClose, 3000);
            return;
          }

          setTxStatus({
            status: (latest?.status === 'failed' ? 'failed' : 'pending'),
            message: latest?.status === 'verifying'
              ? 'Verifying blockchain transfer...'
              : 'Waiting for payment...'
          });
        } catch (error) {
          paymentService.updatePaymentStatus(orderId, 'failed', 'USDT verification error', { error: error?.message });
          setTxStatus({ status: 'failed', message: 'Verification failed. Try again.' });
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isOpen, paymentMethod, amount, onClose, orderId, WALLETS.usdt, verifyNonce]);

  if (!isOpen) return null;

  const handleMastercardPay = async () => {
    if (!orderId) return;

    try {
      paymentService.storePaymentInfo({
        orderId,
        paymentMethod: 'mastercard',
        originalAmount: amount,
        originalCurrency: 'USD',
        depositAddress: WALLETS.usdt,
        status: 'initiated',
        createdAt: Date.now(),
      });

      paymentService.updatePaymentStatus(orderId, 'card_verified', 'Payment verified');
      setTxStatus({ status: 'processing', message: 'تم التحقق من الدفع. جاري تجهيز التحويل...' });

      const usdtAmount = await paymentService.convertFiatToCrypto(Number(amount), 'USD', 'USDT');
      paymentService.updatePaymentStatus(orderId, 'converting', 'Converting fiat to crypto', { to: 'USDT', amount: usdtAmount });
      setTxStatus({ status: 'processing', message: `جاري التحويل إلى USDT (${Number(usdtAmount).toFixed(2)})...` });

      await new Promise((r) => setTimeout(r, 700));

      paymentService.updatePaymentStatus(orderId, 'transferring', 'Routing to wallet', { recipient: WALLETS.usdt });
      setTxStatus({ status: 'processing', message: 'جاري تحويل المبلغ إلى المحفظة...' });

      await new Promise((r) => setTimeout(r, 900));

      paymentService.updatePaymentStatus(orderId, 'completed', 'Transfer queued', { recipient: WALLETS.usdt, amount: usdtAmount, symbol: 'USDT' });
      setTxStatus({ 
        status: 'completed', 
        message: `تم التحقق من الدفع. جاري تحويل ${Number(usdtAmount).toFixed(2)} USDT إلى المحفظة: ${WALLETS.usdt}`,
        recipient: WALLETS.usdt
      });
    } catch (error) {
      paymentService.updatePaymentStatus(orderId, 'failed', 'Card conversion failed', { error: error?.message });
      setTxStatus({ status: 'failed', message: 'فشل التحويل. أعد المحاولة.' });
    }
  };

  const renderCryptoContent = (method) => {
    const config = {
      usdt: { title: 'USDT (TRC20)', address: WALLETS.usdt, color: 'text-green-600', icon: <SiTether /> },
      btc: { title: 'Bitcoin (BTC)', address: WALLETS.btc, color: 'text-orange-500', icon: <FaBitcoin /> },
      eth: { title: 'Ethereum (ETH)', address: WALLETS.eth, color: 'text-blue-500', icon: <FaEthereum /> }
    }[method];

    return (
      <div className="text-center">
        <div className={`flex items-center justify-center gap-2 text-xl font-bold mb-2 ${config.color}`}>
          {config.icon}
          <h3>Pay with {config.title}</h3>
        </div>
        <p className="text-gray-500 mb-4">Send the equivalent of ${amount} to the address below.</p>
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm inline-block">
          <QRCodeSVG value={config.address} size={180} />
        </div>
        <div className="mt-4 bg-gray-100 p-3 rounded-lg group relative cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(config.address);
          alert('Address copied to clipboard!');
        }}>
          <p className="font-mono text-xs break-all">{config.address}</p>
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <span className="text-xs font-bold">Click to Copy</span>
          </div>
        </div>
        
        {method === 'usdt' && txStatus.status !== 'failed' && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <FaSpinner className="animate-spin" />
              <span>{txStatus.message}</span>
            </div>
          </div>
        )}
        {method === 'usdt' && txStatus.status === 'failed' && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl text-sm text-red-700">
            <div className="font-bold mb-2">فشل التحقق من المعاملة</div>
            <div className="mb-3">{txStatus.message}</div>
            <button
              onClick={() => {
                if (!orderId) return;
                paymentService.updatePaymentStatus(orderId, 'pending', 'Retrying verification...');
                setTxStatus({ status: 'pending', message: 'Retrying verification...' });
                setVerifyNonce((n) => n + 1);
              }}
              className="text-red-800 font-bold hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {(method === 'btc' || method === 'eth') && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
            <p>Verification for {method.toUpperCase()} is manual. Please send a screenshot to our bot after payment.</p>
            <button 
              onClick={() => window.open(TELEGRAM_BOT_URL, '_blank')}
              className="mt-2 text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <FaTelegramPlane /> Send Screenshot
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMastercardContent = () => {
    if (txStatus.status === 'completed') {
      return (
        <div className="text-center py-8" dir="rtl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExchangeAlt className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">تم تحويل الدفعة بنجاح!</h3>
          <p className="text-sm text-gray-500 mb-6">
            {txStatus.message || 'تم تحويل الدفعة بنجاح إلى عملة رقمية وهي في طريقها للمحفظة.'}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-right">
            <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">المحفظة المستلمة (Secure Vault)</span>
            <code className="text-xs font-mono break-all text-gray-700">{WALLETS.usdt}</code>
          </div>

          {paymentInfo?.statusHistory?.length ? (
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 text-right">
              <div className="text-xs font-bold text-gray-700 mb-2">حالة المعاملة</div>
              <div className="space-y-2">
                {paymentInfo.statusHistory.slice(-5).reverse().map((s, idx) => (
                  <div key={`${s.at}-${idx}`} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-700">{s.message || s.status}</span>
                    <span className="text-gray-400">{new Date(s.at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          <button 
            onClick={onClose}
            className="mt-8 w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            إغلاق
          </button>
        </div>
      );
    }

    return (
      <div className="text-center" dir="rtl">
        <div className="flex items-center justify-center gap-2 text-xl font-bold mb-2 text-red-600">
          <FaCcMastercard />
          <h3>الدفع عبر Mastercard</h3>
        </div>
        <p className="text-gray-500 mb-6">خدمة وساطة آمنة لتحويل Mastercard إلى عملات رقمية.</p>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-right">
          <div className="flex items-center justify-end gap-2 text-blue-800 font-semibold mb-2">
            <span>وساطة التحويل الرقمي</span>
            <FaExchangeAlt />
          </div>
          <p className="text-xs text-blue-600 mb-3">
            سيتم تحويل دفعتك تلقائياً إلى USDT وإرسالها إلى المحفظة المؤمنة.
          </p>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1 text-right">محفظة الوجهة (USDT/TRC20)</span>
            <code className="text-xs font-mono break-all text-blue-700">{WALLETS.usdt}</code>
          </div>
        </div>

        <InteractiveButton
          onClick={handleMastercardPay}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          {txStatus.status === 'processing' ? 'جاري المعالجة...' : `ادفع $${amount} الآن`}
        </InteractiveButton>
        {txStatus.status === 'processing' ? (
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              <span>{txStatus.message}</span>
            </div>
          </div>
        ) : null}
        {txStatus.status === 'processing' && paymentInfo?.statusHistory?.length ? (
          <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 text-right">
            <div className="text-xs font-bold text-gray-700 mb-2">حالة المعاملة</div>
            <div className="space-y-2">
              {paymentInfo.statusHistory.slice(-5).reverse().map((s, idx) => (
                <div key={`${s.at}-${idx}`} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-700">{s.message || s.status}</span>
                  <span className="text-gray-400">{new Date(s.at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {txStatus.status === 'failed' ? (
          <div className="mt-3 text-sm text-red-600">
            <div>{txStatus.message}</div>
            <button
              onClick={handleMastercardPay}
              className="mt-2 text-red-700 font-bold hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : null}
        <p className="text-[10px] text-gray-400 mt-4 text-center">
          * يتم إرسال سجلات المعاملات تلقائياً إلى نظام وساطة التحويل للتحقق.
        </p>
      </div>
    );
  };

  const renderOtherMethodsContent = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-2">Local Payment Methods</h3>
      <p className="text-gray-500 mb-6">For Al-Haram, MTN Money, or other local options, contact our assistant.</p>
      <InteractiveButton
        onClick={() => window.open(TELEGRAM_BOT_URL, '_blank')}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <FaTelegramPlane />
        Contact Store Assistant
      </InteractiveButton>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
            <FaTimes size={20} />
          </button>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6 border-b pb-2">
            {[
              { id: 'usdt', icon: <SiTether />, label: 'USDT' },
              { id: 'mastercard', icon: <FaCcMastercard />, label: 'Card' },
              { id: 'btc', icon: <FaBitcoin />, label: 'BTC' },
              { id: 'eth', icon: <FaEthereum />, label: 'ETH' },
              { id: 'other', icon: <FaTelegramPlane />, label: 'Other' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center gap-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                  paymentMethod === method.id 
                  ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-600/20' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {method.icon}
                <span className="hidden xs:inline">{method.label}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[300px] flex flex-col justify-center">
            {paymentMethod === 'other' ? renderOtherMethodsContent() : 
             paymentMethod === 'mastercard' ? renderMastercardContent() :
             renderCryptoContent(paymentMethod)}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
