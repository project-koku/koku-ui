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
  const usePageTitle = () => {
    const pathname = usePathname();
    switch (pathname) {
      case formatPath(routes.optimizationsBadge.path):
      case formatPath(routes.optimizationsBreakdown.path):
      case formatPath(routes.optimizationsContainersTable.path):
      case formatPath(routes.optimizationsDetails.path):
      case formatPath(routes.optimizationsLink.path):
      case formatPath(routes.optimizationsProjectsTable.path):
      case formatPath(routes.optimizationsSummary.path):
        return messages.pageTitleOptimizations;
      default:
        return messages.pageTitleDefault;
    }
  };

  // Set page title
  document.title = intl.formatMessage(usePageTitle());

  return <>{children}</>;
};

const PageTitle = injectIntl(PageTitleBase);

export default PageTitle;
