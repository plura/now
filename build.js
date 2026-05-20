const { rollup } = require('rollup');
const terser = require('@rollup/plugin-terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

const SRC  = 'src';
const DIST = 'dist';

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
  const bundle = await rollup({
    input: path.join(SRC, 'assets/js/main.js'),
    plugins: [terser()],
  });
  await bundle.write({
    file: path.join(DIST, 'assets/js/main.js'),
    format: 'es',
  });
  console.log('  JS   assets/js/main.js (bundled)');
}

async function buildCSS() {
  const src = CSS_FILES.map(f => read(f)).join('\n');
  const result = new CleanCSS({ level: 2 }).minify(src);
  write('assets/css/main.css', result.styles);
  console.log('  CSS  assets/css/main.css (bundled)');
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
