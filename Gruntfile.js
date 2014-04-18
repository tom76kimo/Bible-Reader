module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            srcipts: {
                files: ['public/js/*.js', 'public/assets/css/*.css'],
                tasks: []
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "public/js/lib",
                    name: "../app", // assumes a production build using almond
                    out: "public/js/app-built.js",
                    mainConfigFile: 'public/js/app.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task(s).
    grunt.registerTask('default', ['watch', 'requirejs:compile']);
};