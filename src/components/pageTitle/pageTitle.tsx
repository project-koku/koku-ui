import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { paths, routes } from 'routes';

interface PageTitleOwnProps {
  children?: React.ReactNode;
}

type PageTitleProps = PageTitleOwnProps & RouteComponentProps<void> & WrappedComponentProps;

const PageTitleBase: React.FC<PageTitleProps> = ({ children = null, intl, location }) => {
  const getPath = () => {
    const currRoute = routes.find(({ path }) => path === location.pathname);
    return currRoute ? currRoute.path : undefined;
  };

  const getPageTitle = () => {
    switch (getPath()) {
      case paths.explorer:
        return messages.pageTitleExplorer;
      case paths.overview:
        return messages.pageTitleOverview;
      default:
        return messages.pageTitleDefault;
    }
  };

  // Set page title
  document.title = intl.formatMessage(getPageTitle());

  return <>{children}</>;
};

const PageTitle = withRouter(PageTitleBase);
export default injectIntl(PageTitle);
