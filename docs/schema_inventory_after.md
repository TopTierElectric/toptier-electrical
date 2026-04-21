# Schema Inventory (After)

## Sitewide (`src/layouts/TTELayout.astro`)

- `BreadcrumbList` (auto-generated per route)
- `Electrician` entity with `@id`, contact, opening hours, service area
- `WebSite` with `SearchAction`
- `SiteNavigationElement`

## Homepage (`src/pages/index.astro`)

- `ItemList` for service categories
- `FAQPage` with user-helpful FAQs
- explicit breadcrumb JSON-LD

## Contact (`src/pages/contact.astro`)

- `ContactPage` with `mainEntity` to business `@id`
- explicit breadcrumb JSON-LD

## Policy compliance notes

- Review/AggregateRating schema removed from template-level defaults to avoid unverifiable markup.
- FAQ schema used only where visible FAQ content exists.
