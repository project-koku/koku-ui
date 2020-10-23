import React from 'react';

import { asyncComponent } from './asyncComponent';
import { isPageAccessAllowed } from './permissions';

const NotAuthorized = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'pages/state/notAuthorized'));

interface State {
  isLoading: boolean;
}

export function permissionsComponent<Props>(component, path: string) {
  let LoadedComponent: React.ComponentType<Props> = null;

  class PermissionsComponent extends React.Component<Props, State> {
    public state: State = {
      isLoading: !LoadedComponent,
    };

    public componentDidMount() {
      if (!this.state.isLoading) {
        return;
      }

      // Return NoAuthorized if the user doesn't have entitlements, permissions, and is not an org admin
      isPageAccessAllowed(path).then(hasPermissions => {
        LoadedComponent = hasPermissions ? component : NotAuthorized;
        this.setState({ isLoading: false });
      });
    }

    public render() {
      const { isLoading } = this.state;
      return isLoading ? null : <LoadedComponent {...this.props} />;
    }
  }

  return PermissionsComponent;
}
