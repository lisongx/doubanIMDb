import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
  // eslint-disable-next-line no-console
  console.log('onInstalled....');
});

// This is from fancy setting
// eslint-disable-next-line no-undef
const settings = new Store('settings', {
  enableIMDb: true,
  enableRotten: true,
  enableWikipedia: true,
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'get-settings') {
    sendResponse(settings.toObject());
  }
});
