# OpenRM user manual

- **Document version:** 0.1
- **Applies to:** OpenRM funding preview and Phase 5 application workflows
- **Owner:** OpenRM product and documentation maintainers
- **Last verified:** 8 November 2026
- **Status:** First in-product edition; pilot review remains required

OpenRM is an open, self-hostable requirements and configuration management platform. This manual explains how authors, reviewers, verification personnel, administrators, and stakeholders use the product while preserving controlled history and attributable evidence.

> The hosted funding preview includes illustrative project data. Workspaces marked **Live** use the configured API; other preview surfaces demonstrate the intended workflow and information architecture. Do not enter regulated or production-sensitive data in the static preview.

## Table of contents

- [About this manual](#about-this-manual)
- [Getting started](#getting-started)
- [Dashboard and navigation](#dashboard-and-navigation)
- [Projects, roles, and permissions](#projects-roles-and-permissions)
- [Requirements authoring](#requirements-authoring)
- [Organization, search, and saved views](#organization-search-and-saved-views)
- [Revision history and controlled change](#revision-history-and-controlled-change)
- [Traceability and suspect links](#traceability-and-suspect-links)
- [Changesets and baselines](#changesets-and-baselines)
- [Reviews and approvals](#reviews-and-approvals)
- [Verification and gate readiness](#verification-and-gate-readiness)
- [Imports, exports, and evidence](#imports-exports-and-evidence)
- [Integrations and Jira](#integrations-and-jira)
- [Notifications and due dates](#notifications-and-due-dates)
- [Accessibility and keyboard use](#accessibility-and-keyboard-use)
- [Troubleshooting](#troubleshooting)
- [Frequently asked questions](#frequently-asked-questions)
- [Glossary](#glossary)
- [Support and escalation](#support-and-escalation)

## About this manual

Use the table of contents to move directly to a workflow. The in-product Help workspace also provides manual search and stable section links. Procedures describe the controlled product behavior; administrator-only deployment and recovery procedures remain in the repository operations guides.

### Intended audiences

- **Authors** create, organize, revise, and trace requirements.
- **Reviewers** evaluate exact baseline revisions, resolve comments, and make signed decisions.
- **Verification personnel** plan cases, execute runs, attach evidence, and record results.
- **Administrators** configure projects, roles, integrations, and operational boundaries.
- **Stakeholders and viewers** inspect readiness, trace coverage, baselines, and exported evidence without changing controlled records.

### Conventions

- **Select** means activate a button, link, row, or navigation item by pointer or keyboard.
- Text in `monospace` identifies a route, API path, status, identifier, or exact product label.
- A **controlled mutation** creates attributable history and may require a current revision or idempotency key.
- A green **Live** indicator means the workspace is connected to the configured OpenRM API.

## Getting started

### Before you begin

1. Confirm that you have the correct OpenRM URL for your environment.
2. Sign in through the configured organization identity provider when authentication is enabled.
3. Confirm that the project shown in the top bar is the project you intend to use.
4. Confirm your project role before attempting controlled changes.
5. Use **Help** in the top bar or sidebar whenever you need this manual.

### Understand the preview boundary

The static AWS preview demonstrates the user experience. It is delivered through CloudFront from a private S3 origin and does not include a commissioned production API, database, or identity provider. Live local or pilot deployments connect the same web client to the Rust API, PostgreSQL, and configured object storage.

### First-session checklist

- Open **Overview** and identify the current project, readiness score, and attention items.
- Open **Requirements** and confirm whether the workspace reports `Live`, `Preview`, or `Offline`.
- Open **Traceability** and review coverage and gap indicators.
- Open **Reviews** and **Verification** to understand the current gate state.
- Open **Help** and test a table-of-contents link before beginning controlled work.

## Dashboard and navigation

The left sidebar groups navigation into Delivery, Workspace, and Platform areas. On smaller screens, select the menu button in the top bar to open the sidebar.

### Primary workspaces

- **Overview** summarizes readiness, coverage, attention items, reviews, and recent controlled changes.
- **Requirements** supports requirement creation, revision, organization, search, history, comparison, import, and export.
- **Traceability** presents directed relationships, coverage, gaps, impact, and suspect-link disposition.
- **Baselines** presents changesets, immutable baselines, comparisons, and evidence packages.
- **Reviews** manages baseline-bound review packages, participants, comments, resolutions, and decisions.
- **Verification** manages cases, procedures, runs, results, attachments, coverage, and gate readiness.
- **Development** shows repository delivery evidence and implementation status.

### Platform workspaces

- **Object storage** describes and monitors attachment and evidence objects.
- **API & SDK** presents the governed REST/OpenAPI surface used by the browser and integrations.
- **Integrations** manages connector configuration and delivery evidence, beginning with Jira.
- **Architecture** summarizes the portable application design.
- **Help** opens this manual without signing out or changing the selected project.

### Top-bar controls

The top bar shows the current context and provides direct access to Help, the guided demo, and the user profile. Project selection in the funding preview is illustrative; a commissioned environment must enforce project membership and organization policy through the API.

## Projects, roles, and permissions

OpenRM isolates controlled data by organization and project. Access to one project does not imply access to another.

### Standard project roles

- **Administrator:** manages project configuration, membership, workspace taxonomy, integrations, and administrative operations.
- **Author:** creates and revises requirements and controlled relationships within policy.
- **Reviewer:** evaluates changes, resolves suspect links, participates in review packages, and records permitted decisions.
- **Viewer:** reads project information and evidence but cannot perform controlled mutations.

### Permission expectations

1. Work only in projects for which you have an explicit membership.
2. Use the least-privileged role that supports your responsibility.
3. Expect a `403` response when policy denies an action; do not retry with a different identity unless an administrator confirms the assignment.
4. Preserve segregation of duties. A baseline or package author may be prevented from approving their own evidence.
5. Ask a project administrator to correct membership or role assignments; do not share credentials or tokens.

## Requirements authoring

### Create a requirement

1. Open **Requirements**.
2. Confirm that the correct project is selected and the workspace is live.
3. Select **New requirement**.
4. Enter a unique requirement key, concise title, and testable statement.
5. Select the appropriate folder, tags, priority, and custom attributes.
6. Review validation messages and correct incomplete or invalid fields.
7. Select **Create requirement** once. OpenRM safely replays a repeated idempotent command, but repeated manual submission is unnecessary.

### Write effective requirement statements

- State one necessary behavior or constraint per controlled requirement.
- Use unambiguous, verifiable language and define units and tolerances.
- Avoid embedding rationale in the normative statement; retain rationale in the appropriate descriptive field or linked evidence.
- Assign attributes and tags consistently so filters and coverage reports remain meaningful.
- Link the requirement to upstream intent and downstream design or verification evidence.

### Revise a requirement

1. Select the requirement row.
2. Review its current revision and relationship impact.
3. Select **Revise requirement**.
4. Change only the fields supported by the intended decision.
5. Provide an attributable change reason or changeset context when requested.
6. Select **Commit revision**.
7. If OpenRM reports a stale revision conflict, reload the requirement, compare the newer revision, and reapply the intended change deliberately.

OpenRM preserves earlier revisions. Editing a requirement creates a new immutable revision rather than overwriting controlled history.

## Organization, search, and saved views

### Folders, tags, and attributes

- Use **folders** for stable hierarchical organization.
- Use **tags** for cross-cutting classifications such as safety, subsystem, release, or supplier.
- Use **typed custom attributes** for values that require validation and consistent reporting.
- Avoid creating near-duplicate tags or folders; check existing project taxonomy first.

### Search and filtering

1. Enter a key phrase, requirement key, or statement term in requirement search.
2. Apply folder, tag, status, or attribute filters to narrow the result.
3. Clear filters individually when a result appears to be missing.
4. Use pagination controls to inspect additional results.

Search results remain project scoped. A missing result may indicate project membership, filter state, pagination, or indexing consistency rather than deletion.

### Save a view

After selecting useful filters, save the view with a clear team-oriented name. Saved views retain the query definition, not a frozen baseline. Use a baseline when you need an immutable approved snapshot.

## Revision history and controlled change

### Inspect history

1. Select a requirement.
2. Open its revision history.
3. Review revision number, actor, timestamp, and changed fields.
4. Select two revisions to compare.
5. Confirm that the displayed difference matches the recorded decision and related changeset.

### Resolve a concurrency conflict

A `409` conflict means the submitted command was based on stale state or violates a controlled invariant.

1. Do not repeatedly resubmit the stale command.
2. Reload the current requirement or controlled object.
3. Compare the current and expected revisions.
4. Decide whether to reapply, revise, or abandon the proposed change.
5. Record the updated decision through a new controlled command.

### Audit evidence

Controlled mutations emit attributable audit evidence. Audit and revision rows are append-only; operators should investigate any failed immutability check as a security or integrity event.

## Traceability and suspect links

Trace relationships are directed and typed. Direction matters: an upstream need may decompose into system requirements, while a requirement may depend on another requirement or verification artifact.

### Create or inspect a relationship

1. Open **Traceability**.
2. Select the source and target artifacts in the intended direction.
3. Choose an allowed relationship type.
4. Confirm endpoint types and project rules.
5. Save the relationship and verify the exact source and target revisions recorded as evidence.

### Use graph, matrix, coverage, and gaps

- The **graph** emphasizes connected paths and direction.
- The **matrix** supports systematic pairwise inspection.
- **Coverage** reports which required artifacts have qualifying links.
- **Gaps** identify orphans, missing targets, or incomplete evidence.

### Resolve a suspect link

When an upstream requirement changes, OpenRM can create a new suspect relationship revision.

1. Inspect the upstream difference and downstream relationship context.
2. Determine whether the downstream artifact remains valid, needs revision, or is no longer applicable.
3. Record an attributable reviewer disposition.
4. Revise affected downstream artifacts before claiming resolved coverage.
5. Confirm that the relationship history retains the system impact event and reviewer decision.

## Changesets and baselines

### Changesets

A changeset groups attributable controlled differences relative to a parent state. Use a concise message that explains why the grouped change exists, not merely which fields changed.

### Create a baseline

1. Confirm that the intended changeset is complete and current.
2. Resolve required suspect links and blocking review comments.
3. Open **Baselines** and select the changeset.
4. Review added, modified, unchanged, and removed content.
5. Create the baseline using an authorized reviewer or administrator identity.
6. Record the baseline identifier in the related review or release evidence.

A baseline is immutable. Create a superseding baseline when the approved state changes.

### Compare baselines

Select two baselines to view exact artifact and relationship revision differences. Use this comparison for review scoping, regression planning, release notes, and evidence export.

## Reviews and approvals

### Create a review package

1. Open **Reviews**.
2. Select an immutable baseline.
3. Define the package scope, participants, approval threshold, due date, and policy.
4. Confirm independent reviewer assignments where segregation of duties applies.
5. Start the review round.

### Comment and resolve

- Bind comments to the exact baseline artifact revision under discussion.
- Classify blocking comments accurately.
- Record resolutions as append-only evidence rather than editing the original comment.
- Start a new round when policy or scope requires re-review.

### Record a decision

Review the package, open blockers, resolutions, signature status, and approval threshold before recording a decision. A package cannot become approved while policy-required blockers or approvals remain unresolved.

## Verification and gate readiness

### Plan a verification case

1. Open **Verification**.
2. Create a case with method, procedure, acceptance criteria, owner, and due date.
3. Bind the case to exact baseline requirement revisions.
4. Assign an independent executor when required by policy.
5. Review planned coverage before execution.

### Execute and record a result

1. Start the run as the assigned executor.
2. Follow the controlled procedure and preserve relevant measurements.
3. Attach content-addressed evidence using approved object storage.
4. Record passed, failed, or blocked outcome with explanatory data.
5. Complete the run and confirm signature validity.

### Interpret readiness

Gate readiness is explainable, not a manually selected color. Inspect review state, verification outcomes, exact-revision coverage, unresolved blockers, open comments, overdue work, and signature validity. A green score does not override missing required evidence.

## Imports, exports, and evidence

### Import requirements

- Validate the source format and project destination before import.
- Use bounded files and approved interchange fields.
- Review validation failures instead of silently dropping records.
- Treat imported requirements as controlled project content after creation.

### Export current requirements

Current-state export supports interchange and analysis. It is not equivalent to a signed baseline evidence package because current state can advance after export.

### Export gate evidence

Use deterministic signed export when the recipient must reproduce the exact baseline, review, verification, coverage, readiness, attachment, and due-event evidence. Verify the manifest hash and signature using the approved organizational procedure.

## Integrations and Jira

The Jira connector is an adapter over the same governed API and controlled delivery model used by other clients.

### Connector modes

- `disabled` prevents delivery.
- `dry_run` validates mapping and queue behavior without making the intended external change.
- `active` permits governed external delivery when credentials and policy allow it.

### Operate a delivery

1. Confirm the connector configuration, fixed HTTPS origin, mapping version, and external secret reference.
2. Use dry-run mode before activating a new or changed mapping.
3. Inspect delivery attempts, rate-limit classification, retry schedule, and response evidence.
4. Investigate dead letters before replay.
5. Replay only after correcting the underlying mapping, authorization, or external-system issue.

Never paste external-service secrets into the browser or store them in requirement content. Use the configured secret-management reference.

## Notifications and due dates

OpenRM emits attributable due-soon, overdue, and completion events for governed workflows. Treat notifications as prompts to inspect the controlled object; the authoritative state remains in the review or verification workspace.

- Confirm the project, object, due date, and assigned actor before acting.
- Avoid creating duplicate work when an idempotent due event is delivered more than once.
- Escalate overdue launch-blocking evidence through the project governance path.

## Accessibility and keyboard use

OpenRM targets WCAG 2 A/AA behavior for critical workflows.

### Keyboard guidance

- Use `Tab` and `Shift+Tab` to move between interactive controls.
- Use `Enter` or `Space` to activate the focused button or link.
- Use native arrow-key behavior in select controls and supported composite widgets.
- Use `Escape` to close dialogs where the dialog exposes that behavior.
- Follow the visible focus indicator; do not rely on color alone to identify state.

### Accessible content

- Provide meaningful titles and descriptions for uploaded evidence.
- Do not encode requirement meaning only through color or visual position.
- Use concise link and button labels that make sense out of context.
- Report keyboard traps, missing labels, focus loss, or unreadable contrast as product defects.

## Troubleshooting

### Workspace reports Offline

1. Confirm that the API service is running and its readiness endpoint is healthy.
2. Confirm the browser uses the correct API base URL.
3. Confirm authentication credentials are present and unexpired.
4. Review browser and API logs using the request identifier.
5. Do not assume preview data was persisted while the workspace was offline.

### Access denied

Confirm the selected project and your assigned role. Ask a project administrator to inspect membership and policy evidence. If an operation previously worked and suddenly returns access denied, also check environment status, identity claims, and any configured project spend or service limits.

### Stale revision or conflict

Reload, compare the latest revision, and deliberately reapply the intended change. Do not bypass concurrency by editing the database or retrying an old request payload.

### Missing search result

Clear filters, confirm the selected project, inspect pagination, verify the exact key, and allow for asynchronous indexing consistency where applicable.

### Failed upload or export

Check file size and type limits, object-storage availability, authorization, manifest status, and browser download policy. Preserve the request identifier and do not treat a partial download as valid evidence.

### Integration delivery failed

Inspect the latest attempt classification, external response, retry timing, mapping version, credential reference, and dead-letter reason. Correct the cause before replay.

## Frequently asked questions

### Can I edit an old requirement revision?

No. Revisions are immutable. Create a new revision based on the current state.

### Is a saved view a baseline?

No. A saved view stores a reusable query. A baseline freezes exact artifact and relationship revisions.

### Why can I not approve my own package?

The project policy may enforce segregation of duties between authors, baseline creators, package creators, reviewers, and verification executors.

### Does a passed test automatically make the gate ready?

No. Readiness also considers exact-revision coverage, review approval, blockers, comments, due events, and signature validity.

### Can I use the AWS funding preview for production data?

No. The preview is an evaluation surface and does not represent a commissioned production API/database environment.

### Where are administrator and recovery procedures?

Use the repository administration guide, deployment guide, operator runbook, SLO and alert guide, and recovery and upgrade guide. This manual focuses on in-product workflows.

## Glossary

- **Artifact:** A controlled project object such as a requirement.
- **Baseline:** An immutable snapshot of exact artifact and relationship revisions.
- **Changeset:** An attributable collection of differences relative to a parent state.
- **Controlled mutation:** A policy-checked command that creates attributable history.
- **Exact-revision coverage:** Coverage calculated against the specific revisions frozen by a baseline.
- **Gate readiness:** An explainable rollup of review, verification, coverage, blocker, due-date, and signature evidence.
- **Idempotency:** Safe replay of the same command without duplicating its controlled effect.
- **Relationship revision:** An immutable version of a directed typed trace link and its disposition.
- **Review package:** A baseline-bound set of participants, comments, resolutions, and decisions.
- **Suspect link:** A relationship requiring impact assessment after relevant upstream change.
- **Verification case:** Controlled verification intent, procedure, acceptance criteria, owner, and exact targets.
- **Verification run:** An attributable execution of a verification case.

## Support and escalation

When requesting support, provide the environment, selected project, affected workspace, approximate time, request identifier, object identifier, expected result, actual result, and reproducible steps. Do not include passwords, access tokens, external-service secrets, or regulated content in an unapproved support channel.

Escalate immediately when you observe possible cross-project exposure, missing or mutable audit evidence, invalid signatures, unexplained data loss, authentication bypass, repeated recovery failure, or a launch-blocking security issue. Preserve logs and evidence without modifying the affected controlled records.

For repository-level maintenance, consult `docs/operations/ADMINISTRATION_GUIDE.md`, `docs/operations/OPERATOR_RUNBOOK.md`, `docs/operations/RECOVERY_AND_UPGRADES.md`, and the planned Software Design Description.
