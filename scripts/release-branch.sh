#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`

  MAIN_BRANCH="main"
  PROD_BETA_BRANCH="prod-beta"
  PROD_STABLE_BRANCH="prod-stable"
  STAGE_STABLE_BRANCH="stage-stable"

  KOKU_UI_REPO="git@github.com:project-koku/koku-ui.git"

  TMP_DIR="/tmp/$SCRIPT.$$"
  KOKU_UI_DIR="$TMP_DIR/koku-ui"
}

usage()
{
cat <<- EEOOFF

    This script will release the selected branch by merging the following branches

    stage-stage is merged from stage-beta
    prod-beta is merged from stage-stable
    prod-stable is merged from prod-beta

    sh [-x] $SCRIPT [-h] -<b|p|s>

    OPTIONS:
    h       Display this message
    b       Prod beta
    p       Prod stable
    s       Stage stable

EEOOFF
}

clone()
{
  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $KOKU_UI_REPO
}


merge()
{
  cd $KOKU_UI_DIR

  git checkout $BRANCH

  git fetch origin $REMOTE_BRANCH
  git merge origin/$REMOTE_BRANCH --commit --no-edit --no-ff
}

push()
{
  read -p "You are pushing to the $BRANCH branch. Continue?" YN

  case $YN in
    [Yy]* ) git push -u origin $BRANCH;;
    [Nn]* ) exit 0;;
    * ) echo "Please answer yes or no."; push;;
  esac
}

# main()
{
  default

  while getopts hbps c; do
    case $c in
      b) BRANCH=$PROD_BETA_BRANCH
         REMOTE_BRANCH=$STAGE_STABLE_BRANCH;;
      p) BRANCH=$PROD_STABLE_BRANCH
         REMOTE_BRANCH=$PROD_BETA_BRANCH;;
      s) BRANCH=$STAGE_STABLE_BRANCH
         REMOTE_BRANCH=$MAIN_BRANCH;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$BRANCH" ]; then
    usage
    exit 1
  fi

  echo "\nMerging $BRANCH from $REMOTE_BRANCH\n"

  clone
  merge

  if [ "$?" -eq 0 ]; then
    push
  else
    echo "Cannot not push. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
