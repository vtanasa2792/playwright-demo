# Playwright Demo

[![Playwright Tests](https://github.com/vtanasa2792/playwright-demo/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/vtanasa2792/playwright-demo/actions/workflows/playwright.yml)

A Playwright/TypeScript test automation framework built from scratch against [practicesoftwaretesting.com](https://practicesoftwaretesting.com). Covers UI automation with the Page Object Model, API contract and functional testing with Zod, and a modular GitHub Actions pipeline.

## Tech Stack

TypeScript, Playwright, Zod, dotenv, GitHub Actions.

## Project Structure

```
config/
pages/
fixtures/
utilities/
  clients/
tests/
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
npx playwright test                          # all tests
npx playwright test tests/api/brands         # a single module
npx playwright show-report                   # open the HTML report
```

## Design Decisions

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

### CI

- **One job per module** running in parallel; a failure in one does not block the others.
- **Reusable workflow** (`run-tests.yml`) invoked by each job with a `tests-folder` input. The API job skips browser install.
- **Single worker in CI** for determinism; parallelism comes from the job level.
- **WebKit removed** due to known Linux CI stability issues.

## What I Would Add Next

- Playwright fixtures for shared login state.
- Negative-path API tests (401, 404, 422).
- Browser matrix in CI (chromium, firefox).
- Generated API tests for the remaining resources from the OpenAPI spec.
- Richer `Product` model returning typed objects rather than parallel arrays.
