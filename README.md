# OpenRM

OpenRM is an open, self-hostable configuration and requirements management platform. The repository contains the interactive product preview, completed requirements vertical slice, and the active traceability implementation.

[![OpenRM CI](https://github.com/TJ-Engineer/OpenRM/actions/workflows/ci.yml/badge.svg)](https://github.com/TJ-Engineer/OpenRM/actions/workflows/ci.yml)

## Development status

**Current stage:** 🟡 Phase 3 traceability and controlled change is active (updated 8 November 2026).

- 🟢 Phase 0, the interactive prototype and static delivery preview, is complete.
- 🟢 Phase 1 is complete: all foundation deliverables and local evidence checks are implemented.
- 🟢 Hosted OpenRM CI passes web, API, security-audit, migration, browser, accessibility, and authenticated PostgreSQL checks.
- 🟢 The protected `main` branch requires the `web`, `api`, and `database-path` GitHub Actions checks and disallows force-pushes and deletion.
- 🟢 Phase 2 is complete. Teams can create isolated projects, assign scoped roles, create and revise requirements, organize with folders and tags, validate typed attributes, save filtered views, compare history, and import/export JSON.
- 🟢 Controlled revisions and audit events are append-only, create/revise commands are idempotent, stale edits are rejected, and the primary browser workflow passes automated WCAG A/AA checks.
- 🟡 Phase 3 is active: directed relationship types, cardinality enforcement, exact revision evidence, asynchronous suspect propagation, reviewer dispositions, idempotency, project authorization, audit evidence, and append-only history pass locally. Live trace queries, changesets, immutable baselines, and deterministic evidence export remain open.

See the [development dashboard](DEVELOPMENT_DASHBOARD.md) for current evidence, priorities, gaps, and per-phase time/token accounting, and the [implementation plan](IMPLEMENTATION_PLAN.md) for the full roadmap and exit criteria.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/` | React/TypeScript web client and generated API types |
| `apps/api/` | Rust REST API, OIDC validation, policy harness, and operational endpoints |
| `contracts/` | Versioned OpenAPI contract |
| `db/migrations/` | PostgreSQL schema and deterministic local seed |
| `docs/adr/` | Accepted architecture decisions |
| `aws/` | Static preview infrastructure |
| `scripts/` | Bootstrap, checks, provisioning, and deployment |

The web client remains at the repository root to preserve the current Vite, AWS, and Sites deployments. Backend components are Cargo workspace members.

## Bootstrap

Prerequisites: Node.js 24+, Rust 1.96+, Docker, and npm.

```bash
npm run bootstrap
```

This creates `.env` from `.env.example`, starts PostgreSQL, installs JavaScript dependencies, generates TypeScript API types, and applies migrations.

Run the services in separate terminals:

```bash
npm run dev
cargo run -p openrm-api
```

The web client runs at `http://127.0.0.1:5173`; the API runs at `http://127.0.0.1:8080`.

## Verify the foundation

```bash
npm run check:foundation
```

For the database-backed path:

```bash
docker compose up -d postgres
cargo run -p openrm-api --bin migrate
cargo run -p openrm-api
```

Then verify:

```bash
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/ready
curl \
  -H 'Authorization: Bearer dev:local-user' \
  -H 'X-OpenRM-Organization: 00000000-0000-4000-8000-000000000001' \
  http://127.0.0.1:8080/api/v1/session
```

Development tokens are rejected when `APP_ENV=production`. Deployed environments must use `AUTH_MODE=oidc` with an issuer and audience.

Role-scoped development tokens use `dev:<subject>:<role>`, where the role is `administrator`, `author`, `reviewer`, or `viewer`.

## Verify the requirements slice

```bash
npm run check
npm run test:e2e
cargo fmt --all --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-targets
```

The protected `database-path` job applies all migrations to PostgreSQL 17 and exercises project isolation, roles, organization resources, controlled authoring, idempotency, concurrency, search, comparison, import/export, and append-only audit evidence.

## Contract workflow

Edit `contracts/openapi.yaml`, then regenerate the web types:

```bash
npm run generate:api
```

CI fails when committed generated types do not match the contract.

## Reset local data

```bash
docker compose down -v
npm run bootstrap
```

The `-v` operation deletes the disposable local PostgreSQL volume.

