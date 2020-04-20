module.exports = function(grunt, banner) {
  'use strict';

  var path = require('path');
  var chalk = require('chalk');

  var LessPluginAutoPrefix = require('less-plugin-autoprefix');
  var autoPrefixPlugin = new LessPluginAutoPrefix({browsers: ['last 5 versions']});

  //allow for global template overrides
  //src overrides common overrides global
  //css take precedence over less (not that you would ever have both main.{css,less})
  var commonDir = grunt.config.get('files.dir.common');
  var cssName = grunt.config.get('files.names.output.css');
  var ovrName = grunt.config.get('files.names.override.less');

  var ovrCommon;
  var ovrSrc;
  var override;

  function checkFiles(doc) {
    ovrCommon = path.resolve(commonDir, banner.size, doc);
    ovrSrc = path.resolve(banner.srcDir, doc);

    if (grunt.file.exists(ovrSrc)) {
      override = ovrSrc;
    } else if (grunt.file.exists(ovrCommon)) {
      override = ovrCommon;
    }
  }

  //check for .less
  checkFiles(ovrName);

  if (!override) {
    //check for .css
    ovrName = ovrName.split('.')[0] + '.css';
    checkFiles(ovrName);
  }

  if (override) {
    console.log(chalk.magenta('>> ') + 'STYLE OVERRIDE: ' + override);

    //use override file only, no concat
    grunt.config.set('less.' + banner.name, {
      options: {
        compress: false,
        modifyVars: {
          //imagePath: '""',
        },
        plugins: [autoPrefixPlugin]
      },
      files: [
        {
          src: [override],
          dest: path.resolve(banner.outDir, cssName)
        }
      ]
    });

  } else {

    //concat global,common,src
    grunt.config.set('less.' + banner.name, {
      options: {
        compress: false,
        modifyVars: {
          //imagePath: '""',
        },
        plugins: [autoPrefixPlugin]
      },
      files: [
        {
          src: [
            '<%= files.dir.global %>' + '/*.{less,css}',
            '<%= files.dir.common %>' + '/' + banner.size + '/*.{less,css}',
            banner.srcDir + '/*.{less,css}'
          ],
          dest: path.resolve(banner.outDir, cssName)
        }
      ]
    });

  }

};
