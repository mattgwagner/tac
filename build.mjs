import { mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import { marked } from 'marked';

// Configure marked for GitHub Flavored Markdown with heading IDs
const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
  // Generate a slug from heading text (strip HTML tags first)
  const raw = text.replace(/<[^>]*>/g, '');
  const slug = raw.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
  return `<h${depth} id="${slug}">${text}</h${depth}>\n`;
};
marked.use({ gfm: true, renderer });

const DIST = 'dist';
const STX = 'STX';
const FLX = 'FLX';
const REF = 'reference';
const TOOLS = 'tools';
const ASSETS = 'assets';
const POI = 'POI';
const APRIL_TLP = 'April-TLP-Training';

// Files to skip (not content — meta/build files)
const SKIP_FILES = new Set(['AGENTS.md', 'CLAUDE.md']);

// Read the HTML template
const template = readFileSync('opord-template.html', 'utf8');

function shouldSkip(filename) {
  if (SKIP_FILES.has(filename)) return true;
  if (filename === 'README.md') return false; // handled specially
  return false;
}

function renderMarkdown(mdPath, outputPath, options = {}) {
  const md = readFileSync(mdPath, 'utf8');
  const filename = basename(mdPath, '.md');

  // Determine document type from filename
  let docType = 'OPERATION ORDER';
  if (filename.includes('WARNO')) docType = 'WARNING ORDER';
  if (options.isIndex) docType = 'INDEX';

  const title = options.title || filename;

  // Convert markdown to HTML body
  let body = marked.parse(md);

  // Rewrite .md link targets to .html (skip external URLs and pure anchors).
  // Preserves #anchor or ?query suffixes.
  body = body.replace(
    /href="((?!https?:|mailto:|#)[^"]*?)\.md([#?"])/g,
    'href="$1.html$2'
  );

  // Rewrite relative paths based on output location.
  // Source files in subdirectories use ../assets/, ../reference/, ../POI/, etc.
  if (options.flatten) {
    // Output flattened to dist/ root: strip ../ for siblings that live at dist/
    // reference/ and tools/ are flattened to dist root (no directory segment)
    // assets/ and POI/ are copied as directories to dist/assets/ and dist/POI/
    body = body.replace(/(src|href)="\.\.\/(assets|POI)\//g, '$1="$2/');
    body = body.replace(/(src|href)="\.\.\/(reference|tools)\//g, '$1="');
  } else {
    // Output in a subdirectory (e.g. dist/FLX/): reference/ and tools/ are
    // flattened to dist root, so from the subdir go up one level and drop
    // the directory segment. assets/ and POI/ still exist as dist/assets/ and
    // dist/POI/, so ../assets/ and ../POI/ remain correct as-is.
    body = body.replace(/(src|href)="\.\.\/(reference|tools)\//g, '$1="../');
  }

  // Inject into template
  let html = template
    .replace('$title$', title)
    .replace('$header-includes$', '')
    .replace('$body$', body);

  // For index pages, remove the OPORD footer (acknowledge/signature/distribution)
  if (options.isIndex) {
    html = html.replace(/<footer>[\s\S]*<\/footer>/, '');
  }

  writeFileSync(outputPath, html, 'utf8');
  console.log(`Built: ${mdPath} -> ${outputPath}`);
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Helper: process a source directory, flattening output to dist root
function processDir(srcDir, options = {}) {
  if (!existsSync(srcDir)) return;
  for (const file of readdirSync(srcDir)) {
    const srcPath = join(srcDir, file);
    if (statSync(srcPath).isDirectory()) continue;

    if (file.endsWith('.md') && !shouldSkip(file)) {
      renderMarkdown(srcPath, join(DIST, file.replace('.md', '.html')), { flatten: true });
    } else if (file.endsWith('.kml')) {
      copyFileSync(srcPath, join(DIST, file));
      console.log(`Copied: ${srcPath} -> dist/${file}`);
    } else if (file.endsWith('.html')) {
      copyFileSync(srcPath, join(DIST, file));
      console.log(`Copied: ${srcPath} -> dist/${file}`);
    }
  }
}

// Create output directories
mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, 'FLX'), { recursive: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });

// --- Root index from README.md ---
if (existsSync('README.md')) {
  renderMarkdown('README.md', join(DIST, 'index.html'), {
    title: 'ARNG Tactical Training Library',
    isIndex: true,
  });
}

// --- STX OPORDs (flattened to dist root) ---
processDir(STX);

// --- Reference materials (flattened to dist root) ---
processDir(REF);

// --- Tools / standalone HTML (flattened to dist root) ---
processDir(TOOLS);

// --- Assets (copied as directory to dist/assets/) ---
if (existsSync(ASSETS)) {
  copyDir(ASSETS, join(DIST, ASSETS));
}

// --- FLX index (hand-maintained HTML) ---
if (existsSync(join(FLX, 'index.html'))) {
  copyFileSync(join(FLX, 'index.html'), join(DIST, 'FLX', 'index.html'));
  console.log('Copied: FLX/index.html -> dist/FLX/index.html');
}

// --- Convert FLX markdown files ---
for (const file of readdirSync(FLX)) {
  if (!file.endsWith('.md')) continue;
  if (shouldSkip(file)) continue;
  renderMarkdown(join(FLX, file), join(DIST, 'FLX', file.replace('.md', '.html')));
}

// --- Copy FLX non-markdown assets (KML files) ---
for (const file of readdirSync(FLX)) {
  if (file.endsWith('.kml')) {
    copyFileSync(join(FLX, file), join(DIST, 'FLX', file));
    console.log(`Copied: FLX/${file} -> dist/FLX/${file}`);
  }
}

// --- Copy FLX props (printable training documents) ---
const FLX_PROPS = join(FLX, 'props');
if (existsSync(FLX_PROPS)) {
  copyDir(FLX_PROPS, join(DIST, 'FLX', 'props'));
}

// --- Copy POI directory (slides, images) ---
if (existsSync(POI)) {
  copyDir(POI, join(DIST, POI));
}

// --- April TLP Training (subdirectory like FLX) ---
if (existsSync(APRIL_TLP)) {
  mkdirSync(join(DIST, APRIL_TLP), { recursive: true });

  // Convert README.md to index.html for this section
  const aprilReadme = join(APRIL_TLP, 'README.md');
  if (existsSync(aprilReadme)) {
    renderMarkdown(aprilReadme, join(DIST, APRIL_TLP, 'index.html'), {
      title: 'April TLP Training',
      isIndex: true,
    });
  }

  // Convert remaining markdown files
  for (const file of readdirSync(APRIL_TLP)) {
    if (!file.endsWith('.md')) continue;
    if (file === 'README.md') continue;
    if (shouldSkip(file)) continue;
    renderMarkdown(join(APRIL_TLP, file), join(DIST, APRIL_TLP, file.replace('.md', '.html')));
  }
}

console.log('\nBuild complete.');
