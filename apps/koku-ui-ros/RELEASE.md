# Releasing Koku microfrontend (MFE) with Module Federation

This doc describes how to release Koku MFE to each staging environment. Note that this should be done in order for testing purposes; stage-stable, prod-beta, and finally prod-stable

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

After all PRs have been merged, update the \`hccm-frontend-mfe\` resource in https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/hccm/deploy-clowder.yml

Use the latest commit of each branch to update namespaces \`ref\` in the app-interface repo. Don't use a merge commit, SHAs must be unique when images are created for each branch.

```
- name: hccm-frontend-mfe
  ...
    # Stage Stable Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/stage-frontends.yml
    ref: 68ce48592f5222029f27f6fb708698013d2f0a58 // Replace with latest SHA for stage-beta branch
    ...
    # Prod Beta Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-beta-frontends.yml
    ref: e2d9e9116068d4d1aa5feda5c7d1716ee02b5bca // Replace with latest SHA for prod-beta branch
    ...
    # Prod Stable Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-frontends.yml
    ref: 77deb707f31b40414e8b13afe23d39e7091fd067 // Replace with latest SHA for prod-stable branch
    ...
```

## Testing

After releasing to each staging environment, open an incognito window and view one of the staging environments below.

Please ensure expected changes have been updated before releasing to the next staging environment.

1. For stage-stable, view https://console.stage.redhat.com/staging/cost-management/
2. For prod-beta, view https://console.redhat.com/beta/staging/cost-management/

## Release notes

After releasing to prod-stable, a new tag will be created here https://github.com/project-koku/koku-ui/tags. Create a new GitHub release based on this tag -- use the tag label as the "release title".

Note that you may  "Draft a new release", before the latest tag is available, and mark it as a "pre-release" -- don't click "publish release" yet, use "save draft".

Please document any new features and bug fixes available in production and other staging environments. For example, note any features that are only available in stage-beta.

For release examples, please see existing releases here https://github.com/project-koku/koku-ui/releases

## Troubleshooting

If a staging environment has not updated as expected, it's best to ask questions in the forum-consoledot-ui or proj-fecontainer-migration channels of http://coreos.slack.com.

Alternatively, open a Jira issue under the "ConsoleDot Platform (console.redhat.com) (RHCLOUD)" project category. For an example, see https://issues.redhat.com/browse/RHCLOUD-18259
