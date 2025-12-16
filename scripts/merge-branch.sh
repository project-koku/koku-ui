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
  STAGE_HCCM_BRANCH="stage-hccm"
  STAGE_ROS_BRANCH="stage-ros"

  PROD_HCCM_BRANCH="prod-hccm"
  PROD_ROS_BRANCH="prod-ros"

  KOKU_UI=koku-ui
  KOKU_UI_DIR="$TMP_DIR/$KOKU_UI"
  KOKU_UI_REPO="git@github.com:project-koku/koku-ui.git"

  BODY_FILE="$KOKU_UI_DIR/body"
}

usage()
{
cat <<- EEOOFF

    This script will merge the following branches with the koku-ui and either create a pull request (default)
    or push to the origin without an PR. It's assumed SSH keys are in use.

    $STAGE_HCCM_BRANCH is merged from $MAIN_BRANCH
    $PROD_HCCM_BRANCH is merged from $STAGE_HCCM_BRANCH

    $STAGE_ROS_BRANCH is merged from $MAIN_BRANCH
    $PROD_ROS_BRANCH is merged from $STAGE_ROS_BRANCH

    sh [-x] $SCRIPT [-h|-p|-q|-r|-s|-u]

    OPTIONS:
    h       Display this message
    s       Merge $MAIN_BRANCH to $STAGE_HCCM_BRANCH
    p       Merge $STAGE_HCCM_BRANCH to $PROD_HCCM_BRANCH
    q       Merge $MAIN_BRANCH to $STAGE_ROS_BRANCH
    r       Merge $STAGE_ROS_BRANCH to $PROD_ROS_BRANCH
    u       Push to upstream

EEOOFF
}

clone()
{
  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $KOKU_UI_REPO
}

createPullRequestBody()
{
cat <<- EEOOFF > $BODY_FILE
Merged $SOURCE_BRANCH branch to $TARGET_BRANCH.

Use latest commit to update namespace \`ref\` in app-interface repo. Don't use merge commit, SHAs must be unique when images are created for each branch.
EEOOFF
}

merge()
{
  cd $KOKU_UI_DIR

  echo "\n*** Checkout $TARGET_BRANCH"
  git checkout $TARGET_BRANCH

  echo "\n*** Fetch origin $SOURCE_BRANCH"
  git fetch origin $SOURCE_BRANCH

  echo "\n*** Merge origin/$SOURCE_BRANCH"
  git merge origin/$SOURCE_BRANCH --commit --no-edit --no-ff
}

# Use gh in a non-interactive way -- see https://github.com/cli/cli/issues/1718
pullRequest()
{
  NEW_BRANCH="merge_${TARGET_BRANCH}.$$"

  git branch -m $NEW_BRANCH

  echo "\n*** Pushing $NEW_BRANCH..."
  git push -u origin HEAD

  TITLE="Deployment commit for $TARGET_BRANCH"
  BODY=`cat $BODY_FILE`

  gh pr create -t "$TITLE" -b "$BODY" -B $TARGET_BRANCH
}

push()
{
  NEW_BRANCH="merge_${TARGET_BRANCH}.$$"

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

  while getopts hpqrsu c; do
    case $c in
      s) TARGET_BRANCH=$STAGE_HCCM_BRANCH
         SOURCE_BRANCH=$MAIN_BRANCH;;
      p) TARGET_BRANCH=$PROD_HCCM_BRANCH
         SOURCE_BRANCH=$STAGE_HCCM_BRANCH;;
      q) TARGET_BRANCH=$STAGE_ROS_BRANCH
         SOURCE_BRANCH=$MAIN_BRANCH;;
      r) TARGET_BRANCH=$PROD_ROS_BRANCH
         SOURCE_BRANCH=$STAGE_ROS_BRANCH;;
      u) PUSH=true;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$TARGET_BRANCH" ]; then
    usage
    exit 1
  fi

  echo "\n*** Releasing $KOKU_UI $SOURCE_BRANCH to $TARGET_BRANCH...\n"

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
    echo "\n*** Cannot push. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
