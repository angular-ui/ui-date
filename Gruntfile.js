module.exports = function(grunt) {
  // Tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: false
      },
      travis: {
        browsers: ['Firefox'],
        reporters: 'dots',
        autoWatch: false,
        singleRun: true
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['src/**/*.js', 'test/**/*.spec.js', 'demo/**/*.js']
    },

    conventionalChangelog: {
      options: {
        changelogOpts: {
          // conventional-changelog options go here
          preset: 'angular'
        },
      },
      release: {
        src: 'CHANGELOG.md'
      }
    },

  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('changelog', ['conventionalChangelog']);

  grunt.registerTask('test', 'Run tests on karma server', function() {
    if (process.env.TRAVIS) {
      grunt.task.run('karma:travis');
    } else {
      grunt.task.run('karma:unit');
    }
  });

};
