import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OptimizedLayout from '@/components/OptimizedLayout';
import Home from '@/pages/Home';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import BrokerageAgreement from '@/pages/BrokerageAgreement';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminErrors from '@/pages/AdminErrors';
import Checkout from '@/pages/Checkout';
import AIAssistant from '@/components/AIAssistant';
import EnhancedEcommercePlatform from '@/components/EnhancedEcommercePlatform';
import AgentDashboard from '@/pages/AgentDashboard';
import AgentRegistration from '@/pages/AgentRegistration';
import AgentLogin from '@/pages/AgentLogin';
import AffiliateProductPage from '@/pages/AffiliateProductPage';
import MarketNews from '@/pages/MarketNews';
import Predictions from '@/pages/Predictions';
import DebugPage from '@/pages/DebugPage';

function App() {
  return (
    <div style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
      <Routes>
        <Route path="/" element={
          <OptimizedLayout>
            <Home />
          </OptimizedLayout>
        } />
        <Route path="/ecommerce" element={
          <OptimizedLayout>
            <EnhancedEcommercePlatform />
          </OptimizedLayout>
        } />
        <Route path="/market-news" element={
          <OptimizedLayout>
            <MarketNews />
          </OptimizedLayout>
        } />
        <Route path="/predictions" element={
          <OptimizedLayout>
            <Predictions />
          </OptimizedLayout>
        } />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/brokerage-agreement" element={<BrokerageAgreement />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/errors" element={<AdminErrors />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/agent-register" element={<AgentRegistration />} />
        <Route path="/agent-login" element={<AgentLogin />} />
        <Route path="/product/:productId" element={<AffiliateProductPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
      <AIAssistant />
    </div>
  );
}

export default App;
