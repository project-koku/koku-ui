# Releasing Koku UI

This doc describes how to release Koku UI to stage and prod. Merge `main` to `release-hccm` once, then deploy that SHA to app-interface stage, test, and deploy the same SHA to app-interface prod.

## Merge branches

The release-branch.sh script creates a koku-ui PR with a unique SHA, used for a namespace \`ref\` in app-interface. We always pull from main when pushing to release-hccm.

Please allow the PR to build successfully and merge before deploying to app-interface.

### Merge main to release-hccm

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

The Chrome environment prompt is skipped when merging branches.

## Deploy to app-interface

The release-app-interface.sh script will update app-interface with the latest SHA ref from `release-hccm`. Stage and prod both use that branch; choose which app-interface environment to update.

1. Pull from release-hccm when updating the stage deployment in app-interface
2. Pull from release-hccm when updating the prod deployment in app-interface

### Deploy release-hccm to app-interface stage

```
sh ../../scripts/release-app-interface.sh -p
```

### Deploy release-hccm to app-interface prod

```
sh ../../scripts/release-app-interface.sh -s
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

Use the latest commit of the \`release-hccm\` branch to update namespaces \`ref\` in the app-interface repo. Don't use a merge commit.

```
- name: koku-ui-hccm
  ...
    # Stage Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/stage-frontends.yml
    ref: 68ce48592f5222029f27f6fb708698013d2f0a58 // Replace with latest SHA for release-hccm branch
    ...
    # Prod Deployment
  - namespace:
      $ref: /services/insights/frontend-operator/namespaces/prod-frontends.yml
    ref: 68ce48592f5222029f27f6fb708698013d2f0a58 // Replace with latest SHA for release-hccm branch
    ...
```

## Testing

After releasing to each environment, open an incognito window and view one of the environments below.

Please ensure expected changes have been updated before releasing to the next environment.

1. For stage, view https://console.stage.redhat.com/openshift/cost-management/
2. For prod, view https://console.redhat.com/openshift/cost-management/

## Release notes

After releasing to prod, `release-app-interface.sh` triggers the Tag Release workflow for the SHA deployed to prod. A new tag will be created here https://github.com/project-koku/koku-ui/tags. Create a new GitHub release based on this tag -- use the tag label as the "release title".

You can also run the [Tag Release](https://github.com/project-koku/koku-ui/actions/workflows/tag_release.yml) workflow manually and enter the prod commit SHA plus app (`koku-ui-hccm` or `koku-ui-ros`).

Note that you may  "Draft a new release", before the latest tag is available, and mark it as a "pre-release" -- don't click "publish release" yet, use "save draft".

Please document any new features and bug fixes available in production and other environments. For example, note any features that are only available in stage.

For release examples, please see existing releases here https://github.com/project-koku/koku-ui/releases

## Troubleshooting

If a staging environment has not updated as expected, it's best to ask questions in the konflux-users, forum-consoledot-ui, or proj-fecontainer-migration channels of http://coreos.slack.com.

Alternatively, open a Jira issue under the "ConsoleDot Platform (console.redhat.com) (RHCLOUD)" project category. For an example, see https://redhat.atlassian.net/browse/RHCLOUD-18259

[component-activity]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/cost-mgmt-dev-tenant/applications/koku-ui-hccm/activity
