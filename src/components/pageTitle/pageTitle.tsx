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
      case formatPath(routes.awsDetails.path):
      case formatPath(routes.awsDetailsBreakdown.path):
        return messages.pageTitleAws;
      case formatPath(routes.azureDetails.path):
      case formatPath(routes.azureDetailsBreakdown.path):
        return messages.pageTitleAzure;
      case formatPath(routes.costModel.path):
      case formatPath(routes.costModelsDetails.path):
      case formatPath(routes.costModelOld.path):
      case formatPath(routes.costModelsDetailsOld.path):
        return messages.pageTitleCostModels;
      case formatPath(routes.explorer.path):
        return messages.pageTitleExplorer;
      case formatPath(routes.gcpDetails.path):
      case formatPath(routes.gcpDetailsBreakdown.path):
        return messages.pageTitleGcp;
      case formatPath(routes.ibmDetails.path):
      case formatPath(routes.ibmDetailsBreakdown.path):
        return messages.pageTitleIbm;
      case formatPath(routes.ociDetails.path):
      case formatPath(routes.ociDetailsBreakdown.path):
        return messages.pageTitleOci;
      case formatPath(routes.ocpDetails.path):
      case formatPath(routes.ocpDetailsBreakdown.path):
        return messages.pageTitleOcp;
      case formatPath(routes.optimizations.path):
        return messages.pageTitleOptimizations;
      case formatPath(routes.overview.path):
        return messages.pageTitleOverview;
      case formatPath(routes.rhelDetails.path):
      case formatPath(routes.rhelDetailsBreakdown.path):
        return messages.pageTitleRhel;
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
