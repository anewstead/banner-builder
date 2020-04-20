/*
use of async/await requires Node v7.6.0 or greater
*/
module.exports = function(grunt) {
  // var Canvas = require('canvas-prebuilt'); //required to read psd
  // var createCanvas = require('canvas-prebuilt').createCanvas;
  // var loadImage = require('canvas-prebuilt').loadImage;

  var PImage = require('pureimage'); //could be used instead os canvas.js if write psd only

  var writePsd = require('ag-psd').writePsd;
  var readPsd = require('ag-psd').readPsd;
  var initializeCanvas = require('ag-psd').initializeCanvas;

  var fs = require('fs-extra');
  var chalk = require('chalk');

  /*
  DEV NOTES
  node-canvas requires c# libraries to be compilled and installed, we dont want this complication.
  canvas-prebuilt instead uses precompiled version of these libraries, much better as installs with everything else with: npm install
  however, the current release 1.6.5-prerelease.1 has a bug which stops grunt initialization
  canvas-prebuilt does work as expected in isolation but it throws an error when this module is loaded into grunt
  ERROR >> TypeError: Cannot set property 'position' of undefined
  remaining js modules are then not loaded

  so we are instead using PImage to write images to ag-psd
  but if you need to read a PSD you will need canvas-prebuilt



  development helper
  creates layered psd from png frame captures
  output psd are intended to be manually edited to create animated gif
  */

  grunt.registerTask('make_psd', 'compress tmp png to animated gif', function() {

    var taskComplete = this.async();

    var tmpDir = grunt.config.get('files.dir.tmp');
    var srcDir = tmpDir + '/capture/png'; //see capture_frames
    var outDir = tmpDir + '/capture/psd';

    var banners = [];

    //Make sure the write directory is there.
    fs.ensureDirSync(outDir);

    /*
    find images to compress
    */
    grunt.config.get('banners_build').forEach(function(banner) {
      if (!banner.isStatic) {
        banner.output = outDir + '/' + banner.name + '.psd';
        banner.srcDir = srcDir + '/' + banner.name;
        banner.images = [];
        grunt.file.expand(banner.srcDir + '/*.png').forEach(function(item) {
          banner.images.push(item);
        });
        banners.push(banner);
      }
    });

    /*
    */
    // function loadCanvasFromFile(filePath) {
    //   var img = new Canvas.Image();
    //   img.src = fs.readFileSync(filePath);
    //   var canvas = new Canvas(img.width, img.height);
    //   var ctx = canvas.getContext('2d');
    //   ctx.drawImage(img, 0, 0);
    //   return canvas;
    // }

    /*
    */
    function newLayer(psd, pngFile) {
      // PImage version
      return new Promise(function(resolve, reject) {
        PImage.decodePNGFromStream(fs.createReadStream(pngFile)).then(function(pngData) {
          psd.children.push({
            name: 'Layer ' + psd.children.length,
            canvas: pngData
          });
          resolve();
        }).catch(function(e) {
          console.log('addLayer error: ' + e);
          reject();
        });
      });
      // canvas version
      // psd.children.push({
      //   name: 'Layer ' + psd.children.length,
      //   canvas: loadCanvasFromFile(pngFile)
      // });
    }

    /*
    */
    async function addLayers(psd, images) {
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        try {
          await newLayer(psd, img);
        } catch (e) {
          console.log('failed: ' + e + ':' + img);
        }
      }
    }

    /*
    */
    async function newPSD(banner) {
      var psd = {
        width: banner.width,
        height: banner.height,
        children: []
      };
      await addLayers(psd, banner.images);
      var buffer = writePsd(psd);
      await fs.writeFileSync(banner.output, buffer);
      console.log('processed: ' + banner.output);
    }

    /*
    */
    function start() {
      if (banners.length > 0) {
        newPSD(banners.shift()).then(function() {
          start(); //loop back for next
        });
      } else {
        console.log(chalk.green('\n>> process psd complete'));
        taskComplete();
      }
      // test read (comment out write above)
      // initializeCanvas((width, height) => new Canvas(width, height));
      // const buffer = fs.readFileSync(tmpDir+'/test1.psd');
      // const psd = readPsd(buffer);
      // console.log(psd);
    }

    start();

  });

};
