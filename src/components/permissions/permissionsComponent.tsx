import { AccountSettings } from 'components/accountSettings';
import { AppSettings } from 'components/appSettings';
import { asyncComponent } from 'components/async';
import React from 'react';
import { getRoutePath, paths } from 'routes';

const InactiveSources = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'components/inactiveSources'));
const Permissions = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'components/permissions'));

interface State {
  // TBD...
}

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsComponent extends React.Component<Props, State> {
    public render() {
      const path = getRoutePath((this.props as any).location);
      return (
        <AppSettings isResetState>
          <Permissions>
            <InactiveSources {...this.props} />
            {path === paths.costModels ? (
              <AysncComponent {...this.props} />
            ) : (
              <AccountSettings>
                <AysncComponent {...this.props} />
              </AccountSettings>
            )}
          </Permissions>
        </AppSettings>
      );
    }
  }
  return PermissionsComponent;
}
