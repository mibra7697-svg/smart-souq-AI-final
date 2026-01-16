import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaPercent, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import affiliateService from '@/services/affiliateService';
import { useNavigate } from 'react-router-dom';

const AgentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    commissionRate: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commissionRate' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await affiliateService.registerAgent(formData);
      
      if (result.success) {
        setSuccess('Registration successful! Your application is under review.');
        // Store agent ID for dashboard access
        localStorage.setItem('agentId', result.agent.id);
        localStorage.setItem('agentData', JSON.stringify(result.agent));
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate(`/agent-dashboard?agent=${result.agent.id}`);
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway',
    'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
    'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia',
    'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Cyprus',
    'Malta', 'Luxembourg', 'United Arab Emirates', 'Saudi Arabia',
    'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon',
    'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan',
    'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
    'Myanmar', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia',
    'Singapore', 'Indonesia', 'Japan', 'South Korea', 'China',
    'Taiwan', 'Hong Kong', 'New Zealand', 'Fiji', 'Papua New Guinea'
  ];

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
        maxWidth: '600px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
            Become an Affiliate Agent
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Join our network and earn commissions on every sale
          </p>
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

          {success && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#16a34a'
            }}>
              <FaCheckCircle />
              <span>{success}</span>
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              <FaUser style={{ marginRight: '0.5rem' }} />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              <FaEnvelope style={{ marginRight: '0.5rem' }} />
              Email Address *
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
                transition: 'border-color 0.2s'
              }}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              <FaPhone style={{ marginRight: '0.5rem' }} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Country */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              <FaGlobe style={{ marginRight: '0.5rem' }} />
              Country *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select your country</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Commission Rate */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              <FaPercent style={{ marginRight: '0.5rem' }} />
              Commission Rate (%)
            </label>
            <input
              type="number"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              min="1"
              max="20"
              step="0.5"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
            />
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              Standard rate is 5%. Higher rates may be available for high-performing agents.
            </p>
          </div>

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
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Registering...' : 'Register as Agent'}
          </button>

          {/* Terms */}
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '1.5rem'
          }}>
            By registering, you agree to our{' '}
            <a href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AgentRegistration;
