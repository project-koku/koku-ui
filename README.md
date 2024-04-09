# Koku UI

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)
[![CI Status][build-badge]](https://github.com/project-koku/koku-ui/actions/workflows/ci.yml)
[![codecov][codecov-badge]](https://codecov.io/gh/project-koku/koku-ui)

React.js app for Cost Management.

User interface is based on [Patternfly].

Submit issues in [Jira].

## Requirements
* [NodeJS v18.15+][nodejs]
* [npm v9.5+][npm]

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
1. Setup `/etc/hosts` entries listed above.
1. Clone the repository, and open a terminal in the base of this project.
1. Run the command `npm install` to install all the dependencies.

## Building
```
npm build
```

## Testing
```
npm test
```

## Running Koku UI against a hosted Koku API, using webpack proxy
Note that this approach currently supports the Insights stage-beta, stage-stable, prod-beta, and prod-stable environments.

1. Start development server
    ```
    npm start
    ```

    Follow the prompts that follow.

    * Do you want to use local api? `no`
    * Which platform environment you want to use `stage`
    * Which Chrome environment you want to use? `beta`


1. Open the following URL
    ```
    https://stage.foo.redhat.com:1337/beta/openshift/cost-management
    ```

### Running Koku UI with local Cloud Services Backend

See https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/cloud-services-config.md#serving-files-locally

1. Serve files locally from Cloud Services Backend repo
    ```
    make dev-static-node
    ```

1. Start development server in Koku UI repo
    ```
    npm start:csb
    ```

### Running Koku UI with local Koku microfrontend (MFE)

See https://github.com/project-koku/koku-ui-mfe

1. Start development server in Koku MFE repo
    ```
    npm start:static
    ```

1. Start development server in Koku UI repo
    ```
    npm start:mfe
    ```

### Running Koku UI with local Koku microfrontend (MFE) and Cloud Services Backend

See https://github.com/RedHatInsights/chrome-service-backend/blob/main/docs/cloud-services-config.md#serving-files-locally
and https://github.com/project-koku/koku-ui-mfe

1. Serve files locally from Cloud Services Backend repo
    ```
    make dev-static-node
    ```

1. Start development server in Koku MFE repo
    ```
    npm start:static
    ```

1. Start development server in Koku UI repo
    ```
    npm start:csb:mfe
    ```

## Running local instances of Koku UI and Koku API
#### Koku UI

1. Start development server (Answer `yes` to run against local APIs)
    ```
    npm start
    ```

    Follow the prompts that follow.

    * Do you want to use local api? `yes`
    * Which platform environment you want to use `stage`
    * Which Chrome environment you want to use? `beta`

1. Open the following URL
    ```
     http://localhost:8002/beta/openshift/cost-management
    ```

#### Koku API
Refer to the project [README][koku-readme] for prerequisites

1. Setup and run Koku API (see project [README][koku-readme] for more details)
    ```
    git clone git@github.com:project-koku/koku.git
    cd [KOKU_GIT_REPO]
    pipenv install --dev
    pipenv shell "pre-commit install"
    make docker-up-min or make docker-up-min-trino
    make create-test-customer
    make load-test-customer-data (use with docker-up-min-trino)
    ```

1. Check to see if containers are running (optional)
    ```
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
    ```

1. Watch the Koku API logs in another terminal (optional)
    ```
    docker compose logs -f koku-server koku-worker
    ```

1. Clean up (optional)
    ```
    pipenv shell
    make docker-down
    make remove-db
    docker system prune --all
    exit
    ```

## Running local instances of Settings Frontend and Koku API

Follow the [steps](#koku-api) to run a local Koku API instance

1. Clone the Settings Frontend repository and install dependencies
    ```
    git clone https://github.com/RedHatInsights/settings-frontend.git
    cd [SETTINGS_FRONTEND_GIT_REPO]
    npm install
    ```

1. Set the following variables in your environment
    ```
    export API_PORT=8000
    export LOCAL_API="/api/cost-management/v1/"
    export KEYCLOAK_PORT=4020
    ```

1. Start development server
    ```
    npm run start:standalone:beta
    ```

1. Open the following URL
    ```
    http://localhost:1337/beta/settings/applications/cost-management
    ```

## Releasing Koku UI

This [RELEASE][release-doc] doc describes how to release Koku UI to each staging environment.

[build-badge]: https://github.com/project-koku/koku-ui/actions/workflows/ci.yml/badge.svg?branch=main
[license-badge]: https://img.shields.io/github/license/project-koku/koku-ui.svg?longCache=true
[codecov-badge]: https://codecov.io/gh/project-koku/koku-ui/graph/badge.svg?token=1hjFIy1cRe

[koku-readme]: https://github.com/project-koku/koku#readme
[nodejs]: https://nodejs.org/en/
[patch-etc-hosts]: https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh
[Patternfly]: https://www.patternfly.org/
[release-doc]: https://github.com/project-koku/koku-ui/blob/main/RELEASE.md
[npm]: https://www.npmjs.com/
[Jira]: https://issues.redhat.com/projects/COST/
