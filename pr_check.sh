#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export APP_NAME="hccm"
export COMPONENT_NAME="hccm-frontend"

COMPONENTS="hive-metastore koku presto"
COMPONENTS_W_RESOURCES="hive-metastore koku presto"

# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/cloudservices/hccm-frontend"
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export APP_ROOT=$(pwd)
export NODE_BUILD_VERSION=18
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
export IQE_PLUGINS="cost_management"
export IQE_MARKER_EXPRESSION="cost_ui_required"
export IQE_FILTER_EXPRESSION=""

export IQE_CJI_TIMEOUT="120m"

# Specific config for UI deployment and ui smokes
export DEPLOY_FRONTENDS="true"
export IQE_ENV="ephemeral"
export IQE_SELENIUM="true"


export GITHUB_API_ROOT='https://api.github.com/repos/project-koku/koku-ui'

_github_api_request() {

    local API_PATH="$1"
    curl -s -H "Accept: application/vnd.github.v3+json" "${GITHUB_API_ROOT}/$API_PATH"
}


function get_pr_labels() {
    _github_api_request "issues/$ghprbPullId/labels" | jq '.[].name'
}

function set_label_flags() {

    local PR_LABELS

    if ! PR_LABELS=$(get_pr_labels); then
        echo "Error retrieving PR labels"
        return 1
    fi

    if ! grep -E 'ui_smokes_required' <<< "$PR_LABELS"; then
        SKIP_SMOKE_TESTS='true'
        echo "Label ui_smokes_required not found"
    else
        SKIP_SMOKE_TESTS='false'  
        echo "Label ui_smokes_required is set"
    fi
}


set -exv
# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?


set_label_flags

echo $SKIP_SMOKE_TESTS

if [ "$SKIP_SMOKE_TESTS" = "false" ]; then
    echo "PR_check is running smokes"

    # bootstrap bonfire and it's config
    CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
    curl -s "$CICD_URL"/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

    source ${CICD_ROOT}/_common_deploy_logic.sh
    export NAMESPACE=$(bonfire namespace reserve --duration 2h15m)

    # Get secrets from the cluster resources

    oc get secret/koku-aws -o json -n ephemeral-base | jq -r '.data' > aws-creds.json
    oc get secret/koku-gcp -o json -n ephemeral-base | jq -r '.data' > gcp-creds.json
    oc get secret/koku-oci -o json -n ephemeral-base | jq -r '.data' > oci-creds.json

    AWS_ACCESS_KEY_ID_EPH=$(jq -r '."aws-access-key-id"' < aws-creds.json | base64 -d)
    AWS_SECRET_ACCESS_KEY_EPH=$(jq -r '."aws-secret-access-key"' < aws-creds.json | base64 -d)
    GCP_CREDENTIALS_EPH=$(jq -r '."gcp-credentials"' < gcp-creds.json)
    OCI_CREDENTIALS_EPH=$(jq -r '."oci-credentials"' < oci-creds.json)
    OCI_CLI_USER_EPH=$(jq -r '."oci-cli-user"' < oci-creds.json | base64 -d)
    OCI_CLI_FINGERPRINT_EPH=$(jq -r '."oci-cli-fingerprint"' < oci-creds.json | base64 -d)
    OCI_CLI_TENANCY_EPH=$(jq -r '."oci-cli-tenancy"' < oci-creds.json | base64 -d)


    export EXTRA_DEPLOY_ARGS="--set-parameter rbac/MIN_REPLICAS=1"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/AWS_ACCESS_KEY_ID_EPH=${AWS_ACCESS_KEY_ID_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/AWS_SECRET_ACCESS_KEY_EPH=${AWS_SECRET_ACCESS_KEY_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/GCP_CREDENTIALS_EPH=${GCP_CREDENTIALS_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CREDENTIALS_EPH=${OCI_CREDENTIALS_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_USER_EPH=${OCI_CLI_USER_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_FINGERPRINT_EPH=${OCI_CLI_FINGERPRINT_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_TENANCY_EPH=${OCI_CLI_TENANCY_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_TENANCY_EPH=${OCI_CLI_TENANCY_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_TENANCY_EPH=${OCI_CLI_TENANCY_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/OCI_CLI_TENANCY_EPH=${OCI_CLI_TENANCY_EPH}"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/WORKER_SUMMARY_MIN_REPLICAS=1"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/WORKER_PRIORITY_MIN_REPLICAS=1"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/WORKER_DOWNLOAD_MIN_REPLICAS=1"
        EXTRA_DEPLOY_ARGS+=" --set-parameter koku/LISTENER_MIN_REPLICAS=1"


    export REF_ENV= "insights-production"
    export OPTIONAL_DEPS_METHOD= "hybrid"

    bonfire deploy \
        ${APP_NAME} \
        --source=appsre \
        --ref-env ${REF_ENV} \
        --set-template-ref ${COMPONENT_NAME}=${GIT_COMMIT} \
        --set-image-tag ${IMAGE}=${IMAGE_TAG} \
        --namespace ${NAMESPACE} \
        --timeout ${DEPLOY_TIMEOUT} \
        --optional-deps-method ${OPTIONAL_DEPS_METHOD} \
        --frontends ${DEPLOY_FRONTENDS} \
        ${COMPONENTS_ARG} \
        ${COMPONENTS_RESOURCES_ARG} \
        ${EXTRA_DEPLOY_ARGS}


    # We need to override component to deployt iqe pod
    export COMPONENT_NAME="koku"
    source "$CICD_ROOT"/cji_smoke_test.sh


    source "$CICD_ROOT"/post_test_results.sh



else
    echo "PR_check is not running smokes"

fi





