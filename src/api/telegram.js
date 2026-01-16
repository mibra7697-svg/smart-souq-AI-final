
import { ENV } from '@/config/env';

const ADMIN_CHAT_ID = ENV.telegram.adminChatId;

/**
 * Sends a notification to the admin when a new agent joins.
 * @param {Object} agentData - The data submitted by the potential agent.
 * @returns {Promise<boolean>} - True if sent successfully, false otherwise.
 */
export const notifyNewAgent = async (agentData) => {
  if (!ADMIN_CHAT_ID) {
    console.warn('Telegram admin chat id is missing in .env');
    return false;
  }

  try {
    const pending = JSON.parse(localStorage.getItem('smartSouq:telegramQueue') || '[]');
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: Date.now(),
      type: 'new_agent',
      chatId: ADMIN_CHAT_ID,
      payload: {
        name: agentData?.name,
        email: agentData?.email,
        phone: agentData?.phone,
      }
    };
    localStorage.setItem('smartSouq:telegramQueue', JSON.stringify([entry, ...pending].slice(0, 100)));
    console.warn('Telegram notifications are disabled in client builds. Event queued locally.');
    return false;
  } catch (error) {
    console.error('Error queuing Telegram notification:', error);
    return false;
  }
};
