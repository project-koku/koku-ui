# Koku UI

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)
[![CI Status][build-badge]](https://github.com/project-koku/koku-ui/actions/workflows/ci.yml?query=branch%3Amain)
[![codecov][codecov-badge]](https://codecov.io/gh/project-koku/koku-ui)

React.js app for Cost Management.

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

## Building
```
npm build
```

## Testing
```
npm test
```

## Running Koku UI against a hosted Koku API, using webpack proxy

Note that this approach currently supports the Insights stage and prod environments.

1. Start development server
```
npm start
```

Follow the prompts that follow.

* Which platform environment you want to use `stage`

2. Open the following URL
```
https://stage.foo.redhat.com:1337/openshift/cost-management
```

Note: Must log in with a user that has Cost Management permissions

### Running Koku UI with local Cloud Services Backend

Refer to the [serving files locally][serving-files-locally] section of cloud services config for more details

1. Serve files locally from Cloud Services Backend repo
```
make dev-static-node
```

2. Start development server in Koku UI repo
```
npm start:csb
```

### Running Koku UI with local Koku microfrontend (MFE)

Refer to the [koku-ui-mfe README][koku-ui-mfe-readme] for more details

1. Start development server in Koku MFE repo
```
npm start:static
```

2. Start development server in Koku UI repo
```
npm start:mfe
```

### Running Koku UI with local Koku microfrontend (MFE) and Cloud Services Backend

Refer to the [serving files locally][serving-files-locally] section of cloud services config and the [koku-ui-mfe README][koku-ui-mfe-readme] for more details

1. Serve files locally from Cloud Services Backend repo
```
make dev-static-node
```

2. Start development server in Koku MFE repo
```
npm start:static
```

3. Start development server in Koku UI repo
```
npm start:csb:mfe
```

## Running local instances of Koku UI and Koku API
#### Koku UI

Note that this approach currently supports the Insights stage and prod environments.

1. Start development server
```
npm start
```

Follow the prompts that follow.

* Which platform environment you want to use `stage`

2. Open the following URL
```
http://localhost:8002/openshift/cost-management
```

#### Koku API

Refer to the [koku README][koku-readme] for more details

1. Setup & run Koku API
```
git clone git@github.com:project-koku/koku.git
cd [KOKU_GIT_REPO]
pipenv install --dev
pipenv shell "pre-commit install"
make docker-up-min or make docker-up-min-trino
make create-test-customer
make load-test-customer-data (use with docker-up-min-trino)
```

2. Check to see if containers are running (optional)
```
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
```

3. Watch the Koku API logs in another terminal (optional)
```
docker compose logs -f koku-server koku-worker
```

4. Clean up (optional)
```
pipenv shell
make docker-down
make remove-db
docker system prune --all
exit
```

## Running local instances of Settings Frontend & Koku API

Follow the koku API [steps](#koku-api) to run a local Koku API instance

1. Clone the Settings Frontend repository and install dependencies
```
git clone https://github.com/RedHatInsights/settings-frontend.git
cd [SETTINGS_FRONTEND_GIT_REPO]
npm install
```

2. Set the following variables in your environment
```
export API_PORT=8000
export LOCAL_API="/api/cost-management/v1/"
export KEYCLOAK_PORT=4020
```

3. Start development server
```
npm start:static
```

4. Open the following URL
```
http://localhost:1337/settings/applications/cost-management
```

## Releasing Koku UI

This [RELEASE][release-doc] doc describes how to release Koku UI to each staging environment.

[build-badge]: https://github.com/project-koku/koku-ui/actions/workflows/ci.yml/badge.svg?branch=main
[codecov-badge]: https://codecov.io/gh/project-koku/koku-ui/graph/badge.svg?token=1hjFIy1cRe
[Jira]: https://issues.redhat.com/projects/COST/
[koku-readme]: https://github.com/project-koku/koku#readme
[koku-ui-mfe-readme]: https://github.com/project-koku/koku-ui-mfe#readme
[license-badge]: https://img.shields.io/github/license/project-koku/koku-ui.svg?longCache=true
[nodejs]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[patch-etc-hosts]: https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh
[Patternfly]: https://www.patternfly.org/
[podman]: https://podman.io/docs/installation
[release-doc]: https://github.com/project-koku/koku-ui/blob/main/RELEASE.md
[serving-files-locally]: https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/cloud-services-config.md#serving-files-locally
