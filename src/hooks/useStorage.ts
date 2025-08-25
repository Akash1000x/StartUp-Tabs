import { useState, useEffect } from 'react';
import { Website } from '../types';
import { chromeUtils } from '../utils/chrome';

export function useStorage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { websites } = await chromeUtils.getStorageData();
        setWebsites(websites);
      } catch (error) {
        console.error('Error loading data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          await chromeUtils.setStorageData({ websites });
        } catch (error) {
          console.error('Error saving data to storage:', error);
        }
      };

      saveData();
    }
  }, [websites, isLoading]);

  const addWebsite = (url: string) => {
    const website: Website = {
      id: Date.now().toString(),
      url,
    };
    setWebsites(prev => [...prev, website]);
  };

  const removeWebsite = (id: string) => {
    setWebsites(prev => prev.filter(w => w.id !== id));
  };

  const updateWebsite = (id: string, newUrl: string) => {
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, url: newUrl } : w));
  };

  const reorderWebsites = (newWebsites: Website[]) => {
    setWebsites(newWebsites);
  };

  return {
    websites,
    isLoading,
    addWebsite,
    removeWebsite,
    updateWebsite,
    reorderWebsites,
  };
}
