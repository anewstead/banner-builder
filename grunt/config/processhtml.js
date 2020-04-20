module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-processhtml');

  //also see tasks/banners/config

  grunt.config.set('processhtml', {
    linkpage: {
      options: {
        data: {
          linksData: '<%= linksData %>'
        }
      },
      files: [{
        src: '<%= files.template.links %>',
        dest: '<%= files.dir.build %>/<%= files.names.output.html %>'
      }]
    }
  });

};
