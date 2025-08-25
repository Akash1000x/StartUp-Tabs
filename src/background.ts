import { chromeUtils } from './utils/chrome';

chrome.runtime.onStartup.addListener(async () => {
  try {
    const { websites } = await chromeUtils.getStorageData();

    if (websites.length === 0) return;

    const currentWindow = await chrome.windows.getCurrent();
    const tabs = await chrome.tabs.query({ windowId: currentWindow.id });

    const defaultTab = tabs.find(tab =>
      tab.url === 'chrome://newtab/' ||
      tab.url === 'about:newtab/' ||
      tab.url === 'chrome://new-tab-page/' ||
      tab.url === 'edge://newtab/' ||
      tab.url === 'about:blank'
    );

    if (defaultTab && websites.length > 0) {
      for (let i = 0; i < websites.length; i++) {
        await chrome.tabs.create({ url: websites[i].url });
      }
      await chrome.tabs.remove(defaultTab.id!);
    } else {
      for (const website of websites) {
        await chrome.tabs.create({ url: website.url });
      }
    }

  } catch (error) {
    console.error('Error opening websites on startup:', error);
  }
});