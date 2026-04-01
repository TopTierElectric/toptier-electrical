import { spawnSync } from 'node:child_process';

const args = ['audit', '--audit-level=high', '--json'];
const result = spawnSync('npm', args, { encoding: 'utf8' });

const combinedOutput = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

if (result.status === 0) {
  console.log('Security audit passed with no high-severity vulnerabilities.');
  process.exit(0);
}

const endpointUnavailable =
  /audit endpoint returned an error/i.test(combinedOutput) ||
  /security advisories\/bulk/i.test(combinedOutput) ||
  /403 Forbidden/i.test(combinedOutput);

if (endpointUnavailable) {
  console.warn('Security audit could not be completed because the npm advisories endpoint is unavailable.');
  console.warn('Output from npm audit:');
  console.warn(combinedOutput.trim());
  process.exit(0);
}

let parsed;
try {
  parsed = JSON.parse(result.stdout || '{}');
} catch {
  parsed = null;
}

if (parsed?.metadata?.vulnerabilities) {
  const vulnerabilities = parsed.metadata.vulnerabilities;
  const highOrCritical = (vulnerabilities.high ?? 0) + (vulnerabilities.critical ?? 0);
  if (highOrCritical > 0) {
    console.error(
      `Security audit failed: found ${vulnerabilities.high ?? 0} high and ${vulnerabilities.critical ?? 0} critical vulnerabilities.`
    );
    process.exit(1);
  }
}

console.error('Security audit failed for an unexpected reason.');
console.error(combinedOutput.trim());
process.exit(result.status ?? 1);
