'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

//var middleware = require('./proxy');

var PRJ_CONFIG = require('./../config');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = {
    '/bower_components': './bower_components',
    '/node_modules':'./node_modules'
  };


  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      directory:true,
      /*middleware: middleware,*/
      routes: routes
    },
    browser: browser
  });

}

gulp.task('serve', ['watch-dev'], function () {
  browserSyncInit([
    PRJ_CONFIG.path.src,
    PRJ_CONFIG.path.build+'/'+PRJ_CONFIG.path.src,
  ], [
    PRJ_CONFIG.path.build+'/**/*.css',
    PRJ_CONFIG.path.build+'/**/*.js',
    PRJ_CONFIG.path.build+'/**/*.map',
    PRJ_CONFIG.path.src+'/assets/images/**/*',
    PRJ_CONFIG.path.src+'/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(PRJ_CONFIG.path.dist.root);
});

gulp.task('serve:e2e', function () {
  browserSyncInit([PRJ_CONFIG.path.src, PRJ_CONFIG.path.build], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
  browserSyncInit(PRJ_CONFIG.path.dist.root, null, []);
});
