const { updateStreamerStatuses } = require('./utils/browser-helper');
const { formattedLog } = require('./utils/logger');
const { writeToDoneText } = require('./utils/file-system');

updateStreamerStatuses().then((streamers) => {
  formattedLog('Setting up done.txt');
  const formattedStreamers = Object.keys(streamers).map((streamer) => ({
    name: streamer,
    url: `https://www.twitch.tv/${streamer}`,
    minsWatched: 0,
  }));

  writeToDoneText(JSON.stringify(formattedStreamers));
});
