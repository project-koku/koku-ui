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
  PROD_BRANCH="prod-stable"

  UI_DIR="$TMP_DIR/koku-ui"
  UI_REPO="git@github.com:project-koku/koku-ui.git"

  BODY_FILE="$UI_DIR/body"
}

usage()
{
cat <<- EEOOFF

    This script will merge the following branches and create a pull request (default) or push upstream

    sh [-x] $SCRIPT [-h|u] -<b|p|s>

    OPTIONS:
    h       Display this message
    p       Merge $MAIN_BRANCH to $PROD_BRANCH
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

  while getopts hbpsu c; do
    case $c in
      p) BRANCH=$PROD_BRANCH
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
