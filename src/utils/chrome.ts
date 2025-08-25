import { Website } from '../types';

export const chromeUtils = {
  async getStorageData(): Promise<{ websites: Website[] }> {
    const result = await chrome.storage.local.get(['websites']);
    return {
      websites: result.websites || [],
    };
  },

  async setStorageData(data: { websites: Website[] }): Promise<void> {
    await chrome.storage.local.set(data);
  },

};
