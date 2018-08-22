# Koku UI

[![AGPLv3][license-badge]][license]
[![Build Status][build-badge]][build]

User interface for Koku based on Patternfly [![Patternfly][pf-logo]][patternfly]

## Requirements
* [NodeJS v8+][nodejs]
* [yarn 1.5+][yarn]

## Getting Started
1. Install requirements listed above.
2. Clone repo, and open a terminal in the base of this project.
3. Run the command `yarn` to install all the dependencies.

### Running Development Server against a local running Koku

Follow this [Getting Started Guide](https://github.com/project-koku/koku#getting-started) to setup koku api.

```
yarn start
```

### Running Development Server against a hosted Koku instance

```
APP_NAMESPACE=koku-{dev|staging} yarn start
```

As a convenience `start:dev` has been provided to target the hosted dev enviornment.

```
yarn start:dev
```

### Building
```
yarn build
```

### Testing
```
yarn test
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
[build]: https://travis-ci.org/project-koku/UI
