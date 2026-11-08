# OpenRM implementation plan

**Planning baseline:** 7 November 2026  
**Current stage:** Phase 5 complete; bounded pilot commissioning is next

**Primary outcome:** Deliver a self-hostable configuration and requirements management platform with controlled change, end-to-end traceability, review evidence, and verification records.

## 1. Current state

The repository currently contains a polished React/Vite funding preview and a secure static deployment path. The preview demonstrates the intended workflows for requirements, traceability, baselines, reviews, verification, object storage, the API, integrations, and architecture.

What exists now:

- Responsive React prototype covering ten product surfaces.
- Static production build with Vite.
- Private S3 origin and CloudFront distribution defined in CloudFormation.
- Restricted content-deployment role, deployment scripts, caching, HTTPS, and security headers.
- A connected private ChatGPT Site for stakeholder review.
- Accepted ADRs for service boundaries, revision semantics, relationships, tenancy, baselines, search, and connectors.
- TypeScript web client with lint, typecheck, unit test, build, and generated OpenAPI types.
- Rust API with liveness, readiness, build metadata, structured errors, OIDC validation, and tenant policy checks.
- PostgreSQL migrations, deterministic development seed, Docker Compose, and a one-command bootstrap.
- GitHub Actions workflow for web, Rust, dependency audits, migrations, authenticated database paths, recovery/upgrade rehearsals, and production-artifact validation.
- Protected `main` branch requiring `web`, `api`, `database-path`, `recovery-rehearsal`, and `production-artifact`.
- Completed requirements workspace with isolated projects, scoped roles, folders, tags, typed attributes, saved views, controlled authoring, immutable revisions, comparison, import/export, and audit evidence.
- Directed typed relationships with exact revision evidence, asynchronous suspect propagation, reviewer dispositions, and trace graph, matrix, coverage, and gap queries.
- Attributable changesets, immutable signed baselines, exact baseline comparison, deterministic evidence export, and stale-snapshot protection.
- Baseline-bound review packages with participants, exact-revision comments, append-only resolutions, segregation-of-duty policy, and signed decisions.
- Browser end-to-end coverage for requirements, traceability, baselines, live review, and verification workflows plus automated WCAG 2 A/AA checks.
- Governed Jira delivery with external secret references, idempotent queueing, bounded retry/rate-limit handling, append-only attempts, dead letters, and attributable replay.
- Prometheus SLIs, administrator operations status, structured logs, optional OTLP/HTTP traces, provisioned dashboards/alerts, and a hardened production container topology.
- PostgreSQL backup/restore and forward-only upgrade rehearsals, multi-browser and accessibility coverage, load validation, security smoke tests, and pilot operations documentation.
- A reproducible `OPENRM` dogfood project with 12 system requirements, 48 derived requirements, complete decomposition trace, independent review, and repository-linked signed test, analysis, and observation evidence.

What does not exist yet:

- A commissioned pilot API/database environment and connected production OIDC provider.
- Environment-specific alert routing, encrypted backup retention, and point-in-time recovery evidence.
- Automated image-registry promotion and a live Jira service identity for the pilot tenant.
- Independent external penetration-test assurance for broader regulated production use.

The repository Phase 5 gate is complete. The next operational gate is environment-specific pilot commissioning and acceptance.

## 2. Delivery principles

1. **Evidence over appearance.** A workflow is complete only when its behavior, authorization, persistence, audit record, and tests are demonstrable.
2. **Version everything that matters.** Requirements, relationships, reviews, baselines, verification records, and policy changes must retain attributable history.
3. **Contract first.** The OpenAPI contract and domain invariants lead UI and service implementation.
4. **Secure by construction.** Least privilege, immutable audit evidence, tenant isolation, and dependency scanning are release criteria.
5. **Portable core.** PostgreSQL and S3-compatible storage remain the default portable data services; cloud-specific capabilities stay behind adapters.
6. **Thin vertical slices.** Each phase ships an end-to-end user outcome instead of isolated layers.

## 3. Target architecture

| Layer | Initial decision | Responsibility |
| --- | --- | --- |
| Web client | React + TypeScript | Accessible workflows, optimistic interaction, local validation, API client |
| API | Rust service with versioned REST/OpenAPI | Authorization, commands, queries, validation, idempotency |
| Data | PostgreSQL | Projects, artifacts, relationships, revisions, reviews, permissions |
| Object storage | S3-compatible adapter | Attachments, imports, exports, verification evidence |
| Async work | Transactional outbox + worker | Indexing, imports, exports, connector synchronization |
| Identity | OIDC adapter | Authentication and organization identity mapping |
| Observability | OpenTelemetry-compatible signals | Structured logs, traces, metrics, audit health |
| Connector plane | Adapter SDK; Jira first | Typed inbound/outbound mapping with replay and error queues |

Architecture decisions to ratify in Phase 1:

- Repository structure and service boundaries.
- Revision model: append-only revisions plus materialized current state.
- Relationship and suspect-link propagation semantics.
- Authorization model and tenant boundary.
- Baseline immutability and cryptographic evidence strategy.
- Search approach and indexing consistency.
- Background job and connector replay guarantees.

## 4. Phased implementation

### Phase 0 — Prototype and delivery preview (complete)

**Outcome:** Stakeholders can evaluate the information architecture, product language, and intended workflows.

Exit evidence:

- [x] Core product surfaces represented in the interactive preview.
- [x] Responsive layout and guided product tour.
- [x] Private static hosting path with HTTPS and security headers.
- [x] Restricted content-only AWS deployment role.

### Phase 1 — Foundation (Weeks 1–2)

**Outcome:** A deployable service skeleton proves the architecture, contract, quality gates, and developer workflow.

**Status:** Complete on 8 November 2026. Implementation, local evidence, hosted CI, and protected-branch enforcement all passed the phase exit gate.

Deliverables:

- [x] Ratified ADRs for the seven decisions above.
- [x] Workspace structure for web client, API, migrations, contracts, and documentation.
- [x] TypeScript migration for the web client.
- [x] Rust API with `/health`, `/ready`, build metadata, and structured error envelope.
- [x] PostgreSQL migrations and disposable local development environment.
- [x] OpenAPI v1 contract with generated TypeScript client.
- [x] OIDC authentication spike and authorization policy test harness.
- [x] CI definition for formatting, linting, unit tests, build, dependency audit, and migration validation.
- [x] Local seed data and one-command developer bootstrap.

Exit gate:

- A clean checkout can bootstrap, migrate, test, build, and exercise an authenticated health-to-database path in CI.

Local evidence:

- Clean temporary workspace: `npm ci`, generation, lint, typecheck, three web tests, production build, eight Rust tests, and clippy all passed.
- Database path: two migrations applied to PostgreSQL 17; deterministic organization and project seed verified.
- Runtime path: `/health`, `/ready`, and authenticated `/api/v1/session` returned successfully with database availability.
- Security: npm audit and RustSec audit completed with zero known vulnerabilities after selecting the AWS-LC JWT backend.
- Hosted evidence: the first `Foundation CI` run passed its web, API, security-audit, migration, and authenticated database-path checks on 8 November 2026.
- Delivery control: protected `main` requires the `web`, `api`, and `database-path` checks, enforces the rule for administrators, and disallows force-pushes and deletion.

### Phase 2 — Requirements vertical slice (Weeks 3–6)

**Outcome:** A team can create, revise, organize, search, and inspect requirements with durable history.

**Status:** Complete on 8 November 2026. The live authoring workflow, project controls, persistence, policy boundaries, controlled history, interchange, accessibility, and exit matrix passed protected CI.

Implemented capabilities:

- [x] Tenant-scoped project discovery and requirement list/read operations.
- [x] Materialized current artifacts with immutable revision history.
- [x] Idempotent requirement creation and optimistic revision concurrency.
- [x] PostgreSQL full-text requirement search with offset pagination.
- [x] Transactional create/revise audit evidence.
- [x] OpenAPI contract and generated TypeScript types for the new endpoints.
- [x] Database-path CI coverage for create, replay, revise, history, search, and audit evidence.
- [x] API-backed requirements workspace with create, revise, folder, tag, filter, saved-view, and pagination interactions.
- [x] Project-scoped administrator, author, reviewer, and viewer roles with cross-project isolation.
- [x] Typed custom-attribute validation and project-scoped folders, tags, and saved views.
- [x] Revision comparison plus bounded JSON import and current-state export.
- [x] Chromium end-to-end coverage and automated WCAG 2 A/AA validation.
- [x] Database-enforced append-only audit and revision evidence.

Deliverables:

- [x] Projects, artifact types, artifacts, folders, tags, and custom attributes.
- [x] Requirement creation, editing, validation, revision history, and comparison.
- [x] Optimistic concurrency and idempotent command handling.
- [x] Project roles with read, author, reviewer, and administrator policies.
- [x] Search, filters, saved views, pagination, import, and export.
- [x] Immutable audit events for every controlled mutation.
- [x] Accessibility and end-to-end coverage for the primary authoring path.

Exit gate:

