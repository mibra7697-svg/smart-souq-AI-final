import axios from 'axios';

class AffiliateManagementService {
  constructor() {
    this.agents = new Map();
    this.products = new Map();
    this.commissions = new Map();
    this.clicks = new Map();
    this.baseURL = '/api/affiliate';
    this.initializeMockData();
  }

  // Initialize mock data for demo
  initializeMockData() {
    // Mock products from Amazon/AliExpress
    const mockProducts = [
      {
        id: 'amz-001',
        title: 'iPhone 15 Pro Max 256GB',
        price: 1199.99,
        currency: 'USD',
        category: 'Electronics',
        source: 'amazon',
        originalUrl: 'https://amazon.com/dp/B0CHX2QJQ2',
        image: 'https://m.media-amazon.com/images/I/71xb2xkGZaL._AC_SL1500_.jpg',
        commissionRate: 0.04, // 4%
        description: 'Latest iPhone with advanced features'
      },
      {
        id: 'amz-002',
        title: 'Samsung Galaxy S24 Ultra 512GB',
        price: 1299.99,
        currency: 'USD',
        category: 'Electronics',
        source: 'amazon',
        originalUrl: 'https://amazon.com/dp/B0CWQJQ2YF',
        image: 'https://m.media-amazon.com/images/I/81gBZB2B9GL._AC_SL1500_.jpg',
        commissionRate: 0.03, // 3%
        description: 'Premium Android smartphone'
      },
      {
        id: 'ali-001',
        title: 'Wireless Bluetooth Earbuds TWS',
        price: 29.99,
        currency: 'USD',
        category: 'Electronics',
        source: 'aliexpress',
        originalUrl: 'https://aliexpress.com/item/4001234567890.html',
        image: 'https://ae01.alicdn.com/kf/HTB1R9pXnY1gk0SVSZSq6yq5XXaJ.jpg',
        commissionRate: 0.08, // 8%
        description: 'High-quality wireless earbuds'
      },
      {
        id: 'ali-002',
        title: 'Smart Watch Series 7',
        price: 89.99,
        currency: 'USD',
        category: 'Electronics',
        source: 'aliexpress',
        originalUrl: 'https://aliexpress.com/item/4001234567891.html',
        image: 'https://ae01.alicdn.com/kf/HTB1R9pXnY1gk0SVSZSq6yq5XXbJ.jpg',
        commissionRate: 0.06, // 6%
        description: 'Feature-rich smartwatch'
      },
      {
        id: 'amz-003',
        title: 'MacBook Pro 16" M3 Pro',
        price: 2499.99,
        currency: 'USD',
        category: 'Computers',
        source: 'amazon',
        originalUrl: 'https://amazon.com/dp/B0CQ4Z4J5K',
        image: 'https://m.media-amazon.com/images/I/61Gv1c9zkL._AC_SL1500_.jpg',
        commissionRate: 0.02, // 2%
        description: 'Professional laptop with M3 Pro chip'
      },
      {
        id: 'ali-003',
        title: '4K Webcam with Ring Light',
        price: 45.99,
        currency: 'USD',
        category: 'Electronics',
        source: 'aliexpress',
        originalUrl: 'https://aliexpress.com/item/4001234567892.html',
        image: 'https://ae01.alicdn.com/kf/HTB1R9pXnY1gk0SVSZSq6yq5XXcJ.jpg',
        commissionRate: 0.10, // 10%
        description: 'Professional streaming webcam'
      }
    ];

    mockProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Register new agent
  async registerAgent(agentData) {
    try {
      const agentId = this.generateAgentId();
      const referralCode = this.generateReferralCode(agentData.name);
      
      const newAgent = {
        id: agentId,
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone,
        country: agentData.country,
        referralCode: referralCode,
        commissionRate: agentData.commissionRate || 0.05, // Default 5%
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalEarnings: 0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        customCommissionRates: new Map() // Product-specific commission rates
      };

      this.agents.set(agentId, newAgent);
      this.saveToLocalStorage();

      return { success: true, agent: newAgent };
    } catch (error) {
      console.error('Error registering agent:', error);
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

  // Get agent by ID or referral code
  getAgent(identifier) {
    // Try by ID first
    let agent = this.agents.get(identifier);
    
    // Try by referral code
    if (!agent) {
      for (const [id, agentData] of this.agents) {
        if (agentData.referralCode === identifier) {
          agent = agentData;
          break;
        }
      }
    }
    
    return agent;
  }

  // Generate affiliate tracking URL
  generateAffiliateUrl(productId, agentId) {
    const clickId = this.generateClickId();
    const baseUrl = window.location.origin;
    
    const affiliateUrl = `${baseUrl}/product/${productId}?agent=${agentId}&click=${clickId}`;
    
    // Store click tracking data
    this.clicks.set(clickId, {
      id: clickId,
      agentId,
      productId,
      affiliateUrl,
      createdAt: new Date().toISOString(),
      status: 'created',
      userAgent: null,
      ipAddress: null,
      converted: false,
      conversionAmount: 0,
      commissionAmount: 0
    });

    return affiliateUrl;
  }

  // Generate unique click ID
  generateClickId() {
    return `CK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Track click
  async trackClick(clickId, userAgent, ipAddress) {
    try {
      const click = this.clicks.get(clickId);
      if (!click) {
        return { success: false, error: 'Invalid click ID' };
      }

      // Update click data
      click.status = 'clicked';
      click.clickedAt = new Date().toISOString();
      click.userAgent = userAgent;
      click.ipAddress = ipAddress;

      // Update agent stats
      const agent = this.agents.get(click.agentId);
      if (agent) {
        agent.totalClicks += 1;
        this.calculateConversionRate(agent);
      }

      this.saveToLocalStorage();
      return { success: true, click };
    } catch (error) {
      console.error('Error tracking click:', error);
      return { success: false, error: error.message };
    }
  }

  // Record conversion and calculate commission
  async recordConversion(clickId, saleData) {
    try {
      const click = this.clicks.get(clickId);
      if (!click) {
        return { success: false, error: 'Invalid click ID' };
      }

      const product = this.products.get(click.productId);
      const agent = this.agents.get(click.agentId);
      
      if (!product || !agent) {
        return { success: false, error: 'Product or agent not found' };
      }

      // Calculate commission
      const commissionRate = this.getCommissionRate(agent, product);
      const commissionAmount = saleData.amount * commissionRate;

      // Update click data
      click.converted = true;
      click.convertedAt = new Date().toISOString();
      click.conversionAmount = saleData.amount;
      click.commissionAmount = commissionAmount;
      click.orderId = saleData.orderId;

      // Create commission record
      const commissionId = this.generateCommissionId();
      const commission = {
        id: commissionId,
        agentId: agent.id,
        clickId: clickId,
        productId: product.id,
        orderId: saleData.orderId,
        saleAmount: saleData.amount,
        commissionRate: commissionRate,
        commissionAmount: commissionAmount,
        currency: saleData.currency || 'USD',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Store commission
      if (!this.commissions.has(agent.id)) {
        this.commissions.set(agent.id, []);
      }
      this.commissions.get(agent.id).push(commission);

      // Update agent stats
      agent.totalEarnings += commissionAmount;
      agent.totalConversions += 1;
      this.calculateConversionRate(agent);

      this.saveToLocalStorage();
      
      return { 
        success: true, 
        commission: {
          ...commission,
          agentName: agent.name,
          productName: product.title
        }
      };
    } catch (error) {
      console.error('Error recording conversion:', error);
      return { success: false, error: error.message };
    }
  }

  // Get commission rate for agent and product
  getCommissionRate(agent, product) {
    // Check for custom commission rate first
    const customRate = agent.customCommissionRates.get(product.id);
    if (customRate) {
      return customRate;
    }
    
    // Use product-specific rate
    if (product.commissionRate) {
      return product.commissionRate;
    }
    
    // Use agent's default rate
    return agent.commissionRate;
  }

  // Set custom commission rate for agent
  setCustomCommissionRate(agentId, productId, commissionRate) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.customCommissionRates.set(productId, commissionRate);
      this.saveToLocalStorage();
      return { success: true };
    }
    return { success: false, error: 'Agent not found' };
  }

  // Calculate conversion rate
  calculateConversionRate(agent) {
    if (agent.totalClicks > 0) {
      agent.conversionRate = (agent.totalConversions / agent.totalClicks) * 100;
    }
  }

  // Generate commission ID
  generateCommissionId() {
    return `CM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Get products for agent
  getProductsForAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return [];
    }

    return Array.from(this.products.values()).map(product => ({
      ...product,
      affiliateUrl: this.generateAffiliateUrl(product.id, agentId),
      commissionRate: this.getCommissionRate(agent, product),
      estimatedCommission: product.price * this.getCommissionRate(agent, product)
    }));
  }

  // Get agent dashboard data
  getAgentDashboard(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    const agentCommissions = this.commissions.get(agentId) || [];
    const agentClicks = Array.from(this.clicks.values()).filter(click => click.agentId === agentId);
    const products = this.getProductsForAgent(agentId);

    const stats = {
      totalEarnings: agent.totalEarnings,
      totalClicks: agent.totalClicks,
      totalConversions: agent.totalConversions,
      conversionRate: agent.conversionRate,
      pendingCommissions: agentCommissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.commissionAmount, 0),
      confirmedCommissions: agentCommissions
        .filter(c => c.status === 'confirmed')
        .reduce((sum, c) => sum + c.commissionAmount, 0)
    };

    return {
      success: true,
      agent,
      stats,
      products,
      recentCommissions: agentCommissions.slice(-10).reverse(),
      recentClicks: agentClicks.slice(-10).reverse()
    };
  }

  // Get all agents (for admin)
  getAllAgents() {
    return Array.from(this.agents.values()).map(agent => ({
      ...agent,
      customCommissionRates: Array.from(agent.customCommissionRates.entries())
    }));
  }

  // Update agent status
  updateAgentStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      this.saveToLocalStorage();
      return { success: true };
    }
    return { success: false, error: 'Agent not found' };
  }

  // Update commission status
  updateCommissionStatus(commissionId, status) {
    for (const [agentId, commissions] of this.commissions) {
      const commission = commissions.find(c => c.id === commissionId);
      if (commission) {
        commission.status = status;
        this.saveToLocalStorage();
        return { success: true };
      }
    }
    return { success: false, error: 'Commission not found' };
  }

  // Fetch products from APIs (mock implementation)
  async fetchProductsFromAPI(source = 'all') {
    try {
      // In production, this would fetch from actual Amazon/AliExpress APIs
      const products = Array.from(this.products.values());
      
      if (source !== 'all') {
        return products.filter(p => p.source === source);
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Save to localStorage
  saveToLocalStorage() {
    try {
      const data = {
        agents: Array.from(this.agents.entries()),
        products: Array.from(this.products.entries()),
        commissions: Array.from(this.commissions.entries()),
        clicks: Array.from(this.clicks.entries())
      };
      localStorage.setItem('affiliateManagementData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Load from localStorage
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('affiliateManagementData');
      if (data) {
        const parsed = JSON.parse(data);
        this.agents = new Map(parsed.agents || []);
        this.products = new Map(parsed.products || []);
        this.commissions = new Map(parsed.commissions || []);
        this.clicks = new Map(parsed.clicks || []);
        
        // Restore custom commission rates as Maps
        this.agents.forEach((agent, id) => {
          if (agent.customCommissionRates && Array.isArray(agent.customCommissionRates)) {
            agent.customCommissionRates = new Map(agent.customCommissionRates);
          }
        });
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
const affiliateManagementService = new AffiliateManagementService();

// Auto-initialize
if (typeof window !== 'undefined') {
  affiliateManagementService.initialize();
}

export default affiliateManagementService;
