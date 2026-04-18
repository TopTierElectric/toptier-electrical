import siteData from './data/site.json';

const businessData = {
  name: siteData.business.name,
  contactInformation: {
    phone: siteData.business.phoneE164,
    email: siteData.business.email,
    address: 'West Michigan',
  },
  serviceAreas: siteData.serviceAreas,
  hours: {
    Monday: '08:00 AM - 06:00 PM',
    Tuesday: '08:00 AM - 06:00 PM',
    Wednesday: '08:00 AM - 06:00 PM',
    Thursday: '08:00 AM - 06:00 PM',
    Friday: '08:00 AM - 06:00 PM',
    Saturday: '09:00 AM - 01:00 PM',
    Sunday: 'Closed',
  },
  metadata: {
    businessType: siteData.business.category,
    license: siteData.business.license,
    website: siteData.site.origin,
    sameAs: [...siteData.seo.socialProfiles, siteData.seo.googleReviewUrl],
    googleBusinessProfile: siteData.seo.googleBusinessProfileUrl,
  },
};

export default businessData;
