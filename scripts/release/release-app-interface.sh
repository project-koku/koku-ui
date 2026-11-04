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
  HCCM_BRANCH="main"
  ROS_BRANCH="main"
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

  QUAY_ORG="redhat-services-prod/cost-mgmt-dev-tenant"
  QUAY_POLL_INTERVAL=30
  QUAY_WAIT_TIMEOUT=1200

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

    This script deploys app-interface with the SHA from each app's Quay latest image, then creates a merge request.
    SSH keys are assumed.

    Pushing to $MAIN_BRANCH builds images and updates stage. Prod (-s, -t) pins namespace refs to the full
    git SHA from that app's Quay latest OCI labels (org.opencontainers.image.revision / vcs-ref).
    If Quay labels are unavailable, the script asks whether to fall back to tip of $MAIN_BRANCH.
    If Quay lags tip of $MAIN_BRANCH or matches the current app-interface prod SHA, the script asks
    whether to continue, wait for a newer image (poll every ${QUAY_POLL_INTERVAL}s, timeout ${QUAY_WAIT_TIMEOUT}s),
    or abort.
    release:all deploys prod only. -p and -r remain so stage can be pinned by hand.

    $HCCM_BRANCH (HCCM)
    $ROS_BRANCH (ROS)

    sh [-x] $SCRIPT [-h|-p|-r|-s|-t|-u]

    OPTIONS:
    h       Display this message

    p       Deploy SHA refs for $KOKU_UI_HCCM to app-interface stage
    r       Deploy SHA refs for $KOKU_UI_ROS to app-interface stage

    s       Deploy SHA refs for $KOKU_UI_HCCM to app-interface prod
    t       Deploy SHA refs for $KOKU_UI_ROS to app-interface prod

    u       Update fork master to match upstream before pushing the deploy branch

    Note: Stage refs can stay on "$MAIN_BRANCH" for auto-deploy. This script does not support on-prem.

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
    echo ""
    git clone $APP_INTERFACE_REPO
  fi
}

cloneKokuUI()
{
  mkdir -p $TMP_DIR
  cd $TMP_DIR

  if [ ! -d "$KOKU_UI_DIR" ]; then
    echo ""
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

  if [ "$UPDATE_FORK_MASTER" = true ]; then
    updateForkMaster
  fi

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
      if [ -n "$HCCM_TAG" ]; then
        echo "${KOKU_UI_HCCM}: Prod deployment | <a href=https://github.com/project-koku/koku-ui/releases/tag/${HCCM_TAG} target="_blank">${HCCM_TAG}</a>"
      else
        echo "${KOKU_UI_HCCM}: Prod deployment"
      fi
    fi
    if [ "$DEPLOY_ROS_PROD" = "true" ]; then
      if [ -n "$ROS_TAG" ]; then
        echo "${KOKU_UI_ROS}: Prod deployment | <a href=https://github.com/project-koku/koku-ui/releases/tag/${ROS_TAG} target="_blank">${ROS_TAG}</a>"
      else
        echo "${KOKU_UI_ROS}: Prod deployment"
      fi
    fi
  } > "$DEPLOYMENTS_FILE"

  DEPLOYMENTS=`cat $DEPLOYMENTS_FILE`
}

createMergeRequestDesc()
{
  createDeploymentDesc

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

# Ask whether to use tip of the given branch when Quay cannot supply a SHA.
# Default is no (abort) so non-TTY / empty Enter does not pin an unverified SHA.
#
# $1: app name
# $2: branch name (e.g. main)
confirmMainFallback()
{
  APP="$1"
  BRANCH="$2"
  MAIN_TIP=`git rev-parse origin/$BRANCH`

  echo ""
  echo "*** Warning: Could not resolve a deployable SHA from Quay latest for ${APP}."
  echo "*** Tip of origin/${BRANCH} is ${MAIN_TIP}; that commit may not have an image yet."
  printf "Use tip of origin/%s for %s? [y/N] " "$BRANCH" "$APP"
  read REPLY || REPLY=
  case "$REPLY" in
    y|Y|yes|YES)
      RESULT="$MAIN_TIP"
      ;;
    *)
      echo "*** Aborting. Wait for Quay latest labels, then retry."
      exit 1
      ;;
  esac
}

