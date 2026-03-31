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

## Backend Notes
- Feature modules live in `server/src/modules/*`.
- Auth and users are in `server/src/auth` and `server/src/users`.
- Forum/banking logic is implemented under modules and Mongoose schemas.

## Frontend Notes
- Feature pages are in `web/src/app/features/*`.
- Shared UI and styles are in `web/src/app/shared`.
- Core services are in `web/src/app/core/services`.
