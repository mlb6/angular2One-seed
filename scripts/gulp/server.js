"use strict";

var gulp = require("gulp");
var browserSync = require("browser-sync");
//var middleware = require("./proxy");

var pathCfg = require("./../../config").path;
var buildMainPath = pathCfg.dest.buildMain;
var mainPath =  pathCfg.src.main;
var serveDev = {
  baseDir:[
    mainPath,
    buildMainPath,
  ],
  files : [
    buildMainPath+"/**/*.css",
    buildMainPath+"/**/*.js",
    buildMainPath+"/**/*.map",
    mainPath+"/assets/images/**/*",
    mainPath+"/**/*.html"
  ]
};

function browserSyncInit(baseDir, files, browser, notify) {
  browser = browser === undefined ? "default" : browser;
  notify = notify === undefined ? true : notify;

  var routes = {
    "/bower_components": "./bower_components",
    "/node_modules":"./node_modules"
  };

  browserSync.instance = browserSync.init(files, {
    startPath: "index.html",
    server: {
      baseDir: baseDir,
      directory:true,
      /*middleware: middleware,*/
      routes: routes
    },
    browser: browser,
    notify: notify
  });

}


gulp.task("serve", ["watch-dev"], function () {
  gulp.start("serve:dev");
});
gulp.task("serve:prod", ["build:prod"], function () {
  gulp.start("serve:prod:only");
});

gulp.task("serve:dev", function () {
  browserSyncInit(serveDev.baseDir, serveDev.files );
});
gulp.task("serve:dev:only", function () {
  browserSyncInit(serveDev.baseDir, serveDev.files , [], false);
});

gulp.task("serve:prod:only", function () {
  browserSyncInit(pathCfg.dest.dist.base, null, [], false);
});
