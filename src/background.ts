import { chromeUtils } from './utils/chrome';

chrome.runtime.onStartup.addListener(async () => {
  try {
    const { websites } = await chromeUtils.getStorageData();

    for (const website of websites) {
      await chrome.tabs.create({ url: website.url });
    }

  } catch (error) {
    console.error('Error opening websites on startup:', error);
  }
});