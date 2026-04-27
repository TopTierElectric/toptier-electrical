import { getPermalink, getAsset } from './utils/permalinks';
import siteData from './data/site.json';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'Services', href: getPermalink('/services') },
    { text: 'Residential', href: getPermalink('/residential') },
    { text: 'Commercial', href: getPermalink('/commercial') },
    { text: 'Service Areas', href: getPermalink('/service-areas') },
    { text: 'Blog', href: getPermalink('/blog') },
    { text: 'Our Work', href: getPermalink('/gallery') },
    { text: 'About', href: getPermalink('/about') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [
    { text: `Call ${siteData.business.phoneDisplay}`, href: `tel:${siteData.business.phoneE164}` },
    { text: 'Get a Clear Estimate', href: getPermalink('/booking') },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Quick Links',
      links: [
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Get a Clear Estimate', href: getPermalink('/booking') },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Blog', href: getPermalink('/blog') },
        { text: 'FAQ', href: getPermalink('/faq') },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: siteData.business.phoneDisplay, href: `tel:${siteData.business.phoneE164}` },
        { text: siteData.business.email, href: `mailto:${siteData.business.email}` },
      ],
    },
    {
      title: 'Service Areas',
      links: [
        { text: 'Holland, MI', href: getPermalink('/electrician-holland-mi') },
        { text: 'Grand Rapids, MI', href: getPermalink('/electrician-grand-rapids-mi') },
        { text: 'Zeeland, MI', href: getPermalink('/electrician-zeeland-mi') },
        { text: 'Hudsonville, MI', href: getPermalink('/electrician-hudsonville-mi') },
        { text: 'Allegan, MI', href: getPermalink('/electrician-allegan-mi') },
        { text: 'Ada, MI', href: getPermalink('/electrician-ada') },
        { text: 'Grand Haven, MI', href: getPermalink('/electrician-grand-haven') },
        { text: 'Muskegon, MI', href: getPermalink('/electrician-muskegon') },
        { text: 'All Areas →', href: getPermalink('/service-areas') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: siteData.seo.socialProfiles[0],
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `© ${new Date().getFullYear()} ${siteData.business.name}. All rights reserved.`,
};
