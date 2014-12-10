// Karma configuration
// Generated on Fri Mar 14 2014 15:01:19 GMT-0700 (PDT)

var PRJ_CONFIG  = require('./../config')
var traceurOptions = PRJ_CONFIG.traceur.dev;

module.exports = function(config) {

  var isWebstorm = /karma-intellij/.test(process.argv[1]);
  var files;

  if (isWebstorm) {
    // Running within WebStorm - WebStorm takes care of transpiling.
    // Serve already transpiled files, including source maps.

    files = [];
    PRJ_CONFIG.scripts.libraries.forEach(function (library){
      if(!library.afterApp) {
        files.push({pattern: library.path, included: false});
      }
    });
    [].concat(scrApp.jsScripts, scrApp.jsTests, scrApp.scriptMaps).forEach(function (script){
        files.push({pattern: script, included: false});
    });

  } else {
    // Running outside WebStorm (eg. from commandline).
    // Karma transpiles the *.ats sources with karma-traceur-preprocessor.
    files = [
      {pattern: PRJ_CONFIG.path.src+'/**/*.ats', included: false},
      {pattern: PRJ_CONFIG.path.test.unit + '/**/*.ats', included: false}
    ];
  }
  /*console.log('karma.conf.js : files=');

  console.log(config);*/
  files = [
    // The entry point that dynamically imports all the tests.
    {pattern: 'test/unit/main.js', included: true},
    {pattern: 'test/unit/lib/ng2/injectionHelper.spec.ats', included:true}
  ].concat(files);

  console.log(files);

  config.set({
    frameworks: ['jasmine', 'requirejs', 'traceur', 'sourcemaps'],

    basePath:'.',

    files: files,

    preprocessors: {
      '**/*.ats': ['traceur']
    },

    browsers: ['Chrome'],

    traceurPreprocessor: {
      options: traceurOptions,
      transformPath: function(path) {
        // Traceur preprocessor is only used when running Karma outside of WebStorm.
        // We change the path to `.tmp/**` so that the paths are the same as with WebStorm.
        console.log(path
          .replace(PRJ_CONFIG.path.src+'/',  PRJ_CONFIG.path.build+'/'+PRJ_CONFIG.path.src+'/')
          .replace(PRJ_CONFIG.path.test.root+'/',PRJ_CONFIG.path.build+'/'+PRJ_CONFIG.path.test.root+'/')
          .replace(/\.ats$/, '.js'));
        return path
          .replace(PRJ_CONFIG.path.src+'/',  PRJ_CONFIG.path.build+'/'+PRJ_CONFIG.path.src+'/')
          .replace(PRJ_CONFIG.path.test.root+'/',PRJ_CONFIG.path.build+'/'+PRJ_CONFIG.path.test.root+'/')
          .replace(/\.ats$/, '.js');

      }
    }
  });

  config.plugins.push(require('./karma_sourcemaps'));

};
