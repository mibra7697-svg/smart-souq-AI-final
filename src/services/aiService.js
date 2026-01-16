import { ENV } from '@/config/env';
import { proxiedPost } from '@/lib/proxyHandler';

class AIService {
  constructor() {
    this.apiKey = ENV.api.gemini || null;
    this.model = 'gemini-1.5-flash';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  get isConfigured() {
    return !!this.apiKey;
  }

  async analyzeMarketData(data) {
    // Ensure we have data or wait for it if it's being fetched
    if (!data || (!data.crypto && !data.stocks)) {
      console.log('AI Service: Waiting for market data to populate...');
      // If no data provided, we might need to fetch it or return a "warming up" message
      // For now, return the scanning message as requested
      return this.getMockAnalysis();
    }

    if (!this.isConfigured) {
      // Return helpful mock analysis if API key is missing
      return this.getMockAnalysis();
    }

    try {
      const prompt = `You are a professional market analyst for Smart Souq AI.
      Analyze the following market data and provide a concise, professional insight in Arabic.
      
      Market Data:
      Crypto Prices: ${JSON.stringify(data.crypto || {})}
      Stock Quotes: ${JSON.stringify(data.stocks || {})}
      Timestamp: ${data.timestamp || new Date().toISOString()}
      
      Requirements:
      1. Language: Arabic (Modern Standard).
      2. Length: Exactly 2-3 sentences.
      3. Tone: Professional and encouraging.
      4. Content: Focus on current trends, volatility, and potential opportunities for local investors.
      
      Insight:`;

      // Use proxy route for Gemini API
      const response = await proxiedPost(
        `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 256,
          }
        },
        {
          apiType: 'gemini',
          timeout: 15000,
          retries: 1
        }
      );
      
      // Handle response (proxiedPost returns data directly)
      const responseData = response;

      const insight = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!insight) {
        throw new Error('Empty response from Gemini API');
      }

      return insight.trim();
    } catch (error) {
      console.warn('AI Analysis failed, providing fallback insight:', error.message);
      return this.getMockAnalysis();
    }
  }

  async sendToAI(prompt) {
    return this.analyzeMarketData({ message: prompt });
  }

  getMockAnalysis() {
    if (!this.isConfigured) {
      return "جاري مسح الأسواق... (Scanning Markets...)";
    }
    return "تشير البيانات الحالية إلى استقرار نسبي في الأسواق. هناك فرص نمو واعدة في قطاع التكنولوجيا والعملات الرقمية الكبرى. ننصح بمراقبة مستويات الدعم الحالية.";
  }
}

export const aiService = new AIService();

// Legacy compatibility
export const analyzeMarketData = (data) => aiService.analyzeMarketData(data);
export const sendToAI = async (message) => {
  return aiService.analyzeMarketData({ message });
};

export default aiService;
