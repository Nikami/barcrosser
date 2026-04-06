# Barcrosser Project Context

## Project Overview
- Monorepo with npm workspaces: `web`, `plugin`, `shared`.
- Main stack:
  - `plugin`: Tampermonkey UserScript (TypeScript, bundled via Webpack).
  - `web`: Angular (passive DB frontend utilizing Dexie.js for IndexedDB storage).
  - `shared`: DTOs/types used by both apps.
- The `server` (NestJS + MongoDB) has been entirely removed. The system is fully browser-local.

## Repository Structure
- `plugin/src`: TypeScript scraper logic and Userscript metadata.
- `web/src`: Angular frontend app, UI components, and `dexie.js` data receivers.
- `shared/src`: Shared contracts and DTOs (e.g., `PostDTO`).

## Common Commands
- Install deps: `npm install` (repo root).
- Run full dev: `npm run dev` (starts Angular and Webpack watch for plugin).
- Build all: `npm run build` (builds shared, web, and plugin).
- Run Angular tests: `npm run test` (only available for web).

## Working Rules
- Prefer minimal, focused changes.
- Ensure any `PostDTO` changes match both the TypeScript scraper emit logic and the Angular Dexie reception schema.
- Run relevant linters and builds after non-trivial changes.

## Multi-Agent Handoff Rules
- Store shared context in `.ai/`.
- Primary file to read first: `.ai/CURRENT.md` (short summary, token-efficient).
- Detailed state file: `.ai/AI_HANDOFF.md`.
- Task status file: `.ai/AI_TASK_BOARD.md`.
- History file: `.ai/AI_WORKLOG.md` (append-only; read only when needed).
- At start of each session: read `.ai/CURRENT.md`; open other `.ai/*` files only if required.
- At end of each session: update `.ai/CURRENT.md` and the relevant detailed file(s).
- When switching between Agents, continue from these files instead of chat history.

## Plugin Notes
- Scraping logic is built via webpack. It intercepts `*.barcross.ru` pages and sends a `postMessage` payload cross-origin to target Angular endpoint.
- Built files reside in `plugin/dist/tracker.user.js`.

## Frontend Notes
- Feature pages are in `web/src/app/features/*`.
- Core services like `DataReceiverService` and `AppDatabase` are in `web/src/app/core/`.
- Shared UI and styles are in `web/src/app/shared`.
