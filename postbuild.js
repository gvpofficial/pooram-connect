import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcHtmlPath = path.join(__dirname, 'index.html');
const destHtmlPath = path.join(__dirname, 'dist', 'index.html');

try {
  console.log('Running postbuild script...');
  
  if (!fs.existsSync(srcHtmlPath)) {
    console.error(`Error: Source index.html not found at ${srcHtmlPath}`);
    process.exit(1);
  }

  // Read index.html
  let html = fs.readFileSync(srcHtmlPath, 'utf8');

  // Replace dist/assets/ with assets/
  const updatedHtml = html
    .replace(/dist\/assets\/index\.css/g, 'assets/index.css')
    .replace(/dist\/assets\/index\.js/g, 'assets/index.js');

  // Ensure dist directory exists
  const distDir = path.dirname(destHtmlPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write to dist/index.html
  fs.writeFileSync(destHtmlPath, updatedHtml, 'utf8');
  console.log('Successfully copied index.html to dist/index.html with updated paths!');
} catch (error) {
  console.error('Postbuild script failed:', error);
  process.exit(1);
}
