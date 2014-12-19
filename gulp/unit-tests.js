'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*']
});


var prjRootPath = __dirname+'/..';
var pathCfg  = require('./../config').path;
var testPathCfg  = pathCfg.test;
var buildSrc = pathCfg.build + '/' +pathCfg.src;


gulp.task('test',  function(done) {
  karma.start({
    configFile : prjRootPath+'/'+testPathCfg.root+"/karma.conf.js"
  }, done);
});

// For travis
gulp.task('test-single-run',  function(done) {
  karma.start({
    configFile : prjRootPath+'/'+testPathCfg.root+"/karma.conf.js",
    browsers : ['Firefox'],
    singleRun : true
  }, done);
});

gulp.task('publish-coverage', function(){
  gulp.src(testPathCfg.coverage+'/**/lcov.info')
    .pipe($.debug())
    .pipe($.coveralls({filepath:buildSrc}));
})
