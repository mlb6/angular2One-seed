/*
 * karma.conf.js optionally load this
 */
var sauceConfig = require('./../config').sauce;

module.exports = function(options) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
    process.exit(1);
  }

  options.sauceLabs = {
    testName: sauceConfig.testName,
    startConnect: true
  };
  options.customLaunchers = sauceConfig.launchers;
  options.browsers = Object.keys(sauceConfig.launchers);
  options.reporters = (options.reporters || [] ).concat(['dots', 'saucelabs']);

};
