#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

AWS_REGION="${AWS_REGION:-us-east-1}"
SOURCE_PROFILE="${SOURCE_PROFILE:-opencm-demo}"
DEPLOY_PROFILE="${DEPLOY_PROFILE:-opencm-deployer}"
STACK_NAME="${DEPLOY_ROLE_STACK_NAME:-opencm-deployer-role}"
ROLE_NAME="${DEPLOY_ROLE_NAME:-OpenCMDeploymentRole}"
SITE_STACK_NAME="${SITE_STACK_NAME:-opencm-demo}"
PROJECT_NAME="${PROJECT_NAME:-opencm}"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-demo}"

CALLER_ARN="$(aws sts get-caller-identity \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --query Arn \
  --output text)"

if [[ "${CALLER_ARN}" != *":root" ]]; then
  echo "Bootstrap expected the temporary root login profile, got ${CALLER_ARN}." >&2
  echo "Refusing to modify IAM from an unexpected identity." >&2
  exit 1
fi

aws cloudformation deploy \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --template-file "${PROJECT_DIR}/aws/deployer-role.yml" \
  --stack-name "${STACK_NAME}" \
  --parameter-overrides \
    "RoleName=${ROLE_NAME}" \
    "SiteStackName=${SITE_STACK_NAME}" \
    "ProjectName=${PROJECT_NAME}" \
    "EnvironmentName=${ENVIRONMENT_NAME}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --tags \
    "Project=${PROJECT_NAME}" \
    "Environment=${ENVIRONMENT_NAME}" \
    "ManagedBy=CloudFormation" \
  --no-fail-on-empty-changeset

ROLE_ARN="$(aws cloudformation describe-stacks \
  --profile "${SOURCE_PROFILE}" \
  --region "${AWS_REGION}" \
  --stack-name "${STACK_NAME}" \
  --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue | [0]" \
  --output text)"

aws configure set role_arn "${ROLE_ARN}" --profile "${DEPLOY_PROFILE}"
aws configure set source_profile "${SOURCE_PROFILE}" --profile "${DEPLOY_PROFILE}"
aws configure set region "${AWS_REGION}" --profile "${DEPLOY_PROFILE}"
aws configure set role_session_name opencm-deploy --profile "${DEPLOY_PROFILE}"

DEPLOYER_ARN="$(aws sts get-caller-identity \
  --profile "${DEPLOY_PROFILE}" \
  --region "${AWS_REGION}" \
  --query Arn \
  --output text)"

echo "Restricted deployment profile ready"
echo "  Profile: ${DEPLOY_PROFILE}"
echo "  Identity: ${DEPLOYER_ARN}"
