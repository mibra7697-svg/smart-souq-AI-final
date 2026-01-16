import useSWR from 'swr';
import axios from 'axios';
import { ENV } from '@/config/env';

const fetcher = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Fetcher Error:', error.message);
    throw error;
  }
};

const MOCK_NEWS = [
  {
    id: 'mock-1',
    title: 'تنبيه: خدمة الأخبار متوقفة حالياً',
    description: 'تم إيقاف خدمة NewsData في التحديث الأخير. يرجى مراجعة الإعدادات.',
    content: 'تم إيقاف خدمة NewsData في التحديث الأخير. يرجى مراجعة الإعدادات.',
    url: '#',
    image: null,
    publishedAt: new Date().toISOString(),
    source: 'Smart Souq System',
    category: 'system',
    language: 'ar'
  }
];

export const useArabicTechNews = () => {
  // NewsData removed in new config
  return {
    articles: MOCK_NEWS,
    isLoading: false,
    error: null,
    mutate: () => {},
    isEmpty: false
  };
};

export const useArabicFinanceNews = () => {
  // NewsData removed in new config
  return {
    articles: MOCK_NEWS,
    isLoading: false,
    error: null,
    mutate: () => {},
    isEmpty: false
  };
};

export const useCombinedArabicNews = () => {
  return {
    articles: MOCK_NEWS,
    isLoading: false,
    error: null,
    mutate: () => {},
    isEmpty: false
  };
};
