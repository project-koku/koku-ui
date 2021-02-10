import asyncComponent from 'components/async/asyncComponent';
import React from 'react';

const InactiveSources = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ 'components/sources/inactiveSources')
);
const Permissions = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ 'components/async/permissionsComponent')
);

interface State {
  // TBD...
}

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsComponent extends React.Component<Props, State> {
    public render() {
      return (
        <Permissions>
          <InactiveSources {...this.props} />
          <AysncComponent {...this.props} />
        </Permissions>
      );
    }
  }
  return PermissionsComponent;
}
