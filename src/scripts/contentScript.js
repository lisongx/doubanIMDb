import browser from 'webextension-polyfill';
import {getSubjectSitelinks, getCelebritySitelinks} from './utils';
import templates from './templates';

const BASE_URL = 'https://douban-imdb-api.herokuapp.com';

const DOUBAN_IMDB_LINK_TEXT = 'IMDb链接:';

const DOUBAN_CELEBRITY_IMDB_LINK_TEXT = 'imdb编号';

const getImageUrl = type => {
  return browser.runtime.getURL(`assets/${type}.png`);
};

const SUBJECT_PAGE_RE = /\/subject\/\d+\//;
const CELEBRITY_PAGE_RE = /\/celebrity\/\d+\//;

const isSubjectPath = pathPath => {
  return SUBJECT_PAGE_RE.test(pathPath);
};

const isCelebrityPath = pathPath => {
  return CELEBRITY_PAGE_RE.test(pathPath);
};

const getSubjectImdbId = () => {
  const imdbAttr = Array.from(
    document.querySelectorAll('#info span.pl'),
  ).filter(el => {
    return el.textContent && el.textContent === DOUBAN_IMDB_LINK_TEXT;
  })[0];

  if (imdbAttr) {
    return imdbAttr.nextElementSibling.textContent;
  }
};

const getCelebrityImdbId = () => {
  const imdbAttr = Array.from(
    document.querySelectorAll('#headline div.info ul li span'),
  ).filter(el => {
    return el.textContent && el.textContent === DOUBAN_CELEBRITY_IMDB_LINK_TEXT;
  })[0];

  if (imdbAttr) {
    return imdbAttr.nextElementSibling.textContent;
  }
};

class Application {
  constructor() {
    this.pagePath = window.location.pathname;
  }

  run() {
    if (isSubjectPath(this.pagePath)) {
      const doubanId = this.pagePath.split('/')[2];

      if (doubanId) {
        this.injectSubjectView(doubanId);
      }
    } else if (isCelebrityPath(this.pagePath)) {
      const celebrityId = this.pagePath.split('/')[2];

      if (celebrityId) {
        this.injectCelebrityView(celebrityId);
      }
    }
  }

  injectSubjectView = doubanId => {
    const imdbId = getSubjectImdbId();
    const imdbUrl = `${BASE_URL}/imdb/${imdbId}`;
    const rottenUrl = `${BASE_URL}/rotten/${imdbId}`;

    browser.runtime
      .sendMessage('get-settings')
      .then(({enableIMDb, enableRotten, enableWikipedia}) => {
        if (enableIMDb && imdbUrl) {
          this.injectImdb(imdbUrl);
        }

        if (enableRotten && rottenUrl) {
          this.injectRotten(rottenUrl);
        }

        if (enableWikipedia && doubanId) {
          this.injectWikipedia(doubanId, imdbId);
        }
      });
  };

  injectCelebrityView = celebrityId => {
    const imdbId = getCelebrityImdbId();

    browser.runtime.sendMessage('get-settings').then(({enableWikipedia}) => {
      if (enableWikipedia) {
        this.injectCelebrityWikipedia(celebrityId, imdbId);
      }
    });
  };

  injectImdb = url => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // TODO: tidy up this bit with mustache template

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

  injectRotten = url => {
    fetch(this.url)
      .then(res => {
        return res.json();
      })
      .then(({score}) => {
        // TODO: tidy up this bit with mustache template

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

  injectWikipedia = (doubanId, imdbId) => {
    getSubjectSitelinks(doubanId, imdbId).then(sitelinks => {

      if (sitelinks.length > 0) {
        const wpSection = templates.renderWikipediaSection(sitelinks);
        const infoSection = document.getElementById('info');
        infoSection.insertAdjacentHTML('beforeend', wpSection);
      }
    });
  };

  injectCelebrityWikipedia = (celebrityId, imdbId) => {
    getCelebritySitelinks(celebrityId, imdbId).then(sitelinks => {
      if (sitelinks.length > 0) {
        const wpSection = templates.renderCelebrityWikipediaSection(sitelinks);
        const infoSection = document.querySelector('#headline div.info ul');
        infoSection.insertAdjacentHTML('beforeend', wpSection);
      }
    });
  };
}

const app = new Application();
app.run();
