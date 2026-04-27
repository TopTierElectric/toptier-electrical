import siteData from '../data/site.json';

export const SITE = {
  name: 'Top Tier Electrical',
  url: 'https://toptier-electrical.com',
  phone: '+16163347159',
  displayPhone: '(616) 334-7159',
  email: 'info@toptier-electrical.com',
  license: 'MI License #6220430',
  areaServed: [
    'Holland',
    'Grand Rapids',
    'Byron Center',
    'Zeeland',
    'Saugatuck',
    'Douglas',
    'Hudsonville',
    'Jamestown',
    'Allegan',
  ],
} as const;

export const siteConfig = siteData;
export const siteOrigin = SITE.url;
export const canonicalDomain = new URL(SITE.url).hostname;
