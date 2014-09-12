#!/usr/bin/node

/**
 * Gruntfile.js
 * Compress and uploads the stylesheets, scripts and images to Amazon S3.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package portfolio
 */

(function(){
  'use strict';

  module.exports = function(grunt) {

    // Let's setup our environment.
    var target = grunt.option('target') || 'development';

    process.env.NODE_ENV = target;

    var config = require(process.cwd() + '/config/' + target)();

    // Project configuration.
    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      clean: {
        dist: 'dist/',
        tmp: [
          'tmp/concatenated/',
          'tmp/compiled/',
          'tmp/pre-gzip/'
        ]
      },

      jsonmin: {
        dist: {
          files: [{
            expand: true,
            cwd: 'assets/locales/',
            src: [ '**/*.json' ],
            dest: 'tmp/pre-gzip/locales/'
          }]
        }
      },

      jade: {
        options: {
          data: {
            environment: target,
            config: config
          }
        },
        dist: {
          expand: true,
          cwd: 'views/',
          src: [ '**/*.jade' ],
          dest: 'tmp/pre-gzip/views/',
          ext: '.html'
        }
      },

      import: {
        dist: {
          expand: true,
          cwd: 'assets/js/',
          src: [ '**/*.js' ],
          dest: 'tmp/concatenated/js/'
        },
        tasks: [ 'uglify:dist' ]
      },

      uglify: {
        options: {
          banner: '/*! Copyright © <%= grunt.template.today("yyyy") %> Dealer Instincts - <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          sourceMap: true
        },
        dist: {
          expand: true,
          cwd: 'tmp/concatenated/js/',
          src: [ '**/*.js' ],
          dest: 'tmp/pre-gzip/js/'
        }
      },

      less: {
        options: {
          compress: false
        },
        dist: {
          expand: true,
          cwd: 'assets/css/',
          src: [
            '**/*.less',
            '!vendors/**'
          ],
          dest: 'tmp/compiled/css/',
          ext: '.css'
        }
      },

      cssmin: {
        options: {
          banner: '/*! Copyright © <%= grunt.template.today("yyyy") %> Dealer Instincts - <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          keepSpecialComments: 0
        },
        dist: {
          expand: true,
          cwd: 'tmp/compiled/css/',
          src: [ '**/*.css' ],
          dest: 'tmp/pre-gzip/css/'
        }
      },

      imagemin: {
        dist: {
          expand: true,
          cwd: 'public/img/',
          src: [ '**/*.{png,jpg,gif,svg}' ],
          dest: 'tmp/pre-gzip/img/'
        }
      },

      copy: {

        pdf: {
          expand: true,
          cwd: 'public/',
          src: [ '**/*.pdf' ],
          dest: 'tmp/pre-gzip/'
        },

        img: {
          expand: true,
          cwd: 'public/img/',
          src: [ '**/*.ico' ],
          dest: 'tmp/pre-gzip/img/'
        },

        fonts: {
          expand: true,
          cwd: 'public/fonts/',
          src: [ '**/*' ],
          dest: 'tmp/pre-gzip/fonts/'
        }

      },

      compress: {
        dist: {
          options: {
            mode: 'gzip'
          },
          files: [{
            expand: true,
            cwd: 'tmp/pre-gzip/',
            src: [ '**/*.*' ],
            dest: 'dist/',
            ext: function(ext){
              return ext;
            }
          }]
        },
        tasks: [ 'clean:tmp' ]
      },

      aws_s3: {
        options: {
          accessKeyId: config.aws.key,
          secretAccessKey: config.aws.secret,
          region: 'us-east-1'
        },
        deploy: {
          options: {
            bucket: config.aws.s3.bucket,
            params: {
              ContentEncoding: 'gzip'
            },
            differential: true
          },
          files: [{
            cwd: 'dist/',
            dest: '',
            action: 'delete'
          }, {
            expand: true,
            cwd: 'dist/',
            src: [ '**/*' ],
            dest: '',
            action: 'upload'
          }]
        }
      }

    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-jsonmin');

    var build = [
      'clean:dist',
      'jade',
      'jsonmin',
      'import',
      'uglify',
      'less',
      'cssmin',
      'imagemin',
      'copy:pdf',
      'copy:img',
      'copy:fonts',
      'compress',
      'clean:tmp'
    ];

    // Default tasks.
    grunt.registerTask('default', build);
    grunt.registerTask('build', build);

    grunt.registerTask('deploy', [
      'aws_s3'
    ]);

  };

})();