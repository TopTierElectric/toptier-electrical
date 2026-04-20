# Integrations Status

| Integration                  | Status          | Implementation                                                                       |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| GA4                          | Partially wired | gtag present in layout; `.env.example` placeholder added for measurement ID override |
| Google Search Console API    | Scaffolded      | env keys + setup doc created                                                         |
| Ahrefs/Semrush               | Scaffolded      | env keys + operating model doc created                                               |
| Surfer/Clearscope/MarketMuse | Scaffolded      | provider env keys + workflow doc created                                             |
| Review platform              | Scaffolded      | schema-safe rules and env placeholders created                                       |

## Validation

- `npm run check:integrations` verifies required docs and env template keys.
