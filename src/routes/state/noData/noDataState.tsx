import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/esm/icons/file-invoice-dollar-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface NoDataStateOwnProps {
  showReload?: boolean;
}

type NoDataStateProps = NoDataStateOwnProps & RouteComponentProps<void> & WrappedComponentProps;

class NoDataStateBase extends React.Component<NoDataStateProps> {
  public render() {
    const { intl, showReload = true } = this.props;

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={FileInvoiceDollarIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage(messages.noDataStateTitle)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(messages.noDataStateDesc)}</EmptyStateBody>
        {showReload && (
          <Button variant="primary" onClick={() => window.location.reload()}>
            {intl.formatMessage(messages.noDataStateRefresh)}
          </Button>
        )}
      </EmptyState>
    );
  }
}

const NoDataState = injectIntl(withRouter(NoDataStateBase));

export { NoDataState };
