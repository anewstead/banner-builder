/*
use of async/await requires Node v7.6.0 or greater
*/
module.exports = function(grunt) {

  var GIFEncoder = require('gifencoder');
  var pngFileStream = require('png-file-stream');
  var fs = require('fs-extra');
  var chalk = require('chalk');

  /*
  -----
  EXPERIMENTAL, currently not used, use make_psd instead.
  waiting to see if GIFEncoder gets updated for better animated gif compression.
  currently final gifs (after manually finished in photoshop) quality vs filesize is poor
  when compared to a gif of the same banner made directly from original source psd.
  -----

  development helper
  creates animated gif from png frame captures

  default frame delay = 3 seconds
  repeat loop = 1 (plays twice)

  production output
  gif created here are saved using highest quality available,
  recommend each gif is then opened in photoshop to individually time frames and optimise filesize
  */

  grunt.registerTask('make_gif', 'compress tmp png to animated gif', function() {

    var taskComplete = this.async();

    var tmpDir = grunt.config.get('files.dir.tmp');
    var srcDir = tmpDir + '/capture/png'; //see capture_frames
    var outDir = tmpDir + '/capture/gif';

    var banners = [];

    //Make sure the write directory is there.
    fs.ensureDirSync(outDir);

    /*
    find images to compress
    */
    grunt.config.get('banners_build').forEach(function(banner) {
      if (!banner.isStatic) {
        banner.output = outDir + '/' + banner.name + '.gif';
        banner.srcDir = srcDir + '/' + banner.name;
        banners.push(banner);
      }
    });

    /*
    */
    function readWrite(banner) {
      return new Promise(function(resolve, reject) {
        var encoder = new GIFEncoder(banner.width, banner.height);
        var files = banner.srcDir + '/*.png';
        var png = pngFileStream(files);
        var gif = encoder.createWriteStream({repeat: 1, delay: 3000, quality: 1});
        var out = fs.createWriteStream(banner.output);

        // png.on('end', function() {
        //   console.log('pngs read');
        // });
        // gif.on('end', function() {
        //   console.log('pngs encoded to gif');
        // });
        // out.on('finish', function() {
        //   console.log('gif written');
        // });

        out.on('finish', resolve);
        out.on('error', reject);
        png.pipe(gif).pipe(out);
      });
    }

    /*
    */
    async function process(banner) {
      try {
        await readWrite(banner);
        console.log('processed: ' + banner.output);
      } catch (e) {
        console.log('failed: ' + banner.output);
      }
    }

    /*
    */
    function start() {
      if (banners.length > 0) {
        process(banners.shift()).then(function() {
          start(); //loop back for next
        });
      } else {
        console.log(chalk.green('\n>> process gif complete'));
        taskComplete();
      }
    }

    start();

  });

};
