# OpenRM deployment guide

This guide describes the supported pilot deployment shape. The repository does not claim a live production environment until an operator records environment-specific evidence.

## Required services

- OpenRM API image built from `deploy/openrm-api.Dockerfile`.
- PostgreSQL 17 with encrypted durable storage and point-in-time recovery configured by the operator.
- An OIDC provider that publishes discovery metadata and RSA signing keys.
- An OpenTelemetry Collector reachable over OTLP/HTTP.
- Prometheus or another scraper for `/metrics`.
- The existing static web deployment, configured with the API base URL and OIDC client.

## Secrets

Inject these through the deployment platform's secret manager; never commit them or place them in connector configuration rows:

- `OPENRM_DATABASE_URL`
- `OPENRM_EVIDENCE_SIGNING_KEY` (at least 32 bytes in production)
- `OPENRM_EVIDENCE_SIGNING_KEY_ID`
- `OPENRM_JIRA_API_TOKEN` when active Jira delivery is enabled
- the file referenced by `OPENRM_POSTGRES_PASSWORD_FILE`

The non-secret connector reference is fixed to `env:JIRA_API_TOKEN`; the deployment platform decides which operator-managed secret supplies that environment variable.

## First deployment

1. Copy `deploy/compose.production.yaml` and the `deploy/observability` directory to the deployment host.
2. Set the required `OPENRM_*` environment variables.
3. Build the immutable image: `docker compose -f deploy/compose.production.yaml build api`.
4. Run migrations as a one-off task using the same image and production secret set: `docker compose -f deploy/compose.production.yaml run --rm --entrypoint /usr/local/bin/openrm-migrate api`.
5. Start the services: `docker compose -f deploy/compose.production.yaml up -d`.
6. Verify `/health`, `/ready`, `/metrics`, OIDC authentication, and `/api/v1/operations/status`.
7. Run the security and load smoke matrices before admitting pilot data.

The bundled collector writes trace summaries to its debug exporter so the OTLP path is observable during pilot commissioning. Replace or augment that exporter with the operator's retained trace backend before relying on traces for incident retention.

The API container runs as UID 10001, has no Linux capabilities, uses a read-only root filesystem, and accepts production startup only with OIDC and an explicit evidence-signing key.
Keep `/metrics` on the private service network and route only intended API paths through the public ingress; the bundled Compose file binds operator-facing ports to loopback.

## Rollback

Application rollback is image-based. Retain the prior image digest, stop writes, restore the last compatible database snapshot if a migration is not backward compatible, deploy the prior digest, and execute the validation steps in the operator runbook. Never attempt to reverse append-only evidence with ad hoc SQL.
