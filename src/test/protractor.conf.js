require('traceur/bin/traceur-runtime');

// An example configuration file.
exports.config = {

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    isVerbose:true,
    defaultTimeoutInterval: 30000
  }

};
