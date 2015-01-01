// Karma configuration

var pathCfg  = require('./../../config').path;

var sauceConfig = require('./karma.sauce.conf.js');
var travisConfig = require('./karma.travis.conf.js');

var basePath = '../../build/main';
var prjRootPath = '../..';
var nodeModulesPath = prjRootPath + '/node_modules';
var buildMainPath = prjRootPath +'/'+ pathCfg.dest.buildMain;
var buildTestPath = prjRootPath +'/'+ pathCfg.dest.buildUnit
var mainPath = prjRootPath  +'/'+ pathCfg.src.main ;
var unitTestPath = prjRootPath  +'/'+ pathCfg.src.unit ;



module.exports = function(config) {

  var files = [
    // requirejs config to load in tests (some part of it will be override in main.ats)
    {pattern: mainPath + '/require.config.js', included: true},

    // The entry point that dynamically imports all the tests.
    {pattern: unitTestPath +'/main.js', included: true, watched:false},

    // node modules libraries
    {pattern: nodeModulesPath+'/traceur/bin/traceur-runtime.js', included: false, watched:false},
    {pattern: nodeModulesPath+'/rtts-assert/dist/amd/assert.js', included: false, watched:false},

    // transpiled sources
    {pattern: buildMainPath+'/**/*.js', included: false},
    {pattern: buildTestPath + '/**/*.js', included: false}
  ];

  var options = {
    frameworks: ['jasmine', 'requirejs', 'sourcemaps'],

    basePath: basePath,

    files: files,

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type:'lcov',
      dir: prjRootPath +'/'+ pathCfg.dest.coverage
    },

    preprocessors: {
      '**/*.js': ['coverage']
    },

    //logLevel:config.LOG_DEBUG,

    browsers: ['Chrome']
  };

  // Apply sauce specific options
  if (process.argv.indexOf('--sauce') > -1 || process.argv.indexOf('test-sauce') > -1 ) {
    sauceConfig(options);
    travisConfig(options);
  }

  config.set(options);
  config.plugins.push(require('./karma_sourcemaps'));

};
