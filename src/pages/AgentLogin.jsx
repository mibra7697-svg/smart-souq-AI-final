import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import affiliateService from '@/services/affiliateService';
import { useNavigate } from 'react-router-dom';

const AgentLogin = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('email'); // 'email' or 'code'
  const [formData, setFormData] = useState({
    email: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let agent = null;

      if (loginType === 'email') {
        // Find agent by email (in production, this would be an API call)
        for (const [id, agentData] of affiliateService.agents) {
          if (agentData.email === formData.email) {
            agent = agentData;
            break;
          }
        }
      } else {
        // Find agent by referral code
        agent = affiliateService.getAgentByReferralCode(formData.referralCode);
      }

      if (!agent) {
        setError('Agent not found. Please check your credentials.');
        return;
      }

      // Store agent data and redirect
      localStorage.setItem('agentId', agent.id);
      localStorage.setItem('agentData', JSON.stringify(agent));
      
      navigate(`/agent-dashboard?agent=${agent.id}`);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <FaUser style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
            Agent Login
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Access your affiliate dashboard
          </p>
        </div>

        {/* Login Type Toggle */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            type="button"
            onClick={() => setLoginType('email')}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: loginType === 'email' ? '#3b82f6' : 'transparent',
              color: loginType === 'email' ? 'white' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType('code')}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: loginType === 'code' ? '#3b82f6' : 'transparent',
              color: loginType === 'code' ? 'white' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Referral Code
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#dc2626'
            }}>
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          {loginType === 'email' ? (
            /* Email Login */
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                <FaEnvelope style={{ marginRight: '0.5rem' }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  marginBottom: '1.5rem'
                }}
                placeholder="agent@example.com"
              />
            </div>
          ) : (
            /* Referral Code Login */
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                <FaUser style={{ marginRight: '0.5rem' }} />
                Referral Code
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase'
                }}
                placeholder="ABC123"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </button>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Don't have an account?
            </p>
            <a
              href="/agent-register"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Register as Agent
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentLogin;
