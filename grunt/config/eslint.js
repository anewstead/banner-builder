module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-eslint');

  grunt.config.set('eslint', {
    options: {
      configFile: './grunt/config/eslintrc.json',
      plugins: ['json'],
      fix: true
    },
    grunt: ['<%= files.grunt.js %>'],
    banner: ['<%= files.src.js %>', '<%= files.src.json %>']
  });

};
