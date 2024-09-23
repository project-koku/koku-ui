import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface NoInstancesStateOwnProps {
  // TBD...
}

type NoInstancesStateProps = NoInstancesStateOwnProps & WrappedComponentProps;

class NoInstancesStateBase extends React.Component<NoInstancesStateProps, any> {
  public render() {
    const { intl } = this.props;

    return (
      <EmptyState
        headingLevel="h1"
        icon={PlusCircleIcon}
        titleText={intl.formatMessage(messages.noInstancesTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>{intl.formatMessage(messages.noInstancesDesc)}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const NoInstancesState = injectIntl(NoInstancesStateBase);

export { NoInstancesState };
