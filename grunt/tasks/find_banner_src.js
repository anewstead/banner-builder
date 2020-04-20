module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  var commonDir = grunt.config.get('files.dir.common');
  var globalDir = grunt.config.get('files.dir.global');
  var srcDir = grunt.config.get('files.dir.src');

  var jsClick = grunt.config.get('files.names.config.clicktag');
  var jsNaming = grunt.config.get('files.names.config.naming');

  function checkClickTag(folder) {
    var file = path.resolve(folder, jsClick);
    if (grunt.file.exists(file)) {
      return grunt.file.read(file);
    } else if (folder === globalDir) {
      grunt.fail.fatal(jsClick + ' not found in: ' + globalDir);
    } else {
      return false;
    }
  }

  function checkNameFile(folder) {
    var file = path.resolve(folder, jsNaming);
    if (grunt.file.exists(file)) {
      var txt = JSON.parse(grunt.file.read(file));
      return txt;
    } else {
      return false;
    }
  }

  function checkSafeName(str) {
    var regex = /(^[^-_])([a-zA-Z0-9_-]*$)/;
    var safe = str.match(regex);
    if (!safe) {
      grunt.log.error('names cannot start with _- can only contain a-ZA-Z0-9_- and have no spaces');
    }
    return safe;
  }

  function checkSafeSize(str) {
    var split = str.split('x');
    if (split.length !== 2) {
      return false;
    }
    var safe = (Number(split[0]) && Number(split[1]));
    if (!safe) {
      grunt.log.error('size folders must be width x height (e.g 300x250)');
    }
    return safe;
  }

  /*
  loops through folders in the paths: src/banner_creatives/banner_sizes

  outputs to
  grunt.config.bannersData - used in grunt scripts
  grunt.config.linksData - used for HTML links_index

  checks for clickTag.js in common, creative_group, and size folders
  checks for names.json naming convention override in creative_group folders
  */

  grunt.registerTask('find_banner_src', 'find banners in the src folder', function() {

    var globalClicktag = checkClickTag(globalDir);

    var banners = [];
    var linksData = [];
    var staticCount = 0;

    //loop src folder for creative groups (e.g. client_campaign_creative)
    grunt.file.expand(srcDir + '/*').forEach(function(creativeDir) {

      if (grunt.file.isDir(creativeDir) && creativeDir !== commonDir) {

        var creativeDirName = creativeDir.substring(creativeDir.lastIndexOf('/') + 1);

        var names = checkNameFile(creativeDir);
        var creativeClicktag = checkClickTag(creativeDir);

        //loop each creative group for size varients (e.g. 300x600)
        grunt.file.expand(creativeDir + '/*').forEach(function(sizeDir) {

          if (grunt.file.isDir(sizeDir)) {

            var sizeDirName = sizeDir.substring(sizeDir.lastIndexOf('/') + 1);

            if (!checkSafeSize(sizeDirName)) {
              grunt.log.error(creativeDirName + '/' + sizeDirName);
              grunt.fail.fatal('Unexpected size folder: ' + sizeDirName);
            }

            var banner = {};
            banner.size = sizeDirName;
            banner.width = banner.size.split('x')[0];
            banner.height = banner.size.split('x')[1];

            //auto name convention
            banner.group = creativeDirName;
            banner.name = creativeDirName + '_' + sizeDirName;

            if (!checkSafeName(banner.name)) {
              grunt.log.error('Folder: ' + creativeDirName);
              grunt.fail.fatal('Not URL friendly: ' + banner.name);
            }

            //forced naming convention
            if (names) {
              var nameString;
              if (names.all && names.all.indexOf('#size#')) {
                nameString = names.all;
              }
              if (names[banner.size]) {
                nameString = names[banner.size];
              }
              if (nameString) {
                banner.name = nameString.replace(/#size#/g, banner.size);
                if (!checkSafeName(banner.name)) {
                  grunt.log.error(creativeDirName + '/' + jsNaming);
                  grunt.fail.fatal('Not URL friendly: ' + banner.name);
                }
                //check if duplicate banner name
                banners.filter(function(obj) {
                  //console.log(obj.name+' | '+banner.name);
                  if (obj.name === banner.name) {
                    grunt.log.error(creativeDirName + '/' + jsNaming);
                    grunt.fail.fatal('duplicate name convention found: ' + banner.name);
                  }
                });
                //force group name - unused as could cause issues if not used in the intended way in names.json
                //var split = banner.name.split(/\d{2,4}x\d{2,4}/);//split at dimention (300x600)
                //banner.group = split[0].replace(/[-_]$/, '');//remove trailing -_
                //console.log('force_group: '+banner.group);
              }
            }

            //directories
            banner.srcDir = sizeDir;
            banner.outDir = path.resolve('<%= files.dir.build %>', banner.group, banner.name);

            //clicktag
            var sizeClicktag = checkClickTag(sizeDir);
            if (sizeClicktag) {
              banner.clicktag = sizeClicktag;
            } else if (creativeClicktag) {
              banner.clicktag = creativeClicktag;
            } else {
              banner.clicktag = globalClicktag;
            }

            //banner is failover image only (presumes if only 1 file it is gif/jpeg/png)
            var content = grunt.file.expand(sizeDir + '/*');
            if (content.length === 1) {
              var ext = content[0].split('.').pop();
              banner.isStatic = ext;
              staticCount++;
            }

            //push to arrays
            banners.push(banner);

            linksData.push({group: banner.group, name: banner.name, isStatic: banner.isStatic});

          }
        }); //end each size

      }

    }); //end each creative group

    grunt.config.set('bannersData', banners);
    grunt.config.set('linksData', JSON.stringify(linksData, null, 2));

    grunt.log.ok(banners.length + ' banner folders found at ' + srcDir);
    if (staticCount > 0) {
      grunt.log.ok(staticCount + ' is image only');
    }

  }); //end registerTask

};
