/* use of async/await requires Node v7.6.0 or greater

puppeteer currently officaily only supports chromium (until devToolApi is set)
however we want to use chrome release (from v59/60 mac/win)
this is currently working with puppeteer0.10.2 and chrome62.0.3202.94

future version will need testing, for example:
puppeteer0.13 does not work with chrome62.0.3202.94 but may do on a later chrome release
*/
const puppeteer = require('puppeteer');
const findChrome = require('chrome-finder');
const chromePath = findChrome();

module.exports = async function (headless) {
  'use strict';

  var launchArgs = [
    'about:blank', //initial page; about:blank to avoid google homescreen page
    '--window-position=0,0',
    '--window-size=1000,800'
  ];

  var browser = await puppeteer.launch({
    headless: headless, //show/hide
    ignoreHTTPSErrors: true,
    handleSIGINT: true, //for ctrl+c cexit process
    executablePath: chromePath,
    args: launchArgs
  });

  // return {browser: browser};

  //currently must create newPage as chrome has no browser.pages variable
  //should be added in later release
  var page = await browser.newPage();
  page.setViewport({width:1000, height:800});

  return { browser: browser, page: page };
};

// module.exports = function (headless) {
//   var launchArgs = [
//     'about:blank', //initial page; about:blank to avoid google homescreen page
//     '--window-position=0,0',
//     '--window-size=1000,800'
//   ];
//   return new Promise(async function (resolve, reject) {
//     await puppeteer.launch({
//         headless: headless, //show/hide
//         ignoreHTTPSErrors: true,
//         handleSIGINT: true, //for ctrl+c cexit process
//         executablePath: chromePath,
//         args: launchArgs
//       })
//       .then(function (inst) {
//         resolve({ browser: inst });
//       })
//       .catch(function (e) {
//         reject(e);
//       });
//   });
// };
