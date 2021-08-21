<h1 align="center">Rust Drops Bot</h1>

<p>

<img  src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />

</p>

> Bot that watches Rust twitch streams for you so you can get the twitch item drops. This project was built using NodeJS and cheerio.

## Install

```sh
- npm install
```

### Setup

```sh
- Changes to file "utils/browser-helper.js"

- The "\\" double back slash is needed when dealing with windows file-systems.
1. Replace "const BROWSER_LOCATION = 'c:\\Program Files\\Mozilla Firefox\\firefox.exe';"
- Change to whatever location your browser is located. (has only been tested with firefox)
2. Replace "const BROWSER_PROCESS_NAME = 'firefox';"
- Change to whatever the process name is of your browser. ex: 'firefox'
```

## Usage

```sh
- npm run setup
-- Open file 'done.txt', scroll all the way to the end, and write 999 for minsWatched on Youtube streamers or empty objects.
 ex: {"name":"someYoutuber","url":"https://www.twitch.tv/someYoutuber","minsWatched":999,"live":false}
- npm run start
```

## Author

👤 **Gilberto Gaspar**

- Github: [@GilbertoGaspar](https://github.com/GilbertoGaspar)