# Warn when Quay lags main or matches existing app-interface prod; prompt continue/wait/abort.
# Sets RESULT to the SHA to deploy.
#
# $1: app name
# $2: branch name
# $3: Quay SHA
# $4: current app-interface prod frontends SHA (may be empty or "main")
# $5: current app-interface prod multicluster SHA (may be empty or "main")
confirmQuaySHA()
{
  APP="$1"
  BRANCH="$2"
  QUAY_SHA="$3"
  AI_SHA="$4"
  AI_MC_SHA="$5"
  MAIN_TIP=`git rev-parse origin/$BRANCH`

  BEHIND_MAIN=
  SAME_AS_AI=
  if [ "$QUAY_SHA" != "$MAIN_TIP" ]; then
    BEHIND_MAIN=true
  fi
  if [ -n "$AI_SHA" ] && [ "$AI_SHA" != "$MAIN_BRANCH" ] && [ "$QUAY_SHA" = "$AI_SHA" ]; then
    SAME_AS_AI=true
  fi
  if [ -n "$AI_MC_SHA" ] && [ "$AI_MC_SHA" != "$MAIN_BRANCH" ] && [ "$QUAY_SHA" = "$AI_MC_SHA" ]; then
    SAME_AS_AI=true
  fi

  if [ -z "$BEHIND_MAIN" ] && [ -z "$SAME_AS_AI" ]; then
    RESULT="$QUAY_SHA"
    return
  fi

  echo ""
  if [ "$BEHIND_MAIN" = true ]; then
    echo "*** Warning: Quay latest for ${APP} (${QUAY_SHA}) differs from tip of origin/${BRANCH} (${MAIN_TIP})."
    echo "*** A merge may still be building; the image for tip of ${BRANCH} may not be ready yet."
  fi
  if [ "$SAME_AS_AI" = true ]; then
    echo "*** Warning: Quay latest for ${APP} (${QUAY_SHA}) matches a current app-interface prod SHA."
    echo "*** Continuing would make no deployment change for that prod ref."
  fi

  printf "Continue with Quay SHA, wait for a newer image, or abort? [c/w/A] "
  read REPLY || REPLY=
  case "$REPLY" in
    c|C|continue|CONTINUE)
      RESULT="$QUAY_SHA"
      ;;
    w|W|wait|WAIT)
      if waitForQuayImage "$APP" "$BRANCH" "$QUAY_SHA"; then
        return
      fi
      getQuayLatestSHA "$APP"
      CURRENT_QUAY="$RESULT"
      [ -z "$CURRENT_QUAY" ] && CURRENT_QUAY="$QUAY_SHA"
      echo ""
      printf "Continue with current Quay SHA (%s)? [y/N] " "$CURRENT_QUAY"
      read REPLY || REPLY=
      case "$REPLY" in
        y|Y|yes|YES)
          RESULT="$CURRENT_QUAY"
          ;;
        *)
          echo "*** Aborting."
          exit 1
          ;;
      esac
      ;;
    *)
      echo "*** Aborting."
      exit 1
      ;;
  esac
}

# Tag created by tag_release.yml for the given SHA and app suffix, if it is new.
#
# $1: commit SHA
# $2: app suffix (hccm or ros)
# $3: tags that existed before the workflow ran
createdTag()
{
  RESULT=
  for TAG in `git tag --points-at "$1"`
  do
    echo "$TAG" | grep -Eq "^r\.[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]+-${2}$" || continue
    echo "$3" | grep -qx "$TAG" && continue
    RESULT="$TAG"
  done
  echo "$RESULT"
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

# Resolve full git SHA from Quay latest image config labels for the given app.
# Sets RESULT to the SHA on success, empty on failure. Requires jq.
#
# $1: app name (koku-ui-hccm or koku-ui-ros)
getQuayLatestSHA()
{
  RESULT=
  APP="$1"
  REPO="${QUAY_ORG}/${APP}"
  TAG_URL="https://quay.io/api/v1/repository/${REPO}/tag/?specificTag=latest&onlyActiveTags=true"

  DIGEST=`curl -fsSL "$TAG_URL" 2>/dev/null | jq -r '.tags[0].manifest_digest // empty'` || DIGEST=

  if [ -z "$DIGEST" ]; then
    return
  fi

  CFG=`curl -fsSL "https://quay.io/api/v1/repository/${REPO}/manifest/${DIGEST}" 2>/dev/null \
    | jq -r '.manifest_data | fromjson | .config.digest // empty'` || CFG=

  if [ -z "$CFG" ]; then
    return
  fi

  TOK=`curl -fsSL "https://quay.io/v2/auth?service=quay.io&scope=repository:${REPO}:pull" 2>/dev/null \
    | jq -r '.token // empty'` || TOK=

  if [ -z "$TOK" ]; then
    return
  fi

  SHA=`curl -fsSL \
    -H "Authorization: Bearer ${TOK}" \
    -H "Accept: application/vnd.docker.container.image.v1+json" \
    "https://quay.io/v2/${REPO}/blobs/${CFG}" 2>/dev/null \
    | jq -r '.config.Labels["org.opencontainers.image.revision"] // .config.Labels["vcs-ref"] // empty'` || SHA=

  if [ -z "$SHA" ]; then
    return
  fi

  case "$SHA" in
    *[!0-9a-f]*)
      echo "*** Warning: Quay label for ${APP} is not a lowercase hex SHA" >&2
      return
      ;;
  esac
  if [ "${#SHA}" -ne 40 ]; then
    echo "*** Warning: Quay label for ${APP} is not a full 40-character SHA" >&2
    return
  fi

  # Deploy registry tags short SHAs; confirm the short tag matches latest's digest.
  SHORT=`echo "$SHA" | cut -c1-7`
  SHORT_DIGEST=`curl -fsSL \
    "https://quay.io/api/v1/repository/${REPO}/tag/?specificTag=${SHORT}&onlyActiveTags=true" 2>/dev/null \
    | jq -r '.tags[0].manifest_digest // empty'` || SHORT_DIGEST=

  if [ -z "$SHORT_DIGEST" ] || [ "$SHORT_DIGEST" != "$DIGEST" ]; then
    echo "*** Warning: Quay short tag ${SHORT} missing or digest mismatch for ${APP}" >&2
    return
  fi

  RESULT="$SHA"
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

  echo "\nExisting SHA refs..."
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

  echo "\nResolving deploy SHA refs from Quay latest..."

  if [ "$DEPLOY_HCCM_STAGE" = true -o "$DEPLOY_HCCM_PROD" = true ]; then
    resolveAppSHA "$KOKU_UI_HCCM" "$HCCM_BRANCH" "$HCCM_PROD_FRONTENDS_SHA" "$HCCM_PROD_MULTICLUSTER_FRONTENDS_SHA"
    HCCM_SHA="$RESULT"
    echo "koku-ui-hccm: $HCCM_SHA"
  fi

  if [ "$DEPLOY_ROS_STAGE" = true -o "$DEPLOY_ROS_PROD" = true ]; then
    resolveAppSHA "$KOKU_UI_ROS" "$ROS_BRANCH" "$ROS_PROD_FRONTENDS_SHA" "$ROS_PROD_MULTICLUSTER_FRONTENDS_SHA"
    ROS_SHA="$RESULT"
    echo "koku-ui-ros: $ROS_SHA"
  fi
}

