import { execSync } from 'node:child_process';

execSync('npm install --package-lock-only --ignore-scripts', { stdio: 'inherit' });

try {
  execSync('git diff --exit-code -- package-lock.json', { stdio: 'inherit' });
  console.log('Lockfile consistency check passed.');
} catch {
  console.error('package-lock.json is out of sync with package.json. Run npm install and commit lockfile updates.');
  process.exit(1);
}
