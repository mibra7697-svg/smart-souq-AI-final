import React, { useState, useEffect, memo } from 'react';
import { FaChartLine, FaUsers, FaMousePointer, FaDollarSign, FaLink, FaCopy, FaCheck, FaTimes, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import affiliateService from '@/services/affiliateService';
import { useNavigate } from 'react-router-dom';
import ServiceUnavailable from '@/components/ServiceUnavailable';
import { getServiceStatus } from '@/utils/validation';

const AgentDashboard = memo(() => {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);

  useEffect(() => {
    // Check service status first
    const status = getServiceStatus();
    setServiceStatus(status);
    
    // Get agent ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('agent') || localStorage.getItem('agentId');

    if (!agentId) {
      navigate('/agent-login');
      return;
    }

    loadDashboardData(agentId);
  }, [navigate]);

  const loadDashboardData = async (agentId) => {
    try {
      setLoading(true);
      
      // Get agent dashboard data
      const dashboardResult = affiliateService.getAgentDashboard(agentId);
      if (!dashboardResult.success) {
        setError(dashboardResult.error);
        return;
      }

      // Get products with affiliate links
      const productsResult = await affiliateService.fetchProductsWithAffiliateLinks(agentId);
      
      setAgentData(dashboardResult.agent);
      setDashboardData(dashboardResult);
      setProducts(productsResult.success ? productsResult.products : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '1.2rem'
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: '#ef4444',
        fontSize: '1.2rem'
      }}>
        Error: {error}
      </div>
    );
  }

  const { agent, stats, recentClicks, recentCommissions } = dashboardData;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Agent Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>
            Welcome back, {agent.name} ({agent.referralCode})
          </p>
        </div>
        <div style={{
          backgroundColor: agent.status === 'approved' ? '#10b981' : '#f59e0b',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          Status: {agent.status.toUpperCase()}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FaMousePointer style={{ color: '#3b82f6', fontSize: '1.5rem', marginRight: '1rem' }} />
            <h3 style={{ margin: 0, color: '#1e293b' }}>Total Clicks</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {stats.totalClicks}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FaChartLine style={{ color: '#10b981', fontSize: '1.5rem', marginRight: '1rem' }} />
            <h3 style={{ margin: 0, color: '#1e293b' }}>Conversions</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {stats.totalConversions}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FaDollarSign style={{ color: '#f59e0b', fontSize: '1.5rem', marginRight: '1rem' }} />
            <h3 style={{ margin: 0, color: '#1e293b' }}>Total Commission</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
            ${stats.totalCommission.toFixed(2)}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FaUsers style={{ color: '#8b5cf6', fontSize: '1.5rem', marginRight: '1rem' }} />
            <h3 style={{ margin: 0, color: '#1e293b' }}>Conversion Rate</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>
            {stats.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Products with Affiliate Links */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
          Your Affiliate Products
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem'
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <img 
                src={product.image} 
                alt={product.title}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover',
                  backgroundColor: '#f8fafc'
                }}
              />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#1e293b' }}>
                  {product.title}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    ${product.price}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#10b981' }}>
                    Commission: ${product.commission.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => copyToClipboard(product.affiliateLink, product.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    {copiedLink === product.id ? <FaCheck /> : <FaCopy />}
                    {copiedLink === product.id ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => window.open(product.affiliateLink, '_blank')}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Clicks */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>
            Recent Clicks
          </h3>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            {recentClicks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No clicks yet
              </div>
            ) : (
              recentClicks.map(click => (
                <div key={click.id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {click.productId}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {new Date(click.clickedAt || click.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    backgroundColor: click.status === 'converted' ? '#10b981' : '#f59e0b',
                    color: 'white'
                  }}>
                    {click.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Commissions */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>
            Recent Commissions
          </h3>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            {recentCommissions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No commissions yet
              </div>
            ) : (
              recentCommissions.map(commission => (
                <div key={commission.clickId} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {commission.productId}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {new Date(commission.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                      +${commission.commission.toFixed(2)}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      backgroundColor: commission.status === 'confirmed' ? '#10b981' : '#f59e0b',
                      color: 'white'
                    }}>
                      {commission.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

AgentDashboard.displayName = 'AgentDashboard';

export default AgentDashboard;
