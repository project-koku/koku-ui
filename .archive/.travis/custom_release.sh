#!/usr/bin/env bash
set -e
set -x

# If current dev branch is main, push to build repo stage-beta
if [[ "${TRAVIS_BRANCH}" = "master" || "${TRAVIS_BRANCH}" = "main" ]]; then
  .travis/release.sh "stage-beta"
fi

# If current dev branch is deployment branch, push to build repo
if [[ "${TRAVIS_BRANCH}" = "stage-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
  .travis/release.sh "${TRAVIS_BRANCH}"
fi
