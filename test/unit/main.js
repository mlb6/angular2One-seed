// The entry point for unit tests.

var TEST_REGEXP = /.spec\.js$/;

function pathToModule(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
}

function onlySpecs(path) {
  return TEST_REGEXP.test(path);
}

function getAllSpecs() {
  return Object.keys(window.__karma__.files)
      .filter(onlySpecs)
      .map(pathToModule);
}

/*
console.log('before');
var requireConfig = require('require.config.js');
console.log('after');
*/

console.log(window.__karma__);
console.log(window.__karma__.files);
console.log(getAllSpecs());

require.config({
  // Karma serves files under `/base`, which is the `basePath` from `karma-conf.js` file.
  baseUrl: '/base',


  // Dynamically load all test files.
  deps: getAllSpecs(),

  // Kickoff Jasmine, once all spec files are loaded.
  callback: window.__karma__.start
});

