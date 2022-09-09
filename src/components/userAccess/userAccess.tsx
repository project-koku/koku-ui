import { asyncComponent } from 'components/async';
import React from 'react';

const PermissionsWrapper = asyncComponent(
  () => import(/* webpackChunkName: "permissionsWrapper" */ './permissionsWrapper')
);

// Permissions component wrapper
export function userAccess<Props>(Component) {
  const PermissionsComponent: React.FC<Props> = props => {
    return (
      <PermissionsWrapper>
        <Component {...props} />
      </PermissionsWrapper>
    );
  };
  return PermissionsComponent;
}
