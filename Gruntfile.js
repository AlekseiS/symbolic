module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *  Made by <%= pkg.author.name %>\n" +
                " */\n"
        },

        // Concat definitions
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                files: [
                    {
                        src: ["src/js/symbolic.js"],
                        dest: "dist/js/symbolic.js"
                    },
                    {
                        src: ["src/css/symbolic.css"],
                        dest: "dist/css/symbolic.css"
                    },
                    {
                        src: ["dist/js/symbolic.min.js"],
                        dest: "dist/js/symbolic.min.js"
                    },
                    {
                        src: ["dist/css/symbolic.min.css"],
                        dest: "dist/css/symbolic.min.css"
                    }
                ]
            }
        },

        // Lint definitions
        jshint: {
            files: ["src/js/**/*.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Minify definitions
        uglify: {
            my_target: {
                src: ["src/js/symbolic.js"],
                dest: "dist/js/symbolic.min.js"
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            files: ['src/**'],
            tasks: ['default']
        },

        // Minify CSS
        cssmin: {
            my_target: {
                src: 'src/css/symbolic.css',
                dest: 'dist/css/symbolic.min.css'
            }
        },

        csslint: {
            my_target: {
                src: ['src/css/**/*.css']
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    grunt.registerTask("build", ["uglify", "cssmin", "concat"]);
    grunt.registerTask("default", ["jshint", "csslint", "build"]);
    grunt.registerTask("travis", ["default"]);

};
