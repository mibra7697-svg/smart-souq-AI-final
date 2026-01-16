const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('rate-limiter-flexible');
const winston = require('winston');
const axios = require('axios');

/**
 * CORS Proxy Server for MENA Region
 * Handles API calls for Egypt, Iraq, Syria, Libya, and other restricted regions
 */

const app = express();
const PORT = process.env.PROXY_PORT || 3002;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/proxy-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/proxy-combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Rate limiting configuration
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyPrefix: 'proxy_limiter',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for MENA region
const allowedOrigins = [
  'http://localhost:3002',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://smartsouq.ai',
  'https://www.smartsouq.ai',
  // MENA region specific origins
  'https://*.sy', // Syria
  'https://*.eg', // Egypt
  'https://*.iq', // Iraq
  'https://*.ly', // Libya
  'https://*.jo', // Jordan
  'https://*.sa', // Saudi Arabia
  'https://*.ae', // UAE
  'https://*.kw', // Kuwait
  'https://*.qa', // Qatar
  'https://*.bh', // Bahrain
  'https://*.om', // Oman
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(clientIp);
    next();
  } catch (rateLimiterRes) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(rateLimiterRes.msBeforeNext) || 60
    });
  }
};

// Allowed APIs configuration
const ALLOWED_APIS = {
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
    paths: ['/simple/price', '/coins', '/exchange_rates']
  },
  binance: {
    baseUrl: 'https://api.binance.com/api/v3',
    timeout: 8000,
    paths: ['/ticker/price', '/ticker/24hr', '/time']
  },
  coinbase: {
    baseUrl: 'https://api.coinbase.com/v2',
    timeout: 8000,
    paths: ['/exchange-rates', '/time', '/currencies']
  },
  ipapi: {
    baseUrl: 'https://ipapi.co',
    timeout: 5000,
    paths: ['/json', '/*']
  },
  trongrid: {
    baseUrl: 'https://api.trongrid.io',
    timeout: 10000,
    paths: ['/v1/accounts']
  }
};

// Proxy endpoint
app.use('/proxy/:apiName/*', rateLimitMiddleware, async (req, res) => {
  const { apiName } = req.params;
  const path = req.params[0];
  
  logger.info(`Proxy request: ${apiName} - ${path} from ${req.ip}`);
  
  // Validate API name
  if (!ALLOWED_APIS[apiName]) {
    logger.warn(`Invalid API requested: ${apiName}`);
    return res.status(400).json({ error: 'Invalid API name' });
  }
  
  const apiConfig = ALLOWED_APIS[apiName];
  
  // Validate path
  const isAllowedPath = apiConfig.paths.some(allowedPath => 
    path.startsWith(allowedPath.replace('*', ''))
  );
  
  if (!isAllowedPath) {
    logger.warn(`Forbidden path: ${path} for API: ${apiName}`);
    return res.status(403).json({ error: 'Forbidden path' });
  }
  
  // Construct target URL
  const targetUrl = `${apiConfig.baseUrl}/${path}`;
  
  try {
    // Forward the request
    const response = await axios({
      method: req.method,
      url: targetUrl,
      timeout: apiConfig.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': req.headers['content-type'] || 'application/json',
        // Forward authorization headers if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        ...(req.headers['x-api-key'] && { 'X-API-Key': req.headers['x-api-key'] }),
        ...(req.headers['merchant'] && { 'Merchant': req.headers['merchant'] }),
        ...(req.headers['sign'] && { 'Sign': req.headers['sign'] })
      },
      data: req.body,
      params: req.query
    });
    
    logger.info(`Proxy success: ${apiName} - ${path} (${response.status})`);
    
    // Forward the response
    res.status(response.status).json(response.data);
    
  } catch (error) {
    logger.error(`Proxy error for ${apiName} - ${path}:`, error.message);
    
    if (error.response) {
      // Forward the error response from the API
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Gateway Timeout', message: 'Request to external API timed out' });
    } else {
      res.status(503).json({ error: 'Service Unavailable', message: 'Failed to connect to external API' });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    allowedApis: Object.keys(ALLOWED_APIS)
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    proxy: {
      status: 'running',
      port: PORT,
      allowedOrigins: allowedOrigins.length,
      allowedApis: Object.keys(ALLOWED_APIS).length
    },
    rateLimiting: {
      requestsPerMinute: 100,
      currentWindow: '60 seconds'
    },
    security: {
      helmet: true,
      cors: true,
      rateLimiting: true
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Smart Souq CORS Proxy running on port ${PORT}`);
  logger.info(`Allowed APIs: ${Object.keys(ALLOWED_APIS).join(', ')}`);
  logger.info(`Rate limiting: 100 requests per 60 seconds`);
});

module.exports = app;
