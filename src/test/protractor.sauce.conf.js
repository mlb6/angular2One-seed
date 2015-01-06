'use strict';

require('traceur/bin/traceur-runtime');

var sauceConfig = require('./../../config').sauce;
var config = require('./protractor.conf').config;

config.sauceUser = sauceConfig.userName;
config.sauceKey = sauceConfig.accessKey.split("").reverse().join("");

config.capabilities={};
config.multiCapabilities=[];
for(var launcherKey in sauceConfig.launchers){
  var launcher = sauceConfig.launchers[launcherKey];

  launcher.name=sauceConfig.testName+" E2E";
  launcher.build="TRAVIS #" + process.env.TRAVIS_BUILD_NUMBER + " (" + process.env.TRAVIS_BUILD_ID + ")";
  launcher["tunnel-identifier"]=process.env.TRAVIS_JOB_NUMBER;

  config.multiCapabilities.push(launcher);
}

console.log(config.multiCapabilities);

exports.config = config;
