#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

AWS_REGION="${AWS_REGION:-us-east-1}"
SOURCE_PROFILE="${SOURCE_PROFILE:-opencm-demo}"
STACK_NAME="${STACK_NAME:-opencm-demo}"
PROJECT_NAME="${PROJECT_NAME:-opencm}"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-demo}"
PRICE_CLASS="${PRICE_CLASS:-PriceClass_100}"

CALLER_ARN="$(aws sts get-caller-identity \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --query Arn \
  --output text)"

if [[ "${CALLER_ARN}" != *":root" ]]; then
  echo "Provisioning expected the temporary root login profile, got ${CALLER_ARN}." >&2
  echo "Refusing to provision from an unexpected identity." >&2
  exit 1
fi

logout_source_profile() {
  if aws logout --profile "${SOURCE_PROFILE}" >/dev/null 2>&1; then
    echo "Temporary root browser session logged out."
  fi
}

trap logout_source_profile EXIT

echo "Provisioning the OpenCM demo infrastructure once"
echo "  Caller:  ${CALLER_ARN}"
echo "  Region:  ${AWS_REGION}"
echo "  Stack:   ${STACK_NAME}"

aws cloudformation validate-template \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --template-body "file://${PROJECT_DIR}/aws/cloudformation.yml" >/dev/null

aws cloudformation deploy \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --template-file "${PROJECT_DIR}/aws/cloudformation.yml" \
  --stack-name "${STACK_NAME}" \
  --parameter-overrides \
    "ProjectName=${PROJECT_NAME}" \
    "EnvironmentName=${ENVIRONMENT_NAME}" \
    "PriceClass=${PRICE_CLASS}" \
  --tags \
    "Project=${PROJECT_NAME}" \
    "Environment=${ENVIRONMENT_NAME}" \
    "ManagedBy=CloudFormation" \
  --no-fail-on-empty-changeset

SOURCE_PROFILE="${SOURCE_PROFILE}" \
AWS_REGION="${AWS_REGION}" \
SITE_STACK_NAME="${STACK_NAME}" \
PROJECT_NAME="${PROJECT_NAME}" \
ENVIRONMENT_NAME="${ENVIRONMENT_NAME}" \
"${SCRIPT_DIR}/bootstrap-aws-role.sh"

AWS_PROFILE=opencm-deployer \
AWS_REGION="${AWS_REGION}" \
STACK_NAME="${STACK_NAME}" \
PROJECT_NAME="${PROJECT_NAME}" \
ENVIRONMENT_NAME="${ENVIRONMENT_NAME}" \
"${SCRIPT_DIR}/deploy-aws.sh"
