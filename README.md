# doubanIMDb

豆瓣电影 + IMDb + 烂番茄 + 维基百科

![screenshots](http://i.imgur.com/U6MGE.jpg)

[chrome_store_link]: https://chrome.google.com/webstore/detail/doubanimdb/nfibbjnhkbjlgjaojglmmibdjicidini

- [在Chrome安装][chrome_store_link]

- [在Firefox安装](https://addons.mozilla.org/en-GB/firefox/addon/douban-imdb/?src=search)

- [在Opera安装][chrome_store_link]

## Features

* IMDb的电影评分
* IMDb TOP250
* 烂番茄TOMATOMETER

## Setup

Ensure you have
- [Node.js](https://nodejs.org) 10 or later installed
- [Yarn](https://yarnpkg.com) v1 or v2 installed

Then run the following:
- `yarn install` to install dependencies.
- `yarn run dev:chrome` to start the development server for chrome extension
- `yarn run dev:firefox` to start the development server for firefox addon
- `yarn run dev:opera` to start the development server for opera extension
- `yarn run build:chrome` to build chrome extension
- `yarn run build:firefox` to build firefox addon
- `yarn run build:opera` to build opera extension

### Development

- To watch file changes in developement

  - Chrome
    - `yarn run dev:chrome`
  - Firefox
    - `yarn run dev:firefox`

- **Load extension in browser**

  - ### Chrome

    - Go to the browser address bar and type `chrome://extensions`
    - Check the `Developer Mode` button to enable it.
    - Click on the `Load Unpacked Extension…` button.
    - Select your extension’s extracted directory.

  - ### Firefox

    - Load the Add-on via `about:debugging` as temporary Add-on.
    - Choose the `manifest.json` file in the extracted directory

## Contributor

* @lisongx
* @ayanamist

## Feedback

请使用Issues来反馈你遇到的问题;)

## License

[MIT](https://github.com/lisongx/doubanIMDb/blob/master/LICENSE)

## Reference

Thanks to the great [Web Extension Starter](https://github.com/abhijithvijayan/web-extension-starter).
