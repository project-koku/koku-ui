import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/js/icons/file-invoice-dollar-icon';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface NoDataStateOwnProps {
  showReload?: boolean;
}

type NoDataStateProps = NoDataStateOwnProps & RouteComponentProps<void>;

class NoDataStateBase extends React.Component<NoDataStateProps> {
  public render() {
    const { showReload = true } = this.props;
    const intl = createIntlEnv();

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={FileInvoiceDollarIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage(messages.NoDataStateTitle)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(messages.NoDataStateDesc)}</EmptyStateBody>
        {showReload && (
          <Button variant="primary" onClick={() => window.location.reload()}>
            {intl.formatMessage(messages.NoDataStateRefresh)}
          </Button>
        )}
      </EmptyState>
    );
  }
}

const NoDataState = withRouter(NoDataStateBase);

export { NoDataState };
