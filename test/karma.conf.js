// Karma configuration

var pathConfig  = require('./../config').path;

var sauceConfig = require('./karma.sauce.conf');
var travisConfig = require('./karma.travis.conf');

var basePath = '../build/src';
var prjRootPath = '../..';
var nodeModulesPath = prjRootPath + '/node_modules';
var buildSrcPath = prjRootPath +'/'+ pathConfig.build +'/'+ pathConfig.src ;
var buildTestPath = prjRootPath +'/'+ pathConfig.build +'/'+ pathConfig.test.unit ;
var srcPath = prjRootPath  +'/'+ pathConfig.src ;
var testPath = prjRootPath  +'/'+ pathConfig.test.unit ;



module.exports = function(config) {

  var files = [
    // requirejs config to load in tests (some part of it will be override in main.js)
    {pattern: srcPath + '/require.config.js', included: true},

    // The entry point that dynamically imports all the tests.
    {pattern: testPath +'/main.js', included: true, watched:false},

    // node modules libraries
    {pattern: nodeModulesPath+'/traceur/bin/traceur-runtime.js', included: false, watched:false},
    {pattern: nodeModulesPath+'/rtts-assert/dist/amd/assert.js', included: false, watched:false},

    // transpiled sources
    {pattern: buildSrcPath+'/**/*.js', included: false},
    {pattern: buildTestPath + '/**/*.js', included: false}
  ];


  var options = {
    frameworks: ['jasmine', 'requirejs', 'sourcemaps'],

    basePath: basePath,

    files: files,

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type:'lcov',
      dir: prjRootPath +'/'+ pathConfig.test.coverage
    },

    preprocessors: {
      '**/*.js': ['coverage']
    },

    //logLevel:config.LOG_DEBUG,

    browsers: ['Chrome']
  };

  // Apply sauce specific options
  if (process.argv.indexOf('--sauce') > -1) {
    sauceConfig(options);
    travisConfig(options);
  }

  config.set(options);
  config.plugins.push(require('./karma_sourcemaps'));

};
