import React, { useState, useEffect, memo } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { getServiceStatus } from '@/utils/validation';

const EnvironmentNotification = memo(() => {
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const serviceStatus = getServiceStatus();
    setStatus({
      isHealthy: serviceStatus.isValid,
      issues: serviceStatus.errors,
      warnings: serviceStatus.warnings
    });
    
    // Log to console
    if (serviceStatus.errors.length > 0) {
      console.error('🚨 Environment Issues:', serviceStatus.errors);
    }
    if (serviceStatus.warnings.length > 0) {
      console.warn('⚠️ Environment Warnings:', serviceStatus.warnings);
    }
    
    // Auto-hide after 10 seconds if no critical issues
    if (serviceStatus.isValid) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible || !status) return null;
  
  const hasIssues = status.issues.length > 0;
  const hasWarnings = status.warnings.length > 0;
  
  if (!hasIssues && !hasWarnings) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      maxWidth: '600px',
      width: '90%'
    }}>
      <div style={{
        backgroundColor: hasIssues ? '#fef2f2' : '#fffbeb',
        border: `2px solid ${hasIssues ? '#fecaca' : '#fde68a'}`,
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: hasIssues ? '#dc2626' : '#d97706',
            fontWeight: '600'
          }}>
            {hasIssues ? <FaExclamationTriangle /> : <FaInfoCircle />}
            <span>
              {hasIssues ? 'Environment Issues Detected' : 'Environment Warnings'}
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: hasIssues ? '#dc2626' : '#d97706',
              padding: '0.25rem'
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Issues */}
        {hasIssues && (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ 
              color: '#dc2626', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Critical Issues (Must Fix):
            </div>
            {status.issues.map((issue, index) => (
              <div key={`issue-${index}`} style={{
                color: '#991b1b',
                fontSize: '0.9rem',
                marginBottom: '0.25rem',
                paddingLeft: '1rem'
              }}>
                • {issue}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {hasWarnings && (
          <div>
            <div style={{ 
              color: '#d97706', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }}>
              Warnings:
            </div>
            {status.warnings.map((warning, index) => (
              <div key={`warning-${index}`} style={{
                color: '#92400e',
                fontSize: '0.9rem',
                marginBottom: '0.25rem',
                paddingLeft: '1rem'
              }}>
                • {warning}
              </div>
            ))}
          </div>
        )}

        {/* Environment Info */}
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: '#6b7280'
        }}>
          Environment: <strong>{status.environment}</strong> | 
          Status: <strong>{status.usingDemoData ? 'Demo Data' : 'Live Data'}</strong>
        </div>

        {/* Action Button */}
        {status.usingDemoData && (
          <div style={{ marginTop: '0.75rem' }}>
            <button
              onClick={() => window.open('https://vercel.com/docs/environment-variables', '_blank')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Learn How to Set Environment Variables
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);

EnvironmentNotification.displayName = 'EnvironmentNotification';

export default EnvironmentNotification;
