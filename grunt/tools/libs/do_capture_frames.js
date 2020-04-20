/* use of async/await requires Node v7.6.0 or greater */

'use strict';
const events = require('events');
const puppet = require('./puppet');

const os = require('os');
const chalk = require('chalk');

const maxInstances = os.cpus().length;

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

var instances = []; //{banner,page,browser}
var banners;
var remaining;

/*
 */
module.exports = new events.EventEmitter();

module.exports.start = function ($banners) {
  banners = $banners;
  remaining = banners.length;
  newInstance();
};

/*
currently need to create multiple browsers instances,
a single browser with multiple tabs will not play animations in background tabs
*/
async function newInstance() {
  if (instances.length < maxInstances) {
    var inst = await puppet(true); //returns object{browser,page}
    inst.page.on('console', (msg) => {
      onConsoleHandler(inst, msg);
    });
    instances.push(inst);
    setPage(inst);
    if (banners.length > 0) {
      newInstance(); //until max
    }
  }
}

/*
 */
async function setPage(inst) {
  inst.banner = banners.shift();
  inst.shotCount = 0;
  console.log('Loading: ' + inst.banner.url);
  await inst.page.goto(inst.banner.url);
  inst.timer = setTimeout(function () {
    console.log(chalk.red('Timeout: ') + inst.banner.dir);
    checkNext(inst);
  }, maxSeconds * 1000);
}

/*
 */
async function onConsoleHandler(inst, msg) {
  var str = msg.text ? msg.text : msg;
  var hasKey = str.indexOf(keyString) !== -1;
  var isStart = str.indexOf(startString) !== -1;
  var isEnd = str.indexOf(endString) !== -1;
  if (hasKey) {
    console.log('-> console: ' + str);
    var output = inst.banner.output;
    if (isEnd) {
      clearTimeout(inst.timer);
      output += '_end.png';
      await screenshot(inst, output);
      checkNext(inst);
    } else {
      output += ('_0' + inst.shotCount + '.png');
      inst.shotCount++;
      await screenshot(inst, output);
    }
  }
}

/*
 */
async function screenshot(inst, filepath) {
  console.log('Screenshot: ' + filepath);
  await inst.page.screenshot({
    path: filepath,
    clip: {
      x: 0,
      y: 0,
      width: Number(inst.banner.width),
      height: Number(inst.banner.height)
    }
  });
}

/*
 */
async function checkNext(inst) {
  clearTimeout(inst.timer);
  remaining--;
  console.log(chalk.cyan('There are ' + remaining + ' pages remaining'));
  if (banners.length > 0) {
    setPage(inst);
  } else {
    //close instance down and remove
    // await inst.page.close();
    await inst.browser.close();
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].banner.output === inst.banner.output) {
        instances.splice(i, 1);
        // console.log(chalk.yellow('Window closed: ' + (instances.length) + ' instances remaining'));
        break;
      }
    }
    if (instances.length === 0) {
      console.log(chalk.green('\n>> Capture process complete'));
      // taskComplete();
      module.exports.emit('complete');
    }
  }
}
