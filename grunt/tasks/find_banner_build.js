module.exports = function(grunt) {
  'use strict';

  /*
  finds banners in the build folder by the fact they have a size string in the folder name e.g 300x600

  outputs to
  grunt.config.banners_build - used in grunt scripts
  */

  grunt.registerTask('find_banner_build', 'finds banners in the build folder', function() {

    var buildDir = grunt.config.get('files.dir.build');

    var banners = [];

    var staticCount = 0;

    //find banners to screenshot
    grunt.file.expand(buildDir + '/**/**').forEach(function(item) {
      if (grunt.file.isDir(item)) {
        // make sure it has dimention e.g. 300x250
        var dim = item.match(/\d{2,4}x\d{2,4}/);
        if (dim) {
          var loc = item.split('/');
          var banner = {};
          banner.group = loc[loc.length - 2];
          banner.name = loc[loc.length - 1];
          banner.size = dim[0];
          banner.width = banner.size.split('x')[0];
          banner.height = banner.size.split('x')[1];
          banner.dir = item;
          banners.push(banner);
          // check if if single image banner
          var content = grunt.file.expand(item + '/*');
          if (content.length === 2) {
            banner.isStatic = true;
            staticCount++;
          }
        }
      }
    });

    grunt.config.set('banners_build', banners);

    grunt.log.ok(banners.length + ' banner folders found at ' + buildDir);
    
    if (staticCount > 0) {
      grunt.log.ok(staticCount + ' is image only');
    }

  });

};
