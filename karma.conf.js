// jshint strict: false
module.exports = function(karma) {
    karma.set({

        basePath: './src/',

        files: [
            'app/app.module.js',
            {pattern: 'assets/data/*.csv', watched: true, served: true, included: false},
            // 'src/assets/data/locations.csv',
            // 'node_modules/angular/angular.js',
            // 'node_modules/angular-animate/angular-animate.js',
            // 'node_modules/angular-resource/angular-resource.js',
            // 'node_modules/angular-route/angular-route.js',
            // 'node_modules/angular-mocks/angular-mocks.js',
            // '**/*.module.js',
            // '*!(.module|.spec).js',
            // '!(node_modules)/**/*!(.module|.spec).js',
            // 'app/core/papa-parse/*.spec.js',
            'app/**/*.spec.js'
            // 'app/core/**/*.spec.js',
            // 'app/components/**/*.spec.js'
            // 'app/core/google-chart-projecttrends/*.spec.js',
            // 'src/app/components/dashboard-dataview/*.js',
            // 'app/components/dashboard-dataview/*.spec.js'
        ],

        autoWatch: true,

        frameworks: ['browserify', 'jasmine'],

        // browsers: ['Chrome', 'Firefox'],
        browsers: ['Chrome'],

        plugins: [
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],
        preprocessors: {
            'app/app.module.js': ['browserify'],
            'app/**/*.spec.js': ['browserify'],
            // 'app/core/**/*.spec.js': ['browserify'],
            // 'app/components/**/*.spec.js': ['browserify']
            // 'app/core/papa-parse/*.spec.js': ['browserify'],
            // 'app/core/google-chart-projecttrends/*.spec.js': ['browserify'],
            // 'app/components/dashboard-dataview/*.spec.js': ['browserify']
        },
        // browserify configuration
        browserify: {
            debug: true
        },
        logLevel: karma.LOG_DEBUG // ,
        // proxies: {
        //     '/data/': '/src/assets/data/'
        // }
    });
};
