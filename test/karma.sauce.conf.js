/*
 * karma.conf.js optionally load this
 */
var sauceConfig = require('./../config').sauce;

module.exports = function(options) {
  options.sauceLabs = {
    testName: sauceConfig.testName,
    startConnect: true
  };
  options.customLaunchers = sauceConfig.launchers;
  options.browsers = Object.keys(sauceConfig.launchers);
  options.reporters = ['dots', 'saucelabs'];
};
