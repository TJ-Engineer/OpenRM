use axum::{
    Json,
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{
    AppState,
    auth::AuthenticatedPrincipal,
    authorize,
    error::ApiError,
    policy::{Action, Principal},
};

const IDEMPOTENCY_HEADER: &str = "x-idempotency-key";
const CREATE_COMMAND: &str = "requirement.create";

#[derive(Debug, FromRow, Serialize)]
pub struct ProjectSummary {
    pub id: Uuid,
    pub key: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ProjectListResponse {
    pub items: Vec<ProjectSummary>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CreateRequirementRequest {
    pub key: String,
    pub title: String,
    pub statement: String,
    #[serde(default = "empty_object")]
    pub attributes: Value,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ReviseRequirementRequest {
    pub expected_revision: i32,
    pub title: String,
    pub statement: String,
    #[serde(default = "empty_object")]
    pub attributes: Value,
}

#[derive(Clone, Debug, Serialize)]
struct ValidatedRequirement {
    key: String,
    title: String,
    statement: String,
    attributes: Value,
}

#[derive(Debug, FromRow)]
struct RequirementRecord {
    id: Uuid,
    project_id: Uuid,
    key: String,
    title: String,
    statement: String,
    attributes: Value,
    revision: i32,
    created_by: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RequirementResponse {
    pub id: Uuid,
    pub project_id: Uuid,
    pub key: String,
    pub title: String,
    pub statement: String,
    pub attributes: Value,
    pub revision: i32,
    pub created_by: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<RequirementRecord> for RequirementResponse {
    fn from(record: RequirementRecord) -> Self {
        Self {
            id: record.id,
            project_id: record.project_id,
            key: record.key,
            title: record.title,
            statement: record.statement,
            attributes: record.attributes,
            revision: record.revision,
            created_by: record.created_by,
            created_at: record.created_at,
            updated_at: record.updated_at,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct RequirementListQuery {
    pub search: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct RequirementListResponse {
    pub items: Vec<RequirementResponse>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

#[derive(Debug, FromRow, Serialize)]
pub struct RequirementRevisionResponse {
    pub id: Uuid,
    pub revision: i32,
    pub title: String,
    pub statement: String,
    pub attributes: Value,
    pub created_by: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct RequirementRevisionListResponse {
    pub items: Vec<RequirementRevisionResponse>,
}

#[derive(Debug, FromRow)]
struct CommandResult {
    request_fingerprint: String,
    response_payload: Value,
}

pub async fn list_projects(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
) -> Result<Json<ProjectListResponse>, ApiError> {
    authorize(&state, &principal, Action::Read)?;
    let items = sqlx::query_as::<_, ProjectSummary>(
        r#"
        SELECT id, key, name, created_at
        FROM projects
        WHERE organization_id = $1
        ORDER BY key
        "#,
    )
    .bind(principal.organization_id)
    .fetch_all(&state.db)
    .await
    .map_err(database_error)?;
    Ok(Json(ProjectListResponse { items }))
}

pub async fn list_requirements(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
    Path(project_id): Path<Uuid>,
    Query(query): Query<RequirementListQuery>,
) -> Result<Json<RequirementListResponse>, ApiError> {
    authorize(&state, &principal, Action::Read)?;
    ensure_project(&state.db, &principal, project_id).await?;

    let limit = query.limit.unwrap_or(50).clamp(1, 100);
    let offset = query.offset.unwrap_or(0).max(0);
    let search = query
        .search
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty());

    let items = sqlx::query_as::<_, RequirementRecord>(
        r#"
        SELECT a.id, a.project_id, a.key, a.title, a.statement, a.attributes,
               a.current_revision_number AS revision, a.created_by, a.created_at, a.updated_at
        FROM artifacts a
        JOIN artifact_types t
          ON t.organization_id = a.organization_id
         AND t.project_id = a.project_id
         AND t.id = a.artifact_type_id
        WHERE a.organization_id = $1
          AND a.project_id = $2
          AND t.key = 'REQUIREMENT'
          AND (
            $3::text IS NULL OR
            to_tsvector('english', a.key || ' ' || a.title || ' ' || a.statement)
              @@ websearch_to_tsquery('english', $3)
          )
        ORDER BY a.updated_at DESC, a.key
        LIMIT $4 OFFSET $5
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(search)
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.db)
    .await
    .map_err(database_error)?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT count(*)
        FROM artifacts a
        JOIN artifact_types t
          ON t.organization_id = a.organization_id
         AND t.project_id = a.project_id
         AND t.id = a.artifact_type_id
        WHERE a.organization_id = $1
          AND a.project_id = $2
          AND t.key = 'REQUIREMENT'
          AND (
            $3::text IS NULL OR
            to_tsvector('english', a.key || ' ' || a.title || ' ' || a.statement)
              @@ websearch_to_tsquery('english', $3)
          )
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(search)
    .fetch_one(&state.db)
    .await
    .map_err(database_error)?;

    Ok(Json(RequirementListResponse {
        items: items.into_iter().map(RequirementResponse::from).collect(),
        total,
        limit,
        offset,
    }))
}

pub async fn create_requirement(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
    Path(project_id): Path<Uuid>,
    headers: HeaderMap,
    Json(request): Json<CreateRequirementRequest>,
) -> Result<(StatusCode, Json<RequirementResponse>), ApiError> {
    authorize(&state, &principal, Action::Write)?;
    let idempotency_key = parse_idempotency_key(&headers)?;
    let requirement = validate_create(request)?;
    let fingerprint = serde_json::to_string(&(project_id, &requirement))
        .map_err(|_| ApiError::internal("Could not fingerprint requirement command"))?;

    if let Some(command) =
        find_command_result(&state.db, &principal, CREATE_COMMAND, idempotency_key).await?
    {
        if command.request_fingerprint != fingerprint {
            return Err(ApiError::conflict(
                "Idempotency key was already used with a different request",
            ));
        }
        let existing = serde_json::from_value::<RequirementResponse>(command.response_payload)
            .map_err(|_| ApiError::internal("Stored command response is invalid"))?;
        return Ok((StatusCode::OK, Json(existing)));
    }

    let mut transaction = state.db.begin().await.map_err(database_error)?;
    let artifact_type_id = sqlx::query_scalar::<_, Uuid>(
        r#"
        SELECT id
        FROM artifact_types
        WHERE organization_id = $1 AND project_id = $2 AND key = 'REQUIREMENT'
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .fetch_optional(&mut *transaction)
    .await
    .map_err(database_error)?
    .ok_or_else(|| ApiError::not_found("Project does not exist"))?;

    let artifact_id = Uuid::new_v4();
    let revision_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO artifacts (
            id, organization_id, project_id, artifact_type_id, key, title, statement,
            attributes, current_revision_id, current_revision_number, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, $10)
        "#,
    )
    .bind(artifact_id)
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(artifact_type_id)
    .bind(&requirement.key)
    .bind(&requirement.title)
    .bind(&requirement.statement)
    .bind(&requirement.attributes)
    .bind(revision_id)
    .bind(&principal.subject)
    .execute(&mut *transaction)
    .await
    .map_err(requirement_insert_error)?;

    sqlx::query(
        r#"
        INSERT INTO artifact_revisions (
            id, organization_id, project_id, artifact_id, revision_number,
            title, statement, attributes, created_by
        )
        VALUES ($1, $2, $3, $4, 1, $5, $6, $7, $8)
        "#,
    )
    .bind(revision_id)
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(artifact_id)
    .bind(&requirement.title)
    .bind(&requirement.statement)
    .bind(&requirement.attributes)
    .bind(&principal.subject)
    .execute(&mut *transaction)
    .await
    .map_err(database_error)?;

    insert_audit_event(
        &mut transaction,
        &principal,
        project_id,
        artifact_id,
        "requirement.created",
        json!({"key": requirement.key, "revision": 1}),
    )
    .await?;

    let created = sqlx::query_as::<_, RequirementRecord>(
        r#"
        SELECT id, project_id, key, title, statement, attributes,
               current_revision_number AS revision, created_by, created_at, updated_at
        FROM artifacts
        WHERE organization_id = $1 AND project_id = $2 AND id = $3
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(artifact_id)
    .fetch_one(&mut *transaction)
    .await
    .map_err(database_error)?;
    let created = RequirementResponse::from(created);
    let response_payload = serde_json::to_value(&created)
        .map_err(|_| ApiError::internal("Could not store command response"))?;

    sqlx::query(
        r#"
        INSERT INTO command_results (
            organization_id, actor_subject, command_name, idempotency_key,
            request_fingerprint, aggregate_type, aggregate_id, response_revision, response_payload
        )
        VALUES ($1, $2, $3, $4, $5, 'requirement', $6, 1, $7)
        "#,
    )
    .bind(principal.organization_id)
    .bind(&principal.subject)
    .bind(CREATE_COMMAND)
    .bind(idempotency_key)
    .bind(&fingerprint)
    .bind(artifact_id)
    .bind(response_payload)
    .execute(&mut *transaction)
    .await
    .map_err(database_error)?;

    transaction.commit().await.map_err(database_error)?;
    Ok((StatusCode::CREATED, Json(created)))
}

pub async fn get_requirement(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
    Path((project_id, requirement_id)): Path<(Uuid, Uuid)>,
) -> Result<Json<RequirementResponse>, ApiError> {
    authorize(&state, &principal, Action::Read)?;
    let requirement = fetch_requirement(&state.db, &principal, project_id, requirement_id).await?;
    Ok(Json(requirement.into()))
}

pub async fn revise_requirement(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
    Path((project_id, requirement_id)): Path<(Uuid, Uuid)>,
    Json(request): Json<ReviseRequirementRequest>,
) -> Result<Json<RequirementResponse>, ApiError> {
    authorize(&state, &principal, Action::Write)?;
    if request.expected_revision < 1 {
        return Err(ApiError::bad_request("expected_revision must be positive"));
    }
    let content = validate_content(request.title, request.statement, request.attributes)?;

    let mut transaction = state.db.begin().await.map_err(database_error)?;
    let current = sqlx::query_as::<_, RequirementRecord>(
        r#"
        SELECT a.id, a.project_id, a.key, a.title, a.statement, a.attributes,
               a.current_revision_number AS revision, a.created_by, a.created_at, a.updated_at
        FROM artifacts a
        JOIN artifact_types t
          ON t.organization_id = a.organization_id
         AND t.project_id = a.project_id
         AND t.id = a.artifact_type_id
        WHERE a.organization_id = $1 AND a.project_id = $2 AND a.id = $3
          AND t.key = 'REQUIREMENT'
        FOR UPDATE OF a
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(requirement_id)
    .fetch_optional(&mut *transaction)
    .await
    .map_err(database_error)?
    .ok_or_else(|| ApiError::not_found("Requirement does not exist"))?;

    if current.revision != request.expected_revision {
        return Err(ApiError::conflict_with_details(
            "Requirement has changed since it was read",
            json!({
                "expected_revision": request.expected_revision,
                "current_revision": current.revision,
            }),
        ));
    }

    let next_revision = current.revision + 1;
    let revision_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO artifact_revisions (
            id, organization_id, project_id, artifact_id, revision_number,
            title, statement, attributes, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
    )
    .bind(revision_id)
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(requirement_id)
    .bind(next_revision)
    .bind(&content.title)
    .bind(&content.statement)
    .bind(&content.attributes)
    .bind(&principal.subject)
    .execute(&mut *transaction)
    .await
    .map_err(database_error)?;

    sqlx::query(
        r#"
        UPDATE artifacts
        SET title = $4, statement = $5, attributes = $6,
            current_revision_id = $7, current_revision_number = $8, updated_at = now()
        WHERE organization_id = $1 AND project_id = $2 AND id = $3
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(requirement_id)
    .bind(&content.title)
    .bind(&content.statement)
    .bind(&content.attributes)
    .bind(revision_id)
    .bind(next_revision)
    .execute(&mut *transaction)
    .await
    .map_err(database_error)?;

    insert_audit_event(
        &mut transaction,
        &principal,
        project_id,
        requirement_id,
        "requirement.revised",
        json!({"from_revision": current.revision, "to_revision": next_revision}),
    )
    .await?;
    transaction.commit().await.map_err(database_error)?;

    let updated = fetch_requirement(&state.db, &principal, project_id, requirement_id).await?;
    Ok(Json(updated.into()))
}

pub async fn list_requirement_revisions(
    State(state): State<AppState>,
    AuthenticatedPrincipal(principal): AuthenticatedPrincipal,
    Path((project_id, requirement_id)): Path<(Uuid, Uuid)>,
) -> Result<Json<RequirementRevisionListResponse>, ApiError> {
    authorize(&state, &principal, Action::Read)?;
    fetch_requirement(&state.db, &principal, project_id, requirement_id).await?;
    let items = sqlx::query_as::<_, RequirementRevisionResponse>(
        r#"
        SELECT id, revision_number AS revision, title, statement, attributes, created_by, created_at
        FROM artifact_revisions
        WHERE organization_id = $1 AND project_id = $2 AND artifact_id = $3
        ORDER BY revision_number DESC
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(requirement_id)
    .fetch_all(&state.db)
    .await
    .map_err(database_error)?;
    Ok(Json(RequirementRevisionListResponse { items }))
}

async fn ensure_project(
    pool: &PgPool,
    principal: &Principal,
    project_id: Uuid,
) -> Result<(), ApiError> {
    let exists = sqlx::query_scalar::<_, bool>(
        "SELECT EXISTS(SELECT 1 FROM projects WHERE organization_id = $1 AND id = $2)",
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .fetch_one(pool)
    .await
    .map_err(database_error)?;
    exists
        .then_some(())
        .ok_or_else(|| ApiError::not_found("Project does not exist"))
}

async fn fetch_requirement(
    pool: &PgPool,
    principal: &Principal,
    project_id: Uuid,
    requirement_id: Uuid,
) -> Result<RequirementRecord, ApiError> {
    sqlx::query_as::<_, RequirementRecord>(
        r#"
        SELECT a.id, a.project_id, a.key, a.title, a.statement, a.attributes,
               a.current_revision_number AS revision, a.created_by, a.created_at, a.updated_at
        FROM artifacts a
        JOIN artifact_types t
          ON t.organization_id = a.organization_id
         AND t.project_id = a.project_id
         AND t.id = a.artifact_type_id
        WHERE a.organization_id = $1 AND a.project_id = $2 AND a.id = $3
          AND t.key = 'REQUIREMENT'
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(requirement_id)
    .fetch_optional(pool)
    .await
    .map_err(database_error)?
    .ok_or_else(|| ApiError::not_found("Requirement does not exist"))
}

async fn find_command_result(
    pool: &PgPool,
    principal: &Principal,
    command_name: &str,
    idempotency_key: &str,
) -> Result<Option<CommandResult>, ApiError> {
    sqlx::query_as::<_, CommandResult>(
        r#"
        SELECT request_fingerprint, response_payload
        FROM command_results
        WHERE organization_id = $1 AND actor_subject = $2
          AND command_name = $3 AND idempotency_key = $4
        "#,
    )
    .bind(principal.organization_id)
    .bind(&principal.subject)
    .bind(command_name)
    .bind(idempotency_key)
    .fetch_optional(pool)
    .await
    .map_err(database_error)
}

async fn insert_audit_event(
    transaction: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    principal: &Principal,
    project_id: Uuid,
    aggregate_id: Uuid,
    event_type: &str,
    payload: Value,
) -> Result<(), ApiError> {
    sqlx::query(
        r#"
        INSERT INTO audit_events (
            organization_id, project_id, actor_subject, event_type,
            aggregate_type, aggregate_id, payload
        )
        VALUES ($1, $2, $3, $4, 'requirement', $5, $6)
        "#,
    )
    .bind(principal.organization_id)
    .bind(project_id)
    .bind(&principal.subject)
    .bind(event_type)
    .bind(aggregate_id)
    .bind(payload)
    .execute(&mut **transaction)
    .await
    .map_err(database_error)?;
    Ok(())
}

fn validate_create(request: CreateRequirementRequest) -> Result<ValidatedRequirement, ApiError> {
    let key = request.key.trim().to_owned();
    if !valid_requirement_key(&key) {
        return Err(ApiError::bad_request(
            "key must contain 2-32 uppercase letters, digits, or hyphens and start with a letter",
        ));
    }
    let content = validate_content(request.title, request.statement, request.attributes)?;
    Ok(ValidatedRequirement {
        key,
        title: content.title,
        statement: content.statement,
        attributes: content.attributes,
    })
}

fn validate_content(
    title: String,
    statement: String,
    attributes: Value,
) -> Result<ValidatedRequirement, ApiError> {
    let title = title.trim().to_owned();
    let statement = statement.trim().to_owned();
    if title.is_empty() || title.chars().count() > 200 {
        return Err(ApiError::bad_request(
            "title must contain between 1 and 200 characters",
        ));
    }
    if statement.is_empty() || statement.chars().count() > 20_000 {
        return Err(ApiError::bad_request(
            "statement must contain between 1 and 20000 characters",
        ));
    }
    if !attributes.is_object() {
        return Err(ApiError::bad_request("attributes must be a JSON object"));
    }
    Ok(ValidatedRequirement {
        key: String::new(),
        title,
        statement,
        attributes,
    })
}

fn parse_idempotency_key(headers: &HeaderMap) -> Result<&str, ApiError> {
    let value = headers
        .get(IDEMPOTENCY_HEADER)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| (8..=128).contains(&value.len()))
        .filter(|value| {
            value
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.' | b':'))
        })
        .ok_or_else(|| {
            ApiError::bad_request(
                "X-Idempotency-Key must contain 8-128 letters, digits, hyphens, underscores, periods, or colons",
            )
        })?;
    Ok(value)
}

fn valid_requirement_key(value: &str) -> bool {
    (2..=32).contains(&value.len())
        && value
            .bytes()
            .next()
            .is_some_and(|byte| byte.is_ascii_uppercase())
        && value
            .bytes()
            .all(|byte| byte.is_ascii_uppercase() || byte.is_ascii_digit() || byte == b'-')
}

fn empty_object() -> Value {
    json!({})
}

fn requirement_insert_error(error: sqlx::Error) -> ApiError {
    if error
        .as_database_error()
        .and_then(|error| error.code())
        .as_deref()
        == Some("23505")
    {
        return ApiError::conflict("Requirement key already exists in this project");
    }
    database_error(error)
}

fn database_error(error: sqlx::Error) -> ApiError {
    tracing::warn!(%error, "requirements database operation failed");
    ApiError::unavailable("Requirements database operation failed")
}

#[cfg(test)]
mod tests {
    use axum::http::{HeaderMap, HeaderValue};
    use serde_json::json;

    use super::{
        CreateRequirementRequest, parse_idempotency_key, valid_requirement_key, validate_create,
    };

    #[test]
    fn validates_requirement_keys() {
        assert!(valid_requirement_key("SYS-101"));
        assert!(!valid_requirement_key("sys-101"));
        assert!(!valid_requirement_key("1-SYS"));
    }

    #[test]
    fn normalizes_requirement_content() {
        let validated = validate_create(CreateRequirementRequest {
            key: "SYS-101".to_owned(),
            title: "  Stable control  ".to_owned(),
            statement: "  The controller shall remain stable.  ".to_owned(),
            attributes: json!({"priority": "high"}),
        })
        .expect("request should be valid");
        assert_eq!(validated.title, "Stable control");
        assert_eq!(validated.statement, "The controller shall remain stable.");
    }

    #[test]
    fn requires_well_formed_idempotency_keys() {
        let mut headers = HeaderMap::new();
        headers.insert(
            "x-idempotency-key",
            HeaderValue::from_static("req:create:001"),
        );
        assert_eq!(
            parse_idempotency_key(&headers).expect("header should be valid"),
            "req:create:001"
        );
    }
}
