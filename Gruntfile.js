module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "dist/css/main.css": "source/less/main.less"
                }
            },
        },

        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            js: {
                files: {
                    'dist/js/main.min.js': ['dist/js/main.js'],
                    'dist/js/vendors.min.js': ['dist/js/vendors.js']
                }
            }
        },

        cssmin: {
            css: {
                files: {
                    'dist/css/main.min.css': ['dist/css/main.css']
                }
            }
        },

        watch: {
            css: {
                files: ['source/less/*.less', 'source/less/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            js: {
                files: 'source/js/*.js',
                tasks: ['concat', 'uglify:js']
            }
        },

        concat: {
            dist: {
                src: [
                    'source/js/*.js'
                ],
                dest: 'dist/js/main.js',
            },
            vendors: {
                src: [
                    'source/vendors/jquery-mousewheel/jquery.mousewheel.js',
                    'source/vendors/gsap/src/uncompressed/TweenMax.js',
                    'source/vendors/gsap/src/uncompressed/plugins/ScrollToPlugin.js',
                    'source/vendors/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js',
                    'source/vendors/ScrollMagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
                    // 'source/vendors/ScrollMagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js',
                    'source/vendors/history.js/scripts/bundled-uncompressed/html5/jquery.history.js',
                    'source/vendors/Snap.svg/dist/snap.svg.js'
                ],
                dest: 'dist/js/vendors.js',
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: 'dist'
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('w', ['watch']);
    grunt.registerTask('c', ['concat']);
    grunt.registerTask('serve', ['connect', 'watch']);

};
