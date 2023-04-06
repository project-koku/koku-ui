import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
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
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={OptimizationIcon as any} />
        <Title headingLevel="h1" size="lg">
          {intl.formatMessage(messages.noOptimizationsTitle)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(messages.noOptimizationsDesc)}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const NoOptimizationsState = injectIntl(NoOptimizationsStateBase);

export { NoOptimizationsState };
