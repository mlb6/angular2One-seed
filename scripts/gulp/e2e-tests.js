"use strict";

var gulp = require("gulp");

var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");

var pathCfg  = require("./../../config").path;

var sauce=false;

gulp.task("protractor:dev", ["serve:dev:only", "protractor:only"]);
gulp.task("protractor:prod", ["serve:prod:only", "protractor:only"]);

gulp.task("protractor:only", ["webdriver-update"], function (done) {

  gulp.src(pathCfg.dest.buildE2E)
    .pipe($.if(sauce,
      $.protractor.protractor({configFile: pathCfg.protractorSauceConfig}),
      $.protractor.protractor({configFile: pathCfg.protractorConfig}))
    )
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


gulp.task("protractor-sauce", function () {
  sauce=true;
  gulp.start("protractor:only");
});

// Downloads the selenium webdriver
gulp.task("webdriver-update", $.protractor.webdriver_update); // jshint ignore:line

gulp.task("webdriver-standalone", $.protractor.webdriver_standalone); // jshint ignore:line
