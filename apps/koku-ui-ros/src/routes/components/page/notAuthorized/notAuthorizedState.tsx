import UnauthorizedAccess from '@patternfly/react-component-groups/dist/esm/UnauthorizedAccess';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface NotAuthorizedStateOwnProps {
  pathname?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WrappedComponentProps;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps, any> {
  public render() {
    const { intl, pathname } = this.props;

    let msg;

    switch (pathname) {
      case formatPath(routes.optimizationsBadge.path):
      case formatPath(routes.optimizationsBreakdown.path):
      case formatPath(routes.optimizationsContainersTable.path):
      case formatPath(routes.optimizationsDetails.path):
      case formatPath(routes.optimizationsLink.path):
      case formatPath(routes.optimizationsProjectsTable.path):
      case formatPath(routes.optimizationsSummary.path):
      default:
        msg = messages.costManagement;
        break;
    }
    return <UnauthorizedAccess serviceName={intl.formatMessage(msg)} />;
  }
}

const NotAuthorizedState = injectIntl(NotAuthorizedStateBase);

export { NotAuthorizedState };
