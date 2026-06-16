// Single source of truth for service-city landing pages.
// Used by /src/pages/{service}-{city-slug}.astro pages.

export type ServiceConfig = {
  slug: string;
  name: string;
  nameLower: string;
  serviceType: string;
  h1Action: string;
  intro: string;
  pricingFactors: string[];
  relatedServices: Array<{ slug: string; name: string }>;
  faqs: Array<{ q: string; a: string }>;
};

export type CityConfig = {
  slug: string;
  name: string;
  citySlug: string;
  county?: string;
  localContext: string;
  // Geographic midpoint of the city. Used as `geoMidpoint` on the
  // Service schema for service-city pages so Google has an explicit
  // proximity anchor for every "near me" query. Coordinates are
  // approximate municipal centers (publicly available, GeoNames-grade).
  geo: { latitude: number; longitude: number };
};

export const services: Record<string, ServiceConfig> = {
  'panel-upgrades': {
    slug: 'panel-upgrades',
    name: 'Electrical Panel Upgrades',
    nameLower: 'electrical panel upgrades',
    serviceType: 'Electrical Panel Upgrade',
    h1Action: 'Electrical Panel Upgrades',
    intro:
      'Code-compliant panel replacements and service upgrades, with clear scope and clean install before any inspection.',
    pricingFactors: [
      'Existing panel condition and amperage size',
      'Service mast or meter base updates',
      'Need for load calculations and future capacity (EV, generator, HVAC)',
      'Permit and utility coordination',
      'Drywall finish work if the panel is moving',
    ],
    relatedServices: [
      { slug: 'ev-chargers', name: 'EV Chargers' },
      { slug: 'electrical-repairs', name: 'Electrical Repairs' },
      { slug: 'lighting', name: 'Lighting' },
    ],
    faqs: [
      {
        q: 'Will my power be off during a panel upgrade?',
        a: 'Usually yes — there is a planned outage window while the panel is replaced. Most residential panel upgrades finish in a single day.',
      },
      {
        q: 'Do I need a service upgrade or just a panel replacement?',
        a: 'A panel replacement swaps the panel and breakers but keeps the existing service size. A service upgrade changes the service amperage (e.g., 100A to 200A) and involves the meter base and utility coordination. We confirm which one fits your situation with a load calculation before quoting.',
      },
      {
        q: 'Do you handle the permit and inspection?',
        a: 'Yes. Permit and inspection coordination is part of the scope.',
      },
      {
        q: 'How do I know if my existing panel is unsafe?',
        a: 'Warm or discolored breakers, scorch marks, breakers that trip during normal use, double-tapped breakers, corrosion, and known problem brands are all signs worth investigating. If you see any of these, stop using the affected circuit and call.',
      },
    ],
  },
  'ev-chargers': {
    slug: 'ev-chargers',
    name: 'EV Charger Installation',
    nameLower: 'EV charger installation',
    serviceType: 'EV Charging Station Installation',
    h1Action: 'EV Charger Installation',
    intro:
      'Level 2 EV charger installs with capacity checks, clean wiring, and permit coordination — safe, code-compliant home and commercial charging.',
    pricingFactors: [
      'Distance and route from the panel to the charger location',
      'Wall finish (drywall, masonry, exterior siding) and conduit needs',
      'Service size and panel condition',
      'Whether load management or a panel/service upgrade is required',
      'Permit and inspection coordination',
    ],
    relatedServices: [
      { slug: 'panel-upgrades', name: 'Panel Upgrades' },
      { slug: 'electrical-repairs', name: 'Electrical Repairs' },
      { slug: 'lighting', name: 'Lighting' },
    ],
    faqs: [
      {
        q: 'Do I need a panel upgrade to add an EV charger?',
        a: 'Not always. A load calculation tells us whether your existing service supports the charger. Many homes are fine; some need load management; some need a panel or service upgrade.',
      },
      {
        q: 'Hardwired or plug-in charger?',
        a: 'Both work. Hardwired typically looks cleaner, allows higher current (48A and up), and skips a receptacle that can degrade under continuous load. Plug-in (NEMA 14-50) gives portability if you move. We help you choose.',
      },
      {
        q: 'How long does the installation take?',
        a: 'Most charger installs are a single visit once the plan is confirmed. Panel or service upgrades, when needed, add a day plus a planned outage window.',
      },
      {
        q: 'Do you pull a permit?',
        a: 'Yes. Most jurisdictions require one. We coordinate the permit and inspection.',
      },
    ],
  },
  'electrical-repairs': {
    slug: 'electrical-repairs',
    name: 'Electrical Repairs',
    nameLower: 'electrical repairs and troubleshooting',
    serviceType: 'Electrical Repair',
    h1Action: 'Electrical Repairs & Troubleshooting',
    intro:
      'Systematic diagnosis of intermittent and difficult electrical issues, then a code-correct repair you can trust.',
    pricingFactors: [
      'How systematic the diagnosis needs to be (intermittent issues take longer)',
      'Whether wiring needs to be opened up to inspect',
      'Repair scope once the cause is found (replace receptacle, run new wire, fix splice)',
      'Whether breaker or panel work is needed',
    ],
    relatedServices: [
      { slug: 'panel-upgrades', name: 'Panel Upgrades' },
      { slug: 'lighting', name: 'Lighting' },
      { slug: 'ev-chargers', name: 'EV Chargers' },
    ],
    faqs: [
      {
        q: 'My breaker keeps tripping. Is it dangerous?',
        a: 'A breaker tripping repeatedly is doing its job — interrupting overload, short circuit, or ground fault conditions. Stop resetting it and call. We diagnose the root cause (load, equipment, wiring, breaker) before fixing the symptom.',
      },
      {
        q: 'Do you find intermittent issues?',
        a: 'Yes. Systematic testing under varied conditions — different times of day, different loads, different outlets — narrows down hidden faults. We tell you what we found before recommending the fix.',
      },
      {
        q: 'Will you tell me the cost before starting?',
        a: 'Yes. We confirm scope and approach before any repair work begins.',
      },
      {
        q: 'Can it be the breaker itself?',
        a: 'Sometimes. Breakers age and certain brands have known reliability issues. We rule out load and wiring causes first.',
      },
    ],
  },
  lighting: {
    slug: 'lighting',
    name: 'Lighting Installation',
    nameLower: 'lighting installation',
    serviceType: 'Lighting Installation',
    h1Action: 'Lighting Installation',
    intro:
      'Layout, fixtures, dimmers, and smart controls done cleanly — interior, exterior, kitchen task lighting, and LED retrofits.',
    pricingFactors: [
      'Fixture count and ceiling access',
      'Switching and dimming complexity',
      'Need for new circuits or dedicated lighting loads',
      'Fixture type and mounting height',
      'Specialty fixtures (high-bay, outdoor, wet location)',
    ],
    relatedServices: [
      { slug: 'panel-upgrades', name: 'Panel Upgrades' },
      { slug: 'electrical-repairs', name: 'Electrical Repairs' },
      { slug: 'ev-chargers', name: 'EV Chargers' },
    ],
    faqs: [
      {
        q: 'Will my existing dimmer work with new LED fixtures?',
        a: 'Sometimes. Old incandescent dimmers often need replacement to match the LED driver and avoid flicker, hum, or premature failure. We confirm dimmer-driver compatibility before installing.',
      },
      {
        q: 'Can you install customer-supplied fixtures?',
        a: 'Yes, as long as the fixture is compatible with the wiring and rated for its location.',
      },
      {
        q: 'LED retrofit or full fixture replacement?',
        a: "Depends on the existing fixture's condition, rating, and location. Healthy housings get retrofits; old, damaged, or wrong-rated fixtures get replaced.",
      },
      {
        q: 'Do I need new wiring for recessed lights?',
        a: 'Sometimes. We review access, existing wiring, and fixture requirements before confirming scope.',
      },
    ],
  },
  generators: {
    slug: 'generators',
    name: 'Generator Installation',
    nameLower: 'standby generator installation',
    serviceType: 'Generator Installation',
    h1Action: 'Standby Generator Installation',
    intro:
      'Whole-home and standby generators sized to your real loads, with the transfer switch, gas, and electrical tie-in done to code and verified under load.',
    pricingFactors: [
      'Generator size (kW) based on a real load calculation, not a guess',
      'Automatic transfer switch type — whole-home vs. essential-circuits',
      'Distance and route from the generator pad to the panel and meter',
      'Gas supply: natural gas tie-in or propane, and line sizing for the load',
      'Pad or mounting prep, permit, and utility/inspection coordination',
    ],
    relatedServices: [
      { slug: 'panel-upgrades', name: 'Panel Upgrades' },
      { slug: 'electrical-repairs', name: 'Electrical Repairs' },
      { slug: 'ev-chargers', name: 'EV Chargers' },
    ],
    faqs: [
      {
        q: 'What size generator do I need?',
        a: 'It depends on what you want to run during an outage. A whole-home unit powers everything; an essential-circuits setup covers heat, well, fridge, and a few rooms for less money. We run an actual load calculation before recommending a size — oversizing wastes money and undersizing nuisance-trips.',
      },
      {
        q: 'Natural gas or propane?',
        a: 'Both work. If you already have natural gas service, a tie-in is usually simplest and never needs refilling. Propane is the answer where gas is not available — it just needs a tank sized for the runtime you want. We size the gas line for the generator load either way.',
      },
      {
        q: 'Do I need a transfer switch?',
        a: 'Yes. A generator must never back-feed the grid — that endangers utility crews and your equipment. An automatic transfer switch isolates your home and starts the generator within seconds of an outage. It is not optional, and it is the part most DIY setups get dangerously wrong.',
      },
      {
        q: 'Do you pull the permit and handle inspection?',
        a: 'Yes. Generator installs involve electrical and often gas permits plus a final inspection. Coordinating all of it is part of the scope.',
      },
    ],
  },
};

