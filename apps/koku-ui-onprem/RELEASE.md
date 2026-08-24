# Releasing Koku UI OnPrem

On-prem has no Chrome stage or prod environments, and app-interface is not used. On-prem QE verifies the assembled image separately.

## Why HCCM and ROS have separate pipelines

Cost Management (HCCM) and Resource Optimization (ROS) are released separately because different QE teams validate each app. We do not want an HCCM release blocked while a ROS feature is still in QE, or the reverse.

SaaS can do that because ROS is a federated module hosted via app-interface: Chrome loads whatever HCCM and ROS SHAs are in prod, independently.

On-prem cannot. The Konflux pipeline builds one image that includes HCCM and ROS at **build time**. Merging `main` into `release-onprem` as-is would bake in whichever app is still in QE.

`HEAD` of `release-hccm` / `release-ros` is not production-ready either. Those branches are QE candidates. Production-ready for those UIs is the SHA in app-interface **prod**, tagged `r.YYYY.MM.DD.N-hccm` and `r.YYYY.MM.DD.N-ros`.

## Omitting in-progress HCCM and ROS changes

`release-onprem.sh` **assembles** `release-onprem` so in-progress HCCM and ROS product work cannot slip into the image, while on-prem-only work does not wait on a SaaS release.

```
main  (on-prem shell: host, RBAC, sources, libs, lockfile, on-prem webpack glue)
  ├─► release-hccm ──► stage ──► prod ──► tag r.*-hccm  ──  pin apps/koku-ui-hccm
  └─► release-ros  ──► stage ──► prod ──► tag r.*-ros   ──  pin apps/koku-ui-ros
                                                              ▼
                                                     release-onprem (Konflux)
```

| Content | Source | Gate |
| --- | --- | --- |
| On-prem shell | `main` | On-prem QE |
| HCCM product UI (`apps/koku-ui-hccm`, except on-prem webpack glue) | latest HCCM prod tag | HCCM QE |
| ROS product UI (`apps/koku-ui-ros`, except on-prem webpack glue) | latest ROS prod tag | ROS QE |

In-progress HCCM or ROS files on `main` are replaced from those prod tags at assemble time, so they never enter the image.

`webpack-onprem.config.ts` and `tsconfig-onprem.json` in the HCCM and ROS app dirs stay on `main` so an on-prem build-config fix does not wait on that app's SaaS prod tag.

**You only wait on HCCM/ROS prod when the change is actually in those product UIs.**

- **On-prem-only fix** (host, auth, RBAC, Containerfile, on-prem webpack glue): merge to `main`, cut on-prem. No HCCM or ROS SaaS release.
- **Latest HCCM without a ROS release:** yes. ROS UI stays on the last ROS prod pin.
- **HCCM or ROS product bug that on-prem also needs:** that app's QE → prod tag → next on-prem cut. The other app does not need to release.

Shared `libs/ui-lib` comes from `main` with the rest of the shell. On-prem QE is the gate for that mix.

## Promote release-onprem

Preview pins and which HCCM/ROS UI files on `main` will be omitted (no PR):

```
sh ../../scripts/release-onprem.sh -n
```

Create the PR:

```
sh ../../scripts/release-onprem.sh
```

### Wrapper

```
node ../../scripts/release-all.js
```

Follow the prompts below.

* Are you deploying to app-interface? `N`
* Which app do you want to release? `koku-ui-onprem`
* How do you want to release on-prem? `Assemble from main with HCCM/ROS prod pins (recommended)`

The Chrome environment prompt is skipped. Assemble runs `release-onprem.sh`. Direct merge runs `release-branch.sh -q` (warns that the merge may include in-progress HCCM/ROS product work).

Allow the PR to build and merge (merge commit, not squash). Konflux builds from `release-onprem` after that merge.

## Deploy to app-interface

App-interface deployments are not supported for on-prem.

## Testing

After the release-onprem PR is merged, wait for the image to build from that branch. Ensure a successful status by viewing [component activity][component-activity].

Deploy the resulting image to an on-prem cluster and verify expected changes before promoting further.

## Troubleshooting

If an on-prem environment has not updated as expected, it's best to ask questions in the konflux-users channels of http://coreos.slack.com.

A direct `main` merge (`release-branch.sh -q`, or the direct-merge choice in `release-all.js`) may include in-progress HCCM and ROS product files. That path warns and asks to continue. Prefer `release-onprem.sh` when it works.

[component-activity]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/cost-mgmt-dev-tenant/applications/koku-ui-onprem/activity
