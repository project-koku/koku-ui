import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { routes } from '../../routes';
import { formatPath, usePathname } from '../../utils/paths';

interface PageTitleOwnProps {
  children?: React.ReactNode;
}

type PageTitleProps = PageTitleOwnProps & WrappedComponentProps;

const PageTitleBase: React.FC<PageTitleProps> = ({ children = null, intl }) => {
  const usePageTitle = () => {
    const pathname = usePathname();
    switch (pathname) {
      case formatPath(routes.awsBreakdown.path):
      case formatPath(routes.awsDetails.path):
        return messages.pageTitleAws;
      case formatPath(routes.azureBreakdown.path):
      case formatPath(routes.azureDetails.path):
        return messages.pageTitleAzure;
      case formatPath(routes.costModel.basePath):
        return messages.pageTitleCostModels;
      case formatPath(routes.explorer.path):
        return messages.pageTitleExplorer;
      case formatPath(routes.gcpBreakdown.path):
      case formatPath(routes.gcpDetails.path):
        return messages.pageTitleGcp;
      case formatPath(routes.ocpBreakdown.path):
      case formatPath(routes.ocpDetails.path):
        return messages.pageTitleOcp;
      case formatPath(routes.optimizationsDetails.path):
      case formatPath(routes.optimizationsBreakdown.path):
        return messages.pageTitleOptimizations;
      case formatPath(routes.overview.path):
        return messages.pageTitleOverview;
      case formatPath(routes.settings.path):
        return messages.pageTitleSettings;
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
