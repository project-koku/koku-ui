import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { OptimizationIcon } from 'routes/components/icons/optimizationIcon';

interface NoOptimizationsStateOwnProps {
  // TBD...
}

type NoOptimizationsStateProps = NoOptimizationsStateOwnProps & WrappedComponentProps;

class NoOptimizationsStateBase extends React.Component<NoOptimizationsStateProps, any> {
  public render() {
    const { intl } = this.props;

    return (
      <EmptyState
        headingLevel="h1"
        icon={OptimizationIcon as any}
        titleText={intl.formatMessage(messages.noOptimizationsTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>{intl.formatMessage(messages.noOptimizationsDesc)}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const NoOptimizationsState = injectIntl(NoOptimizationsStateBase);

export { NoOptimizationsState };
