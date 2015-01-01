"use strict";

var gulp = require("gulp");
var karma = require("karma").server;
var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*"]
});

var config = require("./../../config");
var sauceCfg  = config.sauce;
var pathCfg  = config.path;

var prjRootPath = __dirname+"/../..";
var configFile =  prjRootPath+"/"+pathCfg.karmaConfig;

gulp.task("test",  function(done) {
  karma.start({
    configFile : configFile
  }, done);
});

// For travis :

// sauce options are apply based on the name of this task "test-sauce"
gulp.task("test-sauce",  function(done){
  process.env.SAUCE_USERNAME=sauceCfg.userName;
  process.env.SAUCE_ACCESS_KEY=sauceCfg.accessKey.split("").reverse().join("");
  karma.start({
    configFile : configFile,
    singleRun : true
  },function(){
    done();
    // Process does not end certainly while using travis config.
    // Certainly because of this issue : https://github.com/gulpjs/gulp/issues/167
    // TODO: Change this when issue is closed.
    process.exit(0);
  } );
});


gulp.task("test-single-run",  function(done) {
  karma.start({
    configFile : pathCfg.karmaConfig,
    browsers : ["Firefox"],
    singleRun : true
  }, done);
});

gulp.task("publish-coverage", function(){
  gulp.src(pathCfg.dest.coverage+"/**/lcov.info")
    .pipe($.coveralls({filepath:pathCfg.dest.buildMain}));
});
