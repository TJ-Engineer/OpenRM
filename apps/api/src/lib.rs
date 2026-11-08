pub mod auth;
pub mod config;
pub mod error;
pub mod outbox;
pub mod policy;
pub mod projects;
pub mod relationships;
pub mod requirements;

use std::time::Duration;

use auth::{AuthVerifier, AuthenticatedPrincipal};
use axum::{
    Json, Router,
    extract::State,
    http::{HeaderName, HeaderValue, Method, StatusCode},
    routing::get,
};
use chrono::{DateTime, Utc};
use config::Config;
use error::ApiError;
use policy::{Action, PolicyEngine, Principal};
use serde::Serialize;
use sqlx::{PgPool, postgres::PgPoolOptions};
use tower_http::{
    catch_panic::CatchPanicLayer,
    cors::CorsLayer,
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    trace::TraceLayer,
};

const REQUEST_ID_HEADER: &str = "x-request-id";

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub auth: AuthVerifier,
    pub policy: PolicyEngine,
    pub build: BuildInfo,
}

#[derive(Clone, Serialize)]
pub struct BuildInfo {
    pub service: &'static str,
    pub version: &'static str,
    pub git_sha: &'static str,
    pub profile: &'static str,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    build: BuildInfo,
    timestamp: DateTime<Utc>,
}

#[derive(Serialize)]
struct ReadinessResponse {
    status: &'static str,
    database: &'static str,
    timestamp: DateTime<Utc>,
}

#[derive(Serialize)]
struct SessionResponse {
    subject: String,
    organization_id: uuid::Uuid,
    roles: Vec<String>,
    database: &'static str,
}

impl BuildInfo {
    pub fn current() -> Self {
        Self {
            service: "openrm-api",
            version: env!("CARGO_PKG_VERSION"),
            git_sha: option_env!("OPENRM_GIT_SHA").unwrap_or("development"),
            profile: option_env!("OPENRM_BUILD_PROFILE").unwrap_or("development"),
        }
    }
}

pub async fn connect(config: &Config) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&config.database_url)
        .await
}

pub async fn migrate(pool: &PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!("../../db/migrations").run(pool).await
}

pub fn router(state: AppState) -> Router {
    let request_id_header = HeaderName::from_static(REQUEST_ID_HEADER);
    let cors = CorsLayer::new()
        .allow_origin(
            "http://127.0.0.1:5173"
                .parse::<HeaderValue>()
                .expect("valid local origin"),
        )
        .allow_headers([
            http::header::AUTHORIZATION,
            http::header::CONTENT_TYPE,
            HeaderName::from_static("x-openrm-organization"),
            HeaderName::from_static("x-idempotency-key"),
        ])
        .allow_methods([Method::GET, Method::POST, Method::PUT]);

    Router::new()
        .route("/health", get(health))
        .route("/ready", get(ready))
        .route("/api/v1/session", get(session))
        .route(
            "/api/v1/projects",
            get(requirements::list_projects).post(projects::create_project),
        )
        .route(
            "/api/v1/projects/{project_id}/members",
            get(projects::list_memberships).post(projects::upsert_membership),
        )
        .route(
            "/api/v1/projects/{project_id}/workspace/{resource}",
            get(projects::list_workspace_resources).post(projects::create_workspace_resource),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements",
            get(requirements::list_requirements).post(requirements::create_requirement),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements/import",
            axum::routing::post(requirements::import_requirements),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements/export",
            get(requirements::export_requirements),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements/{requirement_id}",
            get(requirements::get_requirement).put(requirements::revise_requirement),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements/{requirement_id}/revisions",
            get(requirements::list_requirement_revisions),
        )
        .route(
            "/api/v1/projects/{project_id}/requirements/{requirement_id}/compare",
            get(requirements::compare_requirement_revisions),
        )
        .route(
            "/api/v1/projects/{project_id}/relationship-types",
            get(relationships::list_relationship_types),
        )
        .route(
            "/api/v1/projects/{project_id}/relationships",
            get(relationships::list_relationships).post(relationships::create_relationship),
        )
        .route(
            "/api/v1/projects/{project_id}/relationships/{relationship_id}/resolve",
            axum::routing::post(relationships::resolve_relationship),
        )
        .route(
            "/api/v1/projects/{project_id}/relationships/{relationship_id}/revisions",
            get(relationships::list_relationship_revisions),
        )
        .fallback(not_found)
        .with_state(state)
        .layer(PropagateRequestIdLayer::new(request_id_header.clone()))
        .layer(SetRequestIdLayer::new(request_id_header, MakeRequestUuid))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .layer(CatchPanicLayer::new())
}

async fn health(State(state): State<AppState>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        build: state.build,
        timestamp: Utc::now(),
    })
}

async fn ready(State(state): State<AppState>) -> Result<Json<ReadinessResponse>, ApiError> {
    database_check(&state.db).await?;
    Ok(Json(ReadinessResponse {
        status: "ready",
        database: "available",
        timestamp: Utc::now(),
    }))
}

async fn session(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
) -> Result<Json<SessionResponse>, ApiError> {
    authorize_read(&state, &principal)?;
    database_check(&state.db).await?;
    Ok(Json(SessionResponse {
        subject: principal.subject,
        organization_id: principal.organization_id,
        roles: principal.roles,
        database: "available",
    }))
}

fn authorize_read(state: &AppState, principal: &Principal) -> Result<(), ApiError> {
    authorize(state, principal, Action::Read)
}

fn authorize(state: &AppState, principal: &Principal, action: Action) -> Result<(), ApiError> {
    state
        .policy
        .allows(principal, action, principal.organization_id)
        .then_some(())
        .ok_or_else(|| ApiError::forbidden("Principal is not authorized for this action"))
}

async fn database_check(pool: &PgPool) -> Result<(), ApiError> {
    let value = sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(pool)
        .await
        .map_err(|error| {
            tracing::warn!(%error, "database readiness check failed");
            ApiError::unavailable("Database is not available")
        })?;
    if value != 1 {
        return Err(ApiError::unavailable(
            "Database readiness check returned an invalid result",
        ));
    }
    Ok(())
}

async fn not_found() -> ApiError {
    ApiError::new(StatusCode::NOT_FOUND, "not_found", "Route does not exist")
}

#[cfg(test)]
mod tests {
    use super::{AppState, BuildInfo, router};
    use crate::{auth::AuthVerifier, policy::PolicyEngine};
    use axum::{body::Body, http::Request};
    use http_body_util::BodyExt;
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;

    fn test_state() -> AppState {
        AppState {
            db: PgPoolOptions::new()
                .connect_lazy("postgres://openrm:openrm@127.0.0.1:1/openrm")
                .expect("lazy pool should be valid"),
            auth: AuthVerifier::dev(),
            policy: PolicyEngine,
            build: BuildInfo::current(),
        }
    }

    #[tokio::test]
    async fn health_is_public_and_reports_build_metadata() {
        let response = router(test_state())
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), 200);
        let bytes = response.into_body().collect().await.unwrap().to_bytes();
        let body: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(body["status"], "ok");
        assert_eq!(body["build"]["service"], "openrm-api");
    }

    #[tokio::test]
    async fn protected_session_requires_authentication() {
        let response = router(test_state())
            .oneshot(
                Request::builder()
                    .uri("/api/v1/session")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), 401);
    }
}