export const cities: Record<string, CityConfig> = {
  'holland-mi': {
    slug: 'holland-mi',
    name: 'Holland',
    citySlug: 'electrician-holland-mi',
    county: 'Ottawa County',
    localContext:
      "Holland's housing stock is a mix of historic downtown homes, mid-century neighborhoods, and newer builds along the lakeshore — each with their own electrical considerations. Older panels, knob-and-tube remnants, and aluminum branch wiring are common in pre-1970s homes; newer construction tends to need EV charging, generator readiness, and smart-home wiring.",
    geo: { latitude: 42.7875, longitude: -86.1089 },
  },
  'grand-rapids-mi': {
    slug: 'grand-rapids-mi',
    name: 'Grand Rapids',
    citySlug: 'electrician-grand-rapids-mi',
    county: 'Kent County',
    localContext:
      'Grand Rapids covers everything from older homes in Heritage Hill and Eastown to commercial and light-industrial spaces downtown and along the highways. Service work in older neighborhoods often involves panel modernization and circuit organization; commercial and shop work runs the gamut from LED retrofits to three-phase distribution.',
    geo: { latitude: 42.9634, longitude: -85.6681 },
  },
  'zeeland-mi': {
    slug: 'zeeland-mi',
    name: 'Zeeland',
    citySlug: 'electrician-zeeland-mi',
    county: 'Ottawa County',
    localContext:
      'Zeeland blends compact residential neighborhoods with a strong agricultural and light-manufacturing base. Residential work often centers on panel upgrades and EV charging in established neighborhoods; commercial and ag work tends toward dedicated circuits, motor controls, and reliable lighting in working environments.',
    geo: { latitude: 42.8125, longitude: -86.0181 },
  },
  'hudsonville-mi': {
    slug: 'hudsonville-mi',
    name: 'Hudsonville',
    citySlug: 'electrician-hudsonville-mi',
    county: 'Ottawa County',
    localContext:
      'Hudsonville is a mix of newer subdivisions, working farms, and pole barns / outbuildings — meaning a lot of variety in scope. Common projects include subpanels for detached buildings, dedicated circuits for shop equipment, EV charging for commuters, and panel upgrades on older homes that have grown into modern electrical loads.',
    geo: { latitude: 42.8703, longitude: -85.8654 },
  },
  'ada-mi': {
    slug: 'ada-mi',
    name: 'Ada',
    citySlug: 'electrician-ada-mi',
    county: 'Kent County',
    localContext:
      'Ada has a strong custom-home and equestrian presence, which means electrical scope often goes beyond the standard residential package — 400A services, decorative lighting, barn power, and outbuilding feeders are routine here. New construction coordination with framing, finish, and mechanical trades is part of the job.',
    geo: { latitude: 42.9617, longitude: -85.4936 },
  },
};
