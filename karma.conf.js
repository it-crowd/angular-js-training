// Karma configuration
// Generated on Tue Sep 17 2013 08:22:02 GMT+0200 (CEST)
/*global process*/
module.exports = function (config)
{
    'use strict';

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'vendor/angular.js', 'vendor/angular-resource.js', 'vendor/angular-mocks.js', '_app.js', 'appCtrl.js', 'productDAO.js', 'productEditCtrl.js',
            'productListCtrl.js', '*.test.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['spec', 'coverage'],

        preprocessors: {
            '_app.js': 'coverage', 'appCtrl.js': 'coverage', 'productDAO.js': 'coverage', 'productEditCtrl.js': 'coverage', 'productListCtrl.js': 'coverage'
        },

        coverageReporter: {
            dir: 'target/coverage/',
            type: 'html'
        },

        // web server port
        port: 9876,

        // cli runner port
        runnerPort: 9100,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
