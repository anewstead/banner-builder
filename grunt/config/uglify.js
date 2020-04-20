module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.config.set('uglify', {
    build: {
      files: [{
        expand: true,
        cwd: '<%= files.dir.build %>',
        src: ['**/*.js'],
        dest: '<%= files.dir.build %>'
      }]
    }
  });

};
