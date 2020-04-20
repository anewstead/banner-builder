module.exports = function(grunt) {

  /*
  'pngmin:tmp'
  (task is in config folder, referenced here for convience)
  compress pngs using pngquant
  you need to place pngs in  _tmp/pngmin/...
  */


  /*
  'imagejs'
  if a banner does not already have images.js
  this will create it by finding all the images in the banner folder
  also writes a html file of the placeholder divs to tmp folder
  */
  grunt.registerTask('imagejs', [
    'find_banner_src',
    'image_json'
  ]);

  /*
  'failovers'
  captures the banner end screen by listening for a specific console log (see code)
  compresses screenshots to required filesize
  */
  grunt.registerTask('stills', [
    'find_banner_build',
    'capture_frames',
    'make_jpeg',
    // 'make_psd',
    // 'make_gif'
  ]);

  /*
  'videos'
  captures the banner as video
  some client have requested videos of the banner production
  presumedly as their corporate setup is prohibative to a live link or the HTML being sent
  */
  grunt.registerTask('videos', [
    'find_banner_build',
    'capture_video'
  ]);

};
