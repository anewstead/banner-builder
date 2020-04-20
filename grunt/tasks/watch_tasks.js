module.exports = function(grunt) {
  'use strict';

  /*
  expected use via watch
  */
  grunt.registerTask('grunt_js_changed', [
    'eslint:grunt',
    'build'
  ]);

  grunt.registerTask('banner_js_changed', [
    'eslint:banner',
    'find_banner_src',
    'banner_tasks_concat',
    'concat',
    'comments:js'
  ]);

  grunt.registerTask('banner_style_changed', [
    'find_banner_src',
    'banner_tasks_less',
    'less',
    'comments:css'
  ]);

  grunt.registerTask('banner_html_changed', [
    'find_banner_src',
    'banner_tasks_processhtml',
    'processhtml'
  ]);

};
