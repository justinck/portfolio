var _;
var matchdep;
var chalk;
var module;

_ = require('underscore');
matchdep = require('matchdep');
chalk = require('chalk');

module.exports = function(grunt) {

    var config;
    var isDevLintTask;
    var isDevTasks;
    var pkg;
    var tasks;
    var watchJavascriptFiles = [];
    var watchRequireFiles = {
        src: [],
        dest: []
    };

    pkg = grunt.file.readJSON('package.json');
    config = grunt.file.readYAML('config/grunt.yml').config;
    isDevTasks = !(_.contains(grunt.cli.tasks, 'deploy') || _.contains(grunt.cli.tasks, 'prod'));

    // If this is the `dev-lint` task, then assign javascript files to be
    // watched.
    isDevLintTask = isDevTasks && _.contains(grunt.cli.tasks, 'dev-lint');
    if (isDevLintTask) {
        watchJavascriptFiles = config.files.js.app.src;
    } else if (isDevTasks && _.contains(grunt.cli.tasks, 'dev-require')) {
        watchRequireFiles.dest.push('web/build/require-main.js');
        watchRequireFiles.src = config.files.js.app.src;
    }

    grunt.initConfig({
        pkg: pkg,
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    src: config.files.img.src,
                    // Just replace the file
                    dest: '.'
                }]
            }
        },
        uglify: {
            requirejs: {
                files: {
                    'web/vendor/requirejs/require.min.js': ['web/vendor/requirejs/require.js']
                }
            }
        },
        replace: {
            indexProd: {
                src: 'web/index.html',
                overwrite: true,
                replacements: [
                    {
                        from: '<script src="/js/livereload.js"></script>',
                        to: '<!-- <script src="/js/livereload.js"></script> -->'
                    },
                    {
                        from: 'data-main="/js/require-main.js"',
                        to: 'data-main="/build/require-main.js"'
                    }
                ]
            },
            indexDev: {
                src: 'web/index.html',
                overwrite: true,
                replacements: [
                    {
                        from: '<!-- <script src="/js/livereload.js"></script> -->',
                        to: '<script src="/js/livereload.js"></script>'
                    },
                    {
                        from: 'data-main="/build/require-main.js"',
                        to: 'data-main="/js/require-main.js"'
                    }
                ]
            }
        },
        aws: grunt.file.readJSON('aws.json'), // Read the file
        aws_s3: { //jshint ignore:line
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                region: 'us-west-1',
                uploadConcurrency: 80, // 80 simultaneous uploads
                downloadConcurrency: 80 // 80 simultaneous downloads
            },
            testing: {
                options: {
                    bucket: 'two5six.com'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'web/',
                        src: [
                            'index.html',
                            'vendor/requirejs/require.min.js',
                            'svg/**',
                            'assets/**',
                            'img/**',
                            'fonts/**',
                            'build/require-main.js',
                            'css/main.css'
                        ],
                        dest: '/'
                    }
                ]
            }
        },
        exec: {
            'write-scss-import-file': {
                command: './scssImport.sh'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            inline: {
                files: {
                    src: config.files.js.app.src
                }
            },
            startup: {
                options: {
                    force: true
                },
                files: {
                    src: config.files.js.app.src
                }
            }
        },
        jscs: {
            inline: {
                files: {
                    src: config.files.js.app.src
                }
            },
            startup: {
                options: {
                    force: true
                },
                files: {
                    src: config.files.js.app.src
                }
            }
        },
        requirejs: {
            options: {
                findNestedDependencies: true,
                generateSourceMaps: true,
                optimize: 'uglify2',
                preserveLicenseComments: false,
                uglify2: {
                    //Example of a specialized config. If you are fine
                    //with the default options, no need to specify
                    //any of these properties.
                    output: {
                        beautify: false
                    },
                    compress: {
                        sequences: false
                    },
                    warnings: false,
                    mangle: false
                }
            },
            prod: {
                options: {
                    appDir: config.requirejs.appDir,
                    baseUrl: config.requirejs.baseUrl,
                    dir: config.requirejs.dir,
                    mainConfigFile: config.requirejs.mainConfigFile,
                    modules: config.requirejs.modules,
                    generateSourceMaps: false
                }
            },
            dev: {
                options: {
                    appDir: config.requirejs.appDir,
                    baseUrl: config.requirejs.baseUrl,
                    dir: config.requirejs.dir,
                    mainConfigFile: config.requirejs.mainConfigFile,
                    modules: config.requirejs.modules,
                    optimize: 'none'
                }
            }
        },
        sass: {
            options: {
                loadPath: config.files.scss.loadPaths,
                quiet: true,
                style: 'compact'
            },
            build: {
                src: config.files.scss.app.src,
                dest: config.files.scss.app.dest
            }
        },
        scsslint: {
            allFiles: config.files.scssImport.watch,
            options: {
                bundleExec: false,
                config: '.scss-lint.yml',
                colorizeOutput: true
            }
        },
        symlink: {
            options: {
                overwrite: true
            },
            'pre-commit-hook': {
                src: 'pre-commit-hook.sh',
                dest: '.git/hooks/pre-commit'
            }
        },
        watch: {
            imagemin: {
                files: config.files.img.src,
                tasks: 'newer:imagemin:build'
            },
            js: {
                files: watchJavascriptFiles,
                tasks: ['jshint:inline', 'jscs:inline', 'groc']
            },
            livereload: {
                options: {
                    livereload: config.liveReloadPort
                },
                files: [].concat(
                    'web/css/main.css',
                    config.files.js.app.src,
                    config.files.handlebars.src
                )
            },
            require: {
                options: {
                    interrupt: true
                },
                files: watchRequireFiles.src,
                tasks: ['requirejs:dev']
            },
            scssImport: {
                options: {
                    interrupt: true
                },
                files: config.files.scssImport.watch,
                tasks: ['exec:write-scss-import-file', 'sass']
            }
        }
    });
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('prepare_livereload', 'Build Locale files.', function() {
        var filename;
        var generateLiveReload;

        filename = config.files.js.livereload;
        generateLiveReload = function(port) {
            return '(function() {\n    \'use strict\';\n        var existing_script_tag = document.getElementsByTagName(\'script\')[0];\n        var host;\n        var new_script_tag = document.createElement(\'script\');\n        var url;\n        host = (location.host || \'localhost\').split(\':\')[0];\n        url = \'http://\' + host + \':' + port + '/livereload.js?snipver=1\';\n        new_script_tag.src = url;\n        existing_script_tag.parentNode.insertBefore(new_script_tag, existing_script_tag);\n})(); ';
        };

        if (isDevTasks) {
            grunt.file.write(filename, generateLiveReload(config.liveReloadPort));
            grunt.log.writeln('File ' + chalk.cyan(filename) + ' created');
        } else {
            grunt.file.write(filename, '');
        }
    });
    // delete-python-vendor-directory before installing vendor requirements is necessary because
    // pip is not idempotent when using the -t flag, which we want so the
    // vendor requirements are installed locally.
    // see: https://github.com/GoogleCloudPlatform/appengine-python-flask-skeleton/issues/1
    tasks = [
        'symlink:pre-commit-hook',
        'exec:write-scss-import-file',
        'sass',
        'newer:imagemin:build',
        'uglify',
        'prepare_livereload',
        'watch'
    ];

    // Default grunt task: `grunt`
    grunt.registerTask('default', tasks);

    // Register production build task
    // TODO: Add another task to switch out
    // the main script source with the build version upon deploy
    // `grunt prod`
    grunt.registerTask('prod', ['requirejs:prod']);

    // Register task for validating code.
    // `grunt validate-code`
    grunt.registerTask('validate-code', ['jshint:inline', 'jscs:inline', 'scsslint']);

    // Register task for testing
    // `grunt test`
    grunt.registerTask('test', ['validate-code']);

    grunt.registerTask('deploy', [
        'exec:write-scss-import-file',
        'sass',
        'requirejs:prod',
        'replace:indexProd',
        'uglify',
        'aws_s3',
        'replace:indexDev'
    ]);
};