# Use gh in a non-interactive way -- see https://github.com/cli/cli/issues/1718
mergeRequest()
{
  cd $APP_INTERFACE_DIR

  createMergeRequestDesc

  DESC=`sed -e ':a' -e 'N' -e '$!ba' -e 's|\n|<br/>|g' $DESC_FILE`

  echo "\n*** Pushing $SOURCE_BRANCH..."

  git push \
    -o merge_request.create \
    -o merge_request.title="$TITLE" \
    -o merge_request.description="$DESC" \
    -o merge_request.target_project=$TARGET_PROJECT \
    -o merge_request.target=$TARGET_BRANCH origin $SOURCE_BRANCH
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

# Resolve SHA for one app: Quay latest preferred; prompt for tip-of-branch fallback.
#
# $1: app name
# $2: branch name used for fallback and ancestor check
# $3: current app-interface prod frontends SHA for continue/wait checks
# $4: current app-interface prod multicluster SHA for continue/wait checks
resolveAppSHA()
{
  APP="$1"
  BRANCH="$2"
  AI_SHA="$3"
  AI_MC_SHA="$4"
  RESULT=

  getQuayLatestSHA "$APP"
  if [ -n "$RESULT" ]; then
    if ! git merge-base --is-ancestor "$RESULT" "origin/$BRANCH" 2>/dev/null; then
      echo "*** Warning: Quay SHA $RESULT for ${APP} is not an ancestor of origin/${BRANCH}" >&2
    fi
    confirmQuaySHA "$APP" "$BRANCH" "$RESULT" "$AI_SHA" "$AI_MC_SHA"
    return
  fi

  confirmMainFallback "$APP" "$BRANCH"
}

# Tag the SHA in koku-ui (does not tag stage deploys).
# Triggers .github/workflows/tag_release.yml, then fetches the tags it created.
tagRelease()
{
  cd $KOKU_UI_DIR

  if [ "$DEPLOY_HCCM_PROD" != true -a "$DEPLOY_ROS_PROD" != true ]; then
    return
  fi

  git fetch origin --tags --force >/dev/null 2>&1
  EXISTING_TAGS=`git tag --list 'r.*'`

  if [ "$DEPLOY_HCCM_PROD" = true ]; then
    echo "\n*** Tagging prod release for $KOKU_UI_HCCM at $HCCM_SHA..."
    gh workflow run tag_release.yml -f commit="$HCCM_SHA" -f app="$KOKU_UI_HCCM"
  fi

  if [ "$DEPLOY_ROS_PROD" = true ]; then
    echo "\n*** Tagging prod release for $KOKU_UI_ROS at $ROS_SHA..."
    gh workflow run tag_release.yml -f commit="$ROS_SHA" -f app="$KOKU_UI_ROS"
  fi

  echo "\n*** Waiting for tags... https://github.com/project-koku/koku-ui/actions/workflows/tag_release.yml"

  TRIES=0
  while [ $TRIES -lt 24 ]
  do
    sleep 5
    git fetch origin --tags --force >/dev/null 2>&1
    [ "$DEPLOY_HCCM_PROD" = true ] && HCCM_TAG=`createdTag "$HCCM_SHA" hccm "$EXISTING_TAGS"`
    [ "$DEPLOY_ROS_PROD" = true ] && ROS_TAG=`createdTag "$ROS_SHA" ros "$EXISTING_TAGS"`
    if { [ "$DEPLOY_HCCM_PROD" != true ] || [ -n "$HCCM_TAG" ]; } && \
       { [ "$DEPLOY_ROS_PROD" != true ] || [ -n "$ROS_TAG" ]; }; then
      break
    fi
    TRIES=`expr $TRIES + 1`
  done

  [ "$DEPLOY_HCCM_PROD" = true ] && echo "*** $KOKU_UI_HCCM tag: ${HCCM_TAG:-not found}"
  [ "$DEPLOY_ROS_PROD" = true ] && echo "*** $KOKU_UI_ROS tag: ${ROS_TAG:-not found}"
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

# Push current upstream master to the fork. A large first-time pack can make
# GitLab reject merge_request.create with "Source branch does not exist".
updateForkMaster()
{
  cd $APP_INTERFACE_DIR

  echo "\n*** Updating fork master..."
  if git push origin HEAD:master; then
    echo "*** Fork master updated."
  else
    echo "*** Failed to update fork master. Update it in GitLab (Update fork), then retry."
  fi
}

# Poll Quay until latest differs from START_SHA and matches tip of BRANCH.
# Sets RESULT to the new SHA on success; empty RESULT and return 1 on timeout.
#
# $1: app name
# $2: branch name
# $3: Quay SHA when wait started
waitForQuayImage()
{
  APP="$1"
  BRANCH="$2"
  START_SHA="$3"
  ELAPSED=0

  echo ""
  echo "*** Waiting up to ${QUAY_WAIT_TIMEOUT}s for a newer Quay image matching origin/${BRANCH}..."
  echo "*** Polling every ${QUAY_POLL_INTERVAL}s (Konflux builds often take 10+ minutes)."

  while [ "$ELAPSED" -lt "$QUAY_WAIT_TIMEOUT" ]
  do
    sleep "$QUAY_POLL_INTERVAL"
    ELAPSED=`expr "$ELAPSED" + "$QUAY_POLL_INTERVAL"`

    git fetch origin "$BRANCH" >/dev/null 2>&1
    MAIN_TIP=`git rev-parse origin/$BRANCH`
    getQuayLatestSHA "$APP"
    QUAY_NOW="$RESULT"

    QUAY_SHORT=`echo "${QUAY_NOW:-unknown}" | cut -c1-7`
    MAIN_SHORT=`echo "$MAIN_TIP" | cut -c1-7`
    echo "*** [${ELAPSED}s/${QUAY_WAIT_TIMEOUT}s] Quay=${QUAY_SHORT} main=${MAIN_SHORT}"

    if [ -n "$QUAY_NOW" ] && [ "$QUAY_NOW" != "$START_SHA" ] && [ "$QUAY_NOW" = "$MAIN_TIP" ]; then
      echo "*** New image ready: $QUAY_NOW"
      RESULT="$QUAY_NOW"
      return 0
    fi
  done

  echo "*** Timed out after ${QUAY_WAIT_TIMEOUT}s waiting for Quay to catch origin/${BRANCH}."
  RESULT=
  return 1
}

# main()
{
  default

  while getopts hprstu c; do
    case $c in
      p) DEPLOY_HCCM_STAGE=true;;
      r) DEPLOY_ROS_STAGE=true;;
      s) DEPLOY_HCCM_PROD=true;;
      t) DEPLOY_ROS_PROD=true;;
      u) UPDATE_FORK_MASTER=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$DEPLOY_HCCM_STAGE" -a -z "$DEPLOY_HCCM_PROD" -a -z "$DEPLOY_ROS_STAGE" -a -z "$DEPLOY_ROS_PROD" ]; then
    usage
    exit 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    echo "*** Required command not found: jq"
    exit 1
  fi

  trap cleanup SIGINT SIGTERM EXIT

  echo "\n*** Deploying $APP_INTERFACE with SHA updates for...\n"
  createDeploymentDesc
  cat $DEPLOYMENTS_FILE

  cloneAppInterface
  cloneKokuUI

  initAppInterfaceSHA
  initKokuUISHA

  updateDeploySHA
  commit

  if [ "$?" -eq 0 ]; then
    tagRelease
    mergeRequest
  else
    echo "\n*** Cannot push. No changes or check for conflicts"
  fi
}
