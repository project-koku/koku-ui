#!/usr/bin/env bash
set -e
set -x

# Todo: for debugging
env

# Set env variables for https://github.com/RedHatInsights/insights-frontend-builder-common/blob/master/src/release.sh
export TRAVIS_BRANCH=$GITHUB_BASE_REF
export TRAVIS_BUILD_NUMBER=$GITHUB_RUN_ID
export TRAVIS_BUILD_WEB_URL=$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID
export TRAVIS_COMMIT_MESSAGE=`git show -s --format='%s'`
export TRAVIS_EVENT_TYPE=$GITHUB_EVENT_NAME

case $GITHUB_BASE_REF in
  "master")
  "refs/heads/master")
    BRANCH=ci-beta
    ;;
  "ci-stable")
  "refs/heads/ci-stable")
    BRANCH=ci-stable
    ;;
  "prod-beta")
  "refs/heads/prod-beta")
    BRANCH=prod-beta
    ;;
  "prod-stable")
  "refs/heads/prod-stable")
    BRANCH=prod-stable
    ;;
  "qa-beta")
  "refs/heads/qa-beta")
    BRANCH=qa-beta
    ;;
  "qa-stable")
  "refs/heads/qa-stable")
    BRANCH=qa-stable
    ;;
  *)
    BRANCH=$GITHUB_BASE_REF
    ;;
esac

# Todo: push to test branch for debugging
#.travis/release.sh "$BRANCH"
.travis/release.sh "test"
