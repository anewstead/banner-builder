module.exports = function(grunt, banner) {
  'use strict';

  var path = require('path');
  var chalk = require('chalk');
  var jsName = grunt.config.get('files.names.output.js');
  var ovrName = grunt.config.get('files.names.override.js');

  //allow for global template overrides
  //src overrides common overrides global
  //css take precedence over less (not that you would ever have both main.{css,less})
  var commonDir = grunt.config.get('files.dir.common');

  var ovrCommon = path.resolve(commonDir, banner.size, ovrName);
  var ovrSrc = path.resolve(banner.srcDir, ovrName);

  var override;

  if (grunt.file.exists(ovrSrc)) {
    override = ovrSrc;
  } else if (grunt.file.exists(ovrCommon)) {
    override = ovrCommon;
  }

  if (override) {

    console.log(chalk.magenta('>> ') + banner.name + 'JS OVERRIDE: ' + override);

    //use override file only, no concat
    grunt.config.set('concat.js_' + banner.name, {
      files: [{
        src: [
          override
        ],
        dest: path.resolve(banner.outDir, jsName)
        }]
    });

  } else {

    //concat global,common,src
    grunt.config.set('concat.js_' + banner.name, {
      options: {
        separator: '\n/*!--!*/\n\n'
      },
      files: [{
        src: [
          '<%= files.dir.global %>' + '/*.js',
          '<%= files.dir.common %>' + '/' + banner.size + '/*.js',
          banner.srcDir + '/*.js',
          /*ignore*/
          '!<%= files.dir.global %>' + '/clicktag.js',
          '!<%= files.dir.common %>' + '/' + banner.size + '/clicktag.js',
          '!' + banner.srcDir + '/clicktag.js'
        ],
        dest: path.resolve(banner.outDir, jsName)
        }]
    });

  }

};
