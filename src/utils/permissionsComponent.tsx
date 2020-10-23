import React from 'react';

import { asyncComponent } from './asyncComponent';
import { isPageAccessAllowed } from './permissions';

const InactiveSources = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ 'components/sources/inactiveSources')
);
const NotAuthorized = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'pages/state/notAuthorized'));

interface State {
  isAuthorized: boolean;
  isLoading: boolean;
}

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsComponent extends React.Component<Props, State> {
    public state: State = {
      isAuthorized: false,
      isLoading: true,
    };

    public componentDidMount() {
      const { location }: any = this.props;

      // Test if user has permissions to access the current page
      isPageAccessAllowed(location.pathname).then(hasPermissions => {
        this.setState({ isAuthorized: hasPermissions, isLoading: false });
      });
    }

    public render() {
      const { isAuthorized, isLoading } = this.state;
      if (isLoading) {
        return null;
      }
      if (isAuthorized) {
        return (
          <>
            <InactiveSources {...this.props} />
            <AysncComponent {...this.props} />
          </>
        );
      }
      // User doesn't have entitlements, permissions, and is not an org admin
      return <NotAuthorized />;
    }
  }
  return PermissionsComponent;
}
