/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['**/*.css'],
                    dest: 'public_dist/css',
                    ext: '.min.css'
                }]
            }
        },
        concat: {
            dist: {
                src: [
                    "public/js/app/my_irc.module.js",
                    "public/js/app/my_irc.route.js",
                    "public/js/app/config/*.js",
                    "public/js/app/config/*.js",
                    "public/js/app/controllers/*.js",
                    "public/js/app/directives/*.js",
                    "public/js/app/filters/*.js",
                    "public/js/app/services/*.js"
                ],
                dest: "public_dist/js/app/my_irc.min.js"
            }
        },
        uglify: {
            dist: {
                src: ["public_dist/js/app/my_irc.min.js"],
                dest: "public_dist/js/app/my_irc.min.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["cssmin:dist", "concat:dist", "uglify:dist"]);
};