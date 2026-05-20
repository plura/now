const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

const SRC = 'src';
const DIST = 'dist';

const JS_FILES = [
  'assets/js/utils.js',
  'assets/js/morph.js',
  'assets/js/dev.js',
  'assets/js/anim/logo.js',
  'assets/js/anim/logo-o.js',
  'assets/js/anim/intro.js',
  'assets/js/anim.js',
  'assets/js/lang.js',
  'assets/js/session.js',
  'assets/js/project-detail.js',
  'assets/js/projects.js',
  'assets/js/cta.js',
  'assets/js/main.js',
];

const CSS_FILES = [
  'assets/css/base.css',
  'assets/css/style.css',
  'assets/css/projects.css',
  'assets/css/morph.css',
  'assets/css/cta.css',
];

const HTML_FILES = [
  'index.html',
  'pt/index.html',
];

const COPY_DIRS = [
  'assets/media',
  'data',
  'api',
];

function read(filePath) {
  return fs.readFileSync(path.join(SRC, filePath), 'utf8');
}

function write(filePath, content) {
  const dest = path.join(DIST, filePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
}

async function buildJS() {
  for (const file of JS_FILES) {
    const result = await minifyJS(read(file), { module: true, compress: true, mangle: true });
    write(file, result.code);
    console.log(`  JS   ${file}`);
  }
}

async function buildCSS() {
  const cleaner = new CleanCSS({ level: 2 });
  for (const file of CSS_FILES) {
    const result = cleaner.minify(read(file));
    write(file, result.styles);
    console.log(`  CSS  ${file}`);
  }
}

async function buildHTML() {
  for (const file of HTML_FILES) {
    const result = await minifyHTML(read(file), {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
    write(file, result);
    console.log(`  HTML ${file}`);
  }
}

async function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  console.log('Building...');

  await buildJS();
  await buildCSS();
  await buildHTML();

  for (const dir of COPY_DIRS) {
    fs.cpSync(path.join(SRC, dir), path.join(DIST, dir), { recursive: true });
    console.log(`  COPY ${dir}`);
  }

  console.log(`\nDone → ${DIST}/`);
}

build().catch(err => { console.error(err); process.exit(1); });
