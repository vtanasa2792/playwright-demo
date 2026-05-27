# Playwright Demo

This is a Playwright/TypeScript demo framework built from scratch to showcase my understanding of core test automation principles. Coming from a Cypress background, this project demonstrates my ability to translate those skills into Playwright, covering POM architecture, credential handling, utility abstractions, and CI/CD integration.

## Tech Stack

- TypeScript
- Playwright
- dotenv
- GitHub Actions / GitLab CI

## Project Structure

```
tests/
  auth/
  products/
  cart/
pages/
  auth/
  products/
  cart/
utils/
.env
playwright.config.ts
```

## How to Run

### Prerequisites

Tests read credentials from a `.env` file (gitignored). Create one based on `.env.example`:

```
TEST_USERS={"admin":{"email":"...","password":"..."},"customer1":{"email":"...","password":"..."}}
```

### Run locally (Node)

Requires Node and the Playwright browsers installed on your machine.

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

### Run in Docker (one command, no local setup)

The `Dockerfile` packages the suite, Node, and all browsers into a single image, so the full suite runs in a clean, reproducible environment with nothing installed locally beyond Docker itself.

Build the image:

```bash
docker build -t playwright-suite .
```

Run the full suite, headless:

```bash
docker run --rm --env-file .env playwright-suite
```

Notes on the flags:
- `--rm` removes the container after it exits.
- `--env-file .env` injects the test credentials at runtime, so secrets are never baked into the image.

The container exits with a non-zero status code if any test fails, so it works directly as a CI gate.

Run a specific suite by overriding the default command:

```bash
docker run --rm --env-file .env playwright-suite npx playwright test tests/api
```

### How CI runs the tests

CI uses a different design than the local Docker image, on purpose. Instead of baking the test code into an image, GitHub Actions runs each job **inside an environment-only image** (browsers plus system dependencies, no test code) and checks out the latest code into it at run time:

```yaml
container:
  image: ghcr.io/vtanasa2792/playwright-env:v1.59.1-noble
```

This image is a mirror of the official Playwright image, re-hosted in this project's own GitHub Container Registry for reliability and control (no dependency on Docker Hub availability or rate limits). The official image is pinned by Playwright version so the bundled browsers always match the installed `@playwright/test`.

The two containerization approaches serve different goals:
- The `Dockerfile` (environment plus code) is for running the whole suite locally or anywhere in one command.
- The CI environment image (environment only, code checked out per run) keeps every pull request tested against its own latest code in an identical, reproducible environment.

Credentials are injected in CI through the `TEST_USERS` GitHub Actions secret, the same way `--env-file` injects them locally.
