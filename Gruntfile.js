module.exports = function(grunt) {

  /*
  =============================================================
  project path inside src folder e.g.
  (src/) 'clientFolder/projectFolder' (/banner files)
  */

  var project = 'examples/standard';
  // var project = 'examples/doubleclick';



  /*
  =============================================================
  set project directory and load grunt files
  */
  var path = require('path');
  grunt.config.set('projectDir', project);
  grunt.file.expand('./grunt/*/*.js').forEach(function(item) {
    require(path.resolve(item))(grunt);
  });
};
