module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.config.set('watch', {
    /*
    default watch interval of 100ms is too fast for our purposes.
    1500ms is fast enough and should keep CPU low even watching up to approx. 3000 files
    */
    options: {
      interval: 1500
    },

    /*
    watch grunt files but do not include the main Gruntfile.js
    watching Gruntfile.js trigger watch.reload if its changed this is ok BUT for some reason it also
    triggers a watch.reload event when you add/delete file/folder in the root folder, which we dont want.
    */
    grunt: {
      files: ['<%= files.grunt.js %>'],
      tasks: ['grunt_js_changed'],
      options: {
        reload: true
      }
    },
    /*
    any src file added/deleted
    note. watch often misses if a folder is deleted causeing ENOENT error.
    the error will clear next time watch is reloaded,
    just be aware of should you notice your build isn't correctly in sync
    */
    src: {
      files: ['<%= files.src.all %>'],
      tasks: ['build'],
      options: {
        event: ['added', 'deleted'],
        reload: true
      },
    },
    /*
    any content change not including js,style,html
    */
    content: {
      files: ['<%= files.src.content %>'],
      tasks: ['build'],
      options: {
        event: ['changed'],
      },
    },
    /*
    js change
    */
    js: {
      files: ['<%= files.src.js %>'],
      tasks: ['banner_js_changed'],
      options: {
        event: ['changed'],
      },
    },
    /*
    style change
    */
    style: {
      files: ['<%= files.src.less %>'],
      tasks: ['banner_style_changed'],
      options: {
        event: ['changed'],
      },
    },
    /*
    html change
    */
    html: {
      files: ['<%= files.src.html %>'],
      tasks: ['banner_html_changed'],
      options: {
        event: ['changed'],
      },
    }



  });

};
