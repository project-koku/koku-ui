#!/bin/sh

default()
{
  PATH=/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`

  MAIN_BRANCH="master"
  CI_STABLE_BRANCH="ci-stable"
  STAGE_STABLE_BRANCH="stage-stable"
  REACT_INTL_BRANCH="react-intl_changeover"

  KOKU_UI_REPO="git@github.com:project-koku/koku-ui.git"

  TMP_DIR="/tmp/$SCRIPT.$$"
  KOKU_UI_DIR="$TMP_DIR/koku-ui"
}

usage()
{
cat <<- EEOOFF

    This script will rebase the selected branch with $MAIN_BRANCH, then push changes to origin.

    FYI, there are no ci-beta and stage-beta branches -- we push to https://github.com/RedHatInsights/cost-management-build via Travis builds

    Note: The QA environment is no longer supported.

    sh [-x] $SCRIPT [-h] -<c|q|s|r>

    OPTIONS:
    h       Display this message
    c       CI stable
    s       Stage stable
    r       React Intl

EEOOFF
}

# main()
{
  default

  while getopts hcqsr c; do
    case $c in
      c) BRANCH=$CI_STABLE_BRANCH;;
      s) BRANCH=$STAGE_STABLE_BRANCH;;
      r) BRANCH=$REACT_INTL_BRANCH;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -z "$BRANCH" ]; then
    usage
    exit 1
  fi

  mkdir $TMP_DIR
  cd $TMP_DIR

  git clone $KOKU_UI_REPO
  cd $KOKU_UI_DIR

  git checkout $BRANCH
  git rebase $MAIN_BRANCH

  if [ "$?" -eq 0 ]; then
    git push -u origin $BRANCH
  else
    echo "Did not push to origin. No changes or check for conflicts"
  fi

  rm -rf $TMP_DIR
}
