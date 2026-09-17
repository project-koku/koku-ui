#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`
  TMP_DIR="/tmp/$SCRIPT.$$"

  MAIN_BRANCH="main"
  ONPREM_BRANCH="release-onprem"

  HCCM_APP="apps/koku-ui-hccm"
  ROS_APP="apps/koku-ui-ros"

  KOKU_UI=koku-ui
  KOKU_UI_DIR="$TMP_DIR/$KOKU_UI"
  KOKU_UI_REPO="git@github.com:project-koku/koku-ui.git"

  BODY_FILE="$KOKU_UI_DIR/body"
  MSG_FILE="$KOKU_UI_DIR/commitmsg"

  GIT_USER="koku-ui-bot"
  GIT_USER_EMAIL="$GIT_USER@redhat.com"
  GIT_USER_NAME="Koku UI bot"
}

usage()
{
cat <<- EEOOFF

    This script assembles $ONPREM_BRANCH so in-progress HCCM and ROS product work
    cannot slip into an on-prem image.

      - On-prem shell (host, RBAC, sources, libs, lockfile, Containerfile) from $MAIN_BRANCH
      - $HCCM_APP from the latest HCCM prod tag (except on-prem webpack glue)
      - $ROS_APP from the latest ROS prod tag (except on-prem webpack glue)

    Prod-ready SHAs are the latest r.YYYY.MM.DD.N-hccm and r.YYYY.MM.DD.N-ros tags
    (created when those apps are deployed to app-interface prod). Each tag is a merge
    commit on a release branch; the script peels it to the $MAIN_BRANCH commit that was
    shipped.

    On-prem-only fixes on $MAIN_BRANCH do not wait on an HCCM or ROS SaaS release.
    HCCM and ROS product fixes still wait on that app's prod tag.

    sh [-x] $SCRIPT [-h|-n|-u]

    OPTIONS:
    h       Display this message
    n       Print pins and omitted in-progress UI diffs, then exit without creating a PR
    u       Push to upstream without a PR

EEOOFF
}

cleanup()
{
  echo "\n*** Cleaning temp directory..."
  rm -rf $TMP_DIR

  if [ -n "$ACTIVE_GH_USER" ]; then
    echo "\n*** Switching GitHub user: $ACTIVE_GH_USER"
    gh auth switch --user $ACTIVE_GH_USER
  fi
}

clone()
{
  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $KOKU_UI_REPO
}

config()
{
  cd $KOKU_UI_DIR

  echo "\n*** Set local GIT config: $GIT_USER_EMAIL"
  git config --local user.email "$GIT_USER_EMAIL"
  git config --local user.name "$GIT_USER_NAME"

  if [ -n "$DRY_RUN" ]; then
    return
  fi

  # Use preferred GitHub user to create PR, otherwise default GIT config will do
  if ! gh auth status | grep -q "$GIT_USER"; then
    echo "*** Preferred $GIT_USER user not available, run 'gh auth login'"
  else
    ACTIVE_GH_USER=`gh api user --jq .login`

    echo "\n*** Switching GitHub user: $GIT_USER"
    gh auth switch --user $GIT_USER
  fi
}

# Latest annotated prod tag for an app suffix (hccm or ros).
#
# $1: app suffix
latestProdTag()
{
  RESULT=`git tag --list --sort=version:refname | grep -E "^r\.[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]+-${1}$" | tail -1`
}

# Walk merge commits until we reach a commit on origin/main. Prod tags point at
# GitHub merge commits on release-hccm / release-ros; the shipped content is the
# main SHA that was merged (typically the 2nd parent of the 2nd parent).
#
# $1: commit SHA (usually a prod tag)
peelToMain()
{
  RESULT=
  C="$1"
  TRIES=0

  while [ $TRIES -lt 20 ]
  do
    if git merge-base --is-ancestor "$C" origin/$MAIN_BRANCH; then
      RESULT="$C"
      return 0
    fi
    if git rev-parse -q --verify "${C}^2" >/dev/null; then
      C=`git rev-parse "${C}^2"`
    else
      echo "\n*** Cannot peel $1 to a commit on $MAIN_BRANCH"
      return 1
    fi
    TRIES=`expr $TRIES + 1`
  done

  echo "\n*** Cannot peel $1 to a commit on $MAIN_BRANCH (too many merges)"
  return 1
}

