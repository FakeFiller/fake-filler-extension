/* eslint-disable import/no-extraneous-dependencies, no-console, arrow-body-style */

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import runSequence from 'run-sequence';
import fs from 'fs';
import nodeResolve from 'resolve';

const $ = gulpLoadPlugins();
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const formFillerVersion = packageJson.version;
const vendorScripts = Object.keys(packageJson.dependencies);

function buildScript(entryFile, outputFile, excludeVendors = false) {
  const b = browserify({
    entries: [entryFile],
    extensions: ['.js', '.jsx'],
  });

  if (excludeVendors) {
    vendorScripts.forEach((lib) => {
      b.external(lib);
    });
  }

  return b
    .transform(babelify)
    .bundle()
    .pipe(source(outputFile))
    .pipe(gulp.dest('./app/scripts'));
}

gulp.task('clean', del.bind(null, [
  'dist',
  'package',
  'app/scripts',
  'app/styles',
]));

gulp.task('options-styles', () => {
  return gulp.src('app/styles.scss/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    'app/fonts/**',
    'app/images/**',
    '!app/scripts.babel',
    '!app/*.json',
    '!app/*.html',
    '!app/styles.scss',
  ], {
    base: 'app',
    dot: true,
  }).pipe(gulp.dest('dist'));
});

gulp.task('build-vendor', () => {
  const b = browserify();

  vendorScripts.forEach((lib) => {
    b.require(nodeResolve.sync(lib), { expose: lib });
  });

  return b
    .bundle()
    .pipe(source('vendors.js'))
    .pipe(buffer())
    .pipe($.if(process.env.NODE_ENV === 'production', $.uglify({ mangle: false })))
    .pipe(gulp.dest('./app/scripts'));
});

gulp.task('script-options', () => {
  return buildScript('app/scripts.babel/options.jsx', 'options.js', true);
});

gulp.task('script-background', () => {
  return buildScript('app/scripts.babel/background.js', 'background.js');
});

gulp.task('script-content-script', () => {
  return buildScript('app/scripts.babel/content-script.js', 'content-script.js');
});

gulp.task('html', ['options-styles'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: formFillerVersion,
    }))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    .pipe($.if('*.js', $.uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-scripts', ['script-options', 'script-background', 'script-content-script']);

gulp.task('build', ['build-vendor'], (cb) => {
  runSequence(
    'build-scripts',
    'options-styles',
    'chromeManifest',
    ['html', 'extras'],
    cb,
    );
});

gulp.task('watch', ['build'], () => {
  gulp.watch('app/scripts.babel/**/*.{js,jsx}', ['build-scripts']);
  gulp.watch('app/styles.scss/**/*.scss', ['options-styles']);
});

gulp.task('build-prod', (cb) => {
  process.env.NODE_ENV = 'production';

  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Failed to set NODE_ENV to production!');
  } else {
    process.stdout.write('Set NODE_ENV to "production".\n');
  }

  runSequence('build', cb);
});

gulp.task('package', ['build-prod'], () => {
  return gulp.src('dist/**')
    .pipe($.zip(`form-filler-${formFillerVersion}.zip`))
    .pipe(gulp.dest('package'));
});

gulp.task('default', ['clean'], (cb) => {
  runSequence('build', cb);
});
