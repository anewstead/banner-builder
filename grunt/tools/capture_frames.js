/* use of async/await requires Node v7.6.0 or greater */
module.exports = function (grunt) {
  'use strict';
  const localhost = require('./libs/localhost');

  const capture = require('./libs/do_capture_frames');

  const fs = require('fs-extra');
  const chalk = require('chalk');

  const buildDir = grunt.config.get('files.dir.build');
  const tmpDir = grunt.config.get('files.dir.tmp');
  const outDir = tmpDir + '/capture/png';

  var server;
  var taskComplete;
  var banners = [];
  /*
   */
  grunt.registerTask('capture_frames', 'captures frame of banners', async function () {
    //holds grunt in async call taskComplete() to release
    taskComplete = this.async();
    server = await localhost(buildDir, 9001);
    //create banner objects array, strip out isStatic banners
    grunt.config.get('banners_build').forEach(function (banner) {
      if (!banner.isStatic) {
        banner.outDir = outDir + '/' + banner.name;
        fs.ensureDirSync(banner.outDir); //Make sure the write directory is there.
        banner.output = banner.outDir + '/' + banner.name; //file path and name without final string & extention
        banner.url = server.baseURL + banner.dir.split(buildDir)[1];
        banners.push(banner);
      }
    });
    if (banners.length > 0) {
      capture.on('complete', taskComplete);
      capture.start(banners);
    } else {
      console.log(chalk.yellow('>> no pages found in: ' + buildDir));
      taskComplete();
    }
  });

};
