import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaWallet, FaArrowRight, FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { motion } from 'framer-motion';
import paymentService from '@/services/paymentService';
import LogoSimple from '@/components/LogoSimple';
import PaymentModal from '@/components/PaymentModal';
import LiveStatusBar from '@/components/LiveStatusBar';
import InteractiveButton from '@/components/InteractiveButton';
import { ENV } from '@/config/env';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(location.state?.amount || 100);
  const [status, setStatus] = useState('pending');
  const [orderId, setOrderId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');

  useEffect(() => {
    const newOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setOrderId(newOrderId);
    paymentService.createPayment(newOrderId, amount, selectedCurrency);
  }, [amount, selectedCurrency]);

  const handlePaymentSuccess = () => {
    setStatus('completed');
    setIsModalOpen(false);
    const paymentInfo = paymentService.getStoredPaymentInfo(orderId);
    if (paymentInfo) {
      paymentService.storePaymentInfo({ ...paymentInfo, status: 'completed' });
    }
  };

  const currencyConfig = {
    'USDT': { icon: <SiTether className="text-green-500" />, label: 'USDT (TRC20)' },
    'BTC': { icon: <FaBitcoin className="text-orange-500" />, label: 'Bitcoin (BTC)' },
    'ETH': { icon: <FaEthereum className="text-blue-500" />, label: 'Ethereum (ETH)' }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white">
          <div className="flex justify-center mb-4">
            <LogoSimple type="icon" size="medium" color="white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">إتمام الدفع</h2>
          <p className="text-blue-100">متعدد العملات الرقمية والدفع المحلي</p>
        </div>

        <div className="p-8">
          {status === 'completed' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">تم الدفع بنجاح!</h3>
              <p className="text-gray-600 mb-8">شكراً لك، تم تأكيد عملية الدفع الخاصة بك.</p>
              <InteractiveButton onClick={() => navigate('/')}>
                العودة للرئيسية
              </InteractiveButton>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-500 mb-1">المبلغ المطلوب</p>
                <div className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  {amount} <span className="text-lg text-gray-400">USD</span>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  {Object.keys(currencyConfig).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setSelectedCurrency(curr)}
                      className={`p-2 rounded-lg border-2 transition-all ${selectedCurrency === curr ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      {currencyConfig[curr].icon}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  سيتم الدفع عبر: {currencyConfig[selectedCurrency].label}
                </p>
              </div>

              <InteractiveButton onClick={() => setIsModalOpen(true)}>
                المتابعة للدفع
                <FaArrowRight className="mr-2" />
              </InteractiveButton>
            </>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <FaWallet className="text-gray-400" />
            نظام دفع آمن ومباشر
          </p>
        </div>
      </div>
      
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={amount}
        selectedCurrency={selectedCurrency}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {status === 'pending' && orderId && (
        <LiveStatusBar 
          orderId={orderId}
          expectedAmount={amount}
          onPaymentVerified={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;
