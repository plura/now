import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import CleanCSS from 'clean-css';
import { minify as minifyHTML } from 'html-minifier-terser';
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';

const SRC  = 'src';
const DIST = 'dist';

const CSS_FILES = [
  'assets/css/base.css',
  'assets/css/style.css',
  'assets/css/projects.css',
  'assets/css/morph.css',
  'assets/css/contacts-cta.css',
];

const HTML_FILES = [
  'index.html',
  'pt/index.html',
];

const COPY_DIRS = [
  'assets/media',
  'api',
];

const COPY_ROOT_FILES = [
  'robots.txt',
  'sitemap.xml',
];

function read(filePath) {
  return readFileSync(join(SRC, filePath), 'utf8');
}

function write(filePath, content) {
  const dest = join(DIST, filePath);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, content, 'utf8');
}

async function buildJS() {
  const bundle = await rollup({
    input: join(SRC, 'assets/js/main.js'),
    plugins: [terser()],
  });
  await bundle.write({
    file: join(DIST, 'assets/js/main.js'),
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

function buildJSON() {
  const files = readdirSync(join(SRC, 'data'), { recursive: true, withFileTypes: true });
  for (const f of files) {
    if (!f.name.endsWith('.json')) continue;
    const rel = join(f.parentPath ?? f.path, f.name).slice(join(SRC, 'data').length + 1);
    const minified = JSON.stringify(JSON.parse(read(join('data', rel))));
    write(join('data', rel), minified);
    console.log(`  JSON data/${rel}`);
  }
}

async function build() {
  rmSync(DIST, { recursive: true, force: true });
  console.log('Building...');

  await buildJS();
  await buildCSS();
  await buildHTML();
  buildJSON();

  for (const dir of COPY_DIRS) {
    cpSync(join(SRC, dir), join(DIST, dir), { recursive: true });
    console.log(`  COPY ${dir}`);
  }

  for (const file of COPY_ROOT_FILES) {
    copyFileSync(join(SRC, file), join(DIST, file));
    console.log(`  COPY ${file}`);
  }

  console.log(`\nDone → ${DIST}/`);
}

build().catch(err => { console.error(err); process.exit(1); });
