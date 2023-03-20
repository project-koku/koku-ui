import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface NoDataStateOwnProps {
  showReload?: boolean;
}

type NoDataStateProps = NoDataStateOwnProps & WrappedComponentProps;

class NoDataStateBase extends React.Component<NoDataStateProps, any> {
  public render() {
    const { intl, showReload = true } = this.props;

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={PlusCircleIcon} />
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

const NoDataState = injectIntl(NoDataStateBase);

export { NoDataState };
