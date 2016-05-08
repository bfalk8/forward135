module.exports = function (config) {
    config.set(
            {
                files: [
                    '../src/**/*.js',
                    '../spec/**/*.js'
                ],
                singleRun: true,
                preprocessors: {
                    '../src/**/*.js': ['webpack', 'sourcemap'],
                    '../spec/**/*.js': ['webpack', 'sourcemap']
                },

                webpack: {
                    // karma watches the test entry points
                    // (you don't need to specify the entry option)
                    // webpack watches dependencies

                    // webpack configuration
                },

                webpackMiddleware: {
                    // webpack-dev-middleware configuration
                    // i. e.
                    noInfo: true
                },

                plugins: [
                    require('karma-webpack'),
                    require('karma-mocha')
                ],

                frameworks: ['mocha']
            });
};