module.exports = function(grunt) {
  'use strict';

  //set in Gruntfile.js
  var projectDir = grunt.config.get('projectDir');

  /*
  This file/module contains all configuration for the build process.
  As much as possible all names and location are here then used as variables throughout setup
  */
  grunt.config.set('files', {

    /*
    folder directories
    */
    dir: {
      src: 'src/' + projectDir,
      build: '_build/' + projectDir,
      zip: '_zip/' + projectDir,
      tmp: '_tmp',
      common: '<%= files.dir.src %>' + '/_common',
      global: '<%= files.dir.common %>' + '/_global'
    },

    /*
    templates files
    */
    template: {
      links: '<%= files.dir.common %>' + '/links.html',
      banner: '<%= files.dir.common %>' + '/banner_template.html',
      static: '<%= files.dir.common %>' + '/static_template.html'
    },

    /*
    special files
    */
    names: {
      output: {
        html: 'index.html',
        js: 'main.js',
        css: 'styles.css'
      },
      override: {
        html: 'override.html',
        js: 'override.js',
        less: 'override.less'
      },
      config: {
        clicktag: 'clicktag.js',
        naming: 'names.json'
      }
    },

    /*
    file patterns for src
    */
    src: {
      all: ['<%= files.dir.src %>' + '/**/*'],
      js: ['<%= files.dir.src %>' + '/**/*.js'],
      json: ['<%= files.dir.src %>' + '/**/*.json'],
      less: ['<%= files.dir.src %>' + '/**/*.{less,css}'],
      html: ['<%= files.dir.src %>' + '/**/*.{html,htm}'],
      content: ['<%= files.src.all %>', '!<%= files.src.js %>', '!<%= files.src.less %>', '!<%= files.src.html %>']
    },

    /*
    file patterns for build
    */
    build: {
      all: ['<%= files.dir.build %>' + '/**/*'],
      js: ['<%= files.dir.build %>' + '/**/*.js'],
      json: ['<%= files.dir.build %>' + '/**/*.json'],
      less: ['<%= files.dir.build %>' + '/**/*.{less,css}'],
      html: ['<%= files.dir.build %>' + '/**/*.{html,htm}'],
      content: ['<%= files.build.all %>', '!<%= files.build.js %>', '!<%= files.build.less %>', '!<%= files.build.html %>']
    },

    /*
    file patterns for grunt code.
    we dont include Gruntfile.js see watch.js for more info
    */
    grunt: {
      js: [
        'grunt/**/*.{js,json}'
      ]
    }
  });

};
