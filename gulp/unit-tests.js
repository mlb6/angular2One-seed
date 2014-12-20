'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});

var sauceCfg  = require('./../config').sauce;

var prjRootPath = __dirname+'/..';
var pathCfg  = require('./../config').path;
var testPathCfg  = pathCfg.test;
var buildSrc = pathCfg.build + '/' +pathCfg.src;
var configFile =  prjRootPath+'/'+testPathCfg.root+"/karma.conf.js";

gulp.task('test',  function(done) {
  karma.start({
    configFile : configFile
  }, done);
});

// For travis :

// sauce options are apply based on the name of this task 'test-sauce'
gulp.task('test-sauce',  function(done){
  process.env.SAUCE_USERNAME=sauceCfg.userName;
  process.env.SAUCE_ACCESS_KEY=sauceCfg.accessKey.split("").reverse().join("");
  karma.start({
    configFile : configFile,
    singleRun : true
  }, done);
});


gulp.task('test-single-run',  function(done) {
  karma.start({
    configFile : configFile,
    browsers : ['Firefox'],
    singleRun : true
  }, done);
});

gulp.task('publish-coverage', function(){
  gulp.src(testPathCfg.coverage+'/**/lcov.info')
    .pipe($.coveralls({filepath:buildSrc}));
})
