#!/bin/bash

node scripts/createManifest.js

changed=`git diff --name-only HEAD`

if [[ $changed == *"koku-ui-manifest"* ]]; then
  echo "yarn.lock changed without updating koku-ui-manifest. Run 'yarn manifest:update' to update."
  exit 1
else
  echo "Manifest is up to date."
  exit 0
fi
