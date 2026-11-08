# OpenRM implementation plan

**Planning baseline:** 7 November 2026  
**Current stage:** Foundation implemented locally → Hosted CI validation
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
- GitHub Actions workflow for web, Rust, dependency audits, migrations, and an authenticated database-backed request.

What does not exist yet:

- Hosted CI evidence and protected-branch enforcement for the new workflow.
- Deployed API/database environments and a connected production OIDC provider.
- Production artifact, relationship, baseline, review, and verification endpoints.
- Accessibility and browser end-to-end coverage for controlled product workflows.
- Release automation, full observability, or recovery validation.
- Live Jira or other connector implementations.

The first engineering gate must therefore prove the platform foundation rather than add more prototype surface area.

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

**Status:** Implementation and all local evidence checks passed on 7 November 2026. The first hosted CI run and branch protection remain before the phase is formally closed.

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
- Remaining closure evidence: successful hosted workflow run and protected `main` branch.

### Phase 2 — Requirements vertical slice (Weeks 3–6)

**Outcome:** A team can create, revise, organize, search, and inspect requirements with durable history.

Deliverables:

- [ ] Projects, artifact types, artifacts, folders, tags, and custom attributes.
- [ ] Requirement creation, editing, validation, revision history, and comparison.
- [ ] Optimistic concurrency and idempotent command handling.
- [ ] Project roles with read, author, reviewer, and administrator policies.
- [ ] Search, filters, saved views, pagination, import, and export.
- [ ] Immutable audit events for every controlled mutation.
- [ ] Accessibility and end-to-end coverage for the primary authoring path.

Exit gate:

- Two isolated projects can complete the authoring workflow without cross-project data exposure, and all mutations can be reconstructed from audit evidence.

### Phase 3 — Traceability and controlled change (Weeks 7–10)

**Outcome:** Users can connect intent to evidence, detect impact, and freeze reproducible baselines.

Deliverables:

- [ ] Typed relationships with cardinality and direction rules.
- [ ] Trace matrix, graph, coverage queries, and gap reporting.
- [ ] Suspect-link propagation and resolution workflow.
- [ ] Changesets with attributable diffs and commit messages.
- [ ] Immutable baselines and baseline comparison.
- [ ] Evidence export with deterministic manifests and hashes.

Exit gate:

- A changed upstream requirement flags affected links, records their disposition, and produces a reproducible signed baseline export.

### Phase 4 — Reviews and verification (Weeks 11–14)

**Outcome:** Gate decisions can be made from attributable review and verification evidence.

Deliverables:

- [ ] Review packages, participants, comments, resolutions, and approvals.
- [ ] Approval-policy enforcement and segregation-of-duty checks.
- [ ] Verification cases, procedures, runs, results, and attachments.
- [ ] Coverage rollups from requirement to verification result.
- [ ] Gate-readiness calculation with explainable contributors.
- [ ] Notifications and due-date events.

Exit gate:

- A review package can be assembled from a baseline, approved under policy, verified, and exported with complete evidence.

### Phase 5 — Integration and beta hardening (Weeks 15–17)

**Outcome:** A pilot team can operate OpenRM reliably, recoverably, and with measured service health.

Deliverables:

- [ ] Jira connector with mapping, replay, rate-limit handling, and dead-letter workflow.
- [ ] OpenTelemetry traces, service-level indicators, dashboards, and alerts.
- [ ] Backup, restore, disaster-recovery, and upgrade rehearsals.
- [ ] Threat model, security review, dependency policy, and penetration-test remediation.
- [ ] Load, soak, browser-compatibility, and accessibility validation.
- [ ] Administration guide, operator runbook, and pilot onboarding.

Exit gate:

- The pilot meets the agreed reliability, security, recovery, and usability thresholds with no unresolved launch-blocking risks.

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

FND-001, FND-002, API-001, API-002, DAT-001, SEC-001, WEB-001, and the local portion of QLT-001 are implemented and verified. QLT-002—run hosted CI and protect `main`—is the remaining Phase 1 closure item.

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

