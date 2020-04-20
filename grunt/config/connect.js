module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-connect');

  /*
  basic http web server for testing simple page content.
  0.0.0.0:9000 =
  http://localhost:9000 on local
  http://10.211.55.2:9000 on VMware
  */
  grunt.config.set('connect', {
    options: {
      port: 9000,
      hostname: '0.0.0.0'
    },
    build: {
      options: {
        /*livereload : 35730,*/
        open: true,
        base: ['<%= files.dir.build %>']
      }
    }
  });

};
