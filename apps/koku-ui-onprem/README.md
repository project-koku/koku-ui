# Koku UI OnPrem

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)

React.js app for Cost Management OnPrem.

User interface is based on [Patternfly].

Submit issues in [Jira].

## Requirements

* [NodeJS v20.15+][nodejs]
* [npm v10.8+][npm]

## Getting Started

1. Install requirements listed above.
2. Run `npm ci` to isntall all the dependencies.

## Building apps/koku-ui-onprem
```
npm run build
```

## Running apps/koku-ui-onprem

```
export API_PROXY_HOST=<backend_url>
export API_TOKEN=<auth_token_for_backend>
```

From the root of the repo, run
```
npm run start:onprem
```

This script will run concurrent dev builds of hccm, ros and onprem applications.
After the successful build, navigate to http://localhost:9000


[Jira]: https://issues.redhat.com/projects/COST/
[Patternfly]: https://www.patternfly.org/