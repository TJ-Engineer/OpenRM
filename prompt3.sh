#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/Users/giovanni/Research/EngineeringAI/ProjectWeave-Studio/vibe-openRM"
EXPECTED_BRANCH="codex/production-foundation"
GITHUB_REPO="TJ-Engineer/OpenRM"
BASE_BRANCH="main"

cd "${REPO_DIR}"

echo "== Verify required commands =="

for command_name in git gh; do
  if ! command -v "${command_name}" >/dev/null 2>&1; then
    echo "ERROR: ${command_name} is not installed." >&2
    exit 1
  fi
done

gh auth status --hostname github.com

echo
echo "== Verify repository and remote =="

git rev-parse --show-toplevel

ORIGIN_URL="$(git remote get-url origin)"
echo "origin: ${ORIGIN_URL}"

case "${ORIGIN_URL}" in
  *github.com/TJ-Engineer/OpenRM.git|*github.com/TJ-Engineer/OpenRM)
    ;;
  *)
    echo "ERROR: origin does not point to TJ-Engineer/OpenRM." >&2
    exit 1
    ;;
esac

echo
echo "== Fetch current remote state =="

git fetch --prune origin

echo
echo "== Verify branch =="

CURRENT_BRANCH="$(git branch --show-current)"
echo "Current branch: ${CURRENT_BRANCH}"

if [[ "${CURRENT_BRANCH}" != "${EXPECTED_BRANCH}" ]]; then
  echo "ERROR: Expected ${EXPECTED_BRANCH}, but found ${CURRENT_BRANCH}." >&2
  exit 1
fi

echo
echo "== Verify clean working tree =="

if [[ -n "$(git status --porcelain=v1)" ]]; then
  echo "ERROR: The working tree is not clean:" >&2
  git status --short
  exit 1
fi

git status --short --branch

echo
echo "== Verify the branch contains changes for main =="

COMMIT_COUNT="$(git rev-list --count "origin/${BASE_BRANCH}..HEAD")"

if [[ "${COMMIT_COUNT}" -eq 0 ]]; then
  echo "ERROR: ${EXPECTED_BRANCH} has no commits to merge into ${BASE_BRANCH}." >&2
  exit 1
fi

echo "${EXPECTED_BRANCH} contains ${COMMIT_COUNT} commit(s) not in origin/${BASE_BRANCH}:"
git log --oneline --decorate "origin/${BASE_BRANCH}..HEAD"

echo
echo "Changed files:"
git diff --name-status "origin/${BASE_BRANCH}...HEAD"

echo
echo "== Confirm Prompt 2 validation =="

read -r -p \
  "Did every required Prompt 2 check pass on this exact commit? Type YES to continue: " \
  VALIDATION_CONFIRMATION

if [[ "${VALIDATION_CONFIRMATION}" != "YES" ]]; then
  echo "Stopped. Complete Prompt 2 successfully before publishing the branch."
  exit 1
fi

VALIDATED_HEAD="$(git rev-parse HEAD)"
echo "Validated commit: ${VALIDATED_HEAD}"

echo
echo "== Push the feature branch without force =="

git push --set-upstream origin "${EXPECTED_BRANCH}"

git fetch origin "${EXPECTED_BRANCH}"

LOCAL_HEAD="$(git rev-parse HEAD)"
REMOTE_HEAD="$(git rev-parse "origin/${EXPECTED_BRANCH}")"

if [[ "${LOCAL_HEAD}" != "${REMOTE_HEAD}" ]]; then
  echo "ERROR: Local and remote branch commits differ after the push." >&2
  echo "Local:  ${LOCAL_HEAD}" >&2
  echo "Remote: ${REMOTE_HEAD}" >&2
  exit 1
fi

echo "Remote branch verified at ${REMOTE_HEAD}."

echo
echo "== Check for an existing open pull request =="

PR_URL="$(
  gh pr list \
    --repo "${GITHUB_REPO}" \
    --base "${BASE_BRANCH}" \
    --head "${EXPECTED_BRANCH}" \
    --state open \
    --json url \
    --jq '.[0].url // empty'
)"

if [[ -z "${PR_URL}" ]]; then
  BODY_FILE="$(mktemp /private/tmp/openrm-pr-body.XXXXXX)"
  trap 'rm -f "${BODY_FILE}"' EXIT

  cat > "${BODY_FILE}" <<'PR_BODY'
## Purpose

Introduce the production REST API foundation needed for controlled OpenRM access by software-factory agents and external integrations, including Jira workflows.

## Key changes

- Adds the versioned OpenRM REST API implementation.
- Adds controlled authentication and role-based authorization boundaries.
- Adds API contract generation for the TypeScript client.
- Adds database migrations and persistence support.
- Adds operational, health, readiness, and integration behavior.
- Adds automated frontend, API, browser, container, and migration validation.

## Authentication and authorization

- Development tokens are intended only for local development.
- Development authentication is rejected in production mode.
- Production deployments require OIDC configuration.
- Jira and other API credentials must be supplied through operator-managed environment variables or a secret manager.
- No passwords, API tokens, signing keys, or production credentials should be committed.

## Configuration and migrations

Review `.env.example` and the deployment documentation before deployment.

Apply database migrations using:

```bash
cargo run -p openrm-api --bin migrate
