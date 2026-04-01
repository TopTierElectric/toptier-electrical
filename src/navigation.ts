import { getPermalink, getAsset } from './utils/permalinks';

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
    { text: 'Call / Text (616) 334-7159', href: 'tel:+16163347159' },
    { text: 'Request Scheduling', href: getPermalink('/booking') },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Quick Links',
      links: [
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Request Scheduling', href: getPermalink('/booking') },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Blog', href: getPermalink('/blog') },
        { text: 'FAQ', href: getPermalink('/faq') },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: '(616) 334-7159', href: 'tel:+16163347159' },
        { text: 'info@toptier-electrical.com', href: 'mailto:info@toptier-electrical.com' },
      ],
    },
    {
      title: 'Service Areas',
      links: [
        { text: 'Holland, MI', href: getPermalink('/electrician-holland') },
        { text: 'Grand Rapids, MI', href: getPermalink('/electrician-grand-rapids') },
        { text: 'Zeeland, MI', href: getPermalink('/electrician-zeeland') },
        { text: 'Hudsonville, MI', href: getPermalink('/electrician-hudsonville') },
        { text: 'Allegan, MI', href: getPermalink('/electrician-allegan') },
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
      href: 'https://www.facebook.com/profile.php?id=61573826170938',
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `© ${new Date().getFullYear()} Top Tier Electrical. All rights reserved.`,
};
