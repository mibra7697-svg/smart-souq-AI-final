import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import affiliateManagementService from '@/services/affiliateManagementService';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaPercent, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AffiliateRegistration = () => {
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
      const result = await affiliateManagementService.registerAgent(formData);
      
      if (result.success) {
        setSuccess('Registration successful! Your application is under review.');
        // Store agent ID for dashboard access
        localStorage.setItem('agentId', result.agent.id);
        localStorage.setItem('affiliateAgentData', JSON.stringify(result.agent));
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate(`/affiliate-dashboard?agent=${result.agent.id}`);
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
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '600px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
            Become an Affiliate Partner
          </h1>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
            Earn commissions by promoting products from Amazon and AliExpress
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
              fontWeight: '600',
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
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
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
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
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
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Country */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
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
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: 'white',
                transition: 'all 0.3s ease'
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
              fontWeight: '600',
              color: '#374151'
            }}>
              <FaPercent style={{ marginRight: '0.5rem' }} />
              Default Commission Rate (%)
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
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            />
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              Standard rate is 5%. Higher rates may be available for high-performing partners.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? 'Registering...' : 'Become an Affiliate Partner'}
          </button>

          {/* Benefits */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem'
          }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              marginBottom: '1rem', 
              color: '#1e293b',
              textAlign: 'center'
            }}>
              Why Join Our Affiliate Program?
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              textAlign: 'center'
            }}>
              <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
                ✓ Earn up to 10% commission on sales
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
                ✓ Products from Amazon and AliExpress
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
                ✓ Custom commission rates available
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
                ✓ Real-time tracking and analytics
              </li>
              <li style={{ color: '#4b5563' }}>
                ✓ No inventory management required
              </li>
            </ul>
          </div>

          {/* Terms */}
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '1.5rem'
          }}>
            By registering, you agree to our{' '}
            <a href="/terms" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              Privacy Policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AffiliateRegistration;
