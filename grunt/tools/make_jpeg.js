module.exports = function(grunt) {

  var jimp = require('jimp');
  // var path = require('path');
  var fs = require('fs-extra');
  var chalk = require('chalk');

  var maxKb = 40;

  function processImage(options, onCompleteCallback) {
    jimp.read(options.src, function(err, file) {
      if (err) {
        console.log('jimp error:' + err);
        return;
      }
      file.clone()
        .quality(options.quality)
        .write(options.dest, function() {
          checkSizeLoop(options, onCompleteCallback);
        });
    });
  }

  function checkSizeLoop(options, onCompleteCallback) {
    fs.stat(options.dest, function(err, stats) {
      if (err) {
        console.log('jimp error:' + err);
        return;
      }
      var bytes = stats.size;
      var kb = bytes / 1000;

      console.log(' - quality: ' + options.quality + ' - kb: ' + kb);

      if (options.quality > 0 && options.quality < 100) {
        //check if tried quality before - avoid inifinte loop
        var triedBefore = options.loops.filter(function(obj) {
          return obj.quality === options.quality;
        });
        if (triedBefore.length > 0 && kb < 40) {
          onCompleteCallback(options);
          return;
        }
        options.loops.push({
          'quality': options.quality,
          'kb': kb
        });
        //work down from oversize
        if (kb > maxKb + 30) {
          options.quality -= 10;
        } else if (kb > maxKb + 10) {
          options.quality -= 5;
        } else if (kb > maxKb) {
          options.quality -= 1;
        }
        //work up from undersize
        else if (kb < maxKb - 10) {
          options.quality += 2;
        } else if (kb < maxKb - 2) {
          options.quality += 1;
        } else {
          onCompleteCallback(options);
          return;
        }
        options.quality = Math.min(Math.max(options.quality, 0), 100);
        processImage(options, onCompleteCallback); //loop
      } else {
        onCompleteCallback(options);
      }
    });
  }

  /*
  development helper
  compresses the images taken by capture process
  */

  grunt.registerTask('make_jpeg', 'compress tmp end frame images', function() {

    var taskComplete = this.async();

    var tmpDir = grunt.config.get('files.dir.tmp');
    var srcDir = tmpDir + '/capture/png';//see capture_frames
    var outDir = tmpDir + '/capture/jpeg';

    var images = [];

    //find images to compress
    grunt.file.expand(srcDir + '/**/*_end.png').forEach(function(item) {
      images.push({
        src: item,
        name: item.substring(item.lastIndexOf('/') + 1).split('_end.png')[0]
      });
    });

    if (images.length > 0) {
      //Make sure the output directory is there.
      fs.ensureDirSync(outDir);

      console.log('processing: ' + chalk.cyan(images.length) + ' images to ' + chalk.cyan(maxKb + 'kb...'));
      startImageProcess(); //first image
    } else {
      console.log(chalk.yellow('>> no images found in: ' + srcDir));
      taskComplete();
    }

    function getOptions() {
      var img = images.shift();
      var options = {
        src: img.src,
        dest: outDir + '/' + img.name + '.jpg',
        quality: 99,
        loops: []
      };
      console.log('\nprocessing: ' + options.src);
      return options;
    }

    function startImageProcess() {
      if (images.length > 0) {
        processImage(getOptions(), imageProcessComplete);
      } else {
        console.log(chalk.green('\n>> process jpeg complete'));
        taskComplete();
      }
    }

    function imageProcessComplete(options) {
      console.log('processed: ' + options.dest);
      startImageProcess(); //next image
    }



  });

};
