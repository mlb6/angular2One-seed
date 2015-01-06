"use strict";

var gulp = require("gulp");

var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");

var pathCfg  = require("./../../config").path;

gulp.task("protractor:dev", ["serve:dev:only", "protractor:only"]);
gulp.task("protractor:prod", ["serve:prod:only", "protractor:only"]);

gulp.task("protractor:only", ["webdriver-update"], function (done) {
  var testFiles = [
    "build/test/e2e/**/*.spec.js"
  ];

  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      configFile: pathCfg.protractorConfig
    }))
    .on("error", function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on("end", function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
});


// Downloads the selenium webdriver
gulp.task("webdriver-update", $.protractor.webdriver_update); // jshint ignore:line

gulp.task("webdriver-standalone", $.protractor.webdriver_standalone); // jshint ignore:line
