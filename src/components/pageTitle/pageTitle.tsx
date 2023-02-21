import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { routes } from 'routes';
import { formatPath, usePathname } from 'utils/paths';

interface PageTitleOwnProps {
  children?: React.ReactNode;
}

type PageTitleProps = PageTitleOwnProps & WrappedComponentProps;

const PageTitleBase: React.FC<PageTitleProps> = ({ children = null, intl }) => {
  const getPageTitle = () => {
    const pathname = usePathname();
    switch (pathname) {
      case formatPath(routes.explorer.path):
        return messages.pageTitleExplorer;
      case formatPath(routes.overview.path):
        return messages.pageTitleOverview;
      default:
        return messages.pageTitleDefault;
    }
  };

  // Set page title
  document.title = intl.formatMessage(getPageTitle());

  return <>{children}</>;
};

const PageTitle = injectIntl(PageTitleBase);

export default PageTitle;
