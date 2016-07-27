'use strict';
/* eslint-env node */

var plugins = require('gulp-load-plugins')();
var gulpUtil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var ghPages = require('gulp-gh-pages');
var mergeStream = require('merge-stream');
var del = require('del');
var runSequence = require('run-sequence');
var karma = require('karma');

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copy', function() {
    return mergeStream(
    gulp.src('src/app/core/google-chart-customertrends/*.html').pipe(gulp.dest('./dist/core/google-chart-customertrends/')),
    gulp.src('src/app/core/google-chart-issuestrend/*.html').pipe(gulp.dest('./dist/core/google-chart-issuestrend/')),
    gulp.src('src/app/components/dashboard-geospacial/*.html').pipe(gulp.dest('./dist/dashboard-geospacial/')),
    gulp.src('src/app/components/dashboard-keymetrics/*.html').pipe(gulp.dest('./dist/dashboard-keymetrics/')),
    gulp.src('src/app/components/dashboard-dataview/*.html').pipe(gulp.dest('./dist/dashboard-dataview/')),
    gulp.src('src/app/components/dashboard/*.html').pipe(gulp.dest('./dist/dashboard/')),
    gulp.src('src/app/core/google-map/*.html').pipe(gulp.dest('./dist/core/google-map/')),
    gulp.src('src/app/components/navigation-bar/*.html').pipe(gulp.dest('./dist/navigation-bar/')),
    gulp.src('src/assets/sw/sw.js').pipe(gulp.dest('dist/')),
    gulp.src('src/*.html').pipe(gulp.dest('dist/')),
    gulp.src('src/*.xml').pipe(gulp.dest('dist/')),
    gulp.src('src/assets/img/*').pipe(imagemin({
        progressive: true,
        use: [pngquant()]
    })).pipe(gulp.dest('dist/img')),
    gulp.src('src/assets/data/*.*').pipe(gulp.dest('dist/data/')),
    gulp.src('src/assets/lib/**').pipe(gulp.dest('dist/lib/')),
    gulp.src('src/*.json').pipe(gulp.dest('dist/')),
    gulp.src('src/favicon.ico').pipe(gulp.dest('dist/')),
    gulp.src('src/assets/idb/**/*').pipe(gulp.dest('dist/idb'))
  );
});

gulp.task('styles', function() {
    gulp.src('src/assets/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(autoprefixer({browsers: ['last 2 versions']
    }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('browserSync', function() {
    browserSync.init({
        notify: false,
        files: [
            './dist/**/*.html'
        ],
        port: 3002,
        server: {
            baseDir: './dist',
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                req.mode = 'no-cors';
                next();
            }
        }
    });
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/assets/sass/**/*.scss', ['styles']);
    gulp.watch('src/assets/js/**/*.js', ['lint']);
    gulp.watch('src/assets/sw/sw.js', ['sw']);
    gulp.watch('src/**/*.html', ['copy-html']);
    // gulp.watch('src/jasmine/spec/spec.js', ['copy-spec']);
    gulp.watch('dist/index.html').on('change', browserSync.reload);
});

gulp.task('sw', function() {
    gulp.src('src/assets/sw/sw.js').pipe(gulp.dest('dist/'));
});

gulp.task('copy-html', function() {
    gulp.src('src/app/core/google-chart-customertrends/*.html').pipe(gulp.dest('./dist/core/google-chart-customertrends/'));
    gulp.src('src/app/core/google-chart-issuestrend/*.html').pipe(gulp.dest('./dist/core/google-chart-issuestrend/'));
    gulp.src('src/app/components/dashboard-geospacial/*.html').pipe(gulp.dest('./dist/dashboard-geospacial/'));
    gulp.src('src/app/components/dashboard-keymetrics/*.html').pipe(gulp.dest('./dist/dashboard-keymetrics/'));
    gulp.src('src/app/components/dashboard-dataview/*.html').pipe(gulp.dest('./dist/dashboard-dataview/'));
    gulp.src('src/app/components/dashboard/*.html').pipe(gulp.dest('./dist/dashboard/'));
    gulp.src('src/app/core/google-map/*.html').pipe(gulp.dest('./dist/core/google-map/'));
    gulp.src('src/app/components/navigation-bar/*.html').pipe(gulp.dest('./dist/navigation-bar/'));
    gulp.src('src/*.html').pipe(gulp.dest('./dist'));
});

gulp.task('vulcanize-elems', function() {
    return gulp.src('src/assets/polymer-elements/elements.html')
    .pipe(vulcanize({
        abspath: '',
        excludes: [],
        stripExcludes: false,
        inlineScripts: true,
        inlineCss: true,
        stripComments: true
    })).on('error', function(err) {
        console.log(err);
    })
    .pipe(gulp.dest('dist/polymer-elements/'));
});

gulp.task('lint', function() {
    return gulp.src(['src/assets/js/**/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

gulp.task('tests', function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

var b = browserify({
    entries: ['./src/app/app.module.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    debug: true
});

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gulpUtil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
    // log errors if they happen
    // .on('error', gulpUtil.log.bind(gulpUtil, 'Browserify Error'))
    .on('error', function(err) {
        gulpUtil.log(err.message);
        browserSync.notify("Browserify Error!");
        this.emit("end");
    })
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
}

gulp.task('serve', function(callback) {
    runSequence('clean', ['styles', 'lint', 'js', 'copy', 'vulcanize-elems'], ['browserSync', 'watch'], callback);
});