# $1: label
# $2: prod main SHA
# $3: app path
printAppPinDiff()
{
  echo ""
  echo "*** $1 UI on $MAIN_BRANCH not in prod (omitted from on-prem, except webpack glue):"
  git --no-pager diff --stat "$2" "origin/$MAIN_BRANCH" -- "$3" \
    ":!$3/webpack-onprem.config.ts" \
    ":!$3/tsconfig-onprem.json"
  if git diff --quiet "$2" "origin/$MAIN_BRANCH" -- "$3" \
    ":!$3/webpack-onprem.config.ts" \
    ":!$3/tsconfig-onprem.json"
  then
    echo "    (none — $3 on $MAIN_BRANCH matches prod)"
  fi
}

resolveProdShas()
{
  cd $KOKU_UI_DIR

  echo "\n*** Fetching $MAIN_BRANCH and prod tags..."
  git fetch origin $MAIN_BRANCH
  git fetch origin --tags --force

  MAIN_SHA=`git rev-parse origin/$MAIN_BRANCH`

  latestProdTag hccm
  HCCM_TAG="$RESULT"
  latestProdTag ros
  ROS_TAG="$RESULT"

  if [ -z "$HCCM_TAG" -o -z "$ROS_TAG" ]; then
    echo "\n*** Missing prod tags. Deploy HCCM and ROS to prod first (tag_release.yml)."
    echo "*** HCCM tag: ${HCCM_TAG:-not found}"
    echo "*** ROS tag: ${ROS_TAG:-not found}"
    return 1
  fi

  HCCM_TAG_SHA=`git rev-parse "${HCCM_TAG}^{commit}"`
  ROS_TAG_SHA=`git rev-parse "${ROS_TAG}^{commit}"`

  peelToMain "$HCCM_TAG_SHA" || return 1
  HCCM_MAIN_SHA="$RESULT"
  peelToMain "$ROS_TAG_SHA" || return 1
  ROS_MAIN_SHA="$RESULT"

  printSummary
}

printSummary()
{
  echo ""
  echo "*** Operational picture"
  echo ""
  echo "  $MAIN_BRANCH  ($MAIN_SHA)"
  echo "    │ on-prem shell (host, RBAC, sources, libs, lockfile)"
  echo "    │ + on-prem webpack glue in HCCM/ROS app dirs"
  echo "    ├─► release-hccm ──► stage ──► prod ──► $HCCM_TAG"
  echo "    │                                      pin $HCCM_APP"
  echo "    └─► release-ros  ──► stage ──► prod ──► $ROS_TAG"
  echo "                                           pin $ROS_APP"
  echo "                                              ▼"
  echo "                                     $ONPREM_BRANCH (Konflux)"
  echo ""
  echo "*** $MAIN_BRANCH SHA (on-prem shell): $MAIN_SHA"
  git --no-pager log -1 --oneline "$MAIN_SHA"
  echo "*** HCCM prod tag: $HCCM_TAG"
  echo "***   tag SHA:     $HCCM_TAG_SHA"
  echo "***   $MAIN_BRANCH SHA:    $HCCM_MAIN_SHA"
  echo "*** ROS prod tag:  $ROS_TAG"
  echo "***   tag SHA:     $ROS_TAG_SHA"
  echo "***   $MAIN_BRANCH SHA:    $ROS_MAIN_SHA"

  printAppPinDiff HCCM "$HCCM_MAIN_SHA" "$HCCM_APP"
  printAppPinDiff ROS "$ROS_MAIN_SHA" "$ROS_APP"
}

