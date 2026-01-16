import axios from 'axios';
import { ENV } from '@/config/env';

class NewsService {
  constructor() {
    this.apiKey = null; // News service disabled in current configuration
    this.baseURL = 'https://www.alphavantage.co/query';
  }

  get isConfigured() {
    return !!this.apiKey;
  }

  async getNews() {
    if (!this.isConfigured) {
      return this.getMockNews();
    }

    try {
      const response = await axios.get(this.baseURL, {
        params: {
          apikey: this.apiKey,
          country: country,
          category: category,
          language: 'ar'
        }
      });

      return response.data.results || [];
    } catch (error) {
      console.error('❌ NewsService Error:', error.message);
      return this.getMockNews(category);
    }
  }

  getMockNews(category) {
    return [
      {
        article_id: 'mock-1',
        title: `خبر وهمي عن ${category}`,
        description: 'هذا مجرد نص تجريبي لأن الخدمة غير مفعلة حالياً.',
        link: '#',
        pubDate: new Date().toISOString(),
        source_id: 'mock-source'
      }
    ];
  }
}

export const newsService = new NewsService();
export default newsService;
