// Glossary of electrical terms. Each entry becomes its own indexable page
// at /glossary/<slug>. These short, dense definition pages function as
// "internal link gravity wells" — every other piece of content in the site
// can link to a single canonical definition, distributing PageRank back to
// the glossary and reinforcing topical authority on the source page.

export type GlossaryEntry = {
  slug: string;
  term: string;
  abbreviation?: string;
  shortDef: string; // 1-sentence answer for the SERP snippet / Speakable schema
  body: string; // 200-400 word expanded definition with NEC references
  relatedTerms?: string[]; // slugs of other glossary entries
  relatedPosts?: string[]; // slugs of blog deep dives
  relatedServices?: Array<{ href: string; label: string }>;
};

export const glossary: GlossaryEntry[] = [
  {
    slug: 'afci',
    term: 'AFCI (Arc-Fault Circuit Interrupter)',
    abbreviation: 'AFCI',
    shortDef:
      'An AFCI is a breaker or receptacle that detects the electrical signature of an arc fault and trips before it can start a fire. Required by NEC 210.12 in most living spaces of modern homes.',
    body: `An Arc-Fault Circuit Interrupter (AFCI) monitors the current waveform on a circuit for the specific harmonic and frequency signature of an electrical arc — the small fires that occur when wiring is damaged, connections are loose, or insulation is failing. When the breaker detects an arc, it opens the circuit in milliseconds.

AFCI protection is required by NEC 210.12 in bedrooms, living rooms, family rooms, dining rooms, hallways, kitchens, laundry rooms, and closets — essentially every habitable space in a modern home. Older homes are grandfathered, but renovations that open walls typically require bringing affected circuits up to current code.

AFCIs come in two forms: AFCI breakers (installed in the panel, protecting the entire circuit) and AFCI receptacles (rarer, protect downstream outlets only). Most installs use breakers.

A common point of confusion: AFCI protects against fires from arcing, while GFCI protects against shocks from ground faults. They detect different things. Many modern circuits require both, satisfied by a single Dual-Function (DF) breaker.

AFCI breakers are known to nuisance-trip on certain motor-driven loads (vacuums, treadmills, some power tools). Persistent tripping under multiple different loads, however, signals a real fault worth diagnosing.`,
    relatedTerms: ['gfci', 'nec-210-12'],
    relatedPosts: ['gfci-vs-afci-vs-dual-function', 'why-breakers-trip'],
    relatedServices: [
      { href: '/code-corrections', label: 'Electrical code corrections' },
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
    ],
  },
  {
    slug: 'gfci',
    term: 'GFCI (Ground-Fault Circuit Interrupter)',
    abbreviation: 'GFCI',
    shortDef:
      'A GFCI is a device that compares hot and neutral current and trips when current leaks to ground — preventing electric shock in wet or grounded environments.',
    body: `A Ground-Fault Circuit Interrupter (GFCI) measures current flowing through the hot wire and the current returning through the neutral. When the two are unequal (typically by more than 5 mA), it means current is escaping the intended path — usually to ground, a person, or water. The GFCI trips in milliseconds, preventing electrocution.

GFCI protection is required by the NEC in bathrooms, kitchens (countertop receptacles), laundry rooms, garages, outdoor receptacles, crawl spaces, unfinished basements, and within 6 feet of any sink. Commercial requirements are broader.

Two delivery formats: GFCI receptacles (with TEST and RESET buttons on the face, protecting themselves and any downstream receptacles wired through them) and GFCI breakers (in the panel, protecting the entire circuit). Receptacles are cheaper; breakers are cleaner.

GFCIs are not interchangeable with AFCIs. GFCI protects against shocks; AFCI protects against fires from arcs. Many modern circuits require both, which is what a Dual-Function (DF) breaker provides in a single device.

GFCIs do age out: pressing the TEST button is the way to verify the protection still works. A GFCI that does not trip on TEST has failed and needs replacement.`,
    relatedTerms: ['afci', 'nec-210-12'],
    relatedPosts: ['gfci-vs-afci-vs-dual-function', 'burning-smell-from-outlet'],
    relatedServices: [
      { href: '/electrical-repairs', label: 'Electrical repairs' },
      { href: '/code-corrections', label: 'Electrical code corrections' },
    ],
  },
  {
    slug: 'nec-210-12',
    term: 'NEC 210.12',
    shortDef:
      'NEC 210.12 is the National Electrical Code section that mandates AFCI protection on most 15- and 20-amp branch circuits in dwelling units.',
    body: `Section 210.12 of the National Electrical Code (NEC) governs arc-fault circuit-interrupter (AFCI) protection requirements in residential occupancies. The current version requires AFCI protection on all 15- and 20-amp, 120V branch circuits supplying outlets and devices in:

- Bedrooms
- Living rooms, family rooms, dens, sunrooms, and recreation rooms
- Dining rooms
- Hallways and stairways
- Kitchens
- Laundry rooms
- Closets

This list captures virtually every habitable space in a typical home. Exceptions exist for bathrooms (handled by GFCI under 210.8), garages, outdoor areas, and certain dedicated-equipment circuits.

Michigan adopted the 2020 NEC, with local amendments. Older homes are grandfathered, but any circuit modified during a remodel typically must meet current code. Inspectors flag missing AFCI protection during permitted work.

Protection can be provided via AFCI breakers, AFCI/GFCI Dual-Function breakers, or (rarely) outlet-branch-circuit (OBC) AFCI receptacles. The breaker option is by far the most common in new installs.`,
    relatedTerms: ['afci', 'gfci'],
    relatedPosts: ['gfci-vs-afci-vs-dual-function', 'aluminum-wiring-what-to-do'],
    relatedServices: [{ href: '/code-corrections', label: 'Electrical code corrections' }],
  },
  {
    slug: 'automatic-transfer-switch',
    term: 'Automatic Transfer Switch (ATS)',
    abbreviation: 'ATS',
    shortDef:
      'An automatic transfer switch is the device that disconnects your home from the utility grid and connects it to a standby generator within seconds of an outage.',
    body: `An Automatic Transfer Switch (ATS) is the mandatory safety device in any whole-home standby generator install. It sits between the utility meter and the main panel. In normal operation, it passes utility power through to the panel.

When the ATS senses a utility outage (typically with a 10-second debounce to ignore brief flickers), it sends a low-voltage start signal to the generator. After the generator warms up for 5-15 seconds, the ATS executes a single mechanical action: it opens the utility contacts and closes the generator contacts. The two are never connected simultaneously, which is what prevents backfeed onto the utility grid.

When utility power returns and stays stable for a set period (30 seconds to 5 minutes, configurable), the ATS transfers back and signals the generator to cool down and shut off.

ATS units come in several flavors: service-rated (replaces the main panel disconnect, cleanest install), non-service-rated (downstream of the main), and sub-panel ATS (transfers only critical circuits). Manual transfer switches and interlock kits perform a similar function but require human intervention.

NEC 702.5 requires a transfer switch (automatic or manual) on every permanently-installed generator install. Backfeeding a generator through a wall outlet is illegal and dangerous.`,
    relatedTerms: ['service-entrance', 'load-calculation'],
    relatedPosts: [
      'automatic-transfer-switch-explained',
      'whole-home-vs-portable-generator',
      'how-to-size-a-whole-home-generator',
    ],
    relatedServices: [{ href: '/generators', label: 'Whole-home generator installation' }],
  },
  {
    slug: 'kva-vs-kw',
    term: 'kVA vs kW',
    shortDef:
      'kW is real power; kVA is apparent power. For purely resistive loads they are equal; for loads with motors or transformers, kVA exceeds kW by the power factor.',
    body: `Kilowatts (kW) and kilovolt-amperes (kVA) both measure electrical capacity, but they describe different aspects of the same circuit.

- **kW (kilowatt) — real power.** The power actually doing useful work: heating a coil, lifting a motor's load, lighting a bulb. This is what your utility bills you for.
- **kVA (kilovolt-ampere) — apparent power.** The total power flowing in the circuit, including reactive power that motors and transformers consume but don't convert to work.

The ratio between them is the **power factor** (PF): kW = kVA × PF.

For purely resistive loads (incandescent bulbs, electric heaters, kitchen ranges): PF = 1.0, so kW = kVA.

For inductive loads (motors, transformers, fluorescent ballasts, HVAC compressors): PF is typically 0.7-0.9, meaning kVA is larger than kW.

This matters when sizing generators, transformers, and service equipment. A 22 kW generator is typically rated for 22 kW of resistive load OR roughly 27.5 kVA of mixed motor load. Sizing only by kW underestimates capacity needs for motor-heavy installations like restaurants or industrial sites.

Commercial transformers are almost always rated in kVA because the load mix is unpredictable. Residential generators are usually rated in kW because the typical home load is dominated by resistive heating and lighting.`,
    relatedTerms: ['load-calculation', 'demand-factor'],
    relatedPosts: ['how-to-size-a-whole-home-generator', 'commercial-load-planning-basics'],
    relatedServices: [{ href: '/generators', label: 'Generator installation' }],
  },
  {
    slug: 'demand-factor',
    term: 'Demand Factor',
    shortDef:
      'A demand factor is the NEC-defined percentage applied to connected load to estimate actual peak demand — accounting for the fact that not all appliances run simultaneously.',
    body: `A demand factor is a coefficient less than or equal to 1.0 that the National Electrical Code applies to connected load when calculating the demand load for service sizing. It accounts for **load diversity**: the simple reality that not every appliance in a home or facility runs simultaneously at full power.

Examples from NEC Article 220:

- **General lighting (non-dwelling)**: 100% of first 12,500 VA, then 80% of remainder (Table 220.42).
- **Receptacle outlets (non-dwelling)**: 100% of first 10 kVA, then 50% of remainder (Table 220.44).
- **Commercial kitchen equipment**: 90% for 3 units, 80% for 4 units, 65% for 5, 55% for 6 or more (Table 220.56).
- **Dwelling unit ranges**: complex schedule reducing demand to 8 kW for a single 8-16 kW range, with adjustments for multiple units (Table 220.55).

Without demand factors, every electrical service in the country would be 2-3 times larger (and more expensive) than it needs to be. Without them, a typical 200-amp residential service couldn't physically exist.

Demand factors are why a home with 320 amps of connected load can run safely on 200-amp service: realistic peak demand, after factor application, comes out to 130-180 amps.

Misapplying demand factors is one of the most common errors in commercial load calculations. Specific factor tables apply to specific occupancy types — schools, hospitals, restaurants, retail, and dwellings each have different rules.`,
    relatedTerms: ['load-calculation', 'service-entrance'],
    relatedPosts: ['commercial-load-planning-basics', '100-amp-vs-200-amp-panel'],
    relatedServices: [{ href: '/panel-upgrades', label: 'Electrical panel upgrades' }],
  },
  {
    slug: 'load-calculation',
    term: 'Load Calculation',
    shortDef:
      'A load calculation is the NEC Article 220 procedure for determining the electrical demand on a service or feeder, used to size panels, conductors, and overcurrent protection.',
    body: `A load calculation is the systematic procedure defined by NEC Article 220 for determining the demand on a service or feeder. It is the basis for every panel sizing, service upgrade, and major remodel decision a licensed electrician makes.

The calculation has three layers:

1. **Connected load.** Sum every appliance and circuit nameplate, regardless of whether they run simultaneously. This is the worst-case upper bound.
2. **Demand load.** Apply NEC demand factors (Article 220) to reduce connected load based on occupancy type and load category. Continuous loads (those running 3+ hours) get a 125% multiplier.
3. **Service size.** Take the larger of: calculated demand load, the largest single appliance + 25%, or the minimum-service requirement for that occupancy type.

For dwelling units, NEC offers two methods: the **standard method** (220.42-220.55, more conservative) and the **optional method** (220.82, simpler arithmetic, slightly different results). Both are code-compliant; some jurisdictions prefer one over the other.

For commercial occupancies, additional rules apply: motor loads get a 25% adder on the largest motor (430.24), continuous loads are calculated at 125%, and specific occupancy types (kitchens, schools, hospitals) have their own demand tables.

A documented load calculation is required for any commercial permit and for residential service upgrades. The deliverable is typically a single-page worksheet showing connected load, demand factor application, and final amperage.`,
    relatedTerms: ['demand-factor', 'service-entrance', 'kva-vs-kw'],
    relatedPosts: ['commercial-load-planning-basics', '100-amp-vs-200-amp-panel', 'how-to-size-a-whole-home-generator'],
    relatedServices: [{ href: '/panel-upgrades', label: 'Panel upgrades' }],
  },
  {
    slug: 'service-entrance',
    term: 'Service Entrance',
    shortDef:
      'The service entrance is the set of conductors and equipment between the utility line and the main disconnect — the legal boundary between utility property and homeowner property.',
    body: `The service entrance encompasses everything between the utility's transformer and the building's main disconnect. It includes:

- **Service drop or service lateral.** The conductors running from the utility transformer to your home — overhead (drop) or underground (lateral).
- **Service point.** The contractual boundary between utility-owned and customer-owned equipment, typically at the weatherhead, meter base, or first lug on the line side of the meter.
- **Service entrance conductors (SECs).** The wires carrying utility power from the service point to the main disconnect. SEC sizing is governed by NEC 230.42 and Table 310.12.
- **Meter base / meter socket.** Where the utility meter mounts. Usually mounted on the building exterior.
- **Main disconnect / service disconnect.** Either the main breaker in the panel, or a separate disconnect (required for some configurations). NEC 230.70 requires the disconnect be located at a "readily accessible" point.
- **Grounding electrode system.** Ground rods, water-pipe bonds, and the main bonding jumper that establish ground reference.

Service entrance work has special rules: SECs are typically the only conductors in a residential install that carry unprotected utility voltage on the line side. Touching the wrong terminal is fatal. Permits are required for any service entrance modification.

When a panel upgrade is quoted, the service entrance is usually inspected at the same time. If the meter base is corroded, the SECs are undersized for the new panel amperage, or the grounding has degraded, the scope expands.`,
    relatedTerms: ['load-calculation', 'demand-factor', 'voltage-drop'],
    relatedPosts: ['200-amp-vs-400-amp-service', '100-amp-vs-200-amp-panel', 'when-to-upgrade-electrical-panel'],
    relatedServices: [{ href: '/panel-upgrades', label: 'Service upgrades and panel replacement' }],
  },
  {
    slug: 'voltage-drop',
    term: 'Voltage Drop',
    shortDef:
      'Voltage drop is the loss of voltage that occurs over the length of a conductor. NEC recommends staying under 3% on branch circuits and 5% total (feeder + branch).',
    body: `Voltage drop is the unavoidable loss of voltage that occurs as electrical current flows through a conductor's resistance. It is a function of conductor size (AWG), length of run, and current draw.

NEC Informational Note 210.19(A)(1) recommends keeping branch-circuit voltage drop below 3%, and total drop (feeder + branch) below 5%. These are recommendations, not enforceable code limits — but exceeding them causes real performance issues:

- **Motors run hot and short-lived.** Low voltage forces motors to draw more current to maintain torque.
- **LED drivers fail prematurely.** Many LED fixtures are voltage-sensitive.
- **Heating elements deliver less heat.** Power is proportional to V², so a 5% drop is a ~10% power reduction.
- **Voltage at the load fluctuates.** Heavy-current devices kicking on cause noticeable dimming.

The fix is bigger wire. A 100-foot run of 12 AWG copper carrying 20 amps at 240V drops about 1.8% — under code. The same load on 14 AWG drops 3.1% — over recommended. Long runs (to detached garages, well pumps, EV chargers) typically need one or two wire sizes up from what the breaker amperage alone would suggest.

For commercial feeders running 200+ feet, voltage drop is usually the binding constraint on wire size rather than ampacity. Engineering software calculates this automatically; for residential and small commercial work, NEC Chapter 9 Table 8 provides the resistance-per-foot data manually.`,
    relatedTerms: ['load-calculation', 'service-entrance'],
    relatedPosts: ['commercial-load-planning-basics', 'where-to-install-ev-charger'],
    relatedServices: [{ href: '/services', label: 'Commercial electrical services' }],
  },
  {
    slug: 'bonding-vs-grounding',
    term: 'Bonding vs Grounding',
    shortDef:
      'Grounding establishes a reference connection to earth; bonding ties metal parts together so they share the same electrical potential. Both are required by NEC Article 250.',
    body: `Bonding and grounding are often confused because they involve similar wires and terminations, but they serve different purposes.

**Grounding (NEC Article 250, Parts III–V)** connects the electrical system to the earth via the grounding electrode system: ground rods, water-pipe bonds, and concrete-encased electrodes (Ufer). The purpose is to establish a stable voltage reference and provide a path for lightning and high-voltage surges to dissipate.

**Bonding (NEC Article 250, Part V)** connects normally non-current-carrying metal parts (panel enclosures, conduit, metal water and gas piping, structural steel) together so that all those parts share the same electrical potential. The purpose is to prevent dangerous voltage differences during a fault — and to provide a low-impedance return path for fault current that lets breakers trip quickly.

Common terminology:

- **Grounding electrode conductor (GEC).** Wire from the panel to ground rods or water pipe.
- **Equipment grounding conductor (EGC).** The bare or green wire in a cable that bonds the receptacle ground to the panel.
- **Main bonding jumper (MBJ).** The intentional connection between the neutral bus and the ground bus at the service equipment — the **only** point in a residential system where they should be connected.

Confusing these is a common code-correction finding in older homes. Sub-panels with bonded neutrals (instead of separated) and corroded ground-rod connections at the service entrance are two of the more frequent issues we see in West Michigan inspections.`,
    relatedTerms: ['service-entrance'],
    relatedPosts: ['aluminum-wiring-what-to-do', 'flickering-lights-when-to-worry'],
    relatedServices: [{ href: '/code-corrections', label: 'Electrical code corrections' }],
  },
];

export const glossaryBySlug = Object.fromEntries(glossary.map((e) => [e.slug, e]));
