import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaBug, FaHistory } from 'react-icons/fa';

const ErrorLogPage = () => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from Sentry/LogRocket or a local API
    const mockErrors = [
      { id: 1, message: 'CORS Blocked: Binance API', timestamp: new Date().toISOString(), severity: 'high' },
      { id: 2, message: 'Failed to fetch user geolocation', timestamp: new Date().toISOString(), severity: 'medium' },
      { id: 3, message: 'OxaPay API Key missing', timestamp: new Date().toISOString(), severity: 'critical' },
    ];
    setErrors(mockErrors);
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh', direction: 'rtl' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <FaBug style={{ fontSize: '2rem', color: '#ef4444' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>لوحة مراقبة الأخطاء (Admin Errors)</h1>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead style={{ backgroundColor: '#f3f4f6' }}>
              <tr>
                <th style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>الخطأ</th>
                <th style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>التوقيت</th>
                <th style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>المستوى</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error) => (
                <tr key={error.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaExclamationTriangle style={{ color: error.severity === 'critical' ? '#dc2626' : '#f59e0b' }} />
                    {error.message}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(error.timestamp).toLocaleString('ar-EG')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      backgroundColor: error.severity === 'critical' ? '#fee2e2' : '#fef3c7',
                      color: error.severity === 'critical' ? '#991b1b' : '#92400e'
                    }}>
                      {error.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1rem', 
              backgroundColor: '#1f2937', 
              color: 'white', 
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <FaHistory /> تحديث البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogPage;
