import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeContextProvider, ThemeProvider } from '@/contexts/ThemeContext'
import { ValidationProvider } from '@/contexts/ValidationContext'
import { getEnvironmentConfig, validateEnvironment } from '@/utils/validation'
import { ENV, validateEnv } from '@/config/env'
import App from '@/App.jsx'
import './index.css'

// Safe SSR check
const isClient = typeof window !== 'undefined';

if (isClient) {
  // Call global environment validation
  validateEnv();

  // Log environment configuration for debugging only in development
  if (!ENV.isProduction) {
    console.info('🔧 Environment Config:', ENV);
  }

  // Remove any potential blocking overlays
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      const overlays = document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]');
      overlays.forEach(el => el.style.display = 'none');
    });
  }
}

// Safety wrapper to prevent any undefined references during render
const AppSafeMode = ({ children }) => {
  return children;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppSafeMode>
        <ValidationProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </ThemeContextProvider>
        </ValidationProvider>
      </AppSafeMode>
    </ErrorBoundary>
  </React.StrictMode>,
)
