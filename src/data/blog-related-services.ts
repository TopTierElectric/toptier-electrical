type RelatedService = { href: string; label: string };

export const blogRelatedServices: Record<string, RelatedService[]> = {
  '200-amp-vs-400-amp-service': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'aluminum-wiring-what-to-do': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/code-corrections', label: 'Electrical Code Corrections' },
  ],
  'blog-electrical-safety': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/code-corrections', label: 'Electrical Code Corrections' },
  ],
  'blog-ev-charging': [
    { href: '/ev-chargers', label: 'EV Charger Installation' },
    { href: '/panel-upgrades', label: 'Electrical Panel Upgrades' },
  ],
  'blog-generator-readiness': [{ href: '/generators', label: 'Generator Installation' }],
  'blog-panel-upgrade-signs': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'blog-right-electrician': [
    { href: '/services', label: 'All Electrical Services' },
    { href: '/about', label: 'About Top Tier Electrical' },
  ],
  'blog-surge-protection': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/energy-solutions', label: 'Energy Solutions' },
  ],
  'do-i-need-a-panel-upgrade-for-an-ev-charger': [
    { href: '/ev-chargers', label: 'EV Charger Installation' },
    { href: '/panel-upgrades', label: 'Electrical Panel Upgrades' },
  ],
  'electrical-panel-upgrade-cost': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'gfci-vs-afci-vs-dual-function': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/code-corrections', label: 'Electrical Code Corrections' },
  ],
  'led-retrofit-vs-fixture-replacement': [
    { href: '/lighting', label: 'Lighting & Fixtures Installation' },
    { href: '/energy-solutions', label: 'Energy Solutions' },
  ],
  'when-to-upgrade-electrical-panel': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'why-breakers-trip': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/dedicated-circuits', label: 'Dedicated Circuit Installation' },
  ],
};
