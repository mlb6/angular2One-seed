"use strict";

var gulp = require("gulp");
var argv = require("minimist")(process.argv.slice(2));

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "main-bower-files", "uglify-save-license", "del", "amd-optimize","bower-requirejs", "lazypipe", "event-stream"]
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

gulp.task("clean", function (done) {
  $.del([pathCfg.dest.build, distPath.base], done);
});

gulp.task("build", ["clean"], function(){
  gulp.start("build:dev");
  gulp.start("build:prod");
  //gulp.start("build:prod-es6");
});
//gulp.task("build", ["build-prod-es6"]);


gulp.task("build:dev", ["build-dev-js", "build-dev-styles"]);


gulp.task("build:prod", ["build-prod-js","build-prod-assets", "require-config"],function(){
  gulp.start("build-prod-cleanup");
});


/*************************************************************/
/********************* DEVELOPMENT BUILD *********************/
/************************************************************/
/**
 * Build in temporary build directory:
 * - scripts from atScript in JS ES5
 * - styles from sass in css
 * Other resources are exposed to the Browser Sync server by the main src folder
 */

var stylesPipeline = $.lazypipe()
  .pipe($.sass, config.css.sass)
  .pipe($.autoprefixer, config.css.autoprefixer);

gulp.task("build-dev-styles",  function () {
  return gulp.src(pathCfg.src.sass, pathCfg.src.baseOpt)
    .pipe(stylesPipeline())
    .pipe(gulp.dest(pathCfg.dest.build));
});

gulp.task("build-dev-js", ["build-dev-transpile-amd", "build-dev-transpile-cjs","jshint"]);


var transpileDevPipeline = function(traceurOptions){
  return (
    $.lazypipe()
      .pipe($.sourcemaps.init)
      .pipe($.rename, {extname: ".js"})
      .pipe($.traceur, traceurOptions)
      .pipe($.sourcemaps.write)
  )();
};

gulp.task("build-dev-transpile-amd", function () {
  return gulp.src(pathCfg.src.atScript.amd, pathCfg.src.baseOpt)
    .pipe(transpileDevPipeline(traceurCfg.dev))
    .pipe(gulp.dest(pathCfg.dest.build));
});

gulp.task("build-dev-transpile-cjs", function () {
  return gulp.src(pathCfg.src.atScript.commonjs, pathCfg.src.baseOpt)
    .pipe(transpileDevPipeline(traceurCfg.devCommonjs))
    .pipe(gulp.dest(pathCfg.dest.build));
});




/************************************************************/
/********************* PRODUCTION BUILD *********************/
/************************************************************/


var optimizeJS = function (name){
  var annotateFilter = $.filter("**/router*.es5.js");
  return (
    $.lazypipe()
      .pipe($.sourcemaps.init, {loadMaps: true})
      .pipe(function (){
        return annotateFilter;
      })
      .pipe($.ngAnnotate)
      .pipe(annotateFilter.restore)
      .pipe($.concat, "scripts/"+name+".js")
      // TODO : it seems there is an issue with sourcemaps in uglify. https://github.com/terinjokes/gulp-uglify/issues/56
      .pipe(function () {
        return $.if(config.js.minify, $.uglify({preserveComments: $.uglifySaveLicense}));
      })
      .pipe($.rev)
      .pipe($.sourcemaps.write, ".")
      .pipe(gulp.dest, distPath.base)
  )();
};


var optimize4Almond = function (name){
  var jsPattern="**/*.js";
  return (
    $.lazypipe()
      .pipe($.addSrc, "bower_components/almond/almond.js")
      .pipe($.addSrc, modulesCfg.configFile)

      .pipe($.filter,jsPattern)
      .pipe($.size, {title:"uncompressed "+name+".js"})
      .pipe($.size, {gzip:true, title:"uncompressed "+name+".js"})

      .pipe(optimizeJS, name )

      .pipe($.filter,jsPattern)
      .pipe($.size, {gzip:true,showFiles:true, title:"compressed"})

      // Memorize filename in manifest
      .pipe($.rev.manifest)
      .pipe($.rename, {suffix: "."+name})
      .pipe(gulp.dest, distPath.rev)
  )();
};




