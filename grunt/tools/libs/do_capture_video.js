/* use of async/await requires Node v7.6.0 or greater */

'use strict';
const events = require('events');
const puppet = require('./puppet');
const videocmd = require('./videocmd');

const chalk = require('chalk');

/*
IMPORTANT - each banner MUST console.log messages containing these strings
note. both start and end string contain the key string
 */
const startString = 'start frame'; //unique to start
const keyString = 'frame'; //e.g. frame1, frame2
const endString = 'end frame'; //unique to end

/*
IMPORTANT - banner animation is typically <=30 seconds
add some extra time allowance for latency of network loads e.g. doubleclick enabler.
this is not a test case so easier to have a timeout fail instead of lots of error handling
i.e loaded and finished in this time or assume load-error or other incorrect
 */
const maxSeconds = 45;

var inst;
var banners;
var remaining;

/*
 */
module.exports = new events.EventEmitter();

module.exports.start = function ($banners) {
  banners = $banners;
  remaining = banners.length+1;//+1 for warmup
  newInstance();
};

/*
currently need to create multiple browsers instances,
a single browser with multiple tabs will not play animations in background tabs
*/
async function newInstance() {
  inst = await puppet(false); //returns object{browser,page}
  videocmd.on('complete', checkNext);
  inst.page.on('console', onConsoleHandler);
  warmUp();
}

/*
 */
function complete() {
  videocmd.removeAllListeners();
  module.exports.emit('complete');
}

/*
first run might have a slight delayed start on record
so pre run browser and ffmpeg so they run as correctly
 */
async function warmUp() {
  inst.banner = banners[0];
  console.log('warm up start');
  // await inst.page.goto(inst.banner.url);
  inst.timer = setTimeout(function () {
    console.log('warm up complete');
    videocmd.end();
  }, 3 * 1000);
  videocmd.start(inst.banner);
}

/*
 */
async function setPage() {
  inst.banner = banners.shift();
  console.log('Loading: ' + inst.banner.url);
  await inst.page.goto(inst.banner.url);
  inst.timer = setTimeout(function () {
    console.log(chalk.red('Timeout: ') + inst.banner.dir);
    videocmd.end();
  }, maxSeconds * 1000);
}

/*
 */
function onConsoleHandler(msg) {
  var str = msg.text ? msg.text : msg;
  var hasKey = str.indexOf(keyString) !== -1;
  var isStart = str.indexOf(startString) !== -1;
  var isEnd = str.indexOf(endString) !== -1;
  if (hasKey) {
    console.log('-> console: ' + str);
    if (isStart) {
      videocmd.start(inst.banner);
    } else if (isEnd) {
      clearTimeout(inst.timer);
      videocmd.end();
    }
  }
}

/*
 */
async function checkNext() {
  clearTimeout(inst.timer);
  remaining--;
  console.log(chalk.cyan('There are ' + remaining + ' pages remaining'));
  if (banners.length > 0) {
    setPage();
  } else {
    await inst.browser.close();
    module.exports.emit('complete');
  }
}
