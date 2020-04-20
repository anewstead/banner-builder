module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-pngmin');
  /*
  pngmin:build compress pngs in the build folder
  */
  grunt.config.set('pngmin', {
    build: {
      options: {
        ext: '.png',
        force: true,
      },
      files: [{
        expand: true,
        cwd: '<%= files.dir.build %>',
        src: ['**/*.png'],
        dest: '<%= files.dir.build %>'
      }]
    },
    /*
    pngmin:tmp compress pngs placed in tmp/pngmin/...
    */
    tmp: {
      options: {
        ext: '.png',
        force: true,
      },
      files: [{
        expand: true,
        cwd: '<%= files.dir.tmp %>/pngmin',
        src: ['**/*.png'],
        dest: '<%= files.dir.tmp %>/pngmin/compressed'
      }]
    }
  });

};
