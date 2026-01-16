import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import affiliateService from '@/services/affiliateService';
import { FaExternalLinkAlt, FaShare, FaCopy, FaCheck } from 'react-icons/fa';

const AffiliateProductPage = () => {
  const { productId } = useParams();
  const { agent, click } = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [product, setProduct] = useState(null);
  const [copied, setCopied] = useState(false);

  // Parse URL parameters
  const useQuery = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      agent: params.get('agent'),
      click: params.get('click')
    };
  };

  useEffect(() => {
    if (agent && click) {
      handleAffiliateClick();
    } else {
      // Load product directly without affiliate tracking
      loadProduct();
    }
  }, [agent, click]);

  const handleAffiliateClick = async () => {
    try {
      setLoading(true);
      
      // Track the click
      const result = await affiliateService.trackClick(
        click,
        navigator.userAgent,
        '127.0.0.1' // In production, get real IP
      );

      if (result.success) {
        // Show affiliate info briefly before redirect
        setProduct({
          id: productId,
          title: 'Loading product...',
          affiliateInfo: {
            agentId: result.agentId,
            redirectUrl: result.redirectUrl
          }
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          setRedirecting(true);
          window.location.href = result.redirectUrl;
        }, 3000);
      } else {
        // Error handling - redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadProduct = async () => {
    // Mock product data (replace with actual API call)
    const mockProduct = {
      id: productId,
      title: 'Product Title',
      price: 99.99,
      currency: 'USD',
      description: 'Product description goes here...',
      image: 'https://via.placeholder.com/400x300',
      originalUrl: `https://example.com/product/${productId}`
    };

    setProduct(mockProduct);
    setLoading(false);
  };

  const copyAffiliateLink = async () => {
    const affiliateUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    try {
      await navigator.clipboard.writeText(affiliateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#64748b' }}>Processing affiliate link...</p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#10b981', fontSize: '1.2rem' }}>
            Redirecting to product...
          </p>
          <p style={{ color: '#64748b' }}>
            You'll be redirected to the original product page shortly.
          </p>
        </div>
      </div>
    );
  }

  if (product?.affiliateInfo) {
    // Show affiliate tracking page
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
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'white',
            fontSize: '2rem'
          }}>
            <FaExternalLinkAlt />
          </div>
          
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
            Affiliate Link Detected
          </h1>
          
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
            You're about to visit this product through an affiliate link. 
            The agent will earn a commission if you make a purchase.
          </p>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#16a34a', margin: 0, fontSize: '0.9rem' }}>
              Redirecting automatically in 3 seconds...
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = product.affiliateInfo.redirectUrl}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Visit Product Now
          </button>
        </div>
      </div>
    );
  }

  // Regular product page
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '2rem'
          }}
        >
          ← Back
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Product Image */}
          <div style={{ backgroundColor: '#f8fafc', padding: '2rem' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Product Details */}
          <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>
              {product.title}
            </h1>
            
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1rem' }}>
              ${product.price}
            </div>
            
            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '2rem' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.open(product.originalUrl, '_blank')}
                style={{
                  flex: 1,
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaExternalLinkAlt />
                View Product
              </button>
              
              <button
                onClick={copyAffiliateLink}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProductPage;
