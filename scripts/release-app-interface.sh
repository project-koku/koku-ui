#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`
  TMP_DIR="/tmp/$SCRIPT.$$"

  GITLAB_USER=${GITLAB_USER:-`whoami`}
  MAIN_BRANCH="main"
  HCCM_BRANCH="release-hccm"
  ROS_BRANCH="release-ros"
  TARGET_BRANCH="master"
  TARGET_PROJECT="service/app-interface"

  APP_INTERFACE="app-interface"
  APP_INTERFACE_DIR="$TMP_DIR/$APP_INTERFACE"
  APP_INTERFACE_REPO="git@gitlab.cee.redhat.com:service/app-interface.git"
  APP_INTERFACE_FORK="git@gitlab.cee.redhat.com:$GITLAB_USER/app-interface.git"
  KOKU_UI_DIR="$TMP_DIR/koku-ui"
  KOKU_UI_REPO="git@github.com:project-koku/koku-ui.git"

  KOKU_UI_HCCM=koku-ui-hccm
  KOKU_UI_ROS=koku-ui-ros

  PROD_FRONTENDS=/services/insights/frontend-operator/namespaces/prod-frontends.yml
  PROD_MULTICLUSTER_FRONTENDS=/services/insights/frontend-operator/namespaces/prod-multicluster-frontends.yml
  STAGE_FRONTENDS=/services/insights/frontend-operator/namespaces/stage-frontends.yml
  STAGE_MULTICLUSTER_FRONTENDS=/services/insights/frontend-operator/namespaces/stage-multicluster-frontends.yml

  DESC_FILE="$TMP_DIR/desc"
  DEPLOY_CLOWDER_FILE="$APP_INTERFACE_DIR/data/services/insights/hccm/deploy-clowder.yml"
  DEPLOYMENTS_FILE="$TMP_DIR/deployments"
}

usage()
{
cat <<- EEOOFF

    This script will deploy app-interface with the latest SHA refs from the koku-ui branches below. Then, it will
    either create an merge request (default) or push to the origin without an MR. It's assumed SSH keys are in use.

    $HCCM_BRANCH
    $ROS_BRANCH

    sh [-x] $SCRIPT [-h|-p|-r|-s|-t]

    OPTIONS:
    h       Display this message

    p       Deploy SHA refs from $HCCM_BRANCH to app-interface stage
    r       Deploy SHA refs from $ROS_BRANCH to app-interface stage

    s       Deploy SHA refs from $HCCM_BRANCH to app-interface prod
    t       Deploy SHA refs from $ROS_BRANCH to app-interface prod

    Note: This script does not support on-prem for app-interface deployments.

    This script lacks permission to push directly upstream, so commits will be pushed to this fork:
    $APP_INTERFACE_FORK -- override user via the GITLAB_USER env var.

EEOOFF
}

cleanup()
{
  echo "\n*** Cleaning temp directory..."
  rm -rf $TMP_DIR
}

cloneAppInterface()
{
  mkdir -p $TMP_DIR
  cd $TMP_DIR

  if [ ! -d "$APP_INTERFACE_DIR" ]; then
    git clone $APP_INTERFACE_REPO
  fi
}

cloneKokuUI()
{
  mkdir -p $TMP_DIR
  cd $TMP_DIR

  if [ ! -d "$KOKU_UI_DIR" ]; then
    git clone $KOKU_UI_REPO
  fi
}

commit()
{
  SOURCE_BRANCH="cost-management_deploy.$$"
  TITLE="Update Cost Management UI deployments"

  cd $APP_INTERFACE_DIR

  git remote rename origin upstream
  git remote add origin $APP_INTERFACE_FORK

  git branch -m $SOURCE_BRANCH
  git commit -m "$TITLE" $DEPLOY_CLOWDER_FILE
}

createDeploymentDesc()
{
  mkdir -p $TMP_DIR

  {
    if [ "$DEPLOY_HCCM_STAGE" = "true" ]; then
      echo "${KOKU_UI_HCCM}: Stage deployment"
    fi
    if [ "$DEPLOY_ROS_STAGE" = "true" ]; then
      echo "${KOKU_UI_ROS}: Stage deployment"
    fi

    if [ "$DEPLOY_HCCM_PROD" = "true" ]; then
      echo "${KOKU_UI_HCCM}: Prod deployment"
    fi
    if [ "$DEPLOY_ROS_PROD" = "true" ]; then
      echo "${KOKU_UI_ROS}: Prod deployment"
    fi
  } > "$DEPLOYMENTS_FILE"

  DEPLOYMENTS=`cat $DEPLOYMENTS_FILE`
}

createMergeRequestDesc()
{
cat <<- EEOOFF > $DESC_FILE
<b>What:</b>
Update Cost Management UI deployments to latest commit

Updated deployments:
$DEPLOYMENTS

<b>Why:</b>
To promote new features, latest bug fixes, and dependency updates

<b>Tickets:</b>
N/A

<b>Validation:</b>
QE has verified all queued issues
EEOOFF
}

