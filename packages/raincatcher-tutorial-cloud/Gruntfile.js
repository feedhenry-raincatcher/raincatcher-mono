module.exports = function(grunt) {

  grunt.initConfig({
    express: {
      options: {
      },
      dev: {
        options: {
          script: './index.js',
          port: 8001,
          background: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['express:dev']);
};