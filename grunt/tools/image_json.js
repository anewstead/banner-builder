module.exports = function(grunt) {

  var sizeOf = require('image-size');
  var path = require('path');
  var chalk = require('chalk');

  /*
  development helper
  create json of images in src folder,
  (does not include svg as they can be used in differnt ways)

  outputs to scripts/img.js which is then used for polite loads
  THE images.js FILE IS ONLY WRITEN OUT IF IT DOES NOT ALREADY EXIST

  i.e. will not get overriden
  this allows for it to be manually editted
  if you need to output again remove the existing file

  also outputs a HTML helper file consiting of container divs for each of the images
  these are intended for manual use and can be deleted
  i.e. copy/paste divs into bannner template
  */

  grunt.registerTask('image_json', 'creates src/images.js, tmp/div.html', function() {

    var commonDir = grunt.config.get('files.dir.common');
    var globalDir = grunt.config.get('files.dir.global');
    var tmpDir = grunt.config.get('files.dir.tmp');
    var banners = grunt.config.get('bannersData');

    // images in global
    var global = grunt.file.expand(globalDir + '/*.{jpg,jpeg,gif,png}');

    banners.forEach(function(banner) {

      if (!banner.isStatic) {

        // images in common size and individual src
        var common = grunt.file.expand(commonDir + '/' + banner.size + '/*.{jpg,jpeg,gif,png}');
        var src = grunt.file.expand(banner.srcDir + '/*.{jpg,jpeg,gif,png}');
        var img = global.concat(common, src);

        //output files
        var imgFile = banner.srcDir + '/images.js';
        // var lessFile = banner.srcDir + '/images.less';
        var htmlFile = tmpDir + '/html_image_divs/' + banner.group + '/' + banner.size + '.html';

        //output values
        var imgData = [];
        var htmlTxt = '';
        var lessTxt = '';

        grunt.file.expand(img).forEach(function(item) {
          var file = item.substring(item.lastIndexOf('/') + 1);
          var id = file.slice(0, file.lastIndexOf('.'));
          var size = sizeOf(path.resolve(banner.srcDir, file));
          //create js object
          imgData.push({url: file, retina: true});
          //create html elements
          htmlTxt += '<div class="' + id + '"></div>\n';
          //create css var
          // lessTxt += '.' + id + ',\n';
          // lessTxt += '.' + id + ' img {\n';
          // lessTxt += '  width: ' + size.width / 2 + 'px;\n';
          // lessTxt += '  height: ' + size.height / 2 + 'px;\n';
          // lessTxt += '  // width: ' + size.width + 'px;\n';
          // lessTxt += '  // height: ' + size.height + 'px;\n';
          // lessTxt += '}\n';
          // console.log(dimensions.width, dimensions.height);
        });

        //create json and rewrite as javascript code - change double qoutes to single qoutes etc
        var jsonTxt = JSON.stringify(imgData, null, 2);
        var jsVal = jsonTxt.replace(/"url"/g, 'url')
        .replace(/"retina"/g, 'retina')
        .replace(/"true"/g, true)
        .replace(/"/g, '\'');

        var imgTxt = 'banner.politeImages = ' + jsVal + ';';

        if (!grunt.file.exists(imgFile)) {
          grunt.file.write(imgFile, imgTxt);
          console.log(chalk.green('>> ') + 'jsCreated:   ' + imgFile);
        } else {
          console.log(chalk.magenta('>> ') + 'jsExists:    ' + imgFile);
        }

        // if (!grunt.file.exists(lessFile)) {
        //   grunt.file.write(lessFile, lessTxt);
        //   console.log(chalk.green('>> ') + 'lessCreated: ' + lessFile);
        // } else {
        //   console.log(chalk.magenta('>> ') + 'lessExists:  ' + lessFile);
        // }

        //html is temp so just write
        grunt.file.write(htmlFile, htmlTxt);
        console.log(chalk.white('>> ') + 'html helper: ' + htmlFile);

      }

    });

  });

};
