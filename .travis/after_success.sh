#!/usr/bin/env bash

# Check if it is a pull request
# If it is not a pull request, generate the deploy key
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
    echo -e "Pull Request, not pushing a build"
    exit 0;
else
    openssl aes-256-cbc -K $encrypted_62df11ef8b48_key -iv $encrypted_62df11ef8b48_iv -in koku_ui_id_rsa.enc -out koku_ui_id_rsa -d
    chmod 600 koku_ui_id_rsa
    eval `ssh-agent -s`
    ssh-add koku_ui_id_rsa
fi

# If current dev branch is master, push to build repo ci-beta
if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-beta"
fi

# If current dev branch is deployment branch, push to build repo
if [[ "${TRAVIS_BRANCH}" = "ci-stable"  || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi