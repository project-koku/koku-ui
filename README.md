# Koku UI

[![AGPLv3][license-badge]][license]
[![Build Status][build-badge]][build]

User interface for Koku based on Patternfly [![Patternfly][pf-logo]][patternfly]

To submit an issue please visit https://issues.redhat.com/projects/COST/

## Requirements
* [NodeJS v14+][nodejs]
* [yarn 1.22+][yarn]

## Getting Started
1. Install requirements listed above.
2. Clone the repository, and open a terminal in the base of this project.
3. Run the command `yarn` to install all the dependencies.

### Running Development Server against a hosted Koku instance with webpack proxy
Note that this works with the stage, prod, and CI environments.

#### Start Development Server

```
yarn start
```

Follow the prompts that follow.

* Which platform environment you want to use; `stage`
* Which the UI environment you want to use; `beta`
* Do you want to use the Insights proxy; `no`

Point your browser to the [Overview page](https://stage.foo.redhat.com:1337/beta/openshift/cost-management)

### Running Development Server against a hosted Koku instance behind Insights Proxy
Note that this only works with the prod and CI environments. *This does not work with stage.*

1. Clone the [insights-proxy](https://github.com/RedHatInsights/insights-proxy) repository.
2. Run *insights-proxy* setup steps.

#### Start Insights Proxy

From the `insights-proxy` project directory run the following command to interact with the deployed environment:

```
SPANDX_CONFIG=/path/to/koku-ui/config/spandx.config.js bash /path/to/insights-proxy/scripts/run.sh
```

#### Start Development Server

```
yarn start
```

* Which platform environment you want to use; `ci`
* Which the UI environment you want to use; `beta`
* Do you want to use the Insights proxy; `yes`

Point your browser to the [Overview page](https://ci.foo.redhat.com:1337/beta/cost-management)

### Building
```
yarn build
```

### Testing
```
yarn test
```

### Manifest

Produces a file used by product security for vulnerability and compliance tracking.
```
yarn update:manifest
```

## Running Koku-UI & Koku-API locally 
### koku
Requirements:

Refer to the Koku project README file

1. setup & run koku (Refer to Koku repository for more details)
```
> git clone git@github.com:project-koku/koku.git
> cd [KOKU_GIT_REPO]
> pipenv shell "pre-commit install"
> make docker-up-min or make make docker-up-min-presto (do not rebuild docker images)
> make create-test-customer
> make load-test-customer-data
```

2. Check to see if containers are running (optional)
```
> docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
```

3. Watch Koku logs in another terminal (optional)
```
> docker-compose logs -f koku-server koku-worker
```

### koku-ui
Requirements:

[Reference here](#requirements)

1. Setup koku-ui
```
> yarn install
> export KEYCLOAK_PORT=4020 
```

2. Start koku-ui dev server (Answer **"yes"** to the first question to run against local APIs)

```
> yarn start
yarn run v1.22.10
$ node scripts/start-dev-server.js
? Do you want to use local api? Yes
? Which platform environment you want to use stage
? Which Chrome environment you want to use? beta
```

4. Open the following URL 
```
 http://localhost:8002/beta/openshift/cost-management
```

## Running Frontend-settings & Koku-API locally

Follow [setting up koku](#koku) to config the koku backend

1. Clone settings-frontend
```
> git clone https://github.com/RedHatInsights/settings-frontend.git
> cd settings-frontend <— where ever it has been cloned to
> npm install
```

2. Set the following in your environment
```
> export API_PORT=8000
> export LOCAL_API="/api/cost-management/v1/"
> export KEYCLOAK_PORT=4020
```

3. Start the dev server
```
> npm run start:standalone:beta
```

4. Open the following URL
```
http://localhost:1337/beta/settings/applications/cost-management
```

### Useful Links

#### Libs

* [TypeScript](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
* [React](https://reactjs.org/docs/react-api.html)
* [Redux](https://redux.js.org/) - State Management
  * [Redux-Thunk](https://github.com/reduxjs/redux-thunk#redux-thunk) - Middleware for returning functions from actions (gives access to dispatch and getState to action)
  * [typesafe-actions](https://github.com/piotrwitek/typesafe-actions#motivation) - Typesafe Redux
  * [Selectors](https://redux.js.org/introduction/learningresources#selectors)
* [Axios](https://github.com/axios/axios#axios-api) - HTTP Client
* [React Router](https://reacttraining.com/react-router/web/guides/philosophy)
  * [withRouter](https://reacttraining.com/react-router/web/api/withRouter) - Injects components with route props
  * [Link](https://reacttraining.com/react-router/web/api/Link)
  * [Route](https://reacttraining.com/react-router/web/api/Route)
* [React I18Next](https://react.i18next.com/) - React Wrapper for i18next
* [PatternFly React 4](https://patternfly-react.netlify.com/)
  * [Source](https://github.com/patternfly/patternfly-react/tree/master/packages) - `react-*/**`
  * [PRS](https://github.com/patternfly/patternfly-react/pulls?q=is%3Aopen+is%3Apr+label%3APF4)
  * [Issues](https://github.com/patternfly/patternfly-react/issues?q=is%3Aopen+is%3Aissue+label%3APF4)

#### Tools

* [React Devtools](https://github.com/facebook/react-devtools)
  * [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  * [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/)
* [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension)
  * [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/remotedev/)
* VSCode
  * [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) - Linting
    * In Settings add
    ```json
    {
      ...
      "tslint.autoFixOnSave": true,
      ...
    }
  * [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Autoformat
    * In settings add:
    ```json
    {
      ...
      "[typescript]": {
        "editor.formatOnSave": true
      },
      "[typescriptreact]": {
          "editor.formatOnSave": true
      },
      ...
    }
  * [Docker](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) - Manage Docker images from VSCode


[pf-logo]: https://www.patternfly.org/assets/img/logo.svg
[patternfly]: https://www.patternfly.org/
[yarn]: https://yarnpkg.com/en/
[nodejs]: https://nodejs.org/en/
[license-badge]: 	https://img.shields.io/github/license/project-koku/koku-ui.svg?longCache=true&style=for-the-badge
[license]: https://github.com/project-koku/koku-ui/blob/master/LICENSE
[build-badge]: https://img.shields.io/travis/project-koku/koku-ui.svg?style=for-the-badge
[build]: https://travis-ci.com/project-koku/UI
