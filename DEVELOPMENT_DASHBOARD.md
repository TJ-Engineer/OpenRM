# OpenRM development dashboard

**Last verified:** 8 November 2026, 08:13 CST<br>
**Foundation evidence commit:** `fc6687f`<br>
**Overall status:** 🟡 Phase 2 active; first requirements API/data increment verified in protected CI

This file is the repository-level status dashboard. It summarizes delivery evidence and immediate priorities; [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) remains the source for scope, architecture, phase definitions, and exit gates.

## At a glance

**Stop-light legend:** 🟢 complete, passed, or on track · 🟡 active or needs attention · 🔴 blocked or failed · ⚪ planned or not started

| Area | Status | Evidence or next condition |
| --- | --- | --- |
| Phase 0 — Prototype and delivery preview | 🟢 Complete | Interactive React preview and restricted static AWS delivery path are implemented. |
| Phase 1 — Foundation | 🟢 Complete | All foundation deliverables, local checks, hosted CI jobs, and protected-branch controls are complete. |
| Hosted CI | 🟢 Passed | `web`, `api`, and `database-path` passed in [Foundation CI run 42486750287](https://github.com/TJ-Engineer/OpenRM/actions/runs/42486750287). |
| `main` branch protection | 🟢 Enforced | Requires `web`, `api`, and `database-path`; applies to administrators; disallows force-pushes and deletion. |
| Phase 2 — Requirements vertical slice | 🟡 Active | First API/data increment is protected-CI verified; authoring UI and remaining product capabilities are next. |
| Requirements runtime path | 🟢 Protected CI passed | Create/replay/revise/search/history/audit behavior passed against PostgreSQL 17 in [Foundation CI run 42488729744](https://github.com/TJ-Engineer/OpenRM/actions/runs/42488729744). |
| Production API and database | ⚪ Not deployed | Deployment environments, production OIDC, observability, and recovery controls remain future work. |

## Phase progress

| Signal | Phase | State | Current result |
| --- | --- | --- | --- |
| 🟢 | 0. Prototype and preview | Complete | Product surfaces, guided preview, and static hosting path are available. |
| 🟢 | 1. Foundation | Complete | Web, Rust API, PostgreSQL migrations, OpenAPI generation, OIDC/policy harness, ADRs, bootstrap, hosted CI, and branch protection are verified. |
| 🟡 | 2. Requirements vertical slice | Active | Project discovery, durable requirements, revision history, concurrency, idempotent creation, search, and audit are implemented; UI and remaining capabilities are pending. |
| ⚪ | 3. Traceability and controlled change | Planned | Typed relationships, impact analysis, changesets, baselines, and deterministic evidence export. |
| ⚪ | 4. Reviews and verification | Planned | Review packages, approvals, verification runs, coverage, and gate readiness. |
| ⚪ | 5. Integration and beta hardening | Planned | Jira connector, observability, recovery, security hardening, performance, and pilot operations. |

## Phase time and token usage

Usage tracking begins with this dashboard on 8 November 2026 at 07:56 CST. Historical engineering time and model-token telemetry were not recorded, so those values are marked `N/R` rather than estimated.

| Phase | Tracking state | Started | Completed | Active time used | Model tokens used |
| --- | --- | --- | --- | ---: | ---: |
| 0. Prototype and preview | Historical usage unavailable | `N/R` | Before tracking baseline | `N/R` | `N/R` |
| 1. Foundation | Complete; partial usage history | `N/R` | 8 Nov 2026 | `N/R` historical + 0.1 h tracked | `N/R` |
| 2. Requirements vertical slice | Active; partial usage telemetry | 8 Nov 2026 | — | 0.3 h tracked | `N/R` |
| 3. Traceability and controlled change | Not started | — | — | 0 h | 0 |
| 4. Reviews and verification | Not started | — | — | 0 h | 0 |
| 5. Integration and beta hardening | Not started | — | — | 0 h | 0 |

### Usage change log

| Recorded at | Phase | Time added | Tokens added | Evidence |
| --- | --- | ---: | ---: | --- |
| 8 November 2026, 07:56 CST | 0–1 | `N/R` | `N/R` | Tracking baseline created; earlier session telemetry is unavailable. |
| 8 November 2026, 08:00 CST | 1 | 0.1 h | `N/R` | Branch protection, closure status updates, and local validation. Token telemetry is unavailable. |
| 8 November 2026, 08:13 CST | 2 | 0.3 h | `N/R` | First requirements API/data increment, contract, migration, local PostgreSQL runtime validation, and protected CI. |

### Usage accounting rules

- Record active engineering time in hours, rounded to the nearest 0.1 hour; do not use calendar elapsed time.
- Record the exact input-plus-output model-token total from run metadata when it is available; never estimate missing token usage.
- Add each verified work-session delta to the applicable phase total before changing a phase status.
- If one work session spans phases, split its time and tokens using recorded task boundaries; otherwise mark the allocation `N/R`.
- Preserve completed-phase totals. Correct them only when traceable usage evidence becomes available.

## Foundation evidence

| Workstream | State | Verified capability |
| --- | --- | --- |
| Web | Hosted job passed | Type generation, lint, typecheck, unit tests, production build, and dependency audit. |
| API | Hosted job passed | Rust formatting, clippy, tests, dependency audit, health/readiness, structured errors, authentication, and policy checks. |
| Data | Hosted job passed | PostgreSQL 17 migrations, deterministic seed, readiness, and authenticated session-to-database path. |
| Architecture | Complete | Seven accepted ADRs cover boundaries, revisions, relationships, authorization, baselines, search, and connectors. |
| Developer experience | Complete | Docker Compose, one-command bootstrap, generated client workflow, and foundation check script. |
| Delivery controls | Complete | Hosted workflow is green and protected `main` requires all three foundation checks. |

Local foundation evidence passed on 7 November 2026: clean install, generated types, lint, typecheck, three web tests, production build, eight Rust tests, clippy, two database migrations, authenticated runtime requests, and dependency audits with no known vulnerabilities.

## Phase 2 increment evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Project discovery | 🟢 Implemented | Tenant-scoped project list endpoint and typed contract. |
| Requirement persistence | 🟢 Implemented | Materialized artifacts with immutable revision rows and composite tenant foreign keys. |
| Authoring commands | 🟢 CI verified | Create and revise paths validated against PostgreSQL 17. |
| Concurrency and replay | 🟢 CI verified | Stale revision rejected with `409`; repeated create key returned the original response. |
| Search and pagination | 🟢 CI verified | PostgreSQL full-text query plus bounded limit/offset response. |
| Audit evidence | 🟢 CI verified | Create and revise committed two tenant/project-scoped audit events transactionally. |
| Web authoring workflow | ⚪ Ready | Generated TypeScript contract and command headers exist; screen integration remains. |

## Current priorities

1. Connect the requirements authoring screen to the generated API client.
2. Expand policy coverage for project roles and cross-project isolation.
3. Add folders, tags, typed attributes, saved views, comparison, and import/export in thin increments.

## Known delivery gaps

- Production artifact, relationship, baseline, review, and verification endpoints are not implemented.
- The API, PostgreSQL database, and production OIDC provider are not deployed.
- Browser end-to-end and accessibility coverage for controlled workflows are not in place.
- Release automation, full observability, backup/restore validation, and live connectors remain planned.

## Update policy

Update this dashboard and the relevant status in `README.md` whenever a phase gate, P0/P1 risk, hosted check, deployment state, or sprint commitment changes. Update the phase time and token totals during the same change. Always include a verification timestamp and link status and usage claims to durable evidence where possible.
