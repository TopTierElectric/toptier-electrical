import fs from 'node:fs';
import yaml from 'js-yaml';

const siteConfigPath = new URL('../../src/data/site.json', import.meta.url);
const legacyYamlPath = new URL('../../src/config.yaml', import.meta.url);

export const loadSiteConfig = () => JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));

export const loadLegacyYamlSiteOrigin = () => {
  const raw = fs.readFileSync(legacyYamlPath, 'utf8');
  const parsed = yaml.load(raw);
  return parsed?.site?.site ?? '';
};

export const validateSiteConfig = (config) => {
  const errors = [];
  const phoneDigits = (config.business?.phoneE164 ?? '').replace(/\D/g, '');
  if (!phoneDigits || phoneDigits.includes('555')) {
    errors.push('business.phoneE164 must be set and must not contain placeholder 555 digits.');
  }

  const reviewUrl = config.seo?.googleReviewUrl ?? '';
  if (!/^https:\/\/g\.page\//.test(reviewUrl) || /example|placeholder|your-business/i.test(reviewUrl)) {
    errors.push('seo.googleReviewUrl must be a real g.page review URL.');
  }

  const gbpUrl = config.seo?.googleBusinessProfileUrl ?? '';
  if (!/^https:\/\/g\.page\//.test(gbpUrl) || /example|placeholder|your-business/i.test(gbpUrl)) {
    errors.push('seo.googleBusinessProfileUrl must be a real g.page URL.');
  }

  if (!Array.isArray(config.seo?.socialProfiles) || config.seo.socialProfiles.length === 0) {
    errors.push('seo.socialProfiles must contain at least one production social profile URL.');
  }

  for (const profile of config.seo?.socialProfiles ?? []) {
    if (!/^https:\/\//.test(profile) || /example|placeholder|your-business/i.test(profile)) {
      errors.push(`seo.socialProfiles contains invalid URL: ${profile}`);
    }
  }

  const origin = config.site?.origin ?? '';
  if (!origin) errors.push('site.origin must be set.');

  if (origin) {
    const originHost = new URL(origin).hostname.replace(/^www\./, '');
    const domain = (config.site.domain ?? '').replace(/^www\./, '');
    if (originHost !== domain) errors.push('site.origin host must match site.domain.');
  }

  const yamlOrigin = loadLegacyYamlSiteOrigin();
  if (yamlOrigin && yamlOrigin !== origin) {
    errors.push(
      `Canonical origin mismatch: src/config.yaml site.site (${yamlOrigin}) != src/data/site.json site.origin (${origin}).`
    );
  }

  const placeholderPattern = /your\s+business|example|placeholder|acme|demo/i;
  if (placeholderPattern.test(config.business?.name ?? '')) {
    errors.push('business.name contains placeholder identity text.');
  }

  return errors;
};
