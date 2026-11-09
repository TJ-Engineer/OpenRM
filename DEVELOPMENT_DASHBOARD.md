# OpenRM development dashboard

**Last verified:** 8 November 2026, 19:19 CST<br>
**Foundation evidence commit:** `fc6687f`<br>
**Phase 2 evidence commit:** `f498031`<br>
**Phase 3 implementation evidence commit:** `4f50618`<br>
**Phase 4 protected evidence:** [OpenRM CI run 42504423145](https://github.com/TJ-Engineer/OpenRM/actions/runs/42504423145)<br>
**Phase 5 protected evidence:** [OpenRM CI run 42508760769](https://github.com/TJ-Engineer/OpenRM/actions/runs/42508760769)<br>
**Portable stack protected evidence:** [OpenRM CI run 42518730569](https://github.com/TJ-Engineer/OpenRM/actions/runs/42518730569)<br>
**Overall status:** 🟡 Phase 6 active; the first in-product Help increment is locally verified, with contextual guidance, the maintainer SDD, and protected documentation evidence next

This file is the repository-level status dashboard. It summarizes delivery evidence and immediate priorities; [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) remains the source for scope, architecture, phase definitions, and exit gates.

## At a glance

**Stop-light legend:** 🟢 complete, passed, or on track · 🟡 active or needs attention · 🔴 blocked or failed · ⚪ planned or not started

| Area | Status | Evidence or next condition |
| --- | --- | --- |
| Phase 0 — Prototype and delivery preview | 🟢 AWS deployed | The [interactive React preview](https://d20kr4lr7ux18x.cloudfront.net) is live through CloudFront with a private encrypted S3 origin and restricted deployment role. |
| AWS static preview | 🟢 Live and verified | CloudFront returned `HTTP 200` with CSP/HSTS headers; immutable assets and SPA fallback passed; direct S3 access returned `HTTP 403`. |
| Phase 1 — Foundation | 🟢 Complete | All foundation deliverables, local checks, hosted CI jobs, and protected-branch controls are complete. |
| Hosted CI | 🟢 Passed | All five Phase 5 jobs passed in [OpenRM CI run 42508760769](https://github.com/TJ-Engineer/OpenRM/actions/runs/42508760769). |
| `main` branch protection | 🟢 Enforced | Requires `web`, `api`, `database-path`, `recovery-rehearsal`, and `production-artifact`; applies to administrators; disallows force-pushes and deletion. |
| Phase 2 — Requirements vertical slice | 🟢 Complete | The API-backed authoring workflow, organization controls, isolated roles, controlled history, import/export, browser E2E, and WCAG A/AA evidence passed the exit gate. |
| Requirements runtime path | 🟢 Protected CI passed | The complete two-project authoring and isolation path passed against PostgreSQL 17 in [OpenRM CI run 42492278928](https://github.com/TJ-Engineer/OpenRM/actions/runs/42492278928). |
| Phase 3 — Traceability and controlled change | 🟢 Complete | The complete trace, impact, changeset, baseline, comparison, and signed-export slice passed locally and in protected CI. |
| Phase 4 — Reviews and verification | 🟢 Complete | The complete review-to-verification signed-evidence exit path passes locally and in protected hosted CI. |
| Phase 5 — Integration and beta hardening | 🟢 Complete | Jira operations, telemetry, recovery, security, load, three-browser accessibility, deployment artifacts, and operator procedures pass locally and in protected hosted CI. |
| Phase 6 — Product documentation and maintainability | 🟡 Active | The first-edition manual, persistent Help route, search, stable anchors, responsive rendering, and local quality gates are implemented; the SDD and governance remain open. |
| In-product Help and maintenance design | 🟡 First increment verified | Help opens from the topbar and sidebar, renders the authoritative manual, filters by search, and passes parser plus three-browser WCAG checks; contextual deep links and representative-role review remain. |
| OpenRM self-verification project | 🟢 Protected CI verified | The isolated `OPENRM` project contains 12 system and 48 derived requirements, 48 decomposition links, four independently executed evidence cases, 100% trace and verification coverage, and a ready gate with no blockers; clean reconstruction passed in [OpenRM CI run 42512977538](https://github.com/TJ-Engineer/OpenRM/actions/runs/42512977538). |
| Portable container distribution | 🟢 Protected CI verified | PostgreSQL, migrations, API, self-project bootstrap, and the same-origin web gateway build and start with one command; clean reconstruction and hardening passed in [OpenRM CI run 42518730569](https://github.com/TJ-Engineer/OpenRM/actions/runs/42518730569). |
| Production API and database | ⚪ Not commissioned | Hardened deployment assets are verified, but the pilot environment, OIDC tenant, PITR, secret manager, and alert receivers remain operator-specific work. |

## Phase progress

| Signal | Phase | State | Current result |
| --- | --- | --- | --- |
| 🟢 | 0. Prototype and preview | Complete | Product surfaces, guided preview, and static hosting path are available. |
| 🟢 | 1. Foundation | Complete | Web, Rust API, PostgreSQL migrations, OpenAPI generation, OIDC/policy harness, ADRs, bootstrap, hosted CI, and branch protection are verified. |
| 🟢 | 2. Requirements vertical slice | Complete | Live authoring, project roles, organization, validation, immutable history, comparison, import/export, audit, E2E, and accessibility evidence are verified. |
| 🟢 | 3. Traceability and controlled change | Complete | Directed relationships, trace queries, asynchronous impact, attributable changesets, immutable baselines, comparison, and signed export are protected-CI verified. |
| 🟢 | 4. Reviews and verification | Complete | Reviews, independent verification, exact coverage, readiness, due events, and complete signed export are protected-CI verified. |
| 🟢 | 5. Integration and beta hardening | Complete | Jira delivery/replay, telemetry, recovery, security, load, browser/accessibility, pilot operations, and all five protected hosted jobs pass. |
| 🟡 | 6. Product documentation and maintainability | Active | The authoritative manual and dashboard Help pass local structure, navigation, responsive, three-browser, and WCAG checks; contextual links, protected evidence, governance, and the SDD remain. |

## Phase time and token usage

Usage tracking begins with this dashboard on 8 November 2026 at 07:56 CST. Historical engineering time and model-token telemetry were not recorded, so those values are marked `N/R` rather than estimated.

| Phase | Tracking state | Started | Completed | Active time used | Model tokens used |
| --- | --- | --- | --- | ---: | ---: |
| 0. Prototype and preview | Historical usage unavailable | `N/R` | Before tracking baseline | `N/R` | `N/R` |
| 1. Foundation | Complete; partial usage history | `N/R` | 8 Nov 2026 | `N/R` historical + 0.1 h tracked | `N/R` |
| 2. Requirements vertical slice | Complete; partial usage telemetry | 8 Nov 2026 | 8 Nov 2026 | 1.1 h tracked | `N/R` |
| 3. Traceability and controlled change | Complete | 8 Nov 2026 | 8 Nov 2026 | 0.7 h | `N/R` |
| 4. Reviews and verification | Complete | 8 Nov 2026 | 8 Nov 2026 | 0.9 h | `N/R` |
| 5. Integration and beta hardening | Complete | 8 Nov 2026 | 8 Nov 2026 | 2.7 h | `N/R` |
| 6. Product documentation and maintainability | Active; session telemetry unavailable | 8 Nov 2026 | Not complete | `N/R` | `N/R` |

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
| 8 November 2026, 10:23 CST | 3 | 0.1 h | `N/R` | Protected `web`, `api`, and `database-path` checks passed in OpenRM CI run 42499758656; Phase 3 closure evidence recorded. |
| 8 November 2026, 10:43 CST | 4 | 0.3 h | `N/R` | Implemented baseline-bound reviews, policy-controlled signed decisions, live Review Room, Chromium/WCAG coverage, and a clean PostgreSQL runtime and immutability matrix. |
| 8 November 2026, 11:09 CST | 4 | 0.4 h | `N/R` | Completed immutable verification planning/execution, signed results and attachments, exact coverage, explainable readiness, due events, complete deterministic export, live browser workflow, and a second clean PostgreSQL exit matrix. |
| 8 November 2026, 11:13 CST | 4 | 0.1 h | `N/R` | Replayed the complete signed export with review discussion and lifecycle evidence, passed the full nine-test Chromium suite, and completed the final contract, CI-definition, and diff audit. |
| 8 November 2026, 11:22 CST | 4 | 0.1 h | `N/R` | Protected `web`, `api`, and `database-path` checks passed in OpenRM CI run 42504423145; Phase 4 closure evidence recorded. |
| 8 November 2026, 11:54 CST | 5 | 0.6 h | `N/R` | Implemented Jira delivery/replay, operational telemetry, recovery/deployment assets, security hardening, multi-browser/WCAG tests, load evidence, and pilot operating procedures; local candidate matrix passed. |
| 8 November 2026, 12:08 CST | 5 | 0.2 h | `N/R` | Hardened production OIDC/JWKS and queue-health boundaries, reran Rust and web gates, and verified the final image as non-root with a read-only filesystem and all capabilities dropped. |
| 8 November 2026, 12:16 CST | 5 | 0.1 h | `N/R` | Corrected the hosted recovery harness, passed all five Phase 5 CI jobs, and expanded protected `main` to require recovery and production-artifact validation. |
| 8 November 2026, 12:58 CST | 5 | 0.7 h | `N/R` | Created the OpenRM self-verification catalog and idempotent API loader; loaded 12 system and 48 derived requirements with complete trace, independent review, linked signed evidence, and 100% ready verification coverage. |
| 8 November 2026, 14:13 CST | 5 | 1.1 h | `N/R` | Containerized PostgreSQL, migrations, API, self-project bootstrap, and the web gateway; passed clean-volume local and protected hosted reconstruction with non-root, read-only, capability-dropped application containers. |
| 8 November 2026, 18:53 CST | 0 | `N/R` | `N/R` | Provisioned the `us-east-2` static preview stacks, deployed through the restricted role, completed CloudFront invalidation, and verified HTTPS/security headers, immutable asset caching, SPA fallback, and private-origin isolation. Session usage telemetry was unavailable. |
| 8 November 2026, 19:07 CST | 6 | `N/R` | `N/R` | Added the planned dashboard Help, comprehensive user manual, maintainer SDD, documentation governance, and automated documentation quality workstreams. Session usage telemetry was unavailable. |
| 8 November 2026, 19:16 CST | 6 | `N/R` | `N/R` | Implemented the authoritative first-edition manual, persistent in-product Help, search, stable anchors, responsive layout, parser coverage, and Chromium/Firefox/WebKit WCAG validation. Session usage telemetry was unavailable. |

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

1. Review the first-edition manual with representative author, reviewer, verifier, and administrator users; close content gaps and add accessible visual guidance where it materially helps.
2. Add contextual links from primary workspaces to the corresponding stable manual sections.
3. Generate and validate the code-aligned maintainer SDD.
4. Add documentation ownership and freshness rules, external-link validation, and protected hosted Help quality evidence.
5. Commission the bounded pilot environment with production OIDC, secret delivery, PITR, retained traces, and alert routing.
6. Complete environment-specific recovery, SLO, and Jira dry-run acceptance evidence.
7. Obtain independent external assurance before broader regulated production use.

## Phase 6 active evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Authoritative manual | 🟢 Locally verified | `docs/user/USER_MANUAL.md` includes release metadata, a linked contents list, primary role/workflow procedures, troubleshooting, FAQ, glossary, and escalation guidance. |
| Persistent Help access | 🟢 Browser verified | Help is available from both the application sidebar and persistent topbar without leaving the product shell. |
| Search and navigation | 🟢 Browser verified | Generated contents links reach stable section anchors, and search filters the manual to matching task and error guidance. |
| Responsive behavior | 🟢 Browser verified | The Help layout collapses without horizontal page overflow at a 390-by-844 viewport. |
| Manual structure | 🟢 Unit verified | Parser tests detect missing or duplicate anchors and confirm every authored contents link resolves to a generated section. |
| Accessibility | 🟢 Browser verified | All nine Help navigation, mobile, and WCAG checks pass in Chromium, Firefox, and WebKit; the complete 42-test browser matrix is green. |
| Remaining gate | 🟡 Active | Representative-role review, contextual links, SDD delivery/walkthrough, governance, external-link validation, and protected hosted evidence remain. |

## Phase 3 completion evidence

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
| Protected hosted evidence | 🟢 CI verified | `web`, `api`, and `database-path` passed in [OpenRM CI run 42499758656](https://github.com/TJ-Engineer/OpenRM/actions/runs/42499758656) for the final Phase 3 branch state. |

## Phase 4 completion evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Baseline-bound packages | 🟢 Locally verified | A package freezes one immutable baseline, approval threshold, participants, round, scope counts, and attributable lifecycle state. |
| Structured review evidence | 🟢 Locally verified | Comments bind to exact baseline revision IDs; resolutions and all discussion evidence are append-only. |
| Approval policy | 🟢 Locally verified | Reviewer membership, assignment, active round, thresholds, blockers, and segregation of package/baseline authors are enforced. |
| Signed decisions | 🟢 Locally verified | HMAC-SHA256 decision evidence binds package, baseline, participant, round, decision, comment, and actor; read-time signature verification passes. |
| Replay, tenancy, and audit | 🟢 Locally verified | Commands replay original responses, cross-project access returns `403`, and controlled mutations emit audit evidence. |
| Database immutability | 🟢 Locally verified | PostgreSQL rejected direct changes to lifecycle events, participants, comments, resolutions, and decisions. |
| Live Review Room | 🟢 Browser verified | Chromium creates a package, assigns an independent reviewer, starts a round, records a blocker and signed approval, resolves the blocker, and observes final approval. |
| Accessibility | 🟢 Browser verified | The live Review Room has no automatically detectable WCAG 2 A/AA violations. |
| Verification intent | 🟢 Locally verified | Immutable cases retain method, procedure, acceptance criteria, independent owner, due date, and exact baseline revision targets. |
| Independent execution | 🟢 Locally verified | Only the assigned review participant can start and complete a run; the attributable executor is enforced and replay is safe. |
| Signed results and attachments | 🟢 Locally verified | Result evidence binds the review, baseline, case, run, outcome, measurements, actor, and sorted content-addressed attachment manifest. |
| Exact coverage rollup | 🟢 Locally verified | All three clean-database baseline revisions rolled to passed only after their bound verification evidence passed, producing 100% coverage. |
| Explainable gate readiness | 🟢 Locally verified | Readiness reports review state, case outcomes, coverage, blockers, open comments, and signature validity; the clean exit path reached ready with no blockers. |
| Due-date events | 🟢 Locally verified | Idempotent due-soon, overdue, and completion events retain case, actor, due date, and timestamp evidence. |
| Complete gate export | 🟢 Locally verified | Repeated exports were byte-identical and HMAC-SHA256 verified across reviews, decisions, verification, coverage, readiness, attachments, and due events. |
| Verification immutability | 🟢 Locally verified | PostgreSQL rejected updates to cases, exact targets, run events, results, attachment manifests, and due events. |
| Live Verification workspace | 🟢 Browser verified | Chromium plans and executes a case, records signed attachment evidence, observes 100% coverage/readiness, and exports the gate package. |
| Verification accessibility | 🟢 Browser verified | The live Verification workspace has no automatically detectable WCAG 2 A/AA violations. |
| Protected hosted evidence | 🟢 CI verified | `web`, `api`, and `database-path` passed in [OpenRM CI run 42504423145](https://github.com/TJ-Engineer/OpenRM/actions/runs/42504423145) for the complete Phase 4 branch state. |

## Phase 5 completion evidence

| Capability | State | Evidence |
| --- | --- | --- |
| Jira connector operations | 🟢 Locally verified | Administrator policy, external secret references, mapping, idempotent enqueue, fixed HTTPS paths, bounded attempts, rate-limit/backoff classification, dead letters, and attributable replay are implemented. |
| Immutable connector evidence | 🟢 Locally verified | Two configuration versions and ordered delivery attempts were retained; PostgreSQL rejected direct changes to both histories. |
| Operational telemetry | 🟢 Locally verified | Structured logs, Prometheus request/error/latency and queue metrics, administrator operations status, W3C propagation, optional OTLP/HTTP export, dashboards, and alerts are configured. |
| Production deployment artifact | 🟢 Locally verified | The 40.1 MB API image built from the frozen candidate and passed health/readiness as UID 10001 with a read-only root filesystem and all capabilities dropped. |
| Security hardening | 🟢 Locally verified | Threat review, HTTPS connector origin constraints, secret separation, request bounds, timeout, headers, CORS/authentication smoke checks, and dependency policies are present. |
| Load and soak | 🟢 Locally verified | The final bounded load gate completed 300 requests at concurrency 20 with zero errors and 14.06 ms p95; a 30-second soak issued 118,130 requests at concurrency 10 with zero errors and 3.77 ms p95. |
| Browser and accessibility | 🟢 Locally verified | All 42 workflows, responsive checks, and WCAG 2 A/AA scans pass in Chromium, Firefox, and WebKit. |
| Recovery and upgrades | 🟢 Locally verified | PostgreSQL 17 restored 55 controlled rows across nine migrations with all six critical evidence tables; two migration applications were idempotent. |
| Pilot procedures | 🟢 Documented | Deployment, administration, SLO/alert, recovery, runbook, onboarding, threat-model, and security-review documents define the operating boundary. |
| Product requirements in OpenRM | 🟢 Protected CI verified | The `OPENRM` dogfood project stores 60 controlled requirements, 48 `DECOMPOSES_TO` links, 71 linked test/document attachments across four evidence cases, 100% trace coverage, and 100% passed exact-revision verification coverage; [OpenRM CI run 42512977538](https://github.com/TJ-Engineer/OpenRM/actions/runs/42512977538) reconstructed the complete gate from a clean database. |
| Portable container distribution | 🟢 Protected CI verified | A clean isolated volume built and started PostgreSQL, migrations, API, self-project bootstrap, and the same-origin web gateway; all 60 requirements and container hardening checks passed in [OpenRM CI run 42518730569](https://github.com/TJ-Engineer/OpenRM/actions/runs/42518730569). |
| Protected hosted evidence | 🟢 CI verified | `web`, `api`, `database-path`, `recovery-rehearsal`, and `production-artifact` passed in [OpenRM CI run 42508760769](https://github.com/TJ-Engineer/OpenRM/actions/runs/42508760769); protected `main` requires all five. |

## Known delivery gaps

- The bounded pilot API/database environment and production OIDC provider are not commissioned by this repository change.
- The first-edition manual and Help workspace require representative-role review, contextual workspace links, and any visual guidance proven useful by that review.
- A code-aligned SDD, maintainer walkthrough, documentation ownership model, protected hosted documentation gate, external-link validation, and automated freshness controls have not yet been delivered.
- The static preview does not yet export CloudFront standard request logs; add an encrypted, selected-Region-compatible destination before regulated production traffic.
- Alert receivers, database encryption/PITR, backup retention, and secret-manager integration require environment-specific evidence.
- Registry promotion and independent external penetration-test assurance remain required before broader regulated production exposure.

## Update policy

Update this dashboard and the relevant status in `README.md` whenever a phase gate, P0/P1 risk, hosted check, deployment state, or sprint commitment changes. Update the phase time and token totals during the same change. Always include a verification timestamp and link status and usage claims to durable evidence where possible.
