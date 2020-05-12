import wikibaseSdk from 'wikibase-sdk';

const wbk = wikibaseSdk({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql',
});

const compareLangValue = lang => {
  if (lang === 'zh') {
    return -1;
  }

  if (lang === 'en') {
    return 0;
  }

  return 1;
};

const filterWikimediaQuery = `
  ?link schema:about ?item;
  schema:inLanguage ?lang ;
  schema:isPartOf [ wikibase:wikiGroup "wikipedia" ] .
  FILTER(?lang in ('zh', 'en') || ?lang = ?wikiLang ) .
`;

const genSubjectQuery = (doubanId, imdbId) => `
  SELECT DISTINCT ?link ?lang
  WHERE
  {
    {
      ?item wdt:P4529 "${doubanId}".
    } UNION {
      ?item wdt:P345 "${imdbId}".
    }

    OPTIONAL {
        ?item wdt:P364 ?filmLang.
        ?filmLang wdt:P424 ?wikiLang.
    }

    ${filterWikimediaQuery}
  }
`;

const genCelebrityQuery = (doubanId, imdbId) => `
  SELECT DISTINCT ?link ?lang
  WHERE
  {
    {
      ?item wdt:P5284 "${doubanId}".
    } UNION {
      ?item wdt:P345 "${imdbId}".
    }

    OPTIONAL {
      # Language speak
      ?item wdt:P1412 ?speakLang.
      ?speakLang wdt:P424 ?wikiLang.
    }

    ${filterWikimediaQuery}
  }
`;

const getSitelinksByQuery = query => {
  const url = wbk.sparqlQuery(query);
  console.log('rul', url);

  return fetch(url)
    .then(r => {
      console.log('r', r);
      return r.json();
    })
    .then(result => {
      console.log('result', result);
      const items = wbk.simplify.sparqlResults(result);
      items.sort((a, b) => {
        return compareLangValue(a.lang) - compareLangValue(b.lang);
      });

      return items;
    })
    .catch(error => {
      console.log('error', error);
    });
};

const getSubjectSitelinks = (doubanId, imdbId) => {
  const query = genSubjectQuery(doubanId, imdbId);

  return getSitelinksByQuery(query);
};

const getCelebritySitelinks = (doubanId, imdbId) => {
  const query = genCelebrityQuery(doubanId, imdbId);
  return getSitelinksByQuery(query);
};

export default {getSubjectSitelinks, getCelebritySitelinks};
export {getSubjectSitelinks, getCelebritySitelinks};
