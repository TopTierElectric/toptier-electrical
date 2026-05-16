// Spoke-graph: blog post slug → primary service hub link(s).
//
// This file is the source of truth for the post-template's "Related services"
// section. Each entry should:
//   - Point at the most-relevant service hub for that post's topic.
//   - Use descriptive, varied label text (not the same anchor twice across the
//     corpus — see §5 of the spoke-blog plan).
//
// Cluster map (hub → spoke posts):
//
//   /panel-upgrades
//     ├── 100-amp-vs-200-amp-panel
//     ├── zinsco-fpe-panel-replacement
//     ├── when-to-upgrade-electrical-panel
//     ├── electrical-panel-upgrade-cost
//     ├── 200-amp-vs-400-amp-service
//     └── blog-panel-upgrade-signs
//
//   /generators
//     ├── how-to-size-a-whole-home-generator
//     ├── whole-home-vs-portable-generator
//     ├── automatic-transfer-switch-explained
//     └── blog-generator-readiness
//
//   /ev-chargers
//     ├── level-1-vs-level-2-ev-charger
//     ├── michigan-ev-charger-rebates
//     ├── where-to-install-ev-charger
//     ├── do-i-need-a-panel-upgrade-for-an-ev-charger
//     └── blog-ev-charging
//
//   /electrical-repairs  (+ /code-corrections)
//     ├── flickering-lights-when-to-worry
//     ├── burning-smell-from-outlet
//     ├── knob-and-tube-wiring-what-to-do
//     ├── why-breakers-trip
//     ├── aluminum-wiring-what-to-do
//     ├── gfci-vs-afci-vs-dual-function
//     └── blog-surge-protection
//
//   /lighting  (+ /energy-solutions)
//     ├── smart-lighting-controls-explained
//     ├── outdoor-security-lighting-guide
//     ├── commercial-led-retrofit-roi
//     └── led-retrofit-vs-fixture-replacement
//
//   /services  (commercial cluster)
//     ├── commercial-electrical-maintenance-checklist
//     ├── restaurant-electrical-buildout
//     └── commercial-load-planning-basics

type RelatedService = { href: string; label: string };

export const blogRelatedServices: Record<string, RelatedService[]> = {
  '100-amp-vs-200-amp-panel': [
    { href: '/panel-upgrades', label: 'Main Panel Upgrades in West Michigan' },
    { href: '/services', label: 'All Electrical Services' },
  ],
  '200-amp-vs-400-amp-service': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'aluminum-wiring-what-to-do': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/code-corrections', label: 'Electrical Code Corrections' },
  ],
  'automatic-transfer-switch-explained': [
    { href: '/generators', label: 'Whole-Home Generator Installation' },
    { href: '/panel-upgrades', label: 'Electrical Panel Upgrades' },
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
  'burning-smell-from-outlet': [
    { href: '/electrical-repairs', label: "Top Tier's Repair Service" },
    { href: '/code-corrections', label: 'Bring Wiring Up to Code' },
  ],
  'commercial-electrical-maintenance-checklist': [
    { href: '/services', label: 'Our Service Catalog' },
    { href: '/electrical-repairs', label: 'Licensed Electrical Repair' },
  ],
  'commercial-led-retrofit-roi': [
    { href: '/lighting', label: 'LED Retrofit Service' },
    { href: '/energy-solutions', label: 'Energy-Saving Electrical Work' },
  ],
  'commercial-load-planning-basics': [
    { href: '/services', label: 'See What We Offer' },
    { href: '/panel-upgrades', label: 'Service & Panel Upgrades' },
  ],
  'do-i-need-a-panel-upgrade-for-an-ev-charger': [
    { href: '/ev-chargers', label: 'EV Charger Installation' },
    { href: '/panel-upgrades', label: 'Electrical Panel Upgrades' },
  ],
  'electrical-panel-upgrade-cost': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'flickering-lights-when-to-worry': [
    { href: '/electrical-repairs', label: 'Diagnostic and Repair' },
    { href: '/panel-upgrades', label: 'Upgrade Your Service Panel' },
  ],
  'gfci-vs-afci-vs-dual-function': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/code-corrections', label: 'Electrical Code Corrections' },
  ],
  'how-to-size-a-whole-home-generator': [
    { href: '/generators', label: 'Whole-Home Generator Installation' },
    { href: '/panel-upgrades', label: 'Electrical Panel Upgrades' },
  ],
  'knob-and-tube-wiring-what-to-do': [
    { href: '/code-corrections', label: 'Code-Compliance Work' },
    { href: '/electrical-repairs', label: 'Repair Service' },
  ],
  'led-retrofit-vs-fixture-replacement': [
    { href: '/lighting', label: 'Lighting & Fixtures Installation' },
    { href: '/energy-solutions', label: 'Energy Solutions' },
  ],
  'level-1-vs-level-2-ev-charger': [
    { href: '/ev-chargers', label: 'Level 2 Charger Install' },
    { href: '/panel-upgrades', label: '200 Amp Panel Installation' },
  ],
  'michigan-ev-charger-rebates': [
    { href: '/ev-chargers', label: 'Our EV Charging Service' },
    { href: '/energy-solutions', label: 'Energy Solutions' },
  ],
  'outdoor-security-lighting-guide': [
    { href: '/lighting', label: 'Lighting Installation' },
    { href: '/services', label: 'All Electrical Services' },
  ],
  'restaurant-electrical-buildout': [
    { href: '/services', label: 'Commercial Electrical Services' },
    { href: '/generators', label: 'Standby Generator Install' },
  ],
  'smart-lighting-controls-explained': [
    { href: '/lighting', label: 'Professional Lighting Work' },
    { href: '/services', label: 'All Electrical Services' },
  ],
  'when-to-upgrade-electrical-panel': [{ href: '/panel-upgrades', label: 'Electrical Panel Upgrades' }],
  'where-to-install-ev-charger': [
    { href: '/ev-chargers', label: 'Home EV Charger Setup' },
    { href: '/panel-upgrades', label: 'Electrical Panel Replacement' },
  ],
  'why-breakers-trip': [
    { href: '/electrical-repairs', label: 'Electrical Repairs & Troubleshooting' },
    { href: '/dedicated-circuits', label: 'Dedicated Circuit Installation' },
  ],
  'whole-home-vs-portable-generator': [
    { href: '/generators', label: 'Generator Installation in West Michigan' },
    { href: '/electrical-repairs', label: 'Electrical Troubleshooting' },
  ],
  'zinsco-fpe-panel-replacement': [
    { href: '/panel-upgrades', label: 'Electrical Panel Replacement' },
    { href: '/code-corrections', label: 'Our Code-Correction Service' },
  ],
};
