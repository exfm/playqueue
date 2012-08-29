module.exports = function(grunt){
    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'index.js', 'test/**/*.js']
        },
        jshint: {
            options: {
                node: true
            }
        },
        mocha: {
            index: ['test/index.test.html']
        }
    });

    grunt.registerTask('default', 'lint mocha');

    grunt.loadNpmTasks('grunt-mocha');
};