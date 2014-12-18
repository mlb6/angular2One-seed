'use strict';

var gulp = require('gulp');
var karma = require('karma').server;


var PRJ_CONFIG  = require('./../config');


gulp.task('test',  function(done) {

  karma.start({
    configFile : __dirname+'/../'+PRJ_CONFIG.path.test.root+"/karma.conf.js"
  }, done);


  /*var bowerDeps = wiredep({
    directory: 'bower_components',
    dependencies: true,
    devDependencies: true
  });*/

  //var testFiles = bowerDeps.js.concat([
    // PRJ_CONFIG.path.build.src+'/{app,lib}/**/*.js',
    //PRJ_CONFIG.path.test.unit+'/**/*.js'
  //]);

  var  files = [];

  /*PRJ_CONFIG.scripts.libraries.forEach(function (library){
    if(!library.afterApp) {
      files.push(library.path);
    }
  });*/
/*
  var scripts = PRJ_CONFIG.scripts;
  files = files.concat('src/require.config.js', scripts.jsTests, scripts.scriptMaps);
console.log(files);


  return gulp.src(files)
    .pipe($.karma({
      configFile: PRJ_CONFIG.path.test.root+"/karma.conf.js",
      action: "run"
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });*/
});
