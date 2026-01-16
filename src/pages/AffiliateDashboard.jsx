import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import affiliateManagementService from '@/services/affiliateManagementService';
import { 
  FaUser, 
  FaLink, 
  FaMousePointer, 
  FaDollarSign, 
  FaChartLine, 
  FaCopy, 
  FaCheck, 
  FaTimes, 
  FaEye,
  FaShoppingCart,
  FaAmazon,
  FaStore,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt
} from 'react-icons/fa';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [editingCommission, setEditingCommission] = useState(null);
  const [customRate, setCustomRate] = useState('');

  useEffect(() => {
    // Get agent ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('agent') || localStorage.getItem('agentId');

    if (!agentId) {
      navigate('/affiliate-register');
      return;
    }

    loadDashboardData(agentId);
  }, [navigate]);

  const loadDashboardData = async (agentId) => {
    try {
      setLoading(true);
      
      const result = affiliateManagementService.getAgentDashboard(agentId);
      if (!result.success) {
        setError(result.error);
        return;
      }

      setAgentData(result.agent);
      setDashboardData(result);
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

  const handleCustomCommission = (productId) => {
    const product = dashboardData.products.find(p => p.id === productId);
    if (product) {
      setEditingCommission(productId);
      setCustomRate((product.commissionRate * 100).toString());
    }
  };

  const saveCustomCommission = () => {
    if (editingCommission && customRate) {
      const rate = parseFloat(customRate) / 100;
      const result = affiliateManagementService.setCustomCommissionRate(
        agentData.id, 
        editingCommission, 
        rate
      );
      
      if (result.success) {
        // Reload dashboard data
        loadDashboardData(agentData.id);
        setEditingCommission(null);
        setCustomRate('');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
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

  const { agent, stats, products, recentCommissions, recentClicks } = dashboardData;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
            Affiliate Dashboard
          </h1>
          <p style={{ color: '#64748b' }}>
            Welcome back, {agent.name} ({agent.referralCode})
          </p>
        </div>
        <div style={{
          backgroundColor: getStatusColor(agent.status),
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
            <h3 style={{ margin: 0, color: '#1e293b' }}>Total Earnings</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
            {formatCurrency(stats.totalEarnings)}
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
            <FaChartLine style={{ color: '#8b5cf6', fontSize: '1.5rem', marginRight: '1rem' }} />
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr)', 
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
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '1rem', 
                    color: '#1e293b',
                    lineHeight: '1.4',
                    flex: 1
                  }}>
                    {product.title}
                  </h3>
                  <span style={{
                    backgroundColor: product.source === 'amazon' ? '#ff9900' : '#ff6b35',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {product.source === 'amazon' ? <FaAmazon /> : <FaStore />}
                    {product.source.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {formatCurrency(product.price)}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '500' }}>
                      Commission: {formatCurrency(product.estimatedCommission)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Rate: {(product.commissionRate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Custom Commission Rate */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Custom Rate:</span>
                  {editingCommission === product.id ? (
                    <>
                      <input
                        type="number"
                        value={customRate}
                        onChange={(e) => setCustomRate(e.target.value)}
                        placeholder="%"
                        style={{
                          width: '80px',
                          padding: '0.25rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        onClick={saveCustomCommission}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommission(null);
                          setCustomRate('');
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>
                        {(product.commissionRate * 100).toFixed(1)}%
                      </span>
                      <button
                        onClick={() => handleCustomCommission(product.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEdit />
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => copyToClipboard(product.affiliateUrl, product.id)}
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
                    onClick={() => window.open(product.affiliateUrl, '_blank')}
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
                  <button
                    onClick={() => window.open(product.originalUrl, '_blank')}
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
                    <FaExternalLinkAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
                <div key={commission.id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {commission.productName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Order: {commission.orderId}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(commission.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                      +{formatCurrency(commission.commissionAmount)}
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
                    backgroundColor: click.converted ? '#10b981' : '#64748b',
                    color: 'white'
                  }}>
                    {click.converted ? 'Converted' : 'Clicked'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
