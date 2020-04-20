module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  var tasks = path.resolve('./grunt/tasks/banner_tasks');

  var iConcat = require(tasks + '/concat.js');
  var iCopy = require(tasks + '/copy.js');
  var iLess = require(tasks + '/less.js');
  var iProcesshtml = require(tasks + '/processhtml.js');

  /*
  creates the config tasks that run on each banner
  all configs
  */
  grunt.registerTask('banner_tasks', function() {
    grunt.config.get('bannersData').forEach(function(banner) {
      iProcesshtml(grunt, banner);
      iCopy(grunt, banner);
      if (!banner.isStatic) {
        iConcat(grunt, banner);
        iLess(grunt, banner);
      }
    });
  });

  /*
  just concat
  */
  grunt.registerTask('banner_tasks_concat', function() {
    grunt.config.get('bannersData').forEach(function(banner) {
      if (!banner.isStatic) {
        iConcat(grunt, banner);
      }
    });
  });

  /*
  just less
  */
  grunt.registerTask('banner_tasks_less', function() {
    grunt.config.get('bannersData').forEach(function(banner) {
      if (!banner.isStatic) {
        iLess(grunt, banner);
      }
    });
  });

  /*
  just processhtml
  */
  grunt.registerTask('banner_tasks_processhtml', function() {
    grunt.config.get('bannersData').forEach(function(banner) {
      iProcesshtml(grunt, banner);
    });
  });

};
