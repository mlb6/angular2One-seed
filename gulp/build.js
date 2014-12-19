'use strict';

var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'amd-optimize','bower-requirejs']
});

var PRJ_CONFIG = require('./../config');
var buildSrc = PRJ_CONFIG.path.build + '/' +PRJ_CONFIG.path.src;

var modules = PRJ_CONFIG.modules;

var scripts = PRJ_CONFIG.scripts;
var appScripts =  [].concat( scripts.jsScripts, scripts.jsTests, scripts.scriptMaps);
var atScripts = argv.file || [].concat(scripts.atsScripts, scripts.atsTests);
var allProdScripts = [].concat(scripts.atsScripts, scripts.jsScripts);

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('import-ng2', ['import-ng2-core','import-ng2-facade']);
gulp.task('import-ng2-core', function(){
  return gulp.src(['node_modules/angular/modules/core/src/compiler/selector.js'], { base: './node_modules/angular/modules/core/src/' })
    .pipe($.rename({extname: '.ats'}))
    .pipe($.replace(/import (.*) from '(.*)';/g, "import $1 from 'angular2/$2';"))
    .pipe(gulp.dest('src/lib/angular2/core'));
}) ;

gulp.task('import-ng2-facade', function(){
  return gulp.src(['node_modules/angular/modules/facade/src/lang.es6',
                    'node_modules/angular/modules/facade/src/collection.es6'], { base: './node_modules/angular/modules/facade/src/' })
    .pipe($.rename({extname: '.ats'}))
    .pipe($.replace(/(import {assert} from 'rtts_assert\/rtts_assert';)/g, ""))
    .pipe($.replace(/(window.assert = assert;)/g, "// $1"))
    .pipe($.replace(/import (.*) from '(.*)';/g, "import $1 from 'angular2/$2';"))
    .pipe(gulp.dest('src/lib/angular2/facade'));
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
gulp.task('build-dev', ['clean'],function(){
  gulp.start('build-dev-all');
});

gulp.task('build-dev-all', ['build-dev-styles', 'build-dev-scripts']);

gulp.task('build-dev-styles',  function () {
  return gulp.src('src/**/*.scss')
    .pipe($.sass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest(buildSrc))
});

gulp.task('build-dev-scripts', ['build-dev-transpile', 'build-dev-other-scripts']);

gulp.task('build-dev-transpile', function () {
  return gulp.src(atScripts, {base:PRJ_CONFIG.path.src})
    .pipe($.rename({extname: '.js'}))
    .pipe($.traceur(PRJ_CONFIG.traceur.dev))
    .pipe(gulp.dest(buildSrc));
});


gulp.task('build-dev-other-scripts', function () {
  var srcFilter = $.filter('src/**/*.js');
  return gulp.src(appScripts, { base: './' })
    .pipe(srcFilter)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(srcFilter.restore())
    .pipe(gulp.dest(PRJ_CONFIG.path.build));
});

/************************************************************/
/********************* PRODUCTION BUILD *********************/
/************************************************************/

gulp.task('build', ['clean'], function(){
  gulp.start('build-dev');

  // Production build is not ready yet. WIP

  //gulp.start('build-prod-es5');
  //gulp.start('build-prod-es6');
});
//gulp.task('build', ['build-prod-es6']);



/**
 * Package everything for production (With JS in ES5). [default build task]
 */
gulp.task('build-prod-es5', ['build-prod-app-es5','build-prod-assets-es5', 'build-es5-amd']);
gulp.task('build-prod-app-es5', [ 'build-require-config'],function () {
  var atsFilter = $.filter('**/*.ats');
  var jsFilter = $.filter('**/*.js');
  var jsAppFilter = $.filter(scripts.jsScripts);

  //allProdScripts=allProdScripts.concat(getJSLibraries());

  return gulp.src(allProdScripts, {"base":"."})
    .pipe(atsFilter)
    .pipe($.rename({extname: '.js'}))
    .pipe($.traceur(PRJ_CONFIG.traceur.prod_es5))
    .pipe(atsFilter.restore())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate())
    .pipe(jsAppFilter.restore())
    .pipe($.amdOptimize('app/main', {
      baseUrl : 'src',
      configFile : gulp.src(modules.configFile),
      include : modules.include.prod
    }))
    .pipe($.concat('scripts/app-es5.js'))
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe($.rev())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root))
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: '.app-es5'}))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root+"/rev"))
});



/**
 * Package everything for production (With JS in ES6). [experimental build task]
 */
gulp.task('build-prod-es6', ['build-prod-app-es6','build-prod-assets']);
gulp.task('build-prod-app-es6', function () {
 //TODO implement it ;)
});


/**
 * Package everything except JS for production.
 */
gulp.task('build-prod-assets-es5', ['build-prod-html-css-es5','build-prod-images', 'build-prod-fonts', 'build-prod-misc']);

gulp.task('build-prod-html-css-es5', ['build-prod-app-es5'], function () {

  var htmlFilter = $.filter('*.html');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(['src/*.html'])
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: '.css'}))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root+"/rev"))

    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.replace(/^<!--start:development-only-->((.*)\n)*<!--end:development-only-->$/m, ''))
    .pipe($.replace(/^<!--start:prod-es5-only--:(((.*)\n)*)<!--end:prod-es5-only-->$/m, '$1'))
    .pipe($.addSrc(PRJ_CONFIG.path.dist.root+"/rev/*.json"))
    .pipe($.revCollector())

    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root));
});


gulp.task('build-prod-images', function () {
  return gulp.src('src/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.images))
    .pipe($.size());
});

gulp.task('build-prod-fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.fonts))
    .pipe($.size());
});

gulp.task('build-prod-misc', function () {
  return gulp.src('src/**/*.ico')
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root))
    .pipe($.size());
});



gulp.task('clean', function (done) {
  $.del([PRJ_CONFIG.path.build, PRJ_CONFIG.path.dist.root], done);
});





var jsLibraries, requireConfig; // Initialized by build-require-config
function getJSLibraries(){
  if(jsLibraries && jsLibraries.length>0){
    return jsLibraries
  }
  var jsLibraries = [];
  for(var name in requireConfig.paths){
    var libPath = requireConfig.paths[name];
    libPath =libPath.substring(3)+".js"; // remove '../' and add .js
    jsLibraries.push(libPath);
  }
  return jsLibraries;
}
gulp.task('build-require-config', function(done){
  $.bowerRequirejs({
    baseUrl: 'src',
    config: modules.configFile,
    exclude: ['almond'],
    transitive: true
  }, function (result){
    requireConfig = result;
    done();
  });
})


function minify4Prod(stream, revSuffix){
  return stream
    .pipe($.sourcemaps.init())
    .pipe($.rev())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe($.rename({suffix:".min", dirname:'/scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root))
    .pipe($.rev.manifest())
    .pipe($.rename({suffix: revSuffix}))
    .pipe(gulp.dest(PRJ_CONFIG.path.dist.root+"/rev"))
}


gulp.task('build-es5-amd', ['build-almond-min', 'build-require-config-min']);
gulp.task('build-require-config-min', ['build-require-config'], function(){

  return minify4Prod(gulp.src(modules.configFile), '.require.config');
})

gulp.task('build-almond-min', function(){
  return minify4Prod(gulp.src('bower_components/almond/almond.js'), '.almond');
})