gulp.task("build-prod-js", ["require-config"], function () {
  var atsFilter = $.filter("**/*.ats");
  //var jsAppFilter = $.filter(pathCfg.src.js);
  return gulp.src(pathCfg.src.appScripts, {base:"."})//pathCfg.src.baseOpt
    .pipe(atsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.rename({extname: ".js"}))
    .pipe($.traceur(traceurCfg.prodEs5))
    .pipe($.sourcemaps.write())
    .pipe(atsFilter.restore())

    .pipe($.amdOptimize(modulesCfg.main, {
      baseUrl : pathCfg.src.main,
      configFile : gulp.src(modulesCfg.configFile)
    }))
    .pipe(optimize4Almond("app"));
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
gulp.task("build-prod-assets", ["build-prod-html-css","build-prod-images", "build-prod-fonts", "build-prod-misc", "build-prod-finalize-html", "build-prod-route-templates"]);

gulp.task("build-prod-styles",  function () {
  return gulp.src(pathCfg.src.sass, pathCfg.src.baseOpt)
    .pipe(stylesPipeline())
    .pipe(gulp.dest(distPath.tmp));
});


var optimizeCSS = function(dist, rev){
  return (
    $.lazypipe()
      .pipe($.size, {showFiles:true, title:"uncompressed"})
      .pipe($.size, {gzip:true, showFiles:true, title:"uncompressed gzip"})
      .pipe($.csso)
      .pipe($.rev)
      .pipe(gulp.dest, dist)
      .pipe($.size, {gzip:true, showFiles:true, title:"compressed"})

      .pipe($.rev.manifest) // Memorize name of css
      .pipe($.rename, {suffix: ".css"})
      .pipe(gulp.dest, rev)
  )();
};




gulp.task("build-prod-html-css", ["build-prod-styles"],  function () {

  var htmlFilter = $.filter("*.html");
  var cssFilter = $.filter("**/*.css");
  var assets;


  return gulp.src(pathCfg.src.html, {base:pathCfg.src.main})
    .pipe(htmlFilter)
    // Deal with specific build inclusion
    .pipe($.replace(/^<!--start:development-only-->((.*)\n)*<!--end:development-only-->$/m, ""))
    .pipe($.replace(/^<!--start:prod-es5-only--:(((.*)\n)*)<!--end:prod-es5-only-->$/m, "$1"))
    .pipe(htmlFilter.restore())

    .pipe(assets = $.useref.assets({// Work with assets of html docs
      searchPath: [pathCfg.src.main, distPath.tmp+"/main"]
    }))

    .pipe(cssFilter)
    .pipe(optimizeCSS(distPath.base, distPath.rev))
    .pipe(cssFilter.restore())

    .pipe(assets.restore())// End of asset management, HTMLs + Rev files are now in the stream
    .pipe(htmlFilter)
    .pipe($.useref()) // replace occurrences of assets that has been combined
    .pipe(gulp.dest(distPath.base))
    .pipe(htmlFilter.restore());
});

gulp.task("build-prod-finalize-html", ["build-prod-html-css", "build-prod-js", "require-config"], function () {
  var htmlFilter = $.filter("*.html");

  return gulp.src([distPath.rev+"/*.json",distPath.base+"/*.html"], {base:distPath.base})
    .pipe($.revCollector())

    .pipe(htmlFilter)
    // HTML minification
    .pipe($.minifyHtml(config.html.minify))
    // If you want to generate files for a DB import of your main HTML page, it should be done here.
    .pipe(gulp.dest(distPath.base));
});

gulp.task("build-prod-route-templates", function () {
  return gulp.src(pathCfg.src.templates, {base:pathCfg.src.main})
    .pipe($.minifyHtml(config.html.minify))
    // If you want to generate files for a DB import of your HTML pages, it should be done here.
    .pipe(gulp.dest(distPath.base))
    .pipe($.size({title:"templates"}));
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
  $.del([distPath.rev, distPath.tmp], done);
});



gulp.task("require-config", function(done){
  $.bowerRequirejs({
    baseUrl: pathCfg.src.main,
    config: modulesCfg.configFile,
    exclude: ["almond"],
    transitive: true
  },function(){ done(); } );
});


gulp.task("jshint", function () {
  return gulp.src(pathCfg.jshint, pathCfg.src.baseOpt)
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish"));
});


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
