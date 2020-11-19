import React from 'react';

import { asyncComponent } from './asyncComponent';
import { hasEntitledPermissions, hasOrgAdminPermissions, hasPagePermissions } from './permissions';

const InactiveSources = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ 'components/sources/inactiveSources')
);
const NotAuthorized = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'pages/state/notAuthorized'));

interface State {
  hasPermissions: boolean;
  isEntitled: boolean;
  isLoading: boolean;
  isOrgAdmin: boolean;
}

const getPermissions = async (pathname: string) => {
  const hasPermissions = await hasPagePermissions(pathname);
  const isEntitled = await hasEntitledPermissions();
  const isOrgAdmin = await hasOrgAdminPermissions();

  return {
    hasPermissions,
    isEntitled,
    isOrgAdmin,
  };
};

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsComponent extends React.Component<Props, State> {
    public state: State = {
      hasPermissions: false,
      isEntitled: false,
      isLoading: true,
      isOrgAdmin: false,
    };

    public componentDidMount() {
      const { location }: any = this.props;

      // Get user entitlements and permissions for the current page
      getPermissions(location.pathname).then(({ hasPermissions, isEntitled, isOrgAdmin }) => {
        this.setState({ hasPermissions, isEntitled, isLoading: false, isOrgAdmin });
      });
    }

    public render() {
      const { location }: any = this.props;
      const { hasPermissions, isEntitled, isLoading, isOrgAdmin } = this.state;

      if (isLoading) {
        return null;
      }
      if (isEntitled && (isOrgAdmin || hasPermissions)) {
        return (
          <>
            <InactiveSources {...this.props} />
            <AysncComponent {...this.props} />
          </>
        );
      }
      // Page access denied because user doesn't have entitlements, permissions, and is not an org admin
      return <NotAuthorized pathname={location.pathname} />;
    }
  }
  return PermissionsComponent;
}
