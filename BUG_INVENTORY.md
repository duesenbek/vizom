# Bug Inventory

## BLOCKING BUGS (prevents core functionality)
- [ ] Bug: The `generateChart` function calls an undefined `client` object.
  - File: `generator.html`
  - Error: `ReferenceError: client is not defined`
  - Impact: Chart generation, the core feature of the app, is completely broken.

- [ ] Bug: Critical local scripts for core features are missing.
  - Files: `generator.html`, `templates.html`
  - Error: `Failed to load module script` for `TemplateGallery.js`, `templates.js`, `error-tracking.js`, `analytics.js`, etc.
  - Impact: The template gallery is non-functional, and other key features like error tracking and chart generation helpers fail silently.

- [ ] Bug: The payment processing logic is not functional.
  - File: `pricing.html`
  - Error: The `data-action="upgrade-pro"` buttons have no confirmed, working handler.
  - Impact: Users cannot purchase the Pro plan, blocking the primary revenue stream.

## CRITICAL BUGS (breaks user experience)
- [ ] Bug: Hardcoded Russian text is present in authentication modals.
  - Files: `generator.html`, `templates.html`, `pricing.html`
  - Impact: Creates a confusing and unprofessional experience for non-Russian-speaking users.

- [ ] Bug: Pro plan price uses a comma (`,`) instead of a period (`.`) as a decimal separator.
  - File: `pricing.html`
  - Impact: The price `$2,99` is non-standard for USD and may confuse users or cause payment processing failures.

- [ ] Bug: Dead links in the footer for "Resources" and "Company" sections.
  - Files: `index.html`, `templates.html`, `pricing.html`
  - Impact: Users cannot navigate to essential pages like Documentation, About, or Contact.

- [ ] Bug: Chart export functionality is incomplete and non-functional.
  - File: `generator.html`
  - Impact: Users cannot export their charts in any format (PNG, SVG, PDF), which is a key promised feature.

- [ ] Bug: The template gallery filtering and modal previews do not work.
  - File: `templates.html`
  - Impact: Users cannot filter, sort, or view details for templates, making the gallery unusable.

## MINOR BUGS (cosmetic/edge cases)
- [ ] Bug: Native `alert()` is used for form validation instead of a modern UI component.
  - Files: `index.html`, `generator.html`
  - Impact: Provides a jarring and disruptive user experience.

- [ ] Bug: The "Quick Prompts" and "Quick Actions" buttons on the generator page are non-functional.
  - File: `generator.html`
  - Impact: Users cannot use the shortcut buttons to pre-fill the generator.

- [ ] Bug: The project relies on CDN-hosted libraries (Tailwind, Chart.js) without local fallbacks.
  - Files: All
  - Impact: Poses a performance and reliability risk. If a CDN fails, the site's styling and functionality will break.

- [ ] Bug: The mobile menu script is duplicated across multiple pages.
  - Files: `generator.html`, `templates.html`, `pricing.html`
  - Impact: Unnecessary code duplication increases maintenance overhead.