createPullRequestBody()
{
cat <<- EEOOFF > $BODY_FILE
Assemble \`$ONPREM_BRANCH\` from \`$MAIN_BRANCH\` with HCCM and ROS product UIs pinned to prod.

Do not squash — use a merge commit.

## Pins

| Source | SHA | Notes |
| --- | --- | --- |
| \`$MAIN_BRANCH\` (on-prem shell) | \`$MAIN_SHA\` | Host, RBAC, sources, libs, lockfile, Containerfile, on-prem webpack glue |
| HCCM UI (\`$HCCM_APP\`) | \`$HCCM_TAG\` → \`$HCCM_MAIN_SHA\` | Latest HCCM prod; in-progress HCCM on \`$MAIN_BRANCH\` is omitted |
| ROS UI (\`$ROS_APP\`) | \`$ROS_TAG\` → \`$ROS_MAIN_SHA\` | Latest ROS prod; in-progress ROS on \`$MAIN_BRANCH\` is omitted |

On-prem-only fixes on \`$MAIN_BRANCH\` do not wait on an HCCM or ROS SaaS release. HCCM or ROS product changes still wait on that app's prod tag. On-prem QE verifies the assembled image.
EEOOFF
}

createCommitMessage()
{
cat <<- EEOOFF > $MSG_FILE
Assemble $ONPREM_BRANCH from $MAIN_BRANCH with HCCM/ROS prod tags

On-prem shell: $MAIN_SHA
HCCM UI: $HCCM_TAG ($HCCM_MAIN_SHA)
ROS UI: $ROS_TAG ($ROS_MAIN_SHA)
EEOOFF
}

# Replace an app directory with the tree from a prod main SHA, then restore
# on-prem webpack glue from origin/main so those files can ship without a
# SaaS prod release.
#
# $1: app path
# $2: prod main SHA
pinAppFromProd()
{
  APP_PATH="$1"
  PROD_SHA="$2"

  echo "\n*** Pinning $APP_PATH to $PROD_SHA"
  git rm -rf --quiet "$APP_PATH"
  git checkout "$PROD_SHA" -- "$APP_PATH"
  git checkout "origin/$MAIN_BRANCH" -- \
    "$APP_PATH/webpack-onprem.config.ts" \
    "$APP_PATH/tsconfig-onprem.json"
}

# Assemble origin/main, then pin HCCM and ROS product UIs to their prod SHAs.
# A plain merge of main would keep in-progress HCCM/ROS files; overlaying the
# app dirs after the fact is what strips them.
promote()
{
  cd $KOKU_UI_DIR

  echo "\n*** Checkout $ONPREM_BRANCH"
  git checkout $ONPREM_BRANCH

  echo "\n*** Syncing tree to origin/$MAIN_BRANCH ($MAIN_SHA)"
  git read-tree -u --reset "origin/$MAIN_BRANCH"

  pinAppFromProd "$HCCM_APP" "$HCCM_MAIN_SHA"
  pinAppFromProd "$ROS_APP" "$ROS_MAIN_SHA"

  if git diff --cached --quiet; then
    echo "\n*** $ONPREM_BRANCH already matches the assembled tree"
    return 1
  fi

  createCommitMessage
  git commit -F "$MSG_FILE"
  return 0
}

# Use gh in a non-interactive way -- see https://github.com/cli/cli/issues/1718
pullRequest()
{
  NEW_BRANCH="merge_${ONPREM_BRANCH}.$$"

  git branch -m $NEW_BRANCH

  echo "\n*** Pushing $NEW_BRANCH..."
  git push -u origin HEAD

  TITLE="Assemble $ONPREM_BRANCH from $MAIN_BRANCH with HCCM/ROS prod tags"
  BODY=`cat $BODY_FILE`

  echo "\n*** Creating pull request..."
  PR_URL=`gh pr create -t "$TITLE" -b "$BODY" -B $ONPREM_BRANCH`

  echo "\n*** Enabling auto-merge with merge commit (not squash)..."
  gh pr merge --merge --auto "$PR_URL"

  echo "\n*** Pull request: $PR_URL"
}

push()
{
  NEW_BRANCH="merge_${ONPREM_BRANCH}.$$"

  git branch -m $NEW_BRANCH

  echo ""
  read -p "*** You are pushing to the $NEW_BRANCH branch. Continue?" YN

  case $YN in
    [Yy]* ) echo "\n*** Pushing $NEW_BRANCH..."; git push -u origin $NEW_BRANCH;;
    [Nn]* ) exit 0;;
    * ) echo "Please answer yes or no."; push;;
  esac
}

# main()
{
  default

  while getopts hnu c; do
    case $c in
      n) DRY_RUN=true;;
      u) PUSH=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  trap cleanup SIGINT SIGTERM EXIT

  echo "\n*** Assembling $KOKU_UI $ONPREM_BRANCH from $MAIN_BRANCH with HCCM/ROS prod tags...\n"

  clone
  config
  resolveProdShas || exit 1

  if [ -n "$DRY_RUN" ]; then
    echo "\n*** Dry run. No PR created."
    exit 0
  fi

  if promote; then
    createPullRequestBody
    if [ -n "$PUSH" ]; then
      push
    else
      pullRequest
    fi
  else
    echo "\n*** Cannot push. No changes or check for conflicts"
  fi
}
