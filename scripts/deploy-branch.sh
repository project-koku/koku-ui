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
  HCCM_STAGE_BRANCH="stage-hccm"
  HCCM_PROD_BRANCH="prod-hccm"
  ROS_STAGE_BRANCH="stage-ros"
  ROS_PROD_BRANCH="prod-ros"
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

    $HCCM_STAGE_BRANCH
    $HCCM_PROD_BRANCH

    $ROS_PROD_BRANCH
    $ROS_STAGE_BRANCH

    sh [-x] $SCRIPT [-h|-p|-q|-r|-s]

    OPTIONS:
    h       Display this message
    s       Deploy SHA refs from $HCCM_STAGE_BRANCH to $TARGET_BRANCH
    p       Deploy SHA refs from $HCCM_PROD_BRANCH to $TARGET_BRANCH
    q       Deploy SHA refs from $ROS_STAGE_BRANCH to $TARGET_BRANCH
    r       Deploy SHA refs from $ROS_PROD_BRANCH to $TARGET_BRANCH

    Note: This script lacks permission to push directly upstream, so commits will be pushed to this fork:
    $APP_INTERFACE_FORK -- override user via the GITLAB_USER env var.

EEOOFF
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
    if [ "$DEPLOY_HCCM_PROD" = "true" ]; then
      echo "${KOKU_UI_HCCM}: Prod deployment"
    fi
    if [ "$DEPLOY_ROS_STAGE" = "true" ]; then
      echo "${KOKU_UI_ROS}: Stage deployment"
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

  getAppInterfaceSHA $KOKU_UI_ROS $STAGE_FRONTENDS
  ROS_STAGE_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $STAGE_MULTICLUSTER_FRONTENDS
  ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA="$RESULT"

  getAppInterfaceSHA $KOKU_UI_ROS $PROD_FRONTENDS
  ROS_PROD_FRONTENDS_SHA="$RESULT"

  echo "Existing SHA refs..."
  echo "koku-ui-hccm stage: $HCCM_STAGE_FRONTENDS_SHA"
  echo "koku-ui-hccm stage multicluster: $HCCM_STAGE_MULTICLUSTER_FRONTENDS_SHA"
  echo "koku-ui-hccm prod: $HCCM_PROD_FRONTENDS_SHA"
  echo "koku-ui-ros stage: $ROS_STAGE_FRONTENDS_SHA"
  echo "koku-ui-ros stage multicluster: $ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA"
  echo "koku-ui-ros prod: $ROS_PROD_FRONTENDS_SHA"
}

initKokuUISHA()
{
  cd $KOKU_UI_DIR

  HCCM_STAGE_SHA=`git rev-parse origin/$HCCM_STAGE_BRANCH`
  HCCM_PROD_SHA=`git rev-parse origin/$HCCM_PROD_BRANCH`
  ROS_STAGE_SHA=`git rev-parse origin/$ROS_STAGE_BRANCH`
  ROS_PROD_SHA=`git rev-parse origin/$ROS_PROD_BRANCH`

  echo "Latest SHA refs..."
  echo "koku-ui-hccm stage: $HCCM_STAGE_SHA"
  echo "koku-ui-hccm prod: $HCCM_PROD_SHA"
  echo "koku-ui-ros stage: $ROS_STAGE_SHA"
  echo "koku-ui-ros prod: $ROS_PROD_SHA"
}

updateDeploySHA()
{
  # koku-ui-hccm stage deploy
  if [ "$DEPLOY_HCCM_STAGE" = true ]; then
    if [ "$HCCM_STAGE_FRONTENDS_SHA" != "$MAIN_BRANCH" ]; then
      sed "s|$HCCM_STAGE_FRONTENDS_SHA|$HCCM_STAGE_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
    fi
    if [ "$HCCM_STAGE_MULTICLUSTER_FRONTENDS_SHA" != "$MAIN_BRANCH" ]; then
      sed "s|$HCCM_STAGE_MULTICLUSTER_FRONTENDS_SHA|$HCCM_STAGE_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
    fi
  fi

  # koku-ui-hccm prod deploy
  if [ "$DEPLOY_HCCM_PROD" = true ]; then
      sed "s|$HCCM_PROD_FRONTENDS_SHA|$HCCM_PROD_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
  fi

  # koku-ui-ros stage deploy
  if [ "$DEPLOY_ROS_STAGE" = true ]; then
    if [ "$ROS_STAGE_FRONTENDS_SHA" != "$MAIN_BRANCH" ]; then
      sed "s|$ROS_STAGE_FRONTENDS_SHA|$ROS_STAGE_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
    fi
    if [ "$ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA" != "$MAIN_BRANCH" ]; then
      sed "s|$ROS_STAGE_MULTICLUSTER_FRONTENDS_SHA|$ROS_STAGE_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
    fi
  fi

  # koku-ui-ros prod deploy
  if [ "$DEPLOY_ROS_PROD" = true ]; then
      sed "s|$ROS_PROD_FRONTENDS_SHA|$ROS_PROD_SHA|" $DEPLOY_CLOWDER_FILE > ${DEPLOY_CLOWDER_FILE}.tmp
      mv ${DEPLOY_CLOWDER_FILE}.tmp $DEPLOY_CLOWDER_FILE
  fi
}

# main()
{
  default

  while getopts hpqrs c; do
    case $c in
      s) DEPLOY_HCCM_STAGE=true;;
      p) DEPLOY_HCCM_PROD=true;;
      q) DEPLOY_ROS_STAGE=true;;
      r) DEPLOY_ROS_PROD=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$DEPLOY_HCCM_STAGE" -a -z "$DEPLOY_HCCM_PROD" -a -z "$DEPLOY_ROS_STAGE" -a -z "$DEPLOY_ROS_PROD" ]; then
    usage
    exit 1
  fi

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
  else
    echo "\n*** Cannot push. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
