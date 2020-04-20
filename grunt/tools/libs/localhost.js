const connect = require('connect');
const serveStatic = require('serve-static');

module.exports = function (rootFolder, port) {
  'use strict';
  var url = 'http://localhost:' + port;
  return new Promise(function (resolve, reject) {
    try {
      var app = connect();
      app.use(serveStatic(rootFolder));
      app.listen(port, function () {
        console.log('Started connect web server on ' + url);
        resolve({ app: app, baseURL: url });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};
