'use strict';

var gulp = require('gulp');

gulp.task('watch-dev', ['build-dev'] ,function () {
  gulp.watch('src/**/*.scss', ['build-dev-styles']);
  gulp.watch('src/**/*.js', ['build-dev-scripts']);
});

//TODO watcher for prod
gulp.task('watch-prod', [] ,function () {
  gulp.watch('src/assets/images/**/*', ['build-prod-images']);

});

