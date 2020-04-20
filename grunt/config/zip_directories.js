module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-zip-directories');

  /*
   */
  grunt.config.set('zip_directories', {
    build: {
      files: [{
        filter: 'isDirectory',
        expand: true,
        cwd: '<%= files.dir.build %>',
        src: ['**/*/*'],
        dest: '<%= files.dir.zip %>'
      }]
    }
  });

};
