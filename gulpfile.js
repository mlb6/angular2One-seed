'use strict';

var gulp = require('gulp');
require('require-dir')('./scripts/gulp');


gulp.task('default', ['clean'], function () {
  gulp.start('build-dev');
});
