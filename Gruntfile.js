module.exports = function(grunt) {

  // Tasks
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma']);

  var testConfig = function(configFile, customOptions) {
    var options = {
      configFile: configFile,
      keepalive : true
    };

    var travisOptions = process.env.TRAVIS && {
      browsers : ['Firefox'],
      reporters: 'dots'
    };

    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    karma: {
      options  : testConfig('karma.conf.js'),
      singleRun: true
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      files: ['src/**/*.js', 'test/**/*.spec.js', 'demo/**/*.js']
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    }
  });

};