# Tag the prod SHA in koku-ui (does not tag stage deploys).
# Triggers .github/workflows/tag_release.yml via workflow_dispatch.
# HCCM and ROS can be tagged independently or together.
tagProdReleases()
{
  cd $KOKU_UI_DIR

  if [ "$DEPLOY_HCCM_PROD" = true ]; then
    echo "\n*** Tagging prod release for $KOKU_UI_HCCM at $HCCM_SHA..."
    gh workflow run tag_release.yml -f commit="$HCCM_SHA" -f app="$KOKU_UI_HCCM"
    echo "Dispatched Tag Release. Check status: https://github.com/project-koku/koku-ui/actions/workflows/tag_release.yml"
  fi

  if [ "$DEPLOY_ROS_PROD" = true ]; then
    echo "\n*** Tagging prod release for $KOKU_UI_ROS at $ROS_SHA..."
    gh workflow run tag_release.yml -f commit="$ROS_SHA" -f app="$KOKU_UI_ROS"
    echo "Dispatched Tag Release. Check status: https://github.com/project-koku/koku-ui/actions/workflows/tag_release.yml"
  fi
}

# Use gh in a non-interactive way -- see https://github.com/cli/cli/issues/1718
mergeRequest()
{
  DESC=`sed -e ':a' -e 'N' -e '$!ba' -e 's|\n|<br/>|g' $DESC_FILE`

  echo "\n*** Pushing $SOURCE_BRANCH..."

  git push \
    -o merge_request.create \
    -o merge_request.title="$TITLE" \
    -o merge_request.description="$DESC" \
    -o merge_request.target_project=$TARGET_PROJECT \
    -o merge_request.target=$TARGET_BRANCH origin $SOURCE_BRANCH
}

push()
{
  echo ""
  read -p "*** You are pushing to the $SOURCE_BRANCH branch. Continue?" YN

  case $YN in
    [Yy]* ) echo "\n*** Pushing $SOURCE_BRANCH..."; git push -u origin $SOURCE_BRANCH;;
    [Nn]* ) exit 0;;
    * ) echo "Please answer yes or no."; push;;
  esac
}

# Get SHA for given namespace ref
#
# Note that the deply-clowder.yml file may contain multiple namespace refs. However, koku-ui-hccm should be defined
# before koku-ui-ros
#
# $1: Which SHA to return; koku-ui-hccm or koku-ui-ros
# $2: The namespace ref
#
getAppInterfaceSHA()
{
  RESULT=
  SHA=
  NAMESPACE_REFS=`grep -n "\$ref: $2" $DEPLOY_CLOWDER_FILE | sed 's| ||g'`

  for NAMESPACE_REF in `echo "$NAMESPACE_REFS"`
  do
    NAMESPACE_LINE=`echo $NAMESPACE_REF | awk -F: '{print $1}'`
    COMMIT_LINE=`echo "$NAMESPACE_LINE + 1" | bc`
    COMMIT_REF=`head -n $COMMIT_LINE $DEPLOY_CLOWDER_FILE | tail -n 1 | sed 's| ||g'`
    SHA="$SHA `echo $COMMIT_REF | awk -F: '{print $2}'`"
  done

  if [ $1 = $KOKU_UI_HCCM ]; then
    RESULT=`echo "$SHA" | awk -F' ' '{print $1}' | sed 's| ||g'`
  elif [ $1 = $KOKU_UI_ROS ]; then
    RESULT=`echo "$SHA" | awk -F' ' '{print $2}' | sed 's| ||g'`
  fi
}

initAppInterfaceSHA()
{
  getAppInterfaceSHA $KOKU_UI_HCCM $STAGE_FRONTENDS
  HCCM_STAGE_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_HCCM $STAGE_MULTICLUSTER_FRONTENDS
  HCCM_STAGE_MULTICLUSTER_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_HCCM $PROD_FRONTENDS
  HCCM_PROD_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_HCCM $PROD_MULTICLUSTER_FRONTENDS
  HCCM_PROD_MULTICLUSTER_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $STAGE_FRONTENDS
  ROS_STAGE_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $STAGE_MULTICLUSTER_FRONTENDS
  ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $PROD_FRONTENDS
  ROS_PROD_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $PROD_MULTICLUSTER_FRONTENDS
  ROS_PROD_MULTICLUSTER_FRONTENDS_SHA="$RESULT"

  echo "Existing SHA refs..."
  echo "koku-ui-hccm stage: $HCCM_STAGE_FRONTENDS_SHA"
  echo "koku-ui-hccm stage multicluster: $HCCM_STAGE_MULTICLUSTER_FRONTENDS_SHA"
  echo "koku-ui-hccm prod: $HCCM_PROD_FRONTENDS_SHA"
  echo "koku-ui-hccm prod multicluster: $HCCM_PROD_MULTICLUSTER_FRONTENDS_SHA"
  echo "koku-ui-ros stage: $ROS_STAGE_FRONTENDS_SHA"
  echo "koku-ui-ros stage multicluster: $ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA"
  echo "koku-ui-ros prod: $ROS_PROD_FRONTENDS_SHA"
  echo "koku-ui-ros prod multicluster: $ROS_PROD_MULTICLUSTER_FRONTENDS_SHA"
}