- Two isolated projects can complete the authoring workflow without cross-project data exposure, and all mutations can be reconstructed from audit evidence.

Exit evidence:

- [OpenRM CI run 42492278928](https://github.com/TJ-Engineer/OpenRM/actions/runs/42492278928) passed `web`, `api`, and `database-path` for evidence commit `f498031`.
- PostgreSQL 17 validated two-project isolation, distinct project roles, organization resources, create/replay/revise/conflict, filtered search, history, comparison, import/export, and append-only audit/revision enforcement.
- Chromium validated the primary create/search/revise/compare flow and found no automated WCAG 2 A/AA violations.

### Phase 3 — Traceability and controlled change (Weeks 7–10)

**Outcome:** Users can connect intent to evidence, detect impact, and freeze reproducible baselines.

**Status:** Complete on 8 November 2026. The full contract-led slice covers directed relationship controls, live trace queries, asynchronous suspect impact and reviewer disposition, attributable changesets, immutable signed baselines, comparison, deterministic evidence export, browser workflows, and PostgreSQL exit-gate validation. All protected hosted checks passed.

Deliverables:

- [x] Typed relationships with cardinality and direction rules.
- [x] Trace matrix, graph, coverage queries, and gap reporting.
- [x] Suspect-link propagation and resolution workflow.
- [x] Changesets with attributable diffs and commit messages.
- [x] Immutable baselines and baseline comparison.
- [x] Evidence export with deterministic manifests, hashes, and signatures.

Exit gate:

- A changed upstream requirement flags affected links, records their disposition, and produces a reproducible signed baseline export.

Exit evidence:

- Local PostgreSQL 17 validation passed the complete impact-to-disposition-to-signed-baseline path, including deterministic byte-for-byte evidence replay and append-only enforcement.
- Five Chromium workflows pass for requirements, traceability, changesets, baselines, and automated WCAG 2 A/AA checks.
- [OpenRM CI run 42499758656](https://github.com/TJ-Engineer/OpenRM/actions/runs/42499758656) passed `web`, `api`, and `database-path` for the final Phase 3 branch state.

### Phase 4 — Reviews and verification (Weeks 11–14)

**Outcome:** Gate decisions can be made from attributable review and verification evidence.

**Status:** Complete on 8 November 2026. The complete review-to-verification path passed local gates and protected hosted CI.

Deliverables:

- [x] Review packages, participants, comments, resolutions, and approvals.
- [x] Approval-policy enforcement and segregation-of-duty checks.
- [x] Verification cases, procedures, runs, results, and attachments.
- [x] Coverage rollups from requirement to verification result.
- [x] Gate-readiness calculation with explainable contributors.
- [x] Notifications and due-date events.

Exit gate:

- A review package can be assembled from a baseline, approved under policy, verified, and exported with complete evidence.

Completion evidence:

- A clean PostgreSQL 17 database passed package creation, idempotent replay, exact baseline-revision comment binding, blocker-held approval, resolution-triggered completion, tenant isolation, and signed-decision verification.
- Direct updates to lifecycle events, participants, comments, resolutions, and decisions were rejected by append-only database triggers.
- Chromium passes the complete live Review Room workflow and automated WCAG 2 A/AA checks.
- A second clean PostgreSQL 17 database passed the complete requirements-to-trace-to-baseline-to-review-to-verification journey, including independent execution ownership, signed results, content-addressed attachment manifests, 100% exact-revision coverage, an explainable ready gate, due/overdue/completion events, tenant isolation, and idempotent replay.
- Repeated complete gate exports were byte-for-byte identical and returned a valid HMAC-SHA256 signature over review decisions, verification cases, runs, results, attachments, coverage, readiness, and due events.
- Direct changes to cases, targets, run events, results, attachment manifests, and due events were rejected by PostgreSQL append-only triggers.
- Chromium passes planning, execution, result capture, coverage/readiness, signed export, and automated WCAG 2 A/AA verification workflows.
- [OpenRM CI run 42504423145](https://github.com/TJ-Engineer/OpenRM/actions/runs/42504423145) passed `web`, `api`, and `database-path` for the complete Phase 4 branch state.

### Phase 5 — Integration and beta hardening (Weeks 15–17)

**Outcome:** A pilot team can operate OpenRM reliably, recoverably, and with measured service health.

**Status:** Complete on 8 November 2026. Local code, browser, PostgreSQL 17 runtime, load, recovery, upgrade, security, and deployment-artifact gates pass, and all five protected hosted jobs passed in [OpenRM CI run 42508760769](https://github.com/TJ-Engineer/OpenRM/actions/runs/42508760769).

Deliverables:

- [x] Jira connector with mapping, replay, rate-limit handling, and dead-letter workflow.
- [x] OpenTelemetry traces, service-level indicators, dashboards, and alerts.
- [x] Backup, restore, disaster-recovery, and upgrade rehearsals.
- [x] Threat model, security review, dependency policy, and automated penetration-test smoke remediation for the bounded pilot.
- [x] Load, soak harness, browser-compatibility, and accessibility validation.
- [x] Administration guide, operator runbook, and pilot onboarding.

Exit gate:

- The pilot meets the agreed reliability, security, recovery, and usability thresholds with no unresolved launch-blocking risks.

Completion evidence:

- `web`, `api`, `database-path`, `recovery-rehearsal`, and `production-artifact` passed in [OpenRM CI run 42508760769](https://github.com/TJ-Engineer/OpenRM/actions/runs/42508760769).
- Protected `main` now requires all five Phase 5 checks with strict up-to-date validation and administrator enforcement.
- Live pilot commissioning remains an environment-specific operational gate, not an unresolved repository implementation gate.
- The `OPENRM` self-verification project reaches 100% trace coverage and 100% passed exact-revision verification coverage with no orphans, suspect links, or readiness blockers; [OpenRM CI run 42512977538](https://github.com/TJ-Engineer/OpenRM/actions/runs/42512977538) reconstructed the complete gate from a clean database in the protected `database-path` workflow.

## 5. Phase 1 execution backlog

| ID | Priority | Work item | Primary evidence | Estimate |
| --- | --- | --- | --- | --- |
| FND-001 | P0 | Ratify domain boundaries and ADR set | Approved ADRs | 3 days |
| FND-002 | P0 | Establish workspace and local bootstrap | Clean-checkout run | 2 days |
| API-001 | P0 | Publish OpenAPI skeleton and error model | Contract test | 2 days |
| API-002 | P0 | Create Rust health/readiness service | Integration test | 3 days |
| DAT-001 | P0 | Add PostgreSQL migration workflow | Migration round trip | 2 days |
| SEC-001 | P0 | Prove OIDC identity and authorization policy | Policy tests | 3 days |
| WEB-001 | P1 | Migrate the client to TypeScript and API client | Typecheck + build | 3 days |
| QLT-001 | P0 | Add CI quality and security gates | Protected CI run | 2 days |

FND-001, FND-002, API-001, API-002, DAT-001, SEC-001, WEB-001, QLT-001, and QLT-002 are complete. Phase 1 through Phase 5 are closed.

## 5.1 Phase 2 execution backlog

| ID | Priority | Work item | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| REQ-000 | P1 | Decompose the requirements vertical slice | Complete | Contract-led increment defined |
| REQ-101 | P0 | Persist requirements and immutable revisions | Complete | Migration and database-path test |
| REQ-102 | P0 | Create, list, read, revise, search, and inspect history | Complete | API contract and runtime checks |
| REQ-103 | P0 | Enforce concurrency, idempotency, tenancy, and audit | Complete | PostgreSQL isolation and immutability matrix |
| REQ-104 | P0 | Connect the authoring UI to the API | Complete | Chromium authoring workflow |
| REQ-105 | P1 | Add folders, tags, typed attributes, and saved views | Complete | API runtime and UI acceptance evidence |
| REQ-106 | P1 | Add import/export, comparison, accessibility, and E2E | Complete | Protected CI evidence suite |

## 5.2 Phase 3 execution backlog

| ID | Priority | Work item | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| TRC-101 | P0 | Persist directed typed relationships with cardinality and exact revision evidence | Complete | Isolated PostgreSQL API and immutability matrix |
| TRC-102 | P0 | Propagate and resolve suspect links with attributable dispositions | Complete | Upstream revision impact workflow |
| TRC-103 | P1 | Add trace graph, matrix, coverage, and gap queries | Complete | API queries and Chromium acceptance path |
| CHG-101 | P0 | Add changesets with attributable diffs and commit messages | Complete | Parent-relative controlled commit workflow |
| BAS-101 | P0 | Add immutable baselines and baseline comparison | Complete | Reviewer-only reproducible manifest comparison |
| EVD-101 | P0 | Export deterministic hashed and signed evidence | Complete | Repeated byte-for-byte manifest verification |

## 5.3 Phase 4 execution backlog

| ID | Priority | Work item | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| REV-101 | P0 | Persist baseline-bound packages, participants, comments, resolutions, and decisions | Complete | Migration plus clean PostgreSQL workflow |
| REV-102 | P0 | Enforce approval threshold, segregation of duties, replay, tenancy, and audit | Complete | Policy denial and signed-decision runtime matrix |
| REV-103 | P0 | Connect the Review Room to live review evidence | Complete | Chromium workflow and WCAG A/AA scan |
| REV-104 | P0 | Protect the complete Phase 4 matrix in hosted CI | Complete | `web`, `api`, and `database-path` passed in run `42504423145` |
| VER-101 | P0 | Persist verification cases, procedures, runs, results, and attachments | Complete | Migration, API, clean PostgreSQL workflow, and immutable evidence matrix |
| VER-102 | P0 | Roll verification evidence into requirement coverage and gate readiness | Complete | Exact-revision coverage, explainable readiness, and browser evidence |
| NTF-101 | P1 | Emit review and verification due-date notifications | Complete | Idempotent due-soon, overdue, and completion events |

## 5.4 Phase 5 execution backlog

| ID | Priority | Work item | Status | Primary evidence |
| --- | --- | --- | --- | --- |
| INT-101 | P0 | Deliver governed Jira mapping, queueing, retry, dead-letter, and replay | Complete | API/UI workflow, append-only attempts, and database-path matrix |
| OPS-101 | P0 | Add metrics, OTLP traces, SLO status, dashboards, and alerts | Complete | Prometheus endpoint, operations API, and provisioned observability topology |
| OPS-102 | P0 | Rehearse backup, restore, disaster recovery, and upgrades | Complete | PostgreSQL 17 archive round trip and idempotent migration rehearsal |
| SEC-201 | P0 | Complete threat review and pilot security remediation | Complete | Threat model, dependency gates, security smoke matrix, and hardened container |
| QLT-201 | P0 | Validate load, soak harness, browsers, and accessibility | Complete | Load threshold plus Chromium, Firefox, WebKit, and WCAG A/AA matrix |
| PIL-101 | P1 | Publish administration, operations, and onboarding procedures | Complete | Deployment guide, administration guide, runbook, and pilot checklist |

## 6. Quality gates

Every merged vertical slice must satisfy:

- Code review and linked acceptance criteria.
- Unit tests for domain invariants and policy decisions.
- Integration tests for persistence and API contracts.
- End-to-end coverage for the changed critical workflow.
- No unresolved critical or high dependency vulnerabilities.
- Keyboard operation, focus visibility, semantic structure, and automated accessibility checks.
- Migration forward test and documented rollback or roll-forward strategy.
- Structured audit event for controlled mutations.
- Updated operational notes and architecture decisions where behavior changed.

## 7. Program risks

| Risk | Effect | Mitigation | Trigger to escalate |
| --- | --- | --- | --- |
| Prototype scope is mistaken for implemented capability | Unrealistic schedule and readiness claims | Keep prototype and production metrics separate; demonstrate evidence at every gate | A milestone is reported complete without API, persistence, policy, and tests |
| Revision and baseline semantics are designed late | Expensive data-model rework | Resolve revision, relationship, and baseline ADRs in Phase 1 | Two features implement incompatible history models |
| Authorization is bolted on after feature work | Cross-project exposure or inconsistent policy | Central policy layer, deny-by-default tests, tenant-isolation suite | A query bypasses the policy boundary |
| Connector work destabilizes the core | Delivery stalls on external-system behavior | Adapter boundary, outbox, replay, rate limiting, dead-letter queue | External availability blocks a core transaction |
| Static preview infrastructure is treated as production architecture | Missing API, data, recovery, and observability controls | Separate preview hosting from platform environments and operating model | Production data is proposed for the preview stack |

## 8. Development dashboard operating rules

The in-app Development page is the visual companion to this plan. Until live delivery integrations exist, it is a versioned planning baseline rather than a real-time project-management system.

Update the dashboard and this plan together when:

- A phase gate changes state.
- Scope, sequencing, architecture, or a release criterion changes.
- A new P0/P1 risk is accepted or resolved.
- The sprint commitment changes materially.

Once Phase 1 is complete, replace static dashboard constants with a small delivery-status endpoint populated from CI, the issue tracker, deployment metadata, and the risk register. Preserve source timestamps and make stale data visible.

## 9. Definition of beta-ready

OpenRM is beta-ready when a pilot team can:

1. Authenticate and operate within an isolated project.
2. Create and revise controlled requirements with full history.
3. Trace needs through requirements to verification evidence.
4. Resolve suspect links and compare immutable baselines.
5. Conduct a policy-compliant review and approval.
6. Export a deterministic evidence package.
7. Recover the service and data within agreed objectives.
8. Operate the system with documented alerts, runbooks, and no unresolved launch-blocking security findings.

