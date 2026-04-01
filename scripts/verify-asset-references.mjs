import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const urlPattern = /url\(\s*(['"])(\/assets\/[^'")]+)\1\s*\)/g;
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'coverage']);

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (skipDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getLineNumber(content, matchIndex) {
  return content.slice(0, matchIndex).split('\n').length;
}

async function main() {
  const cssFiles = await walk(repoRoot);
  const missing = [];

  for (const cssFile of cssFiles) {
    const content = await fs.readFile(cssFile, 'utf8');
    let match;

    while ((match = urlPattern.exec(content)) !== null) {
      const assetUrl = match[2];
      const relativeAssetPath = assetUrl.replace(/^\//, '');
      const candidatePaths = [
        path.join(repoRoot, 'public', relativeAssetPath),
        path.join(repoRoot, 'src', relativeAssetPath),
      ];

      let found = false;
      for (const candidate of candidatePaths) {
        if (await fileExists(candidate)) {
          found = true;
          break;
        }
      }

      if (!found) {
        missing.push({
          cssFile: path.relative(repoRoot, cssFile),
          line: getLineNumber(content, match.index),
          assetUrl,
        });
      }
    }
  }

  if (missing.length > 0) {
    console.error('Missing /assets/... references found in CSS:');
    for (const item of missing) {
      console.error(`- ${item.cssFile}:${item.line} -> ${item.assetUrl}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Asset reference check passed (${cssFiles.length} CSS files scanned).`);
}

main().catch((error) => {
  console.error('Failed to verify CSS asset references.', error);
  process.exit(1);
});
