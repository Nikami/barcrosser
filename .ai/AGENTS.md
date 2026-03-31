# Barcrosser Project Context

## Project Overview
- Monorepo with npm workspaces: `web`, `server`, `shared`.
- Main stack:
- `server`: NestJS + Mongoose.
- `web`: Angular.
- `shared`: DTOs/types used by both apps.

## Repository Structure
- `server/src`: backend modules, auth, users, business logic.
- `web/src`: frontend app and feature modules.
- `shared/src`: shared contracts and DTOs.

## Common Commands
- Install deps: `npm install` (repo root).
- Run full dev: `npm run dev` (runs web + server).
- Run only backend: `npm run dev:server`.
- Run only frontend: `npm run dev:web`.
- Run tests (all): `npm run test`.
- Build all: `npm run build`.

## Working Rules
- Prefer minimal, focused changes.
- Keep DTO contracts in `shared` backward compatible when possible.
- When changing API payloads, update both `server` and `web` usages.
- Run relevant tests/lint after non-trivial changes.

## Multi-Agent Handoff Rules
- Store shared context in `.ai/`.
- Primary file to read first: `.ai/CURRENT.md` (short summary, token-efficient).
- Detailed state file: `.ai/AI_HANDOFF.md`.
- Task status file: `.ai/AI_TASK_BOARD.md`.
- History file: `.ai/AI_WORKLOG.md` (append-only; read only when needed).
- At start of each session: read `.ai/CURRENT.md`; open other `.ai/*` files only if required.
- At end of each session: update `.ai/CURRENT.md` and the relevant detailed file(s).
- When switching between Codex and Antigravity built-in agent, continue from these files instead of chat history.

## Backend Notes
- Feature modules live in `server/src/modules/*`.
- Auth and users are in `server/src/auth` and `server/src/users`.
- Forum/banking logic is implemented under modules and Mongoose schemas.

## Frontend Notes
- Feature pages are in `web/src/app/features/*`.
- Shared UI and styles are in `web/src/app/shared`.
- Core services are in `web/src/app/core/services`.
