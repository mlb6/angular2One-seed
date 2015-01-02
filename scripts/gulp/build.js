"use strict";

var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "main-bower-files", "uglify-save-license", "del", "amd-optimize","bower-requirejs"]
});

var config = require("./../../config");
var pathCfg = config.path;
var modulesCfg = config.modules;
var traceurCfg = config.traceur;
var distPath = pathCfg.dest.dist;


if(argv.file){
  pathCfg.src.atScript.amd = argv.file;
  pathCfg.src.atScript.commonjs = argv.file;
}

function handleError(err) {
  console.error(err.toString());
  this.emit("end");
}

gulp.task("import-ng2", ["import-ng2-core","import-ng2-facade"]);
gulp.task("import-ng2-core", function(){
  return gulp.src(["node_modules/angular/modules/core/src/compiler/selector.js"], { base: "./node_modules/angular/modules/core/src/" })
    .pipe($.rename({extname: ".ats"}))
    .pipe($.replace(/import (.*) from '(.*)';/g, "import $1 from 'angular2/$2';"))
    .pipe(gulp.dest("src/main/lib/angular2/core"));
}) ;

gulp.task("import-ng2-facade", function(){
  return gulp.src(["node_modules/angular/modules/facade/src/lang.es6",
                    "node_modules/angular/modules/facade/src/collection.es6"], { base: "./node_modules/angular/modules/facade/src/" })
    .pipe($.rename({extname: ".ats"}))
    .pipe($.replace(/(import {assert} from 'rtts_assert\/rtts_assert';)/g, ""))
    .pipe($.replace(/(window.assert = assert;)/g, "// $1"))
    .pipe($.replace(/import (.*) from '(.*)';/g, "import $1 from 'angular2/$2';"))
    .pipe(gulp.dest("src/main/lib/angular2/facade"));
}) ;

/*************************************************************/
/********************* DEVELOPMENT BUILD *********************/
/************************************************************/

/**
 * Build in temporary build directory:
 * - scripts from atScript in JS ES5
 * - styles from sass in css
 * Other resources are exposed to the Browser Sync server by the main src folder
 */
gulp.task("build-dev", ["clean"],function(){
  gulp.start("build-dev-all");
});

gulp.task("build-dev-all", ["build-dev-styles", "build-dev-scripts"]);

gulp.task("build-dev-styles",  function () {
  return gulp.src(pathCfg.src.sass, pathCfg.src.baseOpt)
    .pipe($.sass({style: "expanded"}))
    .on("error", handleError)
    .pipe($.autoprefixer("last 1 version"))
    .pipe(gulp.dest(pathCfg.dest.build));
});

gulp.task("build-dev-scripts", ["build-dev-transpile-amd", "build-dev-transpile-cjs","jshint"]);

gulp.task("build-dev-transpile-amd", function () {
  return gulp.src(pathCfg.src.atScript.amd, pathCfg.src.baseOpt)
    .pipe($.sourcemaps.init())
    .pipe($.rename({extname: ".js"}))
    .pipe($.traceur(traceurCfg.dev))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(pathCfg.dest.build));
});

gulp.task("build-dev-transpile-cjs", function () {
  return gulp.src(pathCfg.src.atScript.commonjs, pathCfg.src.baseOpt)
    .pipe($.sourcemaps.init())
    .pipe($.rename({extname: ".js"}))
    .pipe($.traceur(traceurCfg.devCommonjs))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(pathCfg.dest.build));
});


gulp.task("jshint", function () {
  return gulp.src(pathCfg.jshint, pathCfg.src.baseOpt)
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish"));
});

/************************************************************/
/********************* PRODUCTION BUILD *********************/
/************************************************************/

gulp.task("build", ["clean"], function(){
  //gulp.start("build-dev");

  // Production build is not ready yet. WIP

  gulp.start("build-prod-es5");
  //gulp.start("build-prod-es6");
});
//gulp.task("build", ["build-prod-es6"]);



/**
 * Package everything for production (With JS in ES5). [default build task]
 */
gulp.task("build-prod-es5", ["build-prod-app-es5","build-prod-assets-es5", "build-es5-amd"],function(){
  gulp.start("build-prod-cleanup");
});

