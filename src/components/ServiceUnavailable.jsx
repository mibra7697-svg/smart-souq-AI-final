import React, { memo } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ServiceUnavailable = memo(({ 
  serviceName, 
  message, 
  showSkeleton = false,
  compact = false 
}) => {
  if (showSkeleton) {
    return (
      <div style={{
        padding: compact ? '0.5rem' : '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: compact ? '16px' : '20px',
            height: compact ? '16px' : '20px',
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <span style={{ color: '#64748b', fontSize: compact ? '0.8rem' : '0.9rem' }}>
            Loading {serviceName}...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: compact ? '0.5rem' : '1rem',
      backgroundColor: '#fef3c7',
      border: '1px solid #fde68a',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <FaExclamationTriangle style={{ 
        color: '#d97706', 
        fontSize: compact ? '0.9rem' : '1rem' 
      }} />
      <div>
        <div style={{ 
          fontWeight: '600', 
          color: '#92400e',
          fontSize: compact ? '0.8rem' : '0.9rem'
        }}>
          {serviceName} Unavailable
        </div>
        {message && (
          <div style={{ 
            color: '#92400e', 
            fontSize: compact ? '0.7rem' : '0.8rem',
            marginTop: '0.25rem'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(style);

ServiceUnavailable.displayName = 'ServiceUnavailable';

export default ServiceUnavailable;
