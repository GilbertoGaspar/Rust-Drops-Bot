const fs = require('fs');
const { formattedLog } = require('./logger');

function readDoneText() {
  const p = new Promise((resolve, reject) => {
    try {
      fs.readFile('done.txt', (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
  return p;
}

function writeToDoneText(text) {
  try {
    fs.writeFile('done.txt', text, 'utf8', (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  readDoneText,
  writeToDoneText,
};
