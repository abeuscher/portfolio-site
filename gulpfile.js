var buildDir ='public_html/';
var srcDir = 'src/';
var sassDir = srcDir + 'scss/';
var cssDir = buildDir + 'css/';
var jsSrcDir = srcDir + 'js/';
var jsBuildDir = buildDir + 'js/';
var pugSrcDir = srcDir + 'pug/templates/';
var pugSrcCompDir = srcDir + 'pug/components/';
var pugBuildDir = buildDir;
var pugBuildCompDir = jsBuildDir + "components/";
var miscSrcDir = srcDir + 'public_transfer/';

// Include gulp
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var pug = require('gulp-pug');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vinylPaths = require('vinyl-paths');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');
var remote = require('gulp-remote-src');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stringify = require('stringify');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var del = require('del');
var path = require('path');
var fs = require('fs');
require('factor-bundle');
var runSequence = require('run-sequence');

var packageData = require('./package.json');

var opts = assign({}, watchify.args, {
  entries: [jsSrcDir + 'app.js'],
  debug: true,
  paths: ['./node_modules']
});
var b = watchify(browserify(opts));
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal
b.transform(require("pugify"));
b.transform(stringify({
    extensions: ['.html'],
    minify: true,
    minifier: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          preserveLineBreaks: false,
          collapseBooleanAttributes: false,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: false,
          removeEmptyAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          removeOptionalTags: false,
          removeIgnored: false,
          removeEmptyElements: false,
          lint: false,
          keepClosingSlash: false,
          caseSensitive: false,
          minifyJS: false,
          minifyCSS: false,
          minifyURLs: false
        }
    }
}));

function bundle() {

  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(fs.createWriteStream(jsBuildDir + 'bundle.js'));
}

function clean(path){
    return function(){
        return gulp.src(path)
            .pipe(vinylPaths(del));
    };
}

gulp.task('compile-sass-autoprefixed-minified', function() {
    return gulp.src(sassDir + '*.scss')
        .pipe(sass())
        .on('error', function(error) {
          console.log(error);
          this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%'],
            cascade: false
        }))
        .pipe(cssmin({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(cssDir));
});

gulp.task('watch-files', function() {
    gulp.watch('source/js/*.js', ['lint-js', 'concat-minify-js']);
    gulp.watch(sassDir + '**/*.scss', ['compile-sass-autoprefixed-minified']);
    gulp.watch([pugSrcDir+'*.pug',pugSrcDir+'**/*.pug'], ['templates']);
});

gulp.task('bundle-js', bundle);

gulp.task('templates', function() {
  gulp.src(pugSrcDir+'*.pug')
    .pipe(pug({"pretty":true,"locals":require("./data.json")}))
    .pipe(gulp.dest(pugBuildDir, {ext: '.html'}));
});

gulp.task('uglify-js', function(){
    return gulp.src(jsBuildDir + '*.js')
        .pipe(uglify().on("error",function(e) {console.log(e,"uglify fail");}))
        .pipe(gulp.dest(jsBuildDir));
});
gulp.task('move-files', function() {
  gulp.src([miscSrcDir + "*/**",miscSrcDir + "*"])
    .pipe(gulp.dest(buildDir))
});
gulp.task('build-js', function(){
    runSequence('bundle-js','uglify-js');
});

// Default Task
gulp.task('default', ['compile-sass-autoprefixed-minified','templates', 'build-js','move-files','watch-files']);
