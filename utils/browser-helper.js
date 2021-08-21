const fkill = require('fkill');
const findProcess = require('find-process');
const cp = require('child_process');
const { formattedLog } = require('./logger');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// The "\\" double back slash is needed when dealing with windows file-systems.
const BROWSER_LOCATION = 'c:\\Program Files\\Mozilla Firefox\\firefox.exe'; // Change to whatever location your browser is located. (has only been tested with firefox)
const BROWSER_PROCESS_NAME = 'firefox'; // Change to whatever the process name is of your browser. ex: 'firefox'

function killBrowser() {
  findProcess('name', BROWSER_PROCESS_NAME).then((curr) => {
    fkill(curr[0].pid).then(() => formattedLog('Killing current browser.'));
  });
}

function openUrl(url) {
  const proc = cp.spawn(BROWSER_LOCATION, ['-new-tab', url]);
}

function updateStreamerStatuses() {
  let streamers = {};
  let promise = new Promise((resolve, reject) => {
    fetch('https://twitch.facepunch.com/')
      .then((res) => res.text())
      .then((body) => {
        // Really nasty way of parsing the html using cheerio and creating a final object with the data we need. Ex: streamerName : {live: true}
        let statusList = [];
        const $ = cheerio.load(body);
        $('.streamer-name').each(
          (i, person) => (streamers[person.children[0].data.toLowerCase()] = {})
        );
        $('.online-status').each((i, status) => {
          const isLive =
            status.children[0].data.toLowerCase().trim() === 'live'
              ? true
              : false;
          statusList.push(isLive);
        });
        Object.keys(streamers).forEach(
          (key, i) => (streamers[key] = { live: statusList[i] })
        );
        formattedLog('Updating streamer statuses...');
        // Returns a new object with the current streamers statuses.
        resolve(streamers);
      });
  }).catch((err) => reject(err));

  return promise;
}

module.exports = { openUrl, killBrowser, updateStreamerStatuses };
