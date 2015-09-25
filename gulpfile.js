/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

// Vulcanization
var crisper = require('gulp-crisper');
var lazypipe = require('lazypipe');
var polyclean = require('polyclean');
var rename = require('gulp-rename');
var vulcanize = require('gulp-vulcanize');

// Debugging!
var compress = require('compression');
var gutil = require('gulp-util');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var styleTask = function (stylesPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return path.join('app', stylesPath, src);
    }))
    .pipe($.changed(stylesPath, {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe($.if('*.css', $.cssmin()))
    .pipe(gulp.dest('dist/' + stylesPath))
    .pipe($.size({title: stylesPath}));
};

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  return styleTask('styles', ['**/*.css']);
});

gulp.task('elements', function () {
  return styleTask('elements', ['**/*.css']);
});

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src([
      'app/scripts/**/*.js',
      'app/elements/**/*.js',
      'app/elements/**/*.html'
    ])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint.extract()) // Extract JS from .html files
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
  var app = gulp.src([
    'app/*/!(*.js)',
    '!app/test',
    '!app/precache.json'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('dist/bower_components'));

  var elements = gulp.src(['app/elements/**/*.html'])
    .pipe(gulp.dest('dist/elements'));

  var vulcanized = gulp.src(['app/elements/elements.html'])
    .pipe($.rename('elements.vulcanized.html'))
    .pipe(gulp.dest('dist/elements'));

  return merge(app, bower, elements, vulcanized)
    .pipe($.size({title: 'copy'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', 'dist']});

  return gulp.src(['app/**/*.html', '!app/{elements,test}/**/*.html'])
    // Replace path for vulcanized assets
    .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.vulcanized.html')))
    // .pipe(assets)
    // Concatenate And Minify JavaScript
    // .pipe($.if('*.js', $.uglify({preserveComments: 'some'}).on('error', gutil.log)))
    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.cssmin()))
    .pipe(assets.restore())
    .pipe($.useref())
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Vulcanize imports
gulp.task('vulcanize', function () {
  var DEST_DIR = 'dist/elements';

  return gulp.src('dist/elements/elements.html')
    .pipe(polybuildMod())
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: 'vulcanize'}));

});

// Compile es6 to es5 compliant code
gulp.task('babel', function () {
  var DEST_DIR = 'dist';

  var opts = {ignore: ['**/d3.v3.js', '**/rickshaw.js']};

  return gulp.src(['app/**/*.js'])
    .pipe($.sourcemaps.init())
    .pipe($.babel(opts)).on('error', swallowError)
    .pipe($.sourcemaps.write('.', {sourceRoot: '/app/' }))
    // .pipe($.debug())
    .pipe(gulp.dest(DEST_DIR));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  
  // Run everything to clean up and ready up before we start watching.
  runSequence('clean', 'styles', 'elements', 'images', 'babel');

  browserSync({
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: true,
    server: {
      baseDir: ['.tmp', 'dist', 'app'],
      middleware: [],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
  gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
  gulp.watch(['app/{scripts,elements}/**/*.js'], ['script-reload']);
  gulp.watch(['app/images/**/*'], reload);
});

// Cleanly reload tasks
gulp.task('script-reload', ['jshint', 'babel'], reload);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    middleware: [compress()]
  });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    ['copy', 'styles'],
    'elements', 'babel',
    ['jshint', 'images', 'fonts', 'html'],
    'vulcanize',
    cb);
});

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}

// Stolen from polybuild
var htmlPipe = lazypipe()
  // inline html imports, scripts and css
  // also remove html comments
  .pipe(vulcanize, {
    stripComments: true,
      inlineCss: true,
      inlineScripts: true,
      excludes: ['//fonts.googleapis.com/*'],
  })
  // remove whitespace from inline css
  .pipe(polyclean.cleanCss)
;

// remove javascript whitespace
var leftAlign = polyclean.leftAlignJs;

// minimize javascript with uglifyjs
var uglify = polyclean.uglifyJs;

function polybuildMod() {
  var pipe = htmlPipe
  // switch between cleaning or minimizing javascript
  .pipe(leftAlign)
  // rename files with an infix '.vulcanized'
  .pipe(rename, function(path) {
    path.basename += '.vulcanized';
  })
  // split the javascript out into `.build.js` for CSP compliance
  .pipe(crisper)
  ()
  ;

  // have to handle errors ourselves, thanks gulp >:(
  pipe.on('error', function(error) {
    gutil.log(error.toString());
    process.exit(1);
  });

  return pipe;
}