import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
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
      <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
        <EmptyStateHeader
          titleText={<>{intl.formatMessage(messages.noDataStateTitle)}</>}
          icon={<EmptyStateIcon icon={PlusCircleIcon} />}
          headingLevel="h5"
        />
        <EmptyStateBody>{intl.formatMessage(messages.noDataStateDesc)}</EmptyStateBody>
        <EmptyStateFooter>
          {showReload && (
            <Button variant="primary" onClick={() => window.location.reload()}>
              {intl.formatMessage(messages.noDataStateRefresh)}
            </Button>
          )}
        </EmptyStateFooter>
      </EmptyState>
    );
  }
}

const NoDataState = injectIntl(NoDataStateBase);

export { NoDataState };
