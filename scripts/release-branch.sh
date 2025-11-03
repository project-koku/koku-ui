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

  STAGE_HCM_BRANCH="stage-hcm"
  STAGE_ROS_BRANCH="stage-ros"

  PROD_HCM_BRANCH="prod-hcm"
  PROD_ROS_BRANCH="prod-ros"

  UI_DIR="$TMP_DIR/koku-ui"
  UI_REPO="git@github.com:project-koku/koku-ui.git"

  BODY_FILE="$UI_DIR/body"
}

usage()
{
cat <<- EEOOFF

    This script will merge the following branches and create a pull request (default) or push upstream

    $STAGE_HCM_BRANCH is merged from $MAIN_BRANCH
    $STAGE_ROS_BRANCH is merged from $MAIN_BRANCH

    $PROD_HCM_BRANCH is merged from $STAGE_HCM_BRANCH
    $PROD_ROS_BRANCH is merged from $STAGE_ROS_BRANCH

    sh [-x] $SCRIPT [-h|u] -<o|p|r|s>

    OPTIONS:
    h       Display this message
    s       Merge $MAIN_BRANCH to $STAGE_HCM_BRANCH
    r       Merge $MAIN_BRANCH to $STAGE_ROS_BRANCH
    p       Merge $STAGE_HCM_BRANCH to $PROD_HCM_BRANCH
    o       Merge $STAGE_ROS_BRANCH to $PROD_ROS_BRANCH
    u       Push to upstream

EEOOFF
}

clone()
{
  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $UI_REPO
}

createPullRequestBody()
{
cat <<- EEOOFF > $BODY_FILE
Merged $REMOTE_BRANCH branch to $BRANCH.

Use latest commit to update namespace \`ref\` in app-interface repo. Don't use merge commit, SHAs must be unique when images are created for each branch.
EEOOFF
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
  NEW_BRANCH="release_${BRANCH}.$$"

  git branch -m $NEW_BRANCH

  echo "\n*** Pushing $NEW_BRANCH..."
  git push -u origin HEAD

  TITLE="Deployment commit for $BRANCH"
  BODY=`cat $BODY_FILE`

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

  while getopts hoprsu c; do
    case $c in
      o) BRANCH=$PROD_ROS_BRANCH
         REMOTE_BRANCH=$STAGE_ROS_BRANCH;;
      p) BRANCH=$PROD_HCM_BRANCH
         REMOTE_BRANCH=$STAGE_HCM_BRANCH;;
      r) BRANCH=$STAGE_ROS_BRANCH
         REMOTE_BRANCH=$MAIN_BRANCH;;
      s) BRANCH=$STAGE_HCM_BRANCH
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
      createPullRequestBody
      pullRequest
    fi
  else
    echo "\n*** Cannot not push. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
