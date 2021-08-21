function formattedLog(message) {
  const time = Date().split(' GMT')[0];

  console.log(`[${time}]: ${message}`);
}

module.exports = {
  formattedLog,
};
