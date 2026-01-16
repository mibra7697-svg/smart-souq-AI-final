import React, { useState, useEffect } from 'react';
import { FaLink, FaUnlink, FaWallet, FaCoins, FaChartLine, FaSync } from 'react-icons/fa';
import blockchainService from '@/services/blockchainService';
import paymentService from '@/services/paymentService';
import InteractiveButton from '@/components/InteractiveButton';
import { ENV } from '@/config/env';

const AdminDashboard = () => {
  const [blockchainStatus, setBlockchainStatus] = useState({
    status: 'checking',
    message: 'Checking blockchain connection...',
    timestamp: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalCommission: 0,
    recentTransactions: []
  });
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkBlockchainStatus();
    loadStats();
    loadWalletTransactions();
    const interval = setInterval(() => {
      checkBlockchainStatus();
      loadStats();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    const transactions = paymentService.getAllTransactions();
    const completed = transactions.filter(t => t.status === 'completed');
    const totalComm = completed.reduce((acc, curr) => acc + (curr.commission || 0), 0);
    
    setStats({
      totalPayments: completed.length,
      totalCommission: totalComm.toFixed(2),
      recentTransactions: transactions.slice(0, 5) // Last 5 transactions
    });
  };

  const checkBlockchainStatus = async () => {
    try {
      setIsLoading(true);
      const result = await blockchainService.healthCheck();
      setBlockchainStatus(result);
    } catch (error) {
      setBlockchainStatus({
        status: 'error',
        message: 'Failed to connect to blockchain',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWalletTransactions = async () => {
    try {
      setIsSyncing(true);
      const transactions = await blockchainService.getWalletTransactions(50);
      setWalletTransactions(transactions);
    } catch (error) {
      console.error('Error loading wallet transactions:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncWalletTransactions = async () => {
    await loadWalletTransactions();
  };

  const getStatusBadge = () => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2";
    
    if (isLoading) {
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          Checking...
        </span>
      );
    }

    switch (blockchainStatus.status) {
      case 'connected':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FaLink className="text-green-600" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <FaUnlink className="text-red-600" />
            Connection Error
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FaUnlink className="text-yellow-600" />
            Unknown Status
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المدير</h1>
          <p className="text-gray-600">إدارة النظام ومراقبة حالة البلوكشين</p>
        </div>

        {/* Blockchain Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaCoins className="text-blue-600" />
              حالة اتصال البلوكشين
            </h2>
            {getStatusBadge()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <FaWallet className="text-blue-600 text-xl" />
                  <p className="text-sm font-semibold text-gray-800">عناوين المحافظ</p>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">USDT (TRC20)</span>
                    <p className="text-xs font-mono text-gray-800 break-all bg-white p-1 rounded border">
                      {ENV.payment.wallets.usdt}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Bitcoin (BTC)</span>
                    <p className="text-xs font-mono text-gray-800 break-all bg-white p-1 rounded border">
                      {ENV.payment.wallets.btc}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Ethereum (ETH)</span>
                    <p className="text-xs font-mono text-gray-800 break-all bg-white p-1 rounded border">
                      {ENV.payment.wallets.eth}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FaChartLine className="text-green-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">حالة الاتصال</p>
                  <p className="text-sm font-medium text-gray-800">
                    {blockchainStatus.message}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-purple-600 text-xl">🕒</div>
                <div>
                  <p className="text-sm text-gray-600">آخر تحديث</p>
                  <p className="text-sm font-medium text-gray-800">
                    {blockchainStatus.timestamp 
                      ? new Date(blockchainStatus.timestamp).toLocaleTimeString('ar-SA')
                      : 'غير متاح'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <InteractiveButton
              onClick={checkBlockchainStatus}
              isLoading={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              تحديث الحالة
            </InteractiveButton>
            
            {blockchainStatus.status === 'error' && (
              <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  ⚠️ خطأ في الاتصال: {blockchainStatus.message}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  تأكد من صحة مفتاح API والاتصال بالإنترنت
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">إجمالي المدفوعات</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalPayments}</p>
            <p className="text-sm text-gray-600">عمليات دفع ناجحة</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">العمولات</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCommission} USDT</p>
            <p className="text-sm text-gray-600">إجمالي العمولات المحصلة</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">حالة النظام</h3>
            <p className="text-lg font-medium text-green-600">✅ نشط</p>
            <p className="text-sm text-gray-600">جميع الخدمات تعمل بشكل طبيعي</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">أحدث المعاملات</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TXID</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentTransactions.length > 0 ? (
                  stats.recentTransactions.map((tx) => (
                    <tr key={tx.orderId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tx.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.usdtAmount} USDT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {tx.txID ? `${tx.txID.substring(0, 8)}...` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد معاملات حديثة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">معاملات المحفظة (USDT-TRC20)</h3>
            <InteractiveButton
              onClick={syncWalletTransactions}
              isLoading={isSyncing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <FaSync className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'جاري التحديث...' : 'تحديث'}
            </InteractiveButton>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المرسل</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ (USDT)</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TXID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {walletTransactions.length > 0 ? (
                  walletTransactions.map((tx) => (
                    <tr key={tx.txID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString('ar-SA')} {new Date(tx.timestamp).toLocaleTimeString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                        {tx.fromAddress ? `${tx.fromAddress.substring(0, 8)}...${tx.fromAddress.slice(-4)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {tx.amount.toFixed(2)} USDT
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        <a
                          href={`https://tronscan.org/#/transaction/${tx.txID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {tx.txID.substring(0, 8)}...{tx.txID.slice(-4)}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      {isSyncing ? 'جاري تحميل المعاملات...' : 'لا توجد معاملات محفظة'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات النظام</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">وضع الدفع:</p>
              <p className="font-medium">نظام الدفع المباشر (USDT-TRC20)</p>
            </div>
            <div>
              <p className="text-gray-600">عنوان العمولة:</p>
              <p className="font-mono text-xs break-all">
                {ENV.payment.adminWallet || 'غير محدد'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">معدل العمولة:</p>
              <p className="font-medium">{(ENV.payment.commissionRate * 100)}%</p>
            </div>
            <div>
              <p className="text-gray-600">حالة البروكسي:</p>
              <p className="font-medium">
                {ENV.api.corsProxy ? 'مفعّل' : 'معطّل'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;