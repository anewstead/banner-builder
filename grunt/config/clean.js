module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');

  /* remove folders */
  grunt.config.set('clean', {
    build: [
      '<%= files.dir.build %>'
    ],
    zip: [
      '<%= files.dir.zip %>'
    ],
    tmp: [
      '<%= files.dir.tmp %>'
    ]
  });

};
