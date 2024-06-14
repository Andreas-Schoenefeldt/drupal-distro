const themeName = 'bootstrap';
const themePath = './web/themes/custom/' + themeName;
const deployJobUrl = '';
const siteUrl = ''

import {deleteAsync} from 'del';
import * as fs from "node:fs";
import * as path from "node:path";
import log from "fancy-log";
import gulpChanged from "gulp-changed";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import gulp from "gulp";
import scss from "gulp-dart-sass";
import autoprefixer from "gulp-autoprefixer";
import cssnano from "gulp-cssnano";
import gulpif from "gulp-if";

let MODE = 'dev';

async function set_dev() {
  MODE = 'dev';
  log('MODE set to ', MODE);
}

async function set_prod() {
  MODE = 'prod';
  log('MODE set to ', MODE);
}

const clear = function () {
  return deleteAsync([
    themePath + '/js/*',
    themePath + '/css/*',
  ]);
};

async function copyTo(src, dest) {
  if (fs.existsSync(dest)) {
    await deleteAsync(dest);
  }

  await fs.promises.mkdir(path.dirname(dest), { recursive: true });

  const stats = await fs.promises.stat(src);
  if (stats.isFile()) {
    await fs.promises.copyFile(src, dest);
  } else {
    let entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      entry.isDirectory() ?
        await copyTo(srcPath, destPath) :
        await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

function library_copy(done) {
  const files = {
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js': themePath + '/js/bootstrap.bundle.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map': themePath + '/js/bootstrap.bundle.min.js.map'
  }

  const length = Object.keys(files).length;

  Object.keys(files).forEach(async (src, i) => {
    await copyTo(src, files[src])
    log(`copied ${src} to ${files[src]}`);

    if (i === length - 1) {
      done();
    }
  });
}

function js() {
  const source = themePath + '/assets/js/*.js';

  return gulp.src(source)
    .pipe(gulpChanged(source))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('.', {}))
    .pipe(gulp.dest(themePath + '/js/'));
}

function doCss(source) {

  // source filesa re for some reason here included into the css file and not as a seperate one, that's wy we distinguish between DEV and PROD mode
  return gulp.src(source, { sourcemaps: MODE === 'dev' })
    .pipe(gulpChanged(source))
    .pipe(gulpif(MODE === 'dev', sourcemaps.init()) )
    .pipe(scss({ outputStyle: "expanded", includePaths: [themePath + '/assets/scss'] }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 1 version'],
      cascade: false
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(cssnano({zindex: false})) // otherwise the z-index is rewritten to lower numbers
    .pipe(gulpif(MODE === 'dev', sourcemaps.write()))
    .pipe(gulp.dest(themePath + '/css/'));
}

function css() {
  return doCss(themePath + '/assets/scss/*.scss');
}

function css_bs() {
  return doCss(themePath + '/assets/bootstrap/*.scss');
}

function watchFiles() {
  gulp.watch('assets/scss/**/*', {cwd: themePath}, css);
  gulp.watch(['assets/bootstrap/**/*', 'assets/scss/_variables.scss'], {cwd: themePath}, css_bs);
  gulp.watch('assets/js/**/*', {cwd: themePath}, js);
}

export default gulp.series(set_dev, clear, gulp.parallel(library_copy, js, css_bs, css), gulp.parallel(watchFiles));

export function generate_image_styles(done) {
  const gen = require('drupal-image-style-generator');

  gen({
    themePath: themePath,
    themeName: themeName,
    syncFolder: './config/sync',
    gridSize: 50,
  })

  done();
}
