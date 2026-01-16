import axios from 'axios';
import { isClient, safeLocalStorage } from '@/utils/ssrSafe';
import { validateUrl, validateApiKey, getServiceStatus } from '@/utils/validation';
import { ENV } from '@/config/env';

class AffiliateService {
  constructor() {
    this.agents = new Map(); // agentId -> agent data
    this.clicks = new Map(); // clickId -> click data
    this.commissions = new Map(); // agentId -> commission data
    this.productLinks = new Map(); // productId -> affiliate links
    this.baseURL = '/api/affiliate';
    this.isInitialized = false;
    
    // Initialize from localStorage if available
    if (isClient) {
      this.loadFromLocalStorage();
    }
  }

  // Register new agent
  async registerAgent(agentData) {
    try {
      if (!isClient) {
        console.warn('Agent registration called on server-side');
        return { success: false, error: 'Server-side registration not allowed' };
      }

      const agentId = this.generateAgentId();
      const newAgent = {
        id: agentId,
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone,
        country: agentData.country,
        commissionRate: agentData.commissionRate || ENV.payment.commissionRate || 0.05,
        status: 'pending',
        createdAt: new Date().toISOString(),
        referralCode: this.generateReferralCode(agentData.name),
        source: 'local'
      };

      this.agents.set(agentId, newAgent);
      this.saveToLocalStorage();

      return { success: true, agent: newAgent };
    } catch (error) {
      console.error('❌ Error registering agent:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate unique agent ID
  generateAgentId() {
    return `AG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Generate referral code
  generateReferralCode(name) {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${cleanName.substr(0, 3)}${random}`;
  }

  // Create affiliate link for product
  createAffiliateLink(productId, agentId, productUrl) {
    const clickId = this.generateClickId();
    const affiliateUrl = `${window.location.origin}/product/${productId}?agent=${agentId}&click=${clickId}`;
    
    // Store click tracking data
    this.clicks.set(clickId, {
      id: clickId,
      agentId,
      productId,
      originalUrl: productUrl,
      affiliateUrl,
      createdAt: new Date().toISOString(),
      status: 'created'
    });

    this.productLinks.set(productId, {
      productId,
      agentId,
      clickId,
      affiliateUrl,
      originalUrl: productUrl
    });

    this.saveToLocalStorage();
    return affiliateUrl;
  }

  // Generate unique click ID
  generateClickId() {
    return `CK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Track click when user visits affiliate link
  async trackClick(clickId, userAgent, ipAddress) {
    try {
      const click = this.clicks.get(clickId);
      if (!click) {
        return { success: false, error: 'Invalid click ID' };
      }

      // Update click status
      click.status = 'clicked';
      click.clickedAt = new Date().toISOString();
      click.userAgent = userAgent;
      click.ipAddress = ipAddress;

      this.clicks.set(clickId, click);
      this.saveToLocalStorage();

      // Redirect to original product URL
      return { 
        success: true, 
        redirectUrl: click.originalUrl,
        agentId: click.agentId
      };
    } catch (error) {
      console.error('Error tracking click:', error);
      return { success: false, error: error.message };
    }
  }

  // Record conversion/sale
  async recordConversion(clickId, saleData) {
    try {
      const click = this.clicks.get(clickId);
      if (!click) {
        return { success: false, error: 'Invalid click ID' };
      }

      const conversion = {
        clickId,
        agentId: click.agentId,
        productId: click.productId,
        amount: saleData.amount,
        commission: saleData.amount * (this.getAgent(click.agentId)?.commissionRate || 0.05),
        currency: saleData.currency || 'USD',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        orderId: saleData.orderId
      };

      // Update click status
      click.status = 'converted';
      click.convertedAt = conversion.createdAt;
      this.clicks.set(clickId, click);

      // Add to agent's commissions
      if (!this.commissions.has(click.agentId)) {
        this.commissions.set(click.agentId, []);
      }
      this.commissions.get(click.agentId).push(conversion);

      this.saveToLocalStorage();
      return { success: true, conversion };
    } catch (error) {
      console.error('Error recording conversion:', error);
      return { success: false, error: error.message };
    }
  }

  // Get agent by ID
  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  // Get agent by referral code
  getAgentByReferralCode(referralCode) {
    for (const agent of this.agents.values()) {
      if (agent.referralCode === referralCode) {
        return agent;
      }
    }
    return null;
  }

  // Get agent dashboard data
  getAgentDashboard(agentId) {
    const agent = this.getAgent(agentId);
    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    const agentClicks = Array.from(this.clicks.values()).filter(click => click.agentId === agentId);
    const agentCommissions = this.commissions.get(agentId) || [];

    const stats = {
      totalClicks: agentClicks.length,
      totalConversions: agentCommissions.length,
      totalCommission: agentCommissions.reduce((sum, conv) => sum + conv.commission, 0),
      conversionRate: agentClicks.length > 0 ? (agentCommissions.length / agentClicks.length) * 100 : 0,
      pendingCommissions: agentCommissions.filter(conv => conv.status === 'pending').reduce((sum, conv) => sum + conv.commission, 0),
      confirmedCommissions: agentCommissions.filter(conv => conv.status === 'confirmed').reduce((sum, conv) => sum + conv.commission, 0)
    };

    return {
      success: true,
      agent,
      stats,
      recentClicks: agentClicks.slice(-10).reverse(),
      recentCommissions: agentCommissions.slice(-10).reverse()
    };
  }

  // Fetch products from Amazon/Pricena APIs and add affiliate links
  async fetchProductsWithAffiliateLinks(agentId, category = 'all') {
    try {
      // Demo: Mock product data (replace with actual API calls)
      const mockProducts = [
        {
          id: 'amz-001',
          title: 'iPhone 15 Pro Max',
          price: 1199.99,
          currency: 'USD',
          source: 'amazon',
          url: 'https://amazon.com/dp/B0CHX2QJQ2',
          image: 'https://m.media-amazon.com/images/I/71xb2xkGZaL._AC_SL1500_.jpg'
        },
        {
          id: 'amz-002',
          title: 'Samsung Galaxy S24 Ultra',
          price: 1299.99,
          currency: 'USD',
          source: 'amazon',
          url: 'https://amazon.com/dp/B0CWQJQ2YF',
          image: 'https://m.media-amazon.com/images/I/81gBZB2B9GL._AC_SL1500_.jpg'
        },
        {
          id: 'prc-001',
          title: 'MacBook Pro 16"',
          price: 2499.99,
          currency: 'USD',
          source: 'pricena',
          url: 'https://pricena.com/product/macbook-pro-16',
          image: 'https://images.pricena.com/product/macbook-pro-16.jpg'
        }
      ];

      // Add affiliate links to products
      const productsWithAffiliateLinks = mockProducts.map(product => ({
        ...product,
        affiliateLink: this.createAffiliateLink(product.id, agentId, product.url),
        commission: product.price * (this.getAgent(agentId)?.commissionRate || 0.05)
      }));

      return { success: true, products: productsWithAffiliateLinks };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: error.message };
    }
  }

  // Save data to localStorage (for demo)
  saveToLocalStorage() {
    if (!isClient) return;
    
    try {
      const data = {
        agents: Array.from(this.agents.entries()),
        clicks: Array.from(this.clicks.entries()),
        commissions: Array.from(this.commissions.entries()),
        productLinks: Array.from(this.productLinks.entries())
      };
      safeLocalStorage.setItem('affiliateData', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }

  // Load data from localStorage (for demo)
  loadFromLocalStorage() {
    if (!isClient) return;
    
    try {
      const data = safeLocalStorage.getItem('affiliateData');
      if (data) {
        const parsed = JSON.parse(data);
        this.agents = new Map(parsed.agents || []);
        this.clicks = new Map(parsed.clicks || []);
        this.commissions = new Map(parsed.commissions || []);
        this.productLinks = new Map(parsed.productLinks || []);
        console.info('✅ Loaded affiliate data from localStorage');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Initialize service
  initialize() {
    this.loadFromLocalStorage();
  }
}

// Create singleton instance
const affiliateService = new AffiliateService();

// Auto-initialize
if (typeof window !== 'undefined') {
  affiliateService.initialize();
}

export default affiliateService;
