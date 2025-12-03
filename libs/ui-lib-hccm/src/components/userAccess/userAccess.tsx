import React from 'react';

import { asyncComponent } from '../async';

const PermissionsWrapper = asyncComponent(() => import(/* webpackChunkName: "permissionsWrapper" */ '../permissions'));

// Permissions component wrapper
function userAccess<Props>(Component) {
  const PermissionsComponent: React.FC<Props> = props => {
    return (
      <PermissionsWrapper>
        <Component {...props} />
      </PermissionsWrapper>
    );
  };
  return PermissionsComponent;
}

export default userAccess;
