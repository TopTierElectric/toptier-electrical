import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync(new URL('../monitoring/uptime.config.json', import.meta.url), 'utf8'));
const mode = process.argv[2] ?? 'full';
const now = new Date().toISOString();
const maintenanceEnabled = process.env.MAINTENANCE_MODE === 'true' || config.maintenance.enabled;
const checkSet =
  mode === 'smoke'
    ? config.checks.filter((check) => ['home', 'contact', 'services'].includes(check.id))
    : config.checks;

const defaultFetchOptions = {
  redirect: 'follow',
  signal: AbortSignal.timeout(20000),
};

async function fetchWithRetry(url, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetch(url, defaultFetchOptions);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

function includesAny(text, markers) {
  return markers.some((marker) => text.toLowerCase().includes(marker.toLowerCase()));
}

async function runRouteCheck(check) {
  const url = `${config.baseUrl}${check.path}`;
  const started = performance.now();
  try {
    const response = await fetchWithRetry(url);
    const body = await response.text();
    const latencyMs = Math.round(performance.now() - started);
    const expectedStatuses = maintenanceEnabled ? config.maintenance.expectedStatus : check.expectedStatus;
    const markers = maintenanceEnabled ? config.maintenance.allowedContentMarkers : check.markers;

    const statusOk = expectedStatuses.includes(response.status);
    const markersOk = includesAny(body, markers);
    const fallbackOk = includesAny(body, check.fallbackMarkers);

    let formActionOk = true;
    if (check.expectsFormAction) {
      formActionOk = body.includes(check.expectsFormAction);
    }

    const ok = statusOk && (markersOk || fallbackOk) && formActionOk;

    return {
      type: 'route',
      id: check.id,
      url,
      status: response.status,
      latencyMs,
      markersOk,
      fallbackOk,
      formActionOk,
      ok,
      reason: ok
        ? 'pass'
        : `statusOk=${statusOk}, markersOk=${markersOk}, fallbackOk=${fallbackOk}, formActionOk=${formActionOk}`,
    };
  } catch (error) {
    return {
      type: 'route',
      id: check.id,
      url,
      status: 0,
      latencyMs: null,
      ok: false,
      reason: `network-error: ${error.message}`,
    };
  }
}

async function runThirdPartyCheck(dep) {
  const started = performance.now();
  try {
    const response = await fetchWithRetry(dep.url);
    const latencyMs = Math.round(performance.now() - started);
    const ok = dep.expectedStatus.includes(response.status);
    return {
      type: 'third-party',
      id: dep.id,
      url: dep.url,
      status: response.status,
      latencyMs,
      ok,
      reason: ok ? 'pass' : `unexpected status ${response.status}`,
    };
  } catch (error) {
    return {
      type: 'third-party',
      id: dep.id,
      url: dep.url,
      status: 0,
      latencyMs: null,
      ok: false,
      reason: `network-error: ${error.message}`,
    };
  }
}

const routeResults = await Promise.all(checkSet.map(runRouteCheck));
const thirdPartyResults = mode === 'smoke' ? [] : await Promise.all(config.thirdParty.map(runThirdPartyCheck));
const allResults = [...routeResults, ...thirdPartyResults];

console.log('ID\tTYPE\tSTATUS\tLATENCY_MS\tRESULT\tDETAILS');
for (const result of allResults) {
  console.log(
    `${result.id}\t${result.type}\t${result.status}\t${result.latencyMs ?? '-'}\t${result.ok ? 'PASS' : 'FAIL'}\t${result.reason}`
  );
}

const failed = allResults.filter((result) => !result.ok);
const slo = {
  timestamp: now,
  mode,
  maintenanceEnabled,
  availabilityPct: Number((((allResults.length - failed.length) / Math.max(allResults.length, 1)) * 100).toFixed(2)),
  p95LatencyMs: (() => {
    const values = allResults
      .map((r) => r.latencyMs)
      .filter((v) => typeof v === 'number')
      .sort((a, b) => a - b);
    if (values.length === 0) return null;
    const idx = Math.ceil(0.95 * values.length) - 1;
    return values[Math.max(0, idx)];
  })(),
  failedChecks: failed.map((item) => ({ id: item.id, url: item.url, reason: item.reason })),
  results: allResults,
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/monitoring-results.json', JSON.stringify(slo, null, 2));

if (failed.length > 0) {
  console.error(`Monitoring failed with ${failed.length} failing checks.`);
  process.exit(1);
}

console.log('Monitoring checks passed.');
