import browser from 'webextension-polyfill';
import {getSitelinksByIMDbId} from './utils';
import templates from './templates';

const BASE_URL = 'https://douban-imdb-api.herokuapp.com';

// TODO: Move this to templates.js
const DOUBAN_IMDB_LINK_TEXT = 'IMDb链接:';

const getPageImdbId = () => {
  const imdbAttr = Array.from(
    document.querySelectorAll('#info span.pl'),
  ).filter(el => {
    return el.textContent && el.textContent === DOUBAN_IMDB_LINK_TEXT;
  })[0];

  if (imdbAttr) {
    return imdbAttr.nextElementSibling.textContent;
  }
};

const getImageUrl = type => {
  return browser.runtime.getURL(`assets/${type}.png`);
};

class Application {
  constructor() {
    this.imdbId = getPageImdbId();
    this.imdbUrl = `${BASE_URL}/imdb/${this.imdbId}`;
    this.rottenUrl = `${BASE_URL}/rotten/${this.imdbId}`;

    if (this.imdbId) {
      this.injectView();
    }
  }

  injectView = () => {
    browser.runtime
      .sendMessage('get-settings')
      .then(({enableIMDb, enableRotten, enableWikipedia}) => {
        if (enableIMDb) {
          this.injectImdb();
        }

        if (enableRotten) {
          this.injectRotten();
        }

        if (enableWikipedia) {
          this.injectWikipedia();
        }
      });
  };

  injectImdb = () => {
    fetch(this.imdbUrl)
      .then(res => res.json())
      .then(data => {
        const doubanRatingElement = document.querySelector('strong.rating_num');
        // get the raing, set to empty string if null
        const rating = data.rating || '';

        if (rating === '') {
          return;
        }
        const rank = data.rank || '';

        const imdbElement = document.createElement('div');
        imdbElement.innerHTML = `
                    <span>IMDb:${rating}</span> <b>${rank}</b>
                `;

        imdbElement.style.cssText = `
                    color: green;
                    clear: left;
                    font-size: 14px;
                    line-height: 18px;
                `;

        imdbElement.childNodes[1].style.cssText = `
                    margin-left: 4px;
                    color: red;
                `;

        doubanRatingElement.insertAdjacentElement('afterend', imdbElement);
      });
  };

  injectRotten = () => {
    fetch(this.rottenUrl)
      .then(res => {
        return res.json();
      })
      .then(({score}) => {
        if (score === null || score === undefined) {
          return;
        }

        let color;
        let type;
        let text;

        if (score === -1) {
          color = 'grey';
          type = 'none';
          text = 'N/A';
        } else {
          text = `${score}%`;
          if (score >= 60) {
            color = 'red';
            type = 'fresh';
          } else {
            color = 'green';
            type = 'rotten';
          }
        }

        const rottenElement = document.createElement('span');
        rottenElement.setAttribute('dir', 'ltr');
        rottenElement.innerHTML = `
                    <img width="25px" src="${getImageUrl(
                      type,
                    )}" /><b>${text}</b>
                `;

        rottenElement.style.cssText = `
                    color: ${color};
                    margin-left: 10px;
                `;
        rottenElement.childNodes[1].style.cssText = 'margin-left: 2px';

        document
          .querySelector('span.year')
          .insertAdjacentElement('afterend', rottenElement);
      })
      .catch(function(error) {
        console.log('rotten fetch error', error);
      });
  };

  injectWikipedia = () => {
    getSitelinksByIMDbId(this.imdbId).then(sitelinks => {
      if (sitelinks.length > 0) {
        const wpSection = templates.renderWikipediaSection(sitelinks);
        const infoSection = document.getElementById('info');
        infoSection.insertAdjacentHTML('beforeend', wpSection);
      }
    });
  };
}

new Application();
