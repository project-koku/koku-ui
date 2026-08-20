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
  HCCM_BRANCH="release-hccm"
  ONPREM_BRANCH="release-onprem"
  ROS_BRANCH="release-ros"

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

    $HCCM_BRANCH is merged from $MAIN_BRANCH
    $ONPREM_BRANCH is merged from $MAIN_BRANCH
    $ROS_BRANCH is merged from $MAIN_BRANCH

    sh [-x] $SCRIPT [-h|-p|-q|-r|-u]

    OPTIONS:
    h       Display this message

    p       Merge $MAIN_BRANCH to $HCCM_BRANCH
    q       Merge $MAIN_BRANCH to $ONPREM_BRANCH
    r       Merge $MAIN_BRANCH to $ROS_BRANCH

    u       Push to upstream

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

  # Use preferred GitHub user to create PR, otherwise default GIT config will do
  if ! gh auth status | grep -q "$GIT_USER"; then
    echo "*** Preferred $GIT_USER user not available, run 'gh auth login'"
  else
    ACTIVE_GH_USER=`gh api user --jq .login`

    echo "\n*** Switching GitHub user: $GIT_USER"
    gh auth switch --user $GIT_USER
  fi
}

createPullRequestBody()
{
cat <<- EEOOFF > $BODY_FILE
Merged $SOURCE_BRANCH branch to $TARGET_BRANCH.

This PR is set to auto-merge with a merge commit. Do not squash — squash breaks ancestry with $SOURCE_BRANCH and causes merge conflicts on the next release.

After merge, use the latest commit SHA on \`$TARGET_BRANCH\` to update the namespace \`ref\` in app-interface.
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
  if git merge origin/$SOURCE_BRANCH --commit --no-edit --no-ff; then
    return 0
  fi

  if [ -n "$(git diff --name-only --diff-filter=U 2>/dev/null)" ]; then
    resolveConflicts
    return $?
  fi

  echo "\n*** Merge failed (no conflicts to resolve)"
  return 1
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

  echo "\n*** Creating pull request..."
  PR_URL=`gh pr create -t "$TITLE" -b "$BODY" -B $TARGET_BRANCH`

  # Lock merge method to "Create a merge commit" so the PR cannot land as a
  # squash (which breaks ancestry and causes conflicts on the next release).
  # --auto waits for required checks/reviews before merging.
  echo "\n*** Enabling auto-merge with merge commit (not squash)..."
  gh pr merge --merge --auto "$PR_URL"

  echo "\n*** Pull request: $PR_URL"
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

resolveConflicts()
{
  echo ""
  echo "*** Merge conflicts detected:"
  git diff --name-only --diff-filter=U
  echo ""
  # Deployment PRs are often squash-merged, which breaks ancestry with the
  # source branch and causes repeat content conflicts. Accepting "theirs"
  # takes the source branch version for every conflicted path.
  read -p "*** Accept origin/$SOURCE_BRANCH (theirs) for all conflicts and continue (y/n)? " YN

  case $YN in
    [Yy]* )
      echo "\n*** Aborting conflicted merge and retrying with -X theirs..."
      git merge --abort
      git merge origin/$SOURCE_BRANCH --commit --no-edit --no-ff -X theirs
      return $?
      ;;
    [Nn]* | "" )
      echo "\n*** Aborting merge. Re-run and accept theirs, or resolve manually."
      git merge --abort
      return 1
      ;;
    * )
      echo "Please answer yes or no."
      resolveConflicts
      ;;
  esac
}

# main()
{
  default

  while getopts hpqru c; do
    case $c in
      p) SOURCE_BRANCH=$MAIN_BRANCH
         TARGET_BRANCH=$HCCM_BRANCH;;
      q) SOURCE_BRANCH=$MAIN_BRANCH
         TARGET_BRANCH=$ONPREM_BRANCH;;
      r) SOURCE_BRANCH=$MAIN_BRANCH
         TARGET_BRANCH=$ROS_BRANCH;;
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
