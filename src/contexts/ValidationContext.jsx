import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateEnvironment, getServiceStatus } from '@/utils/validation';
import { ENV } from '@/config/env';

const ValidationContext = createContext(null);

export const ValidationProvider = ({ children }) => {
  const [validation, setValidation] = useState(() => validateEnvironment());
  const [serviceStatus, setServiceStatus] = useState(() => getServiceStatus());
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only validate once on mount to prevent infinite loops
    if (hasInitialized) return;
    
    const results = validateEnvironment();
    setValidation(results);
    setServiceStatus(getServiceStatus());
    setHasInitialized(true);

    // Log configuration status only once
    if (!ENV.isProduction) {
      console.info('🛡️ Environment Validation:', results);
    }
  }, [hasInitialized]);

  const value = {
    validation,
    serviceStatus,
    isValid: validation.valid,
    useMockData: validation.useMockData,
    errors: validation.errors,
    warnings: validation.warnings,
    revalidate: () => {
      const results = validateEnvironment();
      setValidation(results);
      setServiceStatus(getServiceStatus());
      return results;
    }
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
};

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

export default ValidationContext;
