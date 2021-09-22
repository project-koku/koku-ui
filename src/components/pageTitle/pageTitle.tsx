import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { paths, routes } from 'routes';

interface PageTitleOwnProps extends RouteComponentProps<void> {
  children?: React.ReactNode;
}

interface PageTitleState {
  // TBD...
}

type PageTitleProps = PageTitleOwnProps & WrappedComponentProps;

class PageTitleBase extends React.Component<PageTitleProps> {
  protected defaultState: PageTitleState = {
    // TBD...
  };
  public state: PageTitleState = { ...this.defaultState };

  private getPath() {
    const { location }: any = this.props;

    // cost models may include :uuid
    const _pathname =
      location.pathname && location.pathname.startsWith(paths.costModels) ? paths.costModels : location.pathname;
    const currRoute = routes.find(({ path }) => path === _pathname);

    return currRoute ? currRoute.path : undefined;
  }

  private getPageTitle() {
    const path = this.getPath();

    switch (path) {
      case paths.explorer:
        return messages.PageTitleExplorer;
      case paths.overview:
        return messages.PageTitleOverview;
      case paths.awsDetails:
      case paths.awsDetailsBreakdown:
        return messages.PageTitleAWS;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        return messages.PageTitleAzure;
      case paths.costModels:
        return messages.PageTitleCostModels;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        return messages.PageTitleGCP;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        return messages.PageTitleIBM;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        return messages.PageTitleOCP;
      default:
        return messages.PageTitleDefault;
    }
  }

  public render() {
    const { children = null, intl } = this.props;

    // Set page title
    document.title = intl.formatMessage(this.getPageTitle());

    return children;
  }
}

const PageTitle = injectIntl(withRouter(PageTitleBase));

export { PageTitle };