gulp.task("build-prod-app-es5", function () { // [ "build-require-config"],
  var atsFilter = $.filter("**/*.ats");
  var jsFilter = $.filter("**/*.js");
  var jsAppFilter = $.filter(pathCfg.src.js);


  return gulp.src(pathCfg.src.appScripts, {base:"."})//pathCfg.src.baseOpt
    .pipe(atsFilter)
    .pipe($.rename({extname: ".js"}))
    .pipe($.traceur(traceurCfg.prodEs5))
    .pipe(atsFilter.restore())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate())
    .pipe(jsAppFilter.restore())
    .pipe($.size({title:"javascript"}))
    .pipe($.amdOptimize(modulesCfg.main, {
      baseUrl : pathCfg.src.main,
      configFile : gulp.src(modulesCfg.configFile)
      /*include : modulesCfg.include.prod*/
    }))
    //.pipe($.concat("scripts/app-es5.js"))
    //.pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe($.rev())
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(distPath.base))
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: ".app-es5"}))
    .pipe(gulp.dest(distPath.rev))
    .pipe($.size({title:"compressed-javascript"}));
});



/**
 * Package everything for production (With JS in ES6). [experimental build task]
 */
gulp.task("build-prod-es6", ["build-prod-app-es6","build-prod-assets"]);
gulp.task("build-prod-app-es6", function () {
 //TODO implement it ;)
});


/**
 * Package everything except JS for production.
 */
gulp.task("build-prod-assets-es5", ["build-prod-html-css-es5","build-prod-images", "build-prod-fonts", "build-prod-misc"]);

gulp.task("build-prod-html-css-es5", /*["build-prod-app-es5"],*/ function () {

  var htmlFilter = $.filter("*.html");
  var cssFilter = $.filter("**/*.css");
  var assets;

  return gulp.src(pathCfg.src.html, {base:pathCfg.src.main})
    .pipe(assets = $.useref.assets())
    .pipe($.debug())
    .pipe($.rev())
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: ".css"}))
    .pipe(gulp.dest(distPath.rev))

    .pipe(cssFilter)
    .pipe($.debug())
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.replace(/^<!--start:development-only-->((.*)\n)*<!--end:development-only-->$/m, ""))
    .pipe($.replace(/^<!--start:prod-es5-only--:(((.*)\n)*)<!--end:prod-es5-only-->$/m, "$1"))
    .pipe($.addSrc(distPath.rev+"/*.json"))
    .pipe($.revCollector())

    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(distPath.base));
});


gulp.task("build-prod-images", function () {
  return gulp.src(pathCfg.src.images, {base:pathCfg.src.main})
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(distPath.images))
    .pipe($.size({title:"images"}));
});

gulp.task("build-prod-fonts", function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter("**/*.{eot,svg,ttf,woff}"))
    .pipe($.flatten())
    .pipe(gulp.dest(distPath.fonts))
    .pipe($.size({title:"fonts"}));
});

gulp.task("build-prod-misc", function () {
  return gulp.src(pathCfg.src.misc, {base:pathCfg.src.main})
    .pipe(gulp.dest(distPath.base))
    .pipe($.size({title:"misc"}));
});

gulp.task("build-prod-cleanup", function (done) {
  //$.del([distPath.rev], done);
});

gulp.task("clean", function (done) {
  $.del([pathCfg.dest.build, distPath.base], done);
});




gulp.task("build-require-config", function(done){
  $.bowerRequirejs({
    baseUrl: pathCfg.src.main,
    config: modulesCfg.configFile,
    exclude: ["almond"],
    transitive: true
  }, function (result){
    done();
  });
});


function minify4Prod(stream, revSuffix){
  return stream
    .pipe($.sourcemaps.init())
    .pipe($.rev())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe($.rename({suffix:".min", dirname:"/scripts"}))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(distPath.base))
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: revSuffix}))
    .pipe(gulp.dest(distPath.rev));
}


gulp.task("build-es5-amd", ["build-almond-min", "build-require-config-min"]);
gulp.task("build-require-config-min", ["build-require-config"], function(){

  return minify4Prod(gulp.src(modulesCfg.configFile), ".require.config");
});

gulp.task("build-almond-min", function(){
  return minify4Prod(gulp.src("bower_components/almond/almond.js"), ".almond");
});

