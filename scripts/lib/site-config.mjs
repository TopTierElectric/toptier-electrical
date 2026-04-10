import fs from 'node:fs';

const siteConfigPath = new URL('../../src/data/site.json', import.meta.url);

export const loadSiteConfig = () => JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));

export const validateSiteConfig = (config) => {
  const errors = [];
  const phoneDigits = (config.business?.phoneE164 ?? '').replace(/\D/g, '');
  if (phoneDigits.includes('555')) errors.push('business.phoneE164 must not contain placeholder 555 digits.');

  const reviewUrl = config.seo?.googleReviewUrl ?? '';
  if (!/^https:\/\/g\.page\//.test(reviewUrl) || /example|placeholder/i.test(reviewUrl)) {
    errors.push('seo.googleReviewUrl must be a real g.page review URL.');
  }

  if (!Array.isArray(config.seo?.socialProfiles) || config.seo.socialProfiles.length === 0) {
    errors.push('seo.socialProfiles must contain at least one production social profile URL.');
  }

  if (config.site?.origin) {
    const originHost = new URL(config.site.origin).hostname.replace(/^www\./, '');
    const domain = (config.site.domain ?? '').replace(/^www\./, '');
    if (originHost !== domain) errors.push('site.origin host must match site.domain.');
  }

  const placeholderPattern = /your\s+business|example|placeholder|acme/i;
  if (placeholderPattern.test(config.business?.name ?? '')) {
    errors.push('business.name contains placeholder identity text.');
  }

  return errors;
};
