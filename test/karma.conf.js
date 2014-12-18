// Karma configuration

var PRJ_CONFIG  = require('./../config');
var path = require('path');


var traceurOptions = PRJ_CONFIG.traceur.dev;

module.exports = function(config) {

  //var isWebstorm = /karma-intellij/.test(process.argv[1]);
  var files = [
      {pattern:'../../node_modules/traceur/bin/traceur-runtime.js', included: false, watched:false},
      {pattern:'../../node_modules/rtts-assert/dist/amd/assert.js', included: false, watched:false},
      {pattern: '**/*.js', included: false},
      {pattern: '../'+PRJ_CONFIG.path.test.unit + '/**/*.js', included: false}
    ];


  files = [
    // The entry point that dynamically imports all the tests.
    {pattern: '../../'+PRJ_CONFIG.path.src+'/require.config.js', included: true},
    {pattern: '../../'+PRJ_CONFIG.path.test.unit +'/main.js', included: true}
  ].concat(files);


  config.set({
    frameworks: ['jasmine', 'requirejs', 'sourcemaps'],

    basePath:'../build/src',

    files: files,

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type:'lcov',
      dir: '../reports/coverage'
    },

    preprocessors: {
      '**/*.js': ['coverage']
    },

    //logLevel:config.LOG_DEBUG,

    browsers: ['Chrome']
  });

  config.plugins.push(require('./karma_sourcemaps'));
};
