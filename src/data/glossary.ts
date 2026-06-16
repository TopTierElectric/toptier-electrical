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
  {
    slug: 'ampacity',
    term: 'Ampacity',
    shortDef:
      'Ampacity is the maximum current, in amperes, a conductor can carry continuously without exceeding its temperature rating. Governed by NEC Article 310 and Table 310.16.',
    body: `Ampacity is the safe continuous current-carrying capacity of a wire. Exceed it and the conductor overheats, degrades its insulation, and eventually becomes a fire risk — which is exactly what a correctly sized breaker is there to prevent.

Ampacity depends on the conductor material (copper vs. aluminum), its cross-sectional area (AWG size), the insulation temperature rating (60°C, 75°C, or 90°C), and the installation conditions. NEC Table 310.16 is the reference chart electricians use; for example, 12 AWG copper at the 60°C column is rated 20 amps, which is why a standard 20-amp circuit uses 12-gauge wire.

Two adjustments routinely reduce the usable ampacity below the table value: high ambient temperature and bundling more than three current-carrying conductors together. Both force a derate, which is why a wire that looks adequate on paper can be undersized in a hot attic or a packed conduit.

Most residential overheating and nuisance-tripping problems trace back to a circuit being loaded near or beyond its conductor's ampacity. A proper load calculation prevents it.`,
    relatedTerms: ['load-calculation', 'voltage-drop', 'wire-derating'],
    relatedPosts: ['100-amp-vs-200-amp-panel', 'why-breakers-trip'],
    relatedServices: [
      { href: '/panel-upgrades', label: 'Electrical panel upgrades' },
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
    ],
  },
  {
    slug: 'wire-derating',
    term: 'Wire Derating (Ampacity Adjustment)',
    shortDef:
      'Derating is the required reduction of a conductor’s rated ampacity to account for high ambient temperature or bundling. Specified in NEC 310.15.',
    body: `Derating is the code-required step of reducing a wire's table ampacity when real-world conditions would make it run hotter than the table assumes. Skipping it is one of the more common — and least visible — code violations.

NEC 310.15 covers two main adjustments. **Ambient temperature correction** applies when the wire runs through a space hotter than the 30°C (86°F) baseline — an uninsulated attic in summer can hit 50°C and knock 20–30% off a conductor's rating. **Conductor bundling adjustment** applies when more than three current-carrying conductors share a raceway or cable; packing in more wires traps heat, so ampacity is reduced on a sliding scale (e.g., 4–6 conductors derate to 80%).

Both factors are multiplied together, and the result must still support the breaker protecting the circuit. This is why an electrician designing a new circuit doesn't just read the ampacity table — they confirm the install conditions first. It's also why DIY additions that cram extra cables into an existing conduit can quietly create an overheating hazard even though every individual wire "looks" the right gauge.`,
    relatedTerms: ['ampacity', 'load-calculation'],
    relatedPosts: ['why-breakers-trip', 'burning-smell-from-outlet'],
    relatedServices: [{ href: '/code-corrections', label: 'Electrical code corrections' }],
  },
  {
    slug: 'evse',
    term: 'EVSE (Electric Vehicle Supply Equipment)',
    abbreviation: 'EVSE',
    shortDef:
      'EVSE is the technical term for an EV "charger" — the equipment that safely delivers power to the vehicle. Installation is governed by NEC Article 625.',
    body: `EVSE — Electric Vehicle Supply Equipment — is the proper name for what most people call an EV charger. The actual charger is inside the vehicle; the EVSE is the wall- or pedestal-mounted equipment that supplies and controls the power feeding it.

EVSE comes in three levels. **Level 1** plugs into a standard 120V outlet and adds roughly 3–5 miles of range per hour. **Level 2** runs on a 240V circuit and adds 20–40 miles per hour — the practical choice for home charging. **Level 3 / DC fast charging** is commercial-grade and not a residential install.

NEC Article 625 governs EVSE installation. Key requirements include a dedicated branch circuit, GFCI protection for receptacle-fed units, and accounting for the EVSE as a continuous load — meaning the circuit must be sized to 125% of the unit's rated current. That last rule is why a 48-amp EVSE needs a 60-amp circuit, and why a load calculation matters before adding one to an existing panel.

Hardwired Level 2 EVSE generally allows higher current and a cleaner install than a plug-in (NEMA 14-50) unit, which trades some capacity for portability.`,
    relatedTerms: ['load-calculation', 'demand-factor'],
    relatedPosts: [
      'level-1-vs-level-2-ev-charger',
      'do-i-need-a-panel-upgrade-for-an-ev-charger',
      'where-to-install-ev-charger',
    ],
    relatedServices: [
      { href: '/ev-chargers', label: 'EV charger installation' },
      { href: '/panel-upgrades', label: 'Electrical panel upgrades' },
    ],
  },
  {
    slug: 'sub-panel',
    term: 'Sub-Panel (Subpanel)',
    shortDef:
      'A sub-panel is a secondary breaker panel fed from the main panel, used to distribute circuits to a remote area such as a garage, shop, or addition. Neutrals and grounds must be separated per NEC 250.24 and 408.40.',
    body: `A sub-panel is a smaller breaker panel fed from the main service panel by a feeder. It extends capacity and circuit organization to a part of the property that would otherwise need long home runs — a detached garage, a pole barn, a finished basement, or an addition.

The single most important — and most commonly botched — rule for sub-panels is that the **neutral (grounded) and ground (grounding) bus bars must be kept separate**. They are bonded together at exactly one place in the system: the main service equipment (the main bonding jumper). At a sub-panel, the neutral bus must "float" on insulated standoffs, and the equipment grounds land on a separate bus bonded to the enclosure. NEC 250.24 and 408.40 govern this.

When a sub-panel's neutral and ground are improperly bonded together, normal neutral current flows on the grounding conductors and metal enclosures — energizing things that should never carry current and defeating the safety system. It's one of the most frequent findings in older homes and DIY outbuilding feeds we correct across West Michigan.

A detached-building sub-panel also needs its own grounding electrode (ground rod) per NEC 250.32.`,
    relatedTerms: ['bonding-vs-grounding', 'service-entrance', 'load-calculation'],
    relatedPosts: ['aluminum-wiring-what-to-do'],
    relatedServices: [
      { href: '/code-corrections', label: 'Electrical code corrections' },
      { href: '/dedicated-circuits', label: 'Dedicated circuits' },
    ],
  },
  {
    slug: 'double-tapped-breaker',
    term: 'Double-Tapped Breaker',
    shortDef:
      'A double-tap is two wires landed under one breaker terminal that is only listed for one. A common code violation and home-inspection flag under NEC 110.14.',
    body: `A double-tapped breaker is one where two conductors are clamped under a single breaker terminal that the manufacturer only listed for one wire. It's one of the most frequent items written up on home inspections, and for good reason.

NEC 110.14 requires that conductors be terminated only in the manner the equipment is listed for. Most residential breakers are listed for a single conductor. When two are forced under one screw, neither is reliably clamped — one works loose over time, and a loose connection under load means heat, arcing, and eventually a burned bus or breaker. A few specific breaker models (certain Square D and others) are listed for two wires; most are not.

The fix is straightforward: either add a breaker for the second circuit, or join the two conductors to a single "pigtail" with a listed connector and land the pigtail under the breaker. It's a small repair that resolves a real fire risk.

Double-taps usually appear when someone added a circuit without room in the panel — which is often itself a sign the panel is full and a service or panel upgrade is the real answer.`,
    relatedTerms: ['load-calculation', 'bonding-vs-grounding'],
    relatedPosts: ['why-breakers-trip', 'burning-smell-from-outlet'],
    relatedServices: [
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
      { href: '/panel-upgrades', label: 'Electrical panel upgrades' },
    ],
  },
  {
    slug: 'back-feeding',
    term: 'Back-Feeding',
    shortDef:
      'Back-feeding is pushing power from a generator into a home’s wiring without a transfer switch — illegal and lethal to utility workers. NEC 702 requires proper transfer equipment.',
    body: `Back-feeding is the dangerous practice of energizing a home's wiring from a portable generator without proper transfer equipment — typically by means of a "suicide cord" with male plugs on both ends, or by improperly wiring a generator into the panel.

It is lethal for two reasons. First, the home's main breaker is usually still closed, so the generator's power flows backward through the service and out onto the utility lines — where it can be stepped back up to thousands of volts by the distribution transformer and electrocute a lineworker who believes the line is dead. Second, when utility power returns, it collides with the running generator, destroying equipment and starting fires.

NEC 702 (Optional Standby Systems) requires that any generator connection to a home's wiring go through listed transfer equipment — either an automatic transfer switch or, at minimum, a manual transfer switch or a panel interlock kit that makes it physically impossible for the generator and the utility to be connected at the same time.

The takeaway: every safe, legal generator hookup includes transfer equipment. There is no acceptable shortcut.`,
    relatedTerms: ['automatic-transfer-switch'],
    relatedPosts: [
      'automatic-transfer-switch-explained',
      'whole-home-vs-portable-generator',
      'how-to-size-a-whole-home-generator',
    ],
    relatedServices: [{ href: '/generators', label: 'Generator installation' }],
  },
  {
    slug: 'surge-protective-device',
    term: 'SPD (Surge-Protective Device)',
    abbreviation: 'SPD',
    shortDef:
      'An SPD diverts voltage spikes away from a home’s wiring and electronics. The 2020 NEC (230.67) requires a Type 1 or Type 2 SPD on new and replacement dwelling services.',
    body: `A Surge-Protective Device (SPD) clamps and diverts transient voltage spikes — from lightning, utility switching, and large motors cycling — before they reach the sensitive electronics throughout a home.

There are three types by install location. **Type 1** installs on the line side of the main breaker (between the meter and panel) and handles the largest external surges, including nearby lightning. **Type 2** installs on the load side, inside or beside the panel, and is the most common whole-home choice. **Type 3** are point-of-use devices like plug-in strips, which only protect a single location and should never be the only layer.

A significant code change: the 2020 NEC added 230.67, which **requires** a Type 1 or Type 2 SPD on the service equipment of new and replacement dwelling-unit services. So any panel upgrade done to current code now includes whole-home surge protection by default.

Whole-home surge protection is inexpensive relative to what it protects — HVAC control boards, well pumps, appliances with electronics, computers, and the growing list of smart-home devices that are all vulnerable to a spike that a power strip won't stop.`,
    relatedTerms: ['service-entrance', 'voltage-drop'],
    relatedPosts: ['blog-surge-protection'],
    relatedServices: [
      { href: '/panel-upgrades', label: 'Electrical panel upgrades' },
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
    ],
  },
  {
    slug: 'nm-b-cable',
    term: 'NM-B Cable (Romex)',
    abbreviation: 'NM-B',
    shortDef:
      'NM-B is the standard nonmetallic-sheathed cable used for most residential branch circuits, commonly called by the brand name Romex. Governed by NEC Article 334.',
    body: `NM-B is nonmetallic-sheathed cable — the flat plastic-jacketed wiring inside most residential walls. "Romex" is a brand name (Southwire) that became the common term for it, the way "Band-Aid" stands in for adhesive bandages.

A typical NM-B run contains insulated current-carrying conductors plus a bare equipment grounding conductor, all in a single jacket. The jacket is color-coded by size for quick identification: white for 14 AWG (15-amp circuits), yellow for 12 AWG (20-amp), orange for 10 AWG (30-amp). The "B" designates the modern 90°C-rated insulation, though NM-B's ampacity must be used at the 60°C column per NEC 334.80 — a frequent source of confusion when sizing.

NEC Article 334 governs where NM-B can and can't be used. It's fine in dry, protected interior locations but **not** permitted where exposed to physical damage, in wet or damp locations, or embedded in masonry — those call for conduit and individual conductors, or cable rated for the condition (like UF-B for direct burial).

Knob-and-tube and old cloth-jacketed NM are the wiring types NM-B replaced; finding them is usually the start of a code-correction conversation.`,
    relatedTerms: ['ampacity', 'wire-derating', 'knob-and-tube'],
    relatedPosts: ['knob-and-tube-wiring-what-to-do', 'aluminum-wiring-what-to-do'],
    relatedServices: [{ href: '/code-corrections', label: 'Electrical code corrections' }],
  },
  {
    slug: 'service-disconnect',
    term: 'Service Disconnect (Main Breaker)',
    shortDef:
      'The service disconnect is the single switch that cuts all power entering a building. NEC 230.70 requires it be readily accessible and clearly marked; the 2020 NEC added an outdoor-disconnect requirement.',
    body: `The service disconnect — usually the main breaker at the top of the panel — is the one device that shuts off all power entering a building in a single motion. In an emergency, it's what a homeowner or a first responder reaches for.

NEC 230.70 requires the service disconnect to be installed in a readily accessible location, either outside or inside nearest the point where the service conductors enter. It must be clearly marked as the service disconnect, and 230.71 limits how many disconnects can serve one service (the old "six-throw" rule was tightened in the 2020 NEC to require a single main disconnect for most new services).

A significant recent change: the 2020 NEC introduced an **emergency disconnect** requirement (230.85) for one- and two-family dwellings, mandating a disconnect in a readily accessible outdoor location. This lets firefighters de-energize a home without entering it — which is why newer and upgraded services often have an exterior disconnect ahead of the meter or panel.

If your panel has no main breaker, multiple disconnects, or an inaccessible shutoff, that's a code-correction item worth addressing at the next service upgrade.`,
    relatedTerms: ['service-entrance', 'bonding-vs-grounding'],
    relatedPosts: ['100-amp-vs-200-amp-panel', '200-amp-vs-400-amp-service'],
    relatedServices: [
      { href: '/panel-upgrades', label: 'Electrical panel upgrades' },
      { href: '/code-corrections', label: 'Electrical code corrections' },
    ],
  },
  {
    slug: 'knob-and-tube',
    term: 'Knob-and-Tube Wiring',
    abbreviation: 'K&T',
    shortDef:
      'Knob-and-tube is an early-1900s wiring method using ceramic knobs and tubes to run ungrounded conductors. Not inherently unsafe, but it has no ground, can’t be buried in insulation, and is a frequent insurance and code concern.',
    body: `Knob-and-tube (K&T) is the wiring method used in homes built roughly from 1900 to the 1940s. Individual conductors are run through the framing, supported by ceramic knobs and protected through joists by ceramic tubes, with the wires held away from surfaces to dissipate heat.

K&T is not automatically dangerous — much of it has run safely for a century. But it has real limitations modern homes outgrow. It has **no equipment grounding conductor**, so it can't safely serve grounded receptacles or modern electronics. Its rubberized insulation becomes brittle with age and heat. Critically, K&T relies on open air for cooling, so it **cannot be buried in thermal insulation** — a major problem when an old home gets its attic and walls insulated, which traps heat and accelerates breakdown.

Insurers increasingly refuse or surcharge policies on homes with active K&T, and any renovation that opens walls typically triggers a requirement to replace the affected runs. The usual remediation is a partial or full rewire to modern NM-B cable, often staged room by room.

We assess K&T scope honestly — what's live, what's abandoned, and what actually needs to come out — before recommending a plan.`,
    relatedTerms: ['nm-b-cable', 'bonding-vs-grounding', 'ampacity'],
    relatedPosts: ['knob-and-tube-wiring-what-to-do', 'buying-house-electrical-concerns'],
    relatedServices: [
      { href: '/code-corrections', label: 'Electrical code corrections' },
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
    ],
  },
  {
    slug: 'aluminum-branch-wiring',
    term: 'Aluminum Branch Wiring',
    shortDef:
      'Solid aluminum branch wiring, common in homes built 1965–1973, expands and oxidizes at connections, creating a fire risk. Remediated with listed AL/CU connectors (pigtailing) or COPALUM/AlumiConn.',
    body: `Aluminum branch-circuit wiring was widely installed in homes built from about 1965 to 1973, when copper prices spiked. It's distinct from the aluminum service-entrance and feeder conductors still used safely today — the concern is specifically the small-gauge solid aluminum used for 15- and 20-amp branch circuits to receptacles and switches.

The problem is at the connections, not the wire itself. Aluminum expands and contracts more than copper as it heats and cools under load, which slowly loosens terminations. It also oxidizes, and aluminum oxide is resistant — raising resistance, which raises heat, in a worsening cycle. The result is overheated outlets and switches, a documented fire risk the CPSC has studied extensively.

Approved remediation does not necessarily mean a full rewire. The accepted methods are **pigtailing** with connectors specifically listed for aluminum-to-copper transitions (AlumiConn lugs or COPALUM crimps applied by a certified installer), or replacing devices with ones rated **CO/ALR**. What's *not* acceptable is ignoring it or using standard wire nuts and standard receptacles.

Warning signs include warm cover plates, flickering, a faint burning smell, or outlets that have stopped working. Any of those on a 1965–1973 home warrants an assessment.`,
    relatedTerms: ['bonding-vs-grounding', 'ampacity', 'nm-b-cable'],
    relatedPosts: ['aluminum-wiring-what-to-do', 'buying-house-electrical-concerns', 'burning-smell-from-outlet'],
    relatedServices: [
      { href: '/code-corrections', label: 'Electrical code corrections' },
      { href: '/electrical-repairs', label: 'Electrical repairs and troubleshooting' },
    ],
  },
];

export const glossaryBySlug = Object.fromEntries(glossary.map((e) => [e.slug, e]));
