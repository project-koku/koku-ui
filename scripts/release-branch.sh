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
  PROD_BETA_BRANCH="prod-beta"
  PROD_STABLE_BRANCH="prod-stable"
  STAGE_STABLE_BRANCH="stage-stable"

  UI_DIR="$TMP_DIR/hybrid-committed-spend-ui"
  UI_REPO="git@github.com:RedHatInsights/hybrid-committed-spend-ui.git"
}

usage()
{
cat <<- EEOOFF

    This script will merge the following branches and create a pull request (default) or push upstream

    stage-stage is merged from stage-beta
    prod-beta is merged from stage-stable
    prod-stable is merged from prod-beta

    sh [-x] $SCRIPT [-h|u] -<b|p|s>

    OPTIONS:
    h       Display this message
    b       Prod beta
    p       Prod stable
    s       Stage stable
    u       Push to upstream

EEOOFF
}

clone()
{
  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $UI_REPO
}


merge()
{
  cd $UI_DIR

  echo "\n*** Checkout $BRANCH"
  git checkout $BRANCH

  echo "\n*** Fetch origin $REMOTE_BRANCH"
  git fetch origin $REMOTE_BRANCH

  echo "\n*** Merge origin/$REMOTE_BRANCH"
  git merge origin/$REMOTE_BRANCH --commit --no-edit --no-ff
}

# Use gh in a non-interactive way -- see https://github.com/cli/cli/issues/1718
pullRequest()
{
  NEW_BRANCH="release/${BRANCH}.$$"

  git branch -m $NEW_BRANCH

  echo "\n*** Pushing $NEW_BRANCH..."
  git push -u origin HEAD

  COMMIT=`git rev-parse HEAD`
  TITLE="Deployment commit for $BRANCH"
  BODY="Merged $REMOTE_BRANCH branch to $BRANCH. Use commit $COMMIT to update namespace \`ref\` in app-interface repo"

  gh pr create -t "$TITLE" -b "$BODY" -B $BRANCH
}

push()
{
  echo ""
  read -p "*** You are pushing to the $BRANCH branch. Continue?" YN

  case $YN in
    [Yy]* ) echo "\n*** Pushing $BRANCH..."; git push -u origin $BRANCH;;
    [Nn]* ) exit 0;;
    * ) echo "Please answer yes or no."; push;;
  esac
}

# main()
{
  default

  while getopts hbpsu c; do
    case $c in
      b) BRANCH=$PROD_BETA_BRANCH
         REMOTE_BRANCH=$STAGE_STABLE_BRANCH;;
      p) BRANCH=$PROD_STABLE_BRANCH
         REMOTE_BRANCH=$PROD_BETA_BRANCH;;
      s) BRANCH=$STAGE_STABLE_BRANCH
         REMOTE_BRANCH=$MAIN_BRANCH;;
      u) PUSH=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$BRANCH" ]; then
    usage
    exit 1
  fi

  echo "\n*** Releasing $REMOTE_BRANCH to $BRANCH...\n"

  clone
  merge

  if [ "$?" -eq 0 ]; then
    if [ -n "$PUSH" ]; then
      push
    else
      pullRequest
    fi
  else
    echo "\n*** Cannot not push. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
