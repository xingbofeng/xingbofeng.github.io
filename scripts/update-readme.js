import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.join(__dirname, '../README.md');
const START_MARKER = '<!-- BLOG-POST-LIST:START -->';
const END_MARKER = '<!-- BLOG-POST-LIST:END -->';

function cleanupLegacyMarkers(content) {
  const legacyBlock = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}\\n?`, 'g');
  return content.replace(legacyBlock, '');
}

function main() {
  const readmeContent = fs.readFileSync(README_PATH, 'utf8');
  const updatedReadme = cleanupLegacyMarkers(readmeContent);

  if (updatedReadme === readmeContent) {
    console.log('README is maintained manually. No blog post list sync needed.');
    return;
  }

  fs.writeFileSync(README_PATH, updatedReadme.replace(/\n{3,}/g, '\n\n'));
  console.log('Removed legacy blog post list markers from README.md.');
}

main();
