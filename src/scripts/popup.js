import browser from 'webextension-polyfill';

function openWebPage(url) {
  return browser.tabs.create({url});
}

const feedbackLink = 'https://jinshuju.net/f/3hBRzr';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('open-options').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
  });

  document.getElementById(
    'ext-version',
  ).textContent = browser.runtime.getManifest().version;

  document.getElementById('donate-button').addEventListener('click', () => {
    openWebPage('https://www.buymeacoffee.com/YB5xwrn');
  });

  document.getElementById('author-link').addEventListener('click', () => {
    openWebPage('https://notimportant.org/');
  });

  document.getElementById('feedback-button').addEventListener('click', () => {
    openWebPage(feedbackLink);
  });
});