initKokuUISHA()
{
  cd $KOKU_UI_DIR

  HCCM_SHA=`git rev-parse origin/$HCCM_BRANCH`
  ROS_SHA=`git rev-parse origin/$ROS_BRANCH`

  echo "Latest SHA refs..."
  echo "koku-ui-hccm ($HCCM_BRANCH): $HCCM_SHA"
  echo "koku-ui-ros ($ROS_BRANCH): $ROS_SHA"
}

# Replace the commit SHA only on the target whose namespace $ref matches.
# Stage and prod can share the same SHA after consolidating to a single
# release branch, so we must not gsub across the whole resource block.
#
# $1: resource name (koku-ui-hccm or koku-ui-ros)
# $2: namespace $ref path
# $3: new SHA
replaceSHA()
{
  RESOURCE="$1"
  NAMESPACE="$2"
  NEW_SHA="$3"

  if [ -z "$NEW_SHA" ] || [ "$NEW_SHA" = "$MAIN_BRANCH" ]; then
    return
  fi

  awk -v resource="$RESOURCE" -v ns="$NAMESPACE" -v new="$NEW_SHA" '
    /^[[:space:]]*- name:[[:space:]]+/ {
      in_block = ($0 ~ ("name:[[:space:]]*" resource "([[:space:]]|$)"))
      match_ns = 0
      print
      next
    }
    in_block && index($0, "$ref: " ns) {
      match_ns = 1
      print
      next
    }
    in_block && match_ns && $0 ~ /^[[:space:]]*ref:[[:space:]]/ {
      sub(/ref:[[:space:]].*/, "ref: " new)
      match_ns = 0
      print
      next
    }
    { print }
  ' "$DEPLOY_CLOWDER_FILE" > "${DEPLOY_CLOWDER_FILE}.tmp"
  mv "${DEPLOY_CLOWDER_FILE}.tmp" "$DEPLOY_CLOWDER_FILE"
}

updateDeploySHA()
{
  # koku-ui-hccm stage deploy
  if [ "$DEPLOY_HCCM_STAGE" = true ]; then
    replaceSHA "$KOKU_UI_HCCM" "$STAGE_FRONTENDS" "$HCCM_SHA"
    replaceSHA "$KOKU_UI_HCCM" "$STAGE_MULTICLUSTER_FRONTENDS" "$HCCM_SHA"
  fi

  # koku-ui-hccm prod deploy
  if [ "$DEPLOY_HCCM_PROD" = true ]; then
    replaceSHA "$KOKU_UI_HCCM" "$PROD_FRONTENDS" "$HCCM_SHA"
    replaceSHA "$KOKU_UI_HCCM" "$PROD_MULTICLUSTER_FRONTENDS" "$HCCM_SHA"
  fi

  # koku-ui-ros stage deploy
  if [ "$DEPLOY_ROS_STAGE" = true ]; then
    replaceSHA "$KOKU_UI_ROS" "$STAGE_FRONTENDS" "$ROS_SHA"
    replaceSHA "$KOKU_UI_ROS" "$STAGE_MULTICLUSTER_FRONTENDS" "$ROS_SHA"
  fi

  # koku-ui-ros prod deploy
  if [ "$DEPLOY_ROS_PROD" = true ]; then
    replaceSHA "$KOKU_UI_ROS" "$PROD_FRONTENDS" "$ROS_SHA"
    replaceSHA "$KOKU_UI_ROS" "$PROD_MULTICLUSTER_FRONTENDS" "$ROS_SHA"
  fi
}

# main()
{
  default

  while getopts hprst c; do
    case $c in
      p) DEPLOY_HCCM_STAGE=true;;
      r) DEPLOY_ROS_STAGE=true;;
      s) DEPLOY_HCCM_PROD=true;;
      t) DEPLOY_ROS_PROD=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$DEPLOY_HCCM_STAGE" -a -z "$DEPLOY_HCCM_PROD" -a -z "$DEPLOY_ROS_STAGE" -a -z "$DEPLOY_ROS_PROD" ]; then
    usage
    exit 1
  fi

  trap cleanup SIGINT SIGTERM EXIT

  echo "\n*** Deploying $APP_INTERFACE with SHA updates for...\n"
  createDeploymentDesc
  cat $DEPLOYMENTS_FILE
  echo

  cloneAppInterface
  cloneKokuUI

  initAppInterfaceSHA
  initKokuUISHA

  updateDeploySHA
  commit

  if [ "$?" -eq 0 ]; then
    createMergeRequestDesc
    mergeRequest
    tagProdReleases
  else
    echo "\n*** Cannot push. No changes or check for conflicts"
  fi
}
