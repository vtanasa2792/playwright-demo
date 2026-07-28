# Official Playwright image, pinned to match @playwright/test in package.json (browsers included).
FROM mcr.microsoft.com/playwright:v1.59.1-noble

# Deterministic CI behavior; also stops the HTML reporter from auto-opening and hanging the container.
ENV CI=true

WORKDIR /app

# Copy manifests first so the install layer stays cached until dependencies change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Exec form so the test exit code propagates (non-zero on failure).
CMD ["npx", "playwright", "test", "--config", "configs/playwright.dev.config.ts"]
