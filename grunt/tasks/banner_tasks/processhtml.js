module.exports = function(grunt, banner) {
  'use strict';

  var path = require('path');
  var chalk = require('chalk');
  var htmlName = grunt.config.get('files.names.output.html');

  if (banner.isStatic) {

    //use template for single image banner
    grunt.config.set('processhtml.' + banner.name, {
      options: {
        data: {
          banner:{
            group: banner.group,
            size: banner.size,
            width: banner.width,
            height: banner.height,
            clicktag: banner.clicktag,
            image: banner.name + '.' + banner.isStatic
          }

        }
      },
      files: [{
        src: ['<%= files.template.static %>'],
        dest: path.resolve(banner.outDir, htmlName)
      }]
    });

  } else {

    //allow for global template overrides
    //src overrides common overrides global
    var commonDir = grunt.config.get('files.dir.common');
    var template = grunt.config.get('files.template.banner');
    var ovrName = grunt.config.get('files.names.override.html');

    var ovrCommon = path.resolve(commonDir, banner.size, ovrName);
    var ovrSrc = path.resolve(banner.srcDir, ovrName);

    if (grunt.file.exists(ovrSrc)) {
      template = ovrSrc;
      console.log(chalk.magenta('>> ') + 'HTML OVERRIDE: ' + template);
    }
    else if (grunt.file.exists(ovrCommon)) {
      template = ovrCommon;
      console.log(chalk.magenta('>> ') + 'HTML OVERRIDE: ' + template);
    }

    grunt.config.set('processhtml.' + banner.name, {
      options: {
        data: {
          banner:{
            group: banner.group,
            size: banner.size,
            width: banner.width,
            height: banner.height,
            clicktag: banner.clicktag,
            script: '<%= files.names.output.js %>',
            styles: '<%= files.names.output.css %>'
          }
        }
      },
      files: [{
        src: [template],
        dest: path.resolve(banner.outDir, htmlName)
      }]
    });

  }

};
