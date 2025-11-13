# Releasing ROS UI

This doc describes how to release ROS UI to each staging environment. Note that this should be done in order for testing purposes.

## Release script

The release script creates a PR with a unique SHA, used for a namespace \`ref\` in the app-interface repo. The script also ensures that code is always pulled from the correct branches. For example, we always:

1. Pull from master when pushing to stage-ros
2. Pull from stage-ros when pushing to prod-ros

Please allow the PR to build successfully and merge before running the script again.

### Release to stage-ros

```
sh ../../scripts/release-branch.sh -q
```

### Release to prod-ros

```
sh ../../scripts/release-branch.sh -r
```

## Deployment

After all PRs have been merged, update the \`koku-ui-ros\` resource in https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/hccm/deploy-clowder.yml

Use the latest commit of each branch to update namespaces \`ref\` in the app-interface repo. Don't use a merge commit, SHAs must be unique when images are created for each branch.

```
- name: koku-ui-ros
  ...
    # Stage Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/stage-frontends.yml
    ref: 68ce48592f5222029f27f6fb708698013d2f0a58 // Replace with latest SHA for stage-ros branch
    ...
    # Prod Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-frontends.yml
    ref: 77deb707f31b40414e8b13afe23d39e7091fd067 // Replace with latest SHA for prod-ros branch
    ...
```

## Testing

After releasing to each staging environment, open an incognito window and view one of the staging environments below.

Please ensure expected changes have been updated before releasing to the next staging environment.

1. For stage-ros, view https://console.stage.redhat.com/staging/cost-management/
2. For prod-ros, view https://console.redhat.com/staging/cost-management/ (preview mode only)

## Release notes

After releasing to prod-ros, a new tag will be created here https://github.com/project-koku/koku-ui/tags. Create a new GitHub release based on this tag -- use the tag label as the "release title".

Note that you may  "Draft a new release", before the latest tag is available, and mark it as a "pre-release" -- don't click "publish release" yet, use "save draft".

Please document any new features and bug fixes available in production and other staging environments. For example, note any features that are only available in stage.

For release examples, please see existing releases here https://github.com/project-koku/koku-ui/releases

## Troubleshooting

If a staging environment has not updated as expected, it's best to ask questions in the forum-consoledot-ui or proj-fecontainer-migration channels of http://coreos.slack.com.

Alternatively, open a Jira issue under the "ConsoleDot Platform (console.redhat.com) (RHCLOUD)" project category. For an example, see https://issues.redhat.com/browse/RHCLOUD-18259
