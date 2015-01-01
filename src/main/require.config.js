(function () {
  "use strict";
  require.config({
    shim: {
      traceur: {
        exports: "$traceurRuntime"
      },
      assert: {
        deps: [
          "traceur"
        ]
      },
      "angular-material": {
        deps: [
          "angular",
          "hammer",
          "angular-animate",
          "angular-aria"
        ]
      },
      "angular-animate": {
        deps: [
          "angular"
        ]
      },
      "angular-aria": {
        deps: [
          "angular"
        ]
      },
      "angular-mocks": {
        deps: [
          "angular"
        ]
      },
      router: {
        deps: [
          "angular"
        ]
      },
      "router-directive": {
        deps: [
          "angular",
          "router"
        ]
      },
      angular: {
        exports: "angular"
      }
    },
    paths: {
      angular: "../bower_components/angular/angular",
      "angular-material": "../bower_components/angular-material/angular-material",
      "angular-animate": "../bower_components/angular-animate/angular-animate",
      "angular-aria": "../bower_components/angular-aria/angular-aria",
      hammer: "app/hammer-proxy",
      "angular-mocks": "../bower_components/angular-mocks/angular-mocks",
      traceur: "../node_modules/traceur/bin/traceur-runtime",
      assert: "../node_modules/rtts-assert/dist/amd/assert",
      router: "../node_modules/angular-new-router/dist/router.es5",
      "router-directive": "../node_modules/angular-new-router/src/router-directive.es5",
      core: "lib/core",
      ng2: "lib/ng2",
      commerce: "lib/commerce",
      angular2: "lib/angular2",
      hammerjs: "../bower_components/hammerjs/hammer",
      "traceur-runtime": "../bower_components/traceur-runtime/traceur-runtime"
    },
    packages: [

    ]
  });


})();

