'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

// OBS:
//  Replace the string with informations
//  '<%= yeoman.moduleName %>' = Module name
//  '<%= yeoman.moduleDescription %>' = Module description
//  '<%= yeoman.moduleUrl %>' = Module url

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      moduleName: 'keepr',
      moduleDescription: 'keepr',
      moduleUrl: 'your-url-here',
      docs: 'docs'
    },

    //  Project documentation
    yuidoc: {
      all: {
        name: '<%= yeoman.moduleName %>',
        description: '<%= yeoman.moduleDescription %>',
        version: '0.0.1',
        url: '<%= yeoman.moduleUrl %>',
        options: {
          paths: ['<%= yeoman.app %>/scripts/'],
          outdir: '<%= yeoman.docs %>/',
          themedir: '<%= yeoman.app %>/bower_components/yuidoc-bootstrap-theme/',
          helpers: ['<%= yeoman.app %>/bower_components/yuidoc-bootstrap-theme/helpers/helpers.js']
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },

      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 3000
        }
      ],

      livereload: {
        options: {

          middleware: function(connect, options){
            if (!Array.isArray(options.base)){
              options.base = [options.base];
            }

            //  Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            //  Serve static files.
            options.base.forEach(function(base){
              middlewares.push(connect.static(base));
            });

            //  Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          },

          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      },
      docs: {
        options: {
          base: '<%= yeoman.docs %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'Gruntfile.js'
        ],
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '**/*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/scripts/',
          dest: '<%= yeoman.dist %>/scripts/',
          src: '**'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [],
      test: [],
      dist: []
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          //  package name
          '<%= yeoman.dist %>/<%= yeoman.moduleName %>.min.js': [
            //  List of all files in scripts folder (if have some file in "scripts" root folder)
            '<%= yeoman.app %>/scripts/*.js',
            //  List of all directives
            '<%= yeoman.app %>/scripts/directives/**/*.js',
            //  List of all filters
            '<%= yeoman.app %>/scripts/filters/**/*.js',
            //  List of all services
            '<%= yeoman.app %>/scripts/services/**/*.js'
          ]
        }
      }
    },

    concat: {
      dist: {
        src: [
            //  List of all files in scripts folder (if have some file in "scripts" root folder)
            '<%= yeoman.app %>/scripts/*.js',
            //  List of all directives
            '<%= yeoman.app %>/scripts/directives/**/*.js',
            //  List of all filters
            '<%= yeoman.app %>/scripts/filters/**/*.js',
            //  List of all services
            '<%= yeoman.app %>/scripts/services/**/*.js'
        ],
        dest: '<%= yeoman.dist %>/<%= yeoman.moduleName %>.js'
      },
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('buildNgModuleFile', 'Task for build ng module script file.', function(filename) {
    var path = require('path'),
        fs = require('fs'),
        SCRIPTS_DIST_DIR = 'dist/'
    ;

    //  uncompressed and compressed module
    var buildFile = function(filename){

      var angularModule = {
        contentUncompressed: {
          header: '(function(window, angular, undefined) {' +
                              '\n' +
                              '\'use strict\';' +
                              '\n',
          footer: '\n' +
                  '})(window, window.angular);'
        },
        contentCompressed: {
          header: '(function(window, angular, undefined){ "use strict";',
          footer: '})(window, window.angular);'
        }
      };

      var remove = ['\'use strict\';', '"use strict";'];

      //  Verifying template for include in compiled file
      var templateNgModule = (filename.indexOf('.min.') !== (-1)) ? angularModule.contentUncompressed : angularModule.contentCompressed;

      var data = fs.readFileSync(filename, 'utf8');
      data = templateNgModule.header + data.replace(new RegExp(remove[0], 'g'), '').replace(new RegExp(remove[1], 'g'), '') + templateNgModule.footer;
      fs.writeFileSync(filename, data, 'utf8');
      console.log('Build of filename "'+filename+'" finished with success');
    };

    fs.readdirSync(SCRIPTS_DIST_DIR).forEach(function(file) {
      if ( file.indexOf(filename) !== (-1) ) {
        buildFile(SCRIPTS_DIST_DIR + filename);
      }
    });
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    if (target === 'docs') {
      return grunt.task.run(['connect:docs:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    target = ':'+target || '';
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve'+target]);
  });

  grunt.registerTask('docs', [
    'yuidoc'
  ]);
  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'ngmin',
    'copy:dist',
    'uglify',
    'buildNgModuleFile:'+grunt.config.get('yeoman')['moduleName']+'.js',
    'buildNgModuleFile:'+grunt.config.get('yeoman')['moduleName']+'.min.js'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
