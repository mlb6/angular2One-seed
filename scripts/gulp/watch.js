"use strict";

var gulp = require("gulp");

gulp.task("watch-dev", ["build-dev"] ,function () {
  gulp.watch("src/main/**/*.scss", ["build-dev-styles"]);
  gulp.watch("src/main/**/*.js", ["build-dev-scripts"]);
});


