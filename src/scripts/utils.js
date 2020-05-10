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

const getSitelinksByIMDbId = imdbId => {
  const query = `
        SELECT  ?link ?lang ?name
        WHERE
        {
            ?item wdt:P345 "${imdbId}".
            ?item wdt:P364 ?filmLang.
            ?filmLang wdt:P424 ?wikiLang.
            ?link schema:about ?item;
                    schema:inLanguage ?lang ;
                    schema:name ?name ;
                    schema:isPartOf [ wikibase:wikiGroup "wikipedia" ] .
            FILTER(?lang in ('zh', 'en') || ?lang = ?wikiLang ) .
        }
    `;
  const url = wbk.sparqlQuery(query);

  return fetch(url)
    .then(r => r.json())
    .then(result => {
      const items = wbk.simplify.sparqlResults(result);
      items.sort((a, b) => {
        return compareLangValue(a.lang) - compareLangValue(b.lang);
      });

      return items;
    });
};

const htmlToElements = html => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
};

export default {getSitelinksByIMDbId, htmlToElements};
export {getSitelinksByIMDbId, htmlToElements};
