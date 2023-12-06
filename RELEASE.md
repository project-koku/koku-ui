# Releasing Koku UI

This doc describes how to release the UI to each staging environment. Note that this should be done in order for testing purposes; stage-stable, prod-beta, and finally prod-stable

## Release script

The release script creates a PR with a unique SHA, used for a namespace \`ref\` in the app-interface repo. The script also ensures that code is always pulled from the correct branches. For example, we always:

1. Pull from master when pushing to stage-stable
2. Pull from stage-stable when pushing to prod-beta
3. Pull from prod-beta when pushing to prod-stable

Please allow the PR to build successfully and merge before running the script again for the next branch.

### Release to stage-stable

```
sh scripts/release-branch.sh -s
```

### Release to prod-beta

```
sh scripts/release-branch.sh -b
```

### Release to prod-stable

```
sh scripts/release-branch.sh -p
```

## Deployment

After all PRs have been merged, update the \`hccm-frontend\` resource in https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/hccm/deploy-clowder.yml

Use the latest commit of each branch to update namespaces \`ref\` in the app-interface repo. Don't use a merge commit, SHAs must be unique when images are created for each branch.

```
    # Stage Stable Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/stage-frontends.yml
    ref: 4bdd960da2fe34ed8964acfcbc2d3267a752f3e5 // Replace with latest SHA for stage-beta branch
    parameters:
      ENV_NAME: "frontends"
      IMAGE: "quay.io/cloudservices/hccm-frontend"
    # Prod Beta Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-beta-frontends.yml
    ref: 23909da4ea017963caa78d59168054db842ce014 // Replace with latest SHA for prod-beta branch
    parameters:
      ENV_NAME: "frontends-beta"
      IMAGE: "quay.io/cloudservices/hccm-frontend"
    # Prod Stable Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-frontends.yml
    ref: c7f6c75fd1e895afbc05a2a6d26835fa16a0edfa // Replace with latest SHA for prod-stable branch
    parameters:
      ENV_NAME: "frontends"
      IMAGE: "quay.io/cloudservices/hccm-frontend"
```

## Testing

After releasing to each staging environment, open an incognito window and view one of the staging environments below.

Please ensure expected changes have been updated before releasing to the next staging environment.

1. For stage-stable, view https://console.stage.redhat.com/openshift/cost-management/
2. For prod-beta, view https://console.redhat.com/beta/openshift/cost-management/
3. For prod-stable, view https://console.redhat.com/openshift/cost-management/

## Release notes

After releasing to prod-stable, a new tag will be created here https://github.com/project-koku/koku-ui/tags. Create a new GitHub release based on this tag -- use the tag label as the "release title".

Note that you may  "Draft a new release", before the latest tag is available, and mark it as a "pre-release" -- don't click "publish release" yet, use "save draft".

Please document any new features and bug fixes available in production and other staging environments. For example, note any features that are only available in stage-beta.

For release examples, please see existing releases here https://github.com/project-koku/koku-ui/releases

## Troubleshooting

If a staging environment has not updated as expected, it's best to ask questions in the forum-consoledot-ui or proj-fecontainer-migration channels of http://coreos.slack.com.

Alternatively, open a Jira issue under the "ConsoleDot Platform (console.redhat.com) (RHCLOUD)" project category. For an example, see https://issues.redhat.com/browse/RHCLOUD-18259
