module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.config.set('cssmin', {
    build: {
      files: [{
        expand: true,
        cwd: '<%= files.dir.build %>',
        src: ['**/*.css'],
        dest: '<%= files.dir.build %>'
      }]
    }
  });

};
