const express = require('express');
const apicache = require('apicache');
const PORT = process.env.PORT || 5000;
const {JSDOM} = require('jsdom');
const wdk = require('wikidata-sdk');
const request = require('request-promise');
const redisClient = require('redis').createClient(process.env.REDIS_URL);

const ZENSCRAPE_API = 'https://app.zenscrape.com/api/v1/get';

const trimDomString = val => {
  return val.replace(/(\r\n|\n|\r)/gm, '').trim();
};

let cache = apicache.options({redisClient}).middleware;

const onlyStatus200 = (req, res) => res.statusCode === 200;

const setResponseHeaders = res => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'max-age=216000',
  });
};

const getRottenIdByimdbId = imdbId => {
  const sparql = `
        SELECT ?rottenId
        WHERE
        {
            ?item wdt:P345 "${imdbId}".
            ?item wdt:P1258 ?rottenId
        }
    `;
  const uri = wdk.sparqlQuery(sparql);
  const options = {
    uri: uri,
    headers: {
      Accept: 'application/sparql-results+json',
      'User-Agent': 'doubanIMDb/0.01',
    },
    json: true,
  };

  return request(options)
    .then(wdk.simplify.sparqlResults)
    .then(results => {
      if (results.length > 0) {
        return results[0].rottenId;
      } else {
        throw Error('No rotten tomato id found');
      }
    });
};

const imdbView = (req, res) => {
  const imdbId = req.params.imdbId;
  if (!imdbId) {
    res.status(400);
    return res.json({error: 'you need give me an imdb id'});
  }

  const pageUrl = `http://www.imdb.com/title/${imdbId}`;

  const parseRankValFromElement = rankElement => {
    const rankText = trimDomString(rankElement.textContent);
    return rankText.replace('Top Rated Movies', 'Top');
  };

  return request(pageUrl)
    .then(body => {
      const dom = new JSDOM(body);
      const document = dom.window.document;
      const ratingElement = document.querySelector(
        'span[itemprop=ratingValue]',
      );
      const rating = ratingElement ? ratingElement.textContent : '';
      const rankElement = document.querySelector('#titleAwardsRanks strong');
      const rank = rankElement ? parseRankValFromElement(rankElement) : '';
      setResponseHeaders(res);
      return res.json({rating, rank});
    })
    .catch(e => {
      console.log('error', e);
      res.status(500);
      return res.json({
        score: null,
        error: 'Not be able to find the rotten tomato id',
      });
    });
};

const rottenView = (req, res) => {
  const imdbId = req.params.imdbId;
  if (!imdbId) {
    res.status(400);
    return res.json({error: 'you need give me an imdb id'});
  }

  return getRottenIdByimdbId(imdbId)
    .then(rottenId => {
      const url = `https://www.rottentomatoes.com/${rottenId}`;
      const options = {
        uri: ZENSCRAPE_API,
        qs: {
          url,
        },
        headers: {
          Referer: 'https://www.rottentomatoes.com/',
          apikey: process.env.ZENSCCRAPE_KEY,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
        },
      };
      return request(options);
    })
    .then(body => {
      const dom = new JSDOM(body);
      const document = dom.window.document;
      const meterElement = document.querySelector('#tomato_meter_link');
      const score = meterElement
        ? parseInt(trimDomString(meterElement.textContent))
        : '';
      res.set({
        'content-type': 'application/json',
      });
      setResponseHeaders(res);
      return res.json({score});
    })
    .catch(e => {
      console.log('error', e.message);
      res.status(500);
      return res.json({score: null, error: e.message});
    });
};

express()
  .get('/imdb/:imdbId', cache('5 hours', onlyStatus200), imdbView)
  .get('/rotten/:imdbId', cache('3 days', onlyStatus200), rottenView)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
