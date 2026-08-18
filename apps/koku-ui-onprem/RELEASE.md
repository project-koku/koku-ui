# Releasing Koku UI OnPrem

This doc describes how to release Koku UI OnPrem. On-prem has no Chrome stage or prod environments, and app-interface is not used.

## Merge branches

The release-branch.sh script creates a koku-ui PR with a unique SHA. The script always pulls from main when pushing to release-onprem.

Please allow the PR to build successfully and merge before using the latest SHA.

### Merge main to release-onprem

```
sh ../../scripts/release-branch.sh -q
```

### Wrapper for all merges

```
node ../../scripts/release-all.js
```

Follow the prompts below.

* Are you deploying to app-interface? `N`
* Which app do you want to release? `koku-ui-onprem`

The Chrome environment prompt is skipped when merging branches.

## Deploy to app-interface

App-interface deployments are not supported for on-prem.

## Testing

After the release-onprem PR is merged, wait for the image to build from that branch. Ensure a successful status by viewing [component activity][component-activity].

Deploy the resulting image to an on-prem cluster and verify expected changes before promoting further.

## Troubleshooting

If an on-prem environment has not updated as expected, it's best to ask questions in the konflux-users channels of http://coreos.slack.com.

[component-activity]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/cost-mgmt-dev-tenant/applications/koku-ui-onprem/activity
