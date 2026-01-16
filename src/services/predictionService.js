import alphaVantageService from '@/services/alphaVantageService';

class PredictionService {
  constructor() {
    this.predictions = new Map();
    this.analysisCache = new Map();
  }

  // Analyze stock and generate buy/sell/hold prediction
  async analyzeAsset(symbol, type = 'stock') {
    try {
      const cacheKey = `analysis_${symbol}_${type}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      let quote, indicators, historicalData;

      if (type === 'stock') {
        quote = await alphaVantageService.getStockQuote(symbol);
        historicalData = await alphaVantageService.getHistoricalData(symbol);
      } else {
        quote = await alphaVantageService.getCryptoPrice(symbol);
        historicalData = await alphaVantageService.getHistoricalData(symbol);
      }

      indicators = await alphaVantageService.getTechnicalIndicators(symbol);

      const analysis = {
        symbol,
        type,
        currentPrice: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        prediction: this.generatePrediction(indicators, historicalData),
        indicators,
        recommendation: this.getRecommendation(indicators),
        riskLevel: this.calculateRiskLevel(indicators, historicalData),
        targetPrice: this.calculateTargetPrice(indicators, historicalData),
        timeToBuy: this.getBestTimeToBuy(indicators, historicalData),
        confidence: this.calculateConfidence(indicators, historicalData),
        lastUpdate: new Date().toISOString()
      };

      this.setCache(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error);
      return this.getMockAnalysis(symbol, type);
    }
  }

  // Generate prediction based on technical indicators
  generatePrediction(indicators, historicalData) {
    const signals = [];

    // RSI Analysis
    if (indicators.rsi < 30) {
      signals.push({ type: 'oversold', strength: 'strong', description: 'RSI indicates oversold condition' });
    } else if (indicators.rsi > 70) {
      signals.push({ type: 'overbought', strength: 'strong', description: 'RSI indicates overbought condition' });
    } else if (indicators.rsi < 50) {
      signals.push({ type: 'bearish', strength: 'weak', description: 'RSI below 50' });
    } else {
      signals.push({ type: 'bullish', strength: 'weak', description: 'RSI above 50' });
    }

    // Moving Averages
    if (indicators.sma20 > indicators.sma50) {
      signals.push({ type: 'bullish', strength: 'medium', description: 'Short-term MA above long-term MA' });
    } else {
      signals.push({ type: 'bearish', strength: 'medium', description: 'Short-term MA below long-term MA' });
    }

    // MACD
    if (indicators.macd.histogram > 0) {
      signals.push({ type: 'bullish', strength: 'medium', description: 'MACD histogram positive' });
    } else {
      signals.push({ type: 'bearish', strength: 'medium', description: 'MACD histogram negative' });
    }

    // Bollinger Bands
    const currentPrice = historicalData[historicalData.length - 1]?.close || 0;
    if (currentPrice < indicators.bollingerBands.lower) {
      signals.push({ type: 'oversold', strength: 'strong', description: 'Price below lower Bollinger Band' });
    } else if (currentPrice > indicators.bollingerBands.upper) {
      signals.push({ type: 'overbought', strength: 'strong', description: 'Price above upper Bollinger Band' });
    }

    // Volume Analysis
    if (indicators.volume > indicators.avgVolume * 1.5) {
      signals.push({ type: 'high_volume', strength: 'medium', description: 'High volume detected' });
    }

    return signals;
  }

  // Get overall recommendation
  getRecommendation(indicators) {
    const signals = this.generatePrediction(indicators, []);
    
    let bullishScore = 0;
    let bearishScore = 0;
    let neutralScore = 0;

    signals.forEach(signal => {
      const weight = signal.strength === 'strong' ? 3 : signal.strength === 'medium' ? 2 : 1;
      
      if (signal.type === 'bullish' || signal.type === 'oversold') {
        bullishScore += weight;
      } else if (signal.type === 'bearish' || signal.type === 'overbought') {
        bearishScore += weight;
      } else {
        neutralScore += weight;
      }
    });

    if (bullishScore > bearishScore + 2) {
      return 'BUY';
    } else if (bearishScore > bullishScore + 2) {
      return 'SELL';
    } else {
      return 'HOLD';
    }
  }

  // Calculate risk level
  calculateRiskLevel(indicators, historicalData) {
    let riskScore = 0;

    // Volatility risk
    if (historicalData.length > 20) {
      const recentPrices = historicalData.slice(-20).map(d => d.close);
      const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
      const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / recentPrices.length;
      const volatility = Math.sqrt(variance) / avgPrice;
      
      riskScore += volatility * 50;
    }

    // RSI risk
    if (indicators.rsi > 80 || indicators.rsi < 20) {
      riskScore += 30;
    } else if (indicators.rsi > 70 || indicators.rsi < 30) {
      riskScore += 20;
    }

    // Volume risk
    if (indicators.volume < indicators.avgVolume * 0.5) {
      riskScore += 15;
    }

    if (riskScore > 70) return 'HIGH';
    if (riskScore > 40) return 'MEDIUM';
    return 'LOW';
  }

  // Calculate target price
  calculateTargetPrice(indicators, historicalData) {
    const currentPrice = historicalData[historicalData.length - 1]?.close || 100;
    const recommendation = this.getRecommendation(indicators);
    
    let targetMultiplier = 1;
    
    if (recommendation === 'BUY') {
      targetMultiplier = 1.05 + (Math.random() * 0.1); // 5-15% upside
    } else if (recommendation === 'SELL') {
      targetMultiplier = 0.95 - (Math.random() * 0.05); // 5-10% downside
    } else {
      targetMultiplier = 0.98 + (Math.random() * 0.04); // Small range for HOLD
    }

    return Math.round(currentPrice * targetMultiplier * 100) / 100;
  }

  // Get best time to buy
  getBestTimeToBuy(indicators, historicalData) {
    const recommendation = this.getRecommendation(indicators);
    const riskLevel = this.calculateRiskLevel(indicators, historicalData);
    
    if (recommendation === 'SELL' || riskLevel === 'HIGH') {
      return {
        action: 'WAIT',
        reason: 'Current indicators suggest waiting for better entry point',
        timeframe: '1-2 weeks',
        conditions: ['RSI below 30', 'Price near support level', 'Volume confirmation']
      };
    } else if (recommendation === 'BUY' && riskLevel === 'LOW') {
      return {
        action: 'BUY_NOW',
        reason: 'Favorable conditions detected',
        timeframe: 'Immediate',
        conditions: ['RSI in optimal range', 'Positive momentum', 'Good risk/reward ratio']
      };
    } else {
      return {
        action: 'MONITOR',
        reason: 'Mixed signals - monitor for confirmation',
        timeframe: '2-3 days',
        conditions: ['Wait for clear breakout', 'Volume increase', 'RSI confirmation']
      };
    }
  }

  // Calculate confidence level
  calculateConfidence(indicators, historicalData) {
    let confidence = 50; // Base confidence

    // More historical data increases confidence
    if (historicalData.length > 50) confidence += 10;
    if (historicalData.length > 100) confidence += 10;

    // Strong signal alignment increases confidence
    const signals = this.generatePrediction(indicators, historicalData);
    const strongSignals = signals.filter(s => s.strength === 'strong').length;
    confidence += strongSignals * 5;

    // Volume confirmation
    if (indicators.volume > indicators.avgVolume) confidence += 5;

    // RSI in extreme zones increases confidence
    if (indicators.rsi < 20 || indicators.rsi > 80) confidence += 10;

    return Math.min(Math.max(confidence, 20), 95); // Keep between 20-95%
  }

  // Get multiple asset predictions
  async getBatchAnalysis(symbols) {
    const analyses = await Promise.all(
      symbols.map(async (symbol) => {
        const type = symbol.includes('USD') || symbol.includes('BTC') || symbol.includes('ETH') ? 'crypto' : 'stock';
        return await this.analyzeAsset(symbol, type);
      })
    );

    return analyses.sort((a, b) => b.confidence - a.confidence);
  }

  // Cache management
  getFromCache(key) {
    const cached = this.analysisCache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.analysisCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock analysis for demo
  getMockAnalysis(symbol, type) {
    const price = Math.random() * 1000 + 50;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / price) * 100;

    return {
      symbol,
      type,
      currentPrice: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      prediction: [
        { type: 'bullish', strength: 'medium', description: 'Positive momentum detected' }
      ],
      indicators: {
        rsi: Math.random() * 100,
        sma20: price + Math.random() * 10,
        sma50: price + Math.random() * 10,
        ema12: price + Math.random() * 10,
        ema26: price + Math.random() * 10,
        macd: {
          macd: (Math.random() - 0.5) * 10,
          signal: (Math.random() - 0.5) * 10,
          histogram: (Math.random() - 0.5) * 5
        },
        bollingerBands: {
          upper: price + Math.random() * 20,
          middle: price,
          lower: price - Math.random() * 20
        },
        volume: Math.floor(Math.random() * 10000000),
        avgVolume: Math.floor(Math.random() * 10000000)
      },
      recommendation: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)],
      riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      targetPrice: Math.round((price + (Math.random() - 0.5) * 50) * 100) / 100,
      timeToBuy: {
        action: ['BUY_NOW', 'WAIT', 'MONITOR'][Math.floor(Math.random() * 3)],
        reason: 'Mock analysis for demonstration',
        timeframe: '1-2 weeks',
        conditions: ['Mock condition 1', 'Mock condition 2']
      },
      confidence: Math.round(60 + Math.random() * 30),
      lastUpdate: new Date().toISOString()
    };
  }
}

// Create singleton instance
const predictionService = new PredictionService();

export default predictionService;
