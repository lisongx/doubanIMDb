import mustache from 'mustache';

const renderWikipediaSection = sitelinks => {
  const template = `
        <span class="pl">维基百科:</span>
        {{#sitelinks}}
            <a href="{{{link}}}" target="_blank" rel="nofollow">{{{lang}}}</a>
        {{/sitelinks}}
        <br>
    `;
  return mustache.render(template, {sitelinks});
};

const renderCelebrityWikipediaSection = sitelinks => {
  const template = `
      <li>
        <span>维基百科:</span>
        {{#sitelinks}}
        <a href="{{{link}}}" target="_blank" rel="nofollow">{{{lang}}}</a>
        {{/sitelinks}}
      </li>
    `;
  return mustache.render(template, {sitelinks});
};

export default {renderWikipediaSection, renderCelebrityWikipediaSection};
export {renderWikipediaSection, renderCelebrityWikipediaSection};
