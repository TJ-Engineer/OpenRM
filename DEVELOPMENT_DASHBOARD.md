# OpenRM development dashboard

**Last verified:** 8 November 2026, 10:12 CST<br>
**Foundation evidence commit:** `fc6687f`<br>
**Phase 2 evidence commit:** `f498031`<br>
**Overall status:** 🟡 Phase 3 implementation complete locally; protected hosted evidence pending

This file is the repository-level status dashboard. It summarizes delivery evidence and immediate priorities; [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) remains the source for scope, architecture, phase definitions, and exit gates.

## At a glance

**Stop-light legend:** 🟢 complete, passed, or on track · 🟡 active or needs attention · 🔴 blocked or failed · ⚪ planned or not started

| Area | Status | Evidence or next condition |
| --- | --- | --- |
| Phase 0 — Prototype and delivery preview | 🟢 Complete | Interactive React preview and restricted static AWS delivery path are implemented. |
| Phase 1 — Foundation | 🟢 Complete | All foundation deliverables, local checks, hosted CI jobs, and protected-branch controls are complete. |
| Hosted CI | 🟢 Passed | `web`, `api`, and `database-path` passed the complete Phase 2 matrix in [OpenRM CI run 42492278928](https://github.com/TJ-Engineer/OpenRM/actions/runs/42492278928). |
| `main` branch protection | 🟢 Enforced | Requires `web`, `api`, and `database-path`; applies to administrators; disallows force-pushes and deletion. |
| Phase 2 — Requirements vertical slice | 🟢 Complete | The API-backed authoring workflow, organization controls, isolated roles, controlled history, import/export, browser E2E, and WCAG A/AA evidence passed the exit gate. |
| Requirements runtime path | 🟢 Protected CI passed | The complete two-project authoring and isolation path passed against PostgreSQL 17 in [OpenRM CI run 42492278928](https://github.com/TJ-Engineer/OpenRM/actions/runs/42492278928). |
| Phase 3 — Traceability and controlled change | 🟡 Hosted evidence pending | The complete trace, impact, changeset, baseline, comparison, and signed-export slice passes locally. |
| Production API and database | ⚪ Not deployed | Deployment environments, production OIDC, observability, and recovery controls remain future work. |

## Phase progress

| Signal | Phase | State | Current result |
| --- | --- | --- | --- |
| 🟢 | 0. Prototype and preview | Complete | Product surfaces, guided preview, and static hosting path are available. |
| 🟢 | 1. Foundation | Complete | Web, Rust API, PostgreSQL migrations, OpenAPI generation, OIDC/policy harness, ADRs, bootstrap, hosted CI, and branch protection are verified. |
| 🟢 | 2. Requirements vertical slice | Complete | Live authoring, project roles, organization, validation, immutable history, comparison, import/export, audit, E2E, and accessibility evidence are verified. |
| 🟡 | 3. Traceability and controlled change | Local gate passed | Directed relationships, trace queries, asynchronous impact, attributable changesets, immutable baselines, comparison, and signed export pass locally; protected CI remains. |
| ⚪ | 4. Reviews and verification | Planned | Review packages, approvals, verification runs, coverage, and gate readiness. |
| ⚪ | 5. Integration and beta hardening | Planned | Jira connector, observability, recovery, security hardening, performance, and pilot operations. |

## Phase time and token usage

Usage tracking begins with this dashboard on 8 November 2026 at 07:56 CST. Historical engineering time and model-token telemetry were not recorded, so those values are marked `N/R` rather than estimated.

| Phase | Tracking state | Started | Completed | Active time used | Model tokens used |
| --- | --- | --- | --- | ---: | ---: |
| 0. Prototype and preview | Historical usage unavailable | `N/R` | Before tracking baseline | `N/R` | `N/R` |
| 1. Foundation | Complete; partial usage history | `N/R` | 8 Nov 2026 | `N/R` historical + 0.1 h tracked | `N/R` |
| 2. Requirements vertical slice | Complete; partial usage telemetry | 8 Nov 2026 | 8 Nov 2026 | 1.1 h tracked | `N/R` |
| 3. Traceability and controlled change | Local gate passed; hosted evidence pending | 8 Nov 2026 | — | 0.6 h | `N/R` |
| 4. Reviews and verification | Not started | — | — | 0 h | 0 |
| 5. Integration and beta hardening | Not started | — | — | 0 h | 0 |

### Usage change log

| Recorded at | Phase | Time added | Tokens added | Evidence |
| --- | --- | ---: | ---: | --- |
| 8 November 2026, 07:56 CST | 0–1 | `N/R` | `N/R` | Tracking baseline created; earlier session telemetry is unavailable. |
| 8 November 2026, 08:00 CST | 1 | 0.1 h | `N/R` | Branch protection, closure status updates, and local validation. Token telemetry is unavailable. |
| 8 November 2026, 08:13 CST | 2 | 0.3 h | `N/R` | First requirements API/data increment, contract, migration, local PostgreSQL runtime validation, and protected CI. |
| 8 November 2026, 08:59 CST | 2 | 0.8 h | `N/R` | Completed API-backed UI, project controls, comparison/import/export, browser and accessibility tests, full PostgreSQL exit matrix, and protected CI. |
| 8 November 2026, 09:43 CST | 3 | 0.1 h | `N/R` | Added directed typed relationship schema, exact revision evidence, API contract and generated client, policy/idempotency/audit controls, CI assertions, and isolated PostgreSQL runtime validation. |
| 8 November 2026, 09:47 CST | 3 | 0.1 h | `N/R` | Added transactional-outbox suspect propagation, reviewer-only attributable resolution, optimistic concurrency, replay, immutable version history, and isolated PostgreSQL runtime validation. |
| 8 November 2026, 10:12 CST | 3 | 0.4 h | `N/R` | Completed live trace queries and UI, attributable changesets, immutable signed baselines, comparison, deterministic export, Chromium/WCAG coverage, and the isolated PostgreSQL exit matrix. |

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

## Phase 2 completion evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Project creation and isolation | 🟢 CI verified | Two projects were created; scoped authors saw only their membership project and cross-project access returned `403`. |
| Project roles | 🟢 CI verified | Administrator, author, reviewer, and viewer policies are distinct; viewer writes are denied. |
| Requirement persistence | 🟢 CI verified | Materialized current artifacts and append-only revision rows retain folder, tag, typed attribute, actor, and timestamp evidence. |
| Authoring workflow | 🟢 Browser verified | The live UI creates, searches, selects, revises, and compares controlled requirements through the API. |
| Organization controls | 🟢 CI verified | Folders, tags, typed custom attributes, saved views, filters, and pagination are available and project scoped. |
| Concurrency and replay | 🟢 CI verified | Stale revisions return `409`; create and revise commands replay their original responses. |
| Comparison and interchange | 🟢 CI verified | Revision comparison plus bounded JSON import and full current-state export passed against PostgreSQL 17. |
| Audit and revision immutability | 🟢 CI verified | Controlled mutations produce scoped audit events; database triggers reject updates or deletes to audit and revision history. |
| Accessibility and E2E | 🟢 CI verified | Primary authoring workflow and automated WCAG 2 A/AA checks pass in Chromium. |

## Current priorities

1. Run the expanded `web`, `api`, and `database-path` jobs on the protected hosted path.
2. Record the hosted evidence commit and CI run, then close Phase 3.
3. Begin Phase 4 review-package and verification decomposition only after the Phase 3 closure gate.

## Phase 3 local completion evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Directed relationship types | 🟢 Locally verified | New and existing projects receive `DECOMPOSES_TO` and `DEPENDS_ON` rules with explicit source/target artifact types. |
| Cardinality and endpoint rules | 🟢 Locally verified | Self-links are rejected, endpoint types are checked, and one-parent decomposition cardinality returns `409` when exceeded. |
| Exact revision evidence | 🟢 Locally verified | A relationship created from source revision 2 to target revision 1 returns and persists those exact immutable revision identifiers. |
| Controlled mutation | 🟢 Locally verified | Relationship creation is idempotent, author-allowed, viewer-denied, tenant scoped, and emits `relationship.created` audit evidence. |
| Immutable relationship history | 🟢 Locally verified | PostgreSQL rejected an attempted update, while the history API returned attributable author, system-impact, and reviewer versions in order. |
| Suspect propagation | 🟢 Locally verified | A committed source revision produced one processed outbox message and advanced the downstream relationship to a suspect version bound to source revision 2. |
| Attributable resolution | 🟢 Locally verified | Authors were denied; a reviewer disposition advanced the relationship to version 3, replayed safely, rejected stale concurrency, and emitted resolution audit evidence. |
| Trace graph and matrix | 🟢 Locally verified | Live summary, matrix, and graph queries returned exact directed edges, 66.67% coverage, and explicit orphan/gap state. |
| Attributable changesets | 🟢 Locally verified | Parent-linked immutable snapshots classified added, modified, and unchanged artifact revisions and replayed safely. |
| Immutable baselines | 🟢 Locally verified | Reviewer-only baselines froze exact artifact and relationship revisions, rejected stale changesets, and compared superseding states. |
| Deterministic signed export | 🟢 Locally verified | Repeated evidence downloads were byte-for-byte identical, HMAC-SHA256 verification passed, and manifest rows retained exact revision identifiers. |
| Live browser workflows | 🟢 Locally verified | Five Chromium tests cover requirements, trace impact resolution, changesets, baselines, and WCAG 2 A/AA automation. |
| Append-only controlled history | 🟢 Locally verified | PostgreSQL rejected updates to audit events, artifact revisions, relationship revisions, changesets, and baselines. |
| Protected hosted evidence | ⚪ Pending | The expanded `web`, `api`, and `database-path` jobs are implemented but have not yet run on hosted CI for this evidence commit. |

## Known delivery gaps

- Review, approval, and verification endpoints are not implemented.
- The API, PostgreSQL database, and production OIDC provider are not deployed.
- Release automation, full observability, backup/restore validation, and live connectors remain planned.

## Update policy

Update this dashboard and the relevant status in `README.md` whenever a phase gate, P0/P1 risk, hosted check, deployment state, or sprint commitment changes. Update the phase time and token totals during the same change. Always include a verification timestamp and link status and usage claims to durable evidence where possible.
