var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = (config) => {
    config.set(
        {
            reporters: ['progress'],
            port: 9876,
            colors: false,
            logLevel: config.LOG_DEBUG,
            autoWatch: false,
            // browsers: ['Chrome'],
            browsers: ['PhantomJS'],
            singleRun: true,

            files: [
                'spec/**/*.js'
            ],

            preprocessors: {
                'bin/bundle.js': ['webpack', 'sourcemap'],
                'spec/**/*.js': ['webpack', 'sourcemap']
            },

            webpack: webpackConfig,

            webpackMiddleware: {
                noInfo: true
            },

            frameworks: ['mocha', 'chai']
        });
};