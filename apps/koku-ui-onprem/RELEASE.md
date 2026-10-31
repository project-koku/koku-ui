# Releasing Koku UI OnPrem

On-prem has no Chrome stage or prod environments, and app-interface is not used. On-prem QE verifies the image separately.

Pushing to `main` builds the on-prem image. Konflux builds from that branch.

## Testing

After a commit reaches `main`, wait for the image to build. Ensure a successful status by viewing [component activity][component-activity].

Deploy the resulting image to an on-prem cluster and verify expected changes.

## Troubleshooting

If an on-prem environment has not updated as expected, it's best to ask questions in the konflux-users channels of http://coreos.slack.com.

[component-activity]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/cost-mgmt-dev-tenant/applications/koku-ui-onprem/activity
