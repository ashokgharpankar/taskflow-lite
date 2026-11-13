#!/usr/bin/env bash
# One-time bootstrap (and safe to re-run for updates), from YOUR laptop with an admin AWS profile.
# Usage: ./infra/deploy-infra.sh <github-owner> [repo] [create-oidc-provider auto|true|false]
set -euo pipefail

OWNER="${1:?github owner required}"
REPO="${2:-taskflow-lite}"
CREATE_OIDC="${3:-auto}"
STACK="taskflow-lite-frontend"
REGION="${AWS_REGION:-ap-south-1}"

# The account may hold only ONE GitHub OIDC provider. Decide who owns it:
#   - this stack already manages it            -> true  (passing false would DELETE it on update!)
#   - it exists but was created outside stack  -> false (reuse it)
#   - it doesn't exist                         -> true  (create it)
if [ "$CREATE_OIDC" = "auto" ]; then
  IN_STACK=$(aws cloudformation describe-stack-resource --region "$REGION" --stack-name "$STACK"     --logical-resource-id GitHubOIDCProvider --query StackResourceDetail.ResourceStatus --output text 2>/dev/null || true)
  EXISTS=$(aws iam list-open-id-connect-providers --query "OpenIDConnectProviderList[?ends_with(Arn, 'token.actions.githubusercontent.com')].Arn" --output text)
  if [ -n "$IN_STACK" ] && [ "$IN_STACK" != "None" ]; then CREATE_OIDC=true
  elif [ -n "$EXISTS" ]; then CREATE_OIDC=false
  else CREATE_OIDC=true; fi
  echo "GitHub OIDC provider: CreateOIDCProvider=$CREATE_OIDC (in stack: ${IN_STACK:-no}, in account: ${EXISTS:-no})"
fi

# Repos created after 15 Jul 2026 use GitHub's immutable OIDC subject (owner@id/repo@id).
# Look up the numeric IDs with the GitHub CLI; if gh isn't available, fall back to the classic format.
OWNER_ID=""; REPO_ID=""
if command -v gh >/dev/null 2>&1; then
  OWNER_ID=$(gh api "repos/$OWNER/$REPO" --jq .owner.id 2>/dev/null || true)
  REPO_ID=$(gh api "repos/$OWNER/$REPO" --jq .id 2>/dev/null || true)
  PREFIX=$(gh api "repos/$OWNER/$REPO/actions/oidc/customization/sub" --jq .sub_claim_prefix 2>/dev/null || true)
  echo "GitHub OIDC subject prefix for $OWNER/$REPO: ${PREFIX:-unknown}"
  if [ -n "$PREFIX" ] && [[ "$PREFIX" != *"@"* ]]; then OWNER_ID=""; REPO_ID=""; fi  # repo still on classic format
fi

# A stack whose FIRST create failed sits in ROLLBACK_COMPLETE and can't be updated: delete it first.
STATUS=$(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
  --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo NONE)
if [ "$STATUS" = "ROLLBACK_COMPLETE" ]; then
  echo "Previous create failed and rolled back; deleting $STACK before retrying..."
  aws cloudformation delete-stack --region "$REGION" --stack-name "$STACK"
  aws cloudformation wait stack-delete-complete --region "$REGION" --stack-name "$STACK"
fi

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file "$(dirname "$0")/frontend.yml" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides GitHubOwner="$OWNER" GitHubRepo="$REPO" CreateOIDCProvider="$CREATE_OIDC" \
                        GitHubOwnerId="$OWNER_ID" GitHubRepoId="$REPO_ID"

echo
echo "Trusted OIDC subject:"
aws cloudformation describe-stack-resource --region "$REGION" --stack-name "$STACK" --logical-resource-id DeployRole \
  --query StackResourceDetail.PhysicalResourceId --output text \
  | xargs -I{} aws iam get-role --role-name {} \
      --query "Role.AssumeRolePolicyDocument.Statement[0].Condition.StringEquals.\"token.actions.githubusercontent.com:sub\"" --output text
echo
echo "Stack outputs -> add these as GitHub repo *Variables* (Settings > Secrets and variables > Actions > Variables):"
aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
  --query 'Stacks[0].Outputs[].[Description,OutputValue]' --output table
echo "Also add variable AWS_REGION=$REGION"
