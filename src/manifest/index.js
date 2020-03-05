const pkg = require('../../package.json');

const manifestInput = {
    manifest_version: 2,
    name: 'doubanIMDb',
    version: pkg.version,

    icons: {
        '128': 'assets/icons/favicon-128.png',
    },

    description: 'douban movie + IMDb + Rotten Tomatoes',
    homepage_url: 'https://github.com/lisongx/doubanIMDb/',
    short_name: 'douban IMDb',

    permissions: [
        'activeTab',
        '*://movie.douban.com/*',
        'https://douban-imdb-api.herokuapp.com/'
    ],

    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

    '__chrome|firefox__author': 'Li Song',
    __opera__developer: {
        name: 'lisong',
    },

    // __firefox__applications: {
    //     gecko: { id: '{754FB1AD-CC3B-4856-B6A0-7786F8CA9D17}' },
    // },

    __chrome__minimum_chrome_version: '49',
    __opera__minimum_opera_version: '36',

    '__chrome|opera__options_page': 'fancy-settings/source/index.html',

    options_ui: {
        page: 'fancy-settings/source/index.html',
        open_in_tab: true,
        __chrome__chrome_style: false,
    },

    background: {
        scripts: ['js/fancySettings.bundle.js', 'js/background.bundle.js'],
        '__chrome|opera__persistent': false,
    },

    content_scripts: [
        {
            matches: ['*://movie.douban.com/*'],
            js: ['js/contentScript.bundle.js'],
        },
    ],
};

module.exports = manifestInput;
