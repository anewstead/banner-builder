/*
jquery style shorcut element selector (IE8+)
if you are including jquery you must comment this out
returns either a single item or an array of items if more then one is found
*/
var $ = function (s) {
  var m = document.querySelectorAll(s);
  return m.length < 2 ? m[0] : m;
};
