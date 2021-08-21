const {
  updateStreamerStatuses,
  openUrl,
  killBrowser,
} = require('./utils/browser-helper');

const { readDoneText, writeToDoneText } = require('./utils/file-system');
const { formattedLog } = require('./utils/logger');

let status = 'idle';
let currentStreamer;
let streamers;

function init() {
  formattedLog('Initializing Rust Dropper...');
  const p = new Promise((resolve) => {
    readDoneText().then((data) => {
      streamers = JSON.parse(data);
      let isFinished = streamers.every((curr) => curr.minsWatched >= 130);
      if (isFinished) status = 'finished';
      resolve();
    });
  });
  return p;
}

function run() {
  if (status === 'finished') {
    formattedLog('Done with all streamers. Exiting...');
    process.exit();
  }
  if (status === 'idle') {
    updateStreamerStatuses()
      .then((updatedStreamers) => {
        /// Updates the streamer object with the current live statuses.
        Object.keys(updatedStreamers).forEach((curr, i) => {
          streamers[i] = { ...streamers[i], live: updatedStreamers[curr].live };
        });
        writeToDoneText(JSON.stringify(streamers));

        // Changes status to finished if all streamers minsWatched are over 130;
        let isFinished = streamers.every((curr) => curr.minsWatched >= 130);
        if (isFinished) {
          status = 'finished';
          return;
        }

        let liveStreamers = Object.keys(updatedStreamers).filter(
          (curr) => updatedStreamers[curr].live === true //switch back to true when done debugging
        );

        if (liveStreamers.length === 0) {
          formattedLog('No streamers are live... (rechecking in 5mins)');
          return;
        }

        let filteredStreams = liveStreamers.filter(
          (liveStreamer) =>
            streamers.find((streamer) => streamer.name === liveStreamer)
              .minsWatched < 130
        );
        if (filteredStreams[0] !== undefined) {
          currentStreamer = filteredStreams[0];
          formattedLog(`Starting to watch ${currentStreamer}...`);
          openUrl(`https://www.twitch.tv/${currentStreamer}`);
          status = 'watching';
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }
  if (status === 'watching') {
    let currentStreamerIndex = streamers.findIndex(
      (streamer) => streamer.name === currentStreamer
    );
    streamers[currentStreamerIndex].minsWatched += 5;
    formattedLog(
      `Watching ${streamers[currentStreamerIndex].name}... TimeWatched: ${streamers[currentStreamerIndex].minsWatched} mins.`
    );

    /// Updates the streamer object with the current live statuses.
    updateStreamerStatuses()
      .then((updatedStreamers) => {
        Object.keys(updatedStreamers).forEach((curr, i) => {
          streamers[i] = { ...streamers[i], live: updatedStreamers[curr].live };
        });
      })
      .catch((err) => {
        console.log(err);
        return;
      });
    writeToDoneText(JSON.stringify(streamers));

    if (
      streamers[currentStreamerIndex].minsWatched >= 130 ||
      streamers[currentStreamerIndex].live === false
    ) {
      killBrowser();
      status = 'idle';
    }
  }
}

(async () => {
  await init();
  run();
  setInterval(() => {
    run();
  }, 300000);
})();
