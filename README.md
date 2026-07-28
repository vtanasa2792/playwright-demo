# Playwright Demo

[![Playwright Tests](https://github.com/vtanasa2792/playwright-demo/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/vtanasa2792/playwright-demo/actions/workflows/playwright.yml)

A Playwright/TypeScript test automation framework built from scratch against [practicesoftwaretesting.com](https://practicesoftwaretesting.com). Covers UI automation with the Page Object Model, API contract and functional testing with Zod, and a modular GitHub Actions pipeline.

## Tech Stack

TypeScript, Playwright, Zod, dotenv, GitHub Actions.

## Project Structure

```
configs/
  UserConfig.ts
  playwright.base.config.ts
  playwright.dev.config.ts
pages/
fixtures/
utilities/
  clients/
tests/
  e2e/
    login/
    products-catalog/
    shopping-cart/
  api/brands/
.github/workflows/
```

## How to Run

Requires Node 20+ and a `.env` file based on `.env.example`.

```bash
npm install
npx playwright install
npm run test:api:dev                                              # API project only
npm run test:e2e:dev                                              # e2e (UI) project only
npx playwright test --config configs/playwright.dev.config.ts     # everything
npx playwright show-report                                        # open the HTML report
```

## Design Decisions

### Config

- **Base + per-environment composition.** `configs/playwright.base.config.ts` holds settings shared by every environment (parallelism, retries, reporter, timeouts). Environment-specific files (`playwright.dev.config.ts` today) import the base config and extend it with `projects`.
- **Projects split by concern, not by browser.** `api` and `e2e` each own their own `baseURL` and `use` block, rather than one project per browser.
- **Only one real environment exists today** — `dev`, the public demo site. CI runs the same `playwright.dev.config.ts` as local; the CI-vs-local behavioral difference (workers, retries) is handled inside the base config via `process.env.CI`, not by a separate config file. A new per-environment config would only be added for a genuinely different target (e.g. a staging deployment).

### UI

- **Page Object Model** with intent-level actions; tests describe behaviour, page objects hide the DOM.
- **`data-test` attributes** as the default locator strategy, set globally via `testIdAttribute`.
- **`waitForResponse` over arbitrary waits**, set up before the triggering action.
- **Assertions live in tests**, orchestration in page objects.

### API

- **Contract and functional specs are separate.** Contract validates shape (one test per endpoint); functional validates behaviour (one test, full CRUD lifecycle).
- **Zod as a single source of truth.** Schemas are declared once; types are inferred via `z.infer`, eliminating duplicated type definitions.
- **`test.step` per lifecycle phase** so failures report the exact phase and the test reads as a narrative.
- **Admin bearer token acquired once** in `beforeAll` and reused across the describe.
- **`auth.client.ts` lives under `utilities/`** because it is not API-test specific; UI tests can use it to seed state.
- **Login fails fast.** `Authentication.loginAs` throws if the login request doesn't return a 2xx or doesn't return a token, instead of silently returning `undefined` and surfacing as a confusing failure elsewhere later.

### CI

- **One job per test project** (`api`, `e2e`) running in parallel; a failure in one does not block the other.
- **Reusable workflow** (`run-tests.yml`) invoked by each job with a `project` input, run against `configs/playwright.dev.config.ts`.
- **WebKit removed** due to known Linux CI stability issues.

## What I Would Add Next

- Auth-token and shared-POM fixtures, replacing manual `new Authentication(...)` / `new XPage(page)` instantiation in each spec.
- Browser matrix in CI (chromium, firefox).
- Generated API tests for the remaining resources from the OpenAPI spec.
- Richer `Product` model returning typed objects rather than parallel arrays.
- A second per-environment config, if a genuinely different target (e.g. staging) is ever introduced.
