import { asyncComponent } from 'components/async';
import React from 'react';

const PermissionsWrapper = asyncComponent(
  () => import(/* webpackChunkName: "permissionsWrapper" */ 'components/permissions/permissionsWrapper')
);

interface State {
  // TBD...
}

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsComponent extends React.Component<Props, State> {
    public render() {
      return (
        <PermissionsWrapper>
          <AysncComponent {...this.props} />
        </PermissionsWrapper>
      );
    }
  }
  return PermissionsComponent;
}
