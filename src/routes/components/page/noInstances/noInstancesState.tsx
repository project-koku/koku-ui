import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
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
      <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
        <EmptyStateHeader
          titleText={intl.formatMessage(messages.noInstancesTitle)}
          icon={<EmptyStateIcon icon={PlusCircleIcon} />}
          headingLevel="h1"
        />
        <EmptyStateBody>{intl.formatMessage(messages.noInstancesDesc)}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const NoInstancesState = injectIntl(NoInstancesStateBase);

export { NoInstancesState };
