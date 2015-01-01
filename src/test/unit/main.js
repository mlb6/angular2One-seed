"use strict";

// The entry point for unit tests.

var TEST_REGEXP = /.spec\.js$/;

function pathToModule(path) {
  if(path.substr( 0,"/absolute".length)==="/absolute"){
    return path;
  }
  return path.replace(/^\/base\//, "").replace(/\.js$/, "");

}

function onlySpecs(path) {
  return TEST_REGEXP.test(path);
}

function getAllSpecs() {
  return Object.keys(window.__karma__.files)
      .filter(onlySpecs)
      .map(pathToModule);
}

function getAllPathForSuffix(suffix){
  return Object.keys(window.__karma__.files)
    .filter(function(path){
      return path.indexOf(suffix, path.length - suffix.length) !== -1;
    })
    .map(function(path){
      return path.replace(/\.js$/, "");
    });
}

function getPathForSuffix(suffix){
  return getAllPathForSuffix(suffix)[0];
}


require.config({
  // Karma serves files under `/base`, which is the `basePath` from `karma-conf.js` file.
  baseUrl: "/base",

  //Override (from require.config.js) paths of libraries in node_modules, because the relative path does not work.
  paths: {
    traceur: getPathForSuffix("node_modules/traceur/bin/traceur-runtime.js"),
    assert: getPathForSuffix("node_modules/rtts-assert/dist/amd/assert.js")
  },

  // Dynamically load all test files.
  deps: getAllSpecs(),

  // Kickoff Jasmine, once all spec files are loaded.
  callback: window.__karma__.start
});


