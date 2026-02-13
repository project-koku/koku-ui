# ROS UI

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)
[![CI Status][build-badge]](https://github.com/project-koku/koku-ui/actions/workflows/ci.yml?query=branch%3Amain)
[![codecov][codecov-badge]](https://codecov.io/gh/project-koku/koku-ui)

React.js app for Resource Optimization with Module Federation.

User interface is based on [Patternfly].

Submit issues in [Jira].

## Requirements

* [NodeJS v20.15+][nodejs]
* [npm v10.8+][npm]
* [Podman][podman]

After installing Podman, create and start your VM.

```
podman machine init
podman machine start
```

If you are using fec development utilities on a Mac that uses Apple's silicon and Podman, you may experience issues when running `fec dev` or `fec dev-proxy`. Specifically the error `Chrome server stopped unexpectedly! The server port 9998 is already in use!`.

If you have confirmed the port is not actually in use, follow the steps below (warning, this will remove and delete the default VM config). This will create a new default VM that uses an older Podman machine OS that does not have the compatibility issues on Apple silicon.

For more context, see the [debugging Slack thread](https://redhat-internal.slack.com/archives/C023VGW21NU/p1758114060634089).

```
podman machine stop
podman machine rm
podman machine init --image docker://quay.io/podman/machine-os:5.5
podman machine start
```

## Setup `hosts` entries (do this once)

Edit the `/etc/hosts` file and add the following entries
```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
```

Alternatively, run the [patch-etc-hosts.sh][patch-etc-hosts] script from the insights-proxy repo
```
sudo bash scripts/patch-etc-hosts.sh
```

## Getting Started

1. Install requirements listed above.
2. Setup `/etc/hosts` entries listed above.
3. Clone the repository, and open a terminal in the base of this project.
4. Run the command `npm install` to install all the dependencies.

## Building apps/koku-ui-ros
```
npm build
```

## Testing apps/koku-ui-ros
```
npm test
```

## Running ROS UI against a hosted Koku API, using webpack proxy

Note that this approach currently supports only the Insights stage environment.

1. Start development server in apps/koku-ui-ros
```
npm start
```

Follow the prompts that follow.

* Which platform environment you want to use? `stage`

2. Open the following URL
```
https://stage.foo.redhat.com:1337/staging/cost-management/ros
```

Note: Must log in with a user that has Cost Management permissions

### Running ROS UI with local Cloud Services Backend

Refer to the [serving files locally][serving-files-locally] section of cloud services config for more details

1. Serve files locally from Cloud Services Backend repo
```
make dev-static-node
```

2. Start development server in apps/koku-ui-ros
```
npm start:csb
```

### Running ROS UI with local Koku UI

Refer to the [koku-ui README][koku-ui-readme] for more details

1. Start development server in apps/koku-ui-ros
```
npm start:static
```

2. Start development server in apps/koku-ui-hccm
```
npm start:ros
```

### Running ROS UI with local Koku UI and Cloud Services Backend

Refer to the [serving files locally][serving-files-locally] section of cloud services config and the [koku-ui README][koku-ui-readme] for more details

1. Serve files locally from Cloud Services Backend repo
```
make dev-static-node
```

2. Start development server in apps/koku-ui-ros
```
npm start:static
```

3. Start development server in apps/koku-ui-ros
```
npm start:csb:ros
```

## Releasing ROS UI

This [RELEASE][release-doc] doc describes how to release ROS UI to each staging environment.

[build-badge]: https://github.com/project-koku/koku-ui/actions/workflows/ci.yml/badge.svg?branch=main
[codecov-badge]: https://codecov.io/gh/project-koku/koku-ui/graph/badge.svg?token=1hjFIy1cRe
[Jira]: https://issues.redhat.com/projects/COST/
[koku-ui-readme]: https://github.com/project-koku/koku-ui#readme
[license-badge]: https://img.shields.io/github/license/project-koku/koku-ui.svg?longCache=true
[nodejs]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[patch-etc-hosts]: https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh
[Patternfly]: https://www.patternfly.org/
[release-doc]: https://github.com/project-koku/koku-ui/blob/main/apps/koku-ui-ros//RELEASE.md
[serving-files-locally]: https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/cloud-services-config.md#serving-files-locally
