# Releasing Koku UI

This doc describes how to release Koku UI to each staging environment. Note that this should be done in order for testing purposes.

## Merge branches

The release-branch.sh script creates a koku-ui PR with a unique SHA, used for a namespace \`ref\` in app-interface. The script also ensures that code is always pulled from the correct branches. For example, we always:

1. Pull from main when pushing to stage-hccm
2. Pull from stage-hccm when pushing to prod-hccm

Please allow the PR to build successfully and merge before running the script again.

### Merge main to stage-hccm

```
sh ../../scripts/release-branch.sh -s
```

### Merge stage-hccm to prod-hccm

```
sh ../../scripts/release-branch.sh -p
```

### Wrapper for all merges

```
node ../../scripts/release-all.js
```

Follow the prompts below.

* Are you deploying to app-interface? `N`
* Which app do you want to release? `koku-ui-hccm`
* Which Chrome environment do you want to release? `stage`

## Deploy to app-interface

The release-app-interface.sh script will update app-interface with the latest SHA refs from the koku-ui branches above. The script also ensures that SHA refs are always pulled from the correct branches. For example, we always:

1. Pull from stage-hccm when updating the stage deployment in app-interface
2. Pull from prod-hccm when updating the prod deployment in app-interface

### Deploy stage-hccm to app-interface

```
sh ../../scripts/release-app-interface.sh -s
```

### Deploy prod-hccm to app-interface

```
sh ../../scripts/release-app-interface.sh -p
```

### Wrapper for all deployments

```
node ../../scripts/release-all.js
```

Follow the prompts below.

* Are you deploying to app-interface? `Y`
* Which app do you want to release? `koku-ui-hccm`
* Which Chrome environment do you want to release? `stage`

Please allow Konflux to generate images from the previous branch merge, first. Ensure a successful status by viewing [component activity][component-activity].

### Manual deployment

After all koku-ui PRs have been merged, update the \`koku-ui-hccm\` resource in https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/insights/hccm/deploy-clowder.yml

Use the latest commit of each branch to update namespaces \`ref\` in the app-interface repo. Don't use a merge commit, SHAs must be unique when images are created for each branch.

```
- name: koku-ui-hccm
  ...
    # Stage Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/stage-frontends.yml
    ref: 68ce48592f5222029f27f6fb708698013d2f0a58 // Replace with latest SHA for stage-hccm branch
    ...
    # Prod Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-frontends.yml
    ref: c7f6c75fd1e895afbc05a2a6d26835fa16a0edfa // Replace with latest SHA for prod-hccm branch
    ...
```

## Testing

After releasing to each staging environment, open an incognito window and view one of the staging environments below.

Please ensure expected changes have been updated before releasing to the next staging environment.

1. For stage, view https://console.stage.redhat.com/openshift/cost-management/
2. For prod-hccm, view https://console.redhat.com/openshift/cost-management/

## Release notes

After releasing to prod-hccm, a new tag will be created here https://github.com/project-koku/koku-ui/tags. Create a new GitHub release based on this tag -- use the tag label as the "release title".

Note that you may  "Draft a new release", before the latest tag is available, and mark it as a "pre-release" -- don't click "publish release" yet, use "save draft".

Please document any new features and bug fixes available in production and other staging environments. For example, note any features that are only available in stage.

For release examples, please see existing releases here https://github.com/project-koku/koku-ui/releases

## Troubleshooting

If a staging environment has not updated as expected, it's best to ask questions in the forum-consoledot-ui or proj-fecontainer-migration channels of http://coreos.slack.com.

Alternatively, open a Jira issue under the "ConsoleDot Platform (console.redhat.com) (RHCLOUD)" project category. For an example, see https://issues.redhat.com/browse/RHCLOUD-18259

[component-activity]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/cost-mgmt-dev-tenant/applications/koku-ui-hccm/activity
