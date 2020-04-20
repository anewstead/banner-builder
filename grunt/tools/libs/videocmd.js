/*
capturer and input are platform specifc (mac/linux/windows)
input below is video:audio device number. these can change position but for example:
0=default display
1=webcam
2=secondary/ external display

you can verbose log info when run if you uncomment on.stderror below

crop below is w:h:x:y adjust x:y to locate inner-top-left corner of chromium window

a little dev gotcha to be aware of:
if you are using mac quicktime(10+)to view recorded clips
quicktime will not display clips smaller than its control bar overlay
so a video 160x600 will show proportionally larger to accomodate the controls, i.e 379x1422!
google chrome does display correctly, simply drag an mp4 into chrome window.
*/

'use strict';
const events = require('events');

const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static');

process.env.FFMPEG_PATH = ffmpeg.path;
process.env.FFPROBE_PATH = ffprobe.path;

const fluent = require('fluent-ffmpeg');
var command;

/*
*/
module.exports = new events.EventEmitter();

/*
*/
module.exports.start = function(banner) {
  var b = banner;
  //these are for mac, windows and linux may be different
  var capturer = 'avfoundation';
  var device = '1:0'; //video:audio device

  command = fluent()
    // .addOptions(['-list_devices true'])
    .videoCodec('libx264')
    .videoBitrate('1000k')
    .audioBitrate('96k')
    .addOptions([
      '-pix_fmt yuv420p',
      '-preset veryfast',
      '-tune zerolatency',
      '-threads 2',
      '-async 1',
      '-crf 17'
    ])
    .input(device)
    .inputOptions(['-f ' + capturer])
    // .duration(25)
    .fps(25)
    .size(b.width + 'x' + b.height)
    .videoFilters([
      {
        filter: 'crop',
        options: b.width + ':' + b.height + ':' + '0:136'
      }
    ])
    .on('start', function (progress) {
      console.log('Screen Capture Start');
    })
    .on('stderr', function (e) {
      // console.log('-- ' + e);//ffmpeg dumps ALL messages to this!
    })
    .on('error', function (e) {
      if (e.message.indexOf('code 255') > -1 && e.message.indexOf('signal 2') > -1) {
        //code255+signal2=expected end from forced killsig
        console.log('Screen Capture Completed');
        module.exports.emit('complete');
      } else {
        console.log('onerror:', e);
      }
    })
    .save(b.output + '.mp4');
};

/*
*/
module.exports.end = function() {
  try {
    command.kill('SIGINT'); //SIGINT(2) or SIGTERM(15)
    // console.log('kill(SIGINT)');
  } catch (e) {
    console.log('videocmd: end killsig error: ' + e);
  }
};
