module.exports = function(grunt, banner) {
  'use strict';

  if (banner.isStatic) {

    grunt.config.set('copy.' + banner.name, {
      files: [{
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: [
            banner.srcDir + '/*'
          ],
        dest: banner.outDir,
        rename: function(dest, src) {
          var ext = src.split('.').pop();
          return dest + '/' + banner.name + '.' + ext;
        }
      }]
    });

  } else {

    grunt.config.set('copy.' + banner.name, {
      files: [{
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: [
          '<%= files.dir.global %>' + '/*',
          '<%= files.dir.common %>' + '/' + banner.size + '/*',
          banner.srcDir + '/*',
          /*ignore*/
          '!<%= files.dir.global %>' + '/*.{js,less,css}',
          '!<%= files.dir.common %>' + '/' + banner.size + '/*.{js,less,css,htm,html}',
          '!' + banner.srcDir + '/*.{js,less,css,htm,html}',
        ],
        dest: banner.outDir
      },
      {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: banner.srcDir + '/backup_img/*.jpg',
        dest: '<%= files.dir.build %>/' + banner.group + '/' + banner.group + '_backup_images/',
        rename: function(dest, src) {
          return dest + banner.name + '_backup.jpg';
        }
      },
      {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: banner.srcDir + '/backup_img/*.gif',
        dest: '<%= files.dir.build %>/' + banner.group + '/' + banner.group + '_backup_images/',
        rename: function(dest, src) {
          return dest + banner.name + '_backup.gif';
        }
      }]
    });

  }

};
