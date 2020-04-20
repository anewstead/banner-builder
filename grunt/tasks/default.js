module.exports = function(grunt) {
  'use strict';

  /*
  just type grunt
  fresh build, start localhost, launch browser, watch source
  */
  grunt.registerTask('default', [
    'eslint',
    'build',
    'connect',
    'watch'
  ]);

  /*
  compile banners from src folder into build folder
  */
  grunt.registerTask('build', [
    'clean:build',
    'find_banner_src',
    'banner_tasks',
    'processhtml',
    'concat',
    'less',
    'copy',
    'comments'
  ]);

  /*
  minify js and css in existing build
  */
  grunt.registerTask('min', [
    'cssmin',
    'uglify'
  ]);

  /*
  shortcut "zip_directories", zips existing build
  */
  grunt.registerTask('zip', [
    'zip_directories'
  ]);


};
