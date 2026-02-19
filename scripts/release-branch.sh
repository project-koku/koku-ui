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

  GIT_USER="koku-ui-bot"
  GIT_USER_EMAIL="$GIT_USER@redhat.com"
  GIT_USER_NAME="Koku UI bot"
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

    Note: This script does not support on-prem.

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

  echo "\n*** Switching GitHub user: $GIT_USER"

  if ! gh auth status | grep -q "$GIT_USER"; then
    echo "*** Cannot switch GitHub user: $GIT_USER"
    echo "*** You may need to create an SSH key and run 'gh auth login'"
    return
  fi

  ACTIVE_GH_USER=`gh api user --jq .login`
  gh auth switch --user $GIT_USER

  echo "\n*** Configuring GIT user: $GIT_USER_EMAIL"
  git config --local user.email "$GIT_USER_EMAIL"
  git config --local user.name "$GIT_USER_NAME"
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

  trap cleanup SIGINT SIGTERM EXIT

  echo "\n*** Merging $KOKU_UI $SOURCE_BRANCH to $TARGET_BRANCH...\n"

  clone
  config
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
}
