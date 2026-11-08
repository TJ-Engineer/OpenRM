# OpenRM

OpenRM is an open, self-hostable configuration and requirements management platform. The repository currently contains the interactive product preview and the Phase 1 platform foundation.

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

