import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
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
      <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
        <EmptyStateHeader
          titleText={<>{intl.formatMessage(messages.noOptimizationsTitle)}</>}
          icon={<EmptyStateIcon icon={OptimizationIcon as any} />}
          headingLevel="h1"
        />
        <EmptyStateBody>{intl.formatMessage(messages.noOptimizationsDesc)}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const NoOptimizationsState = injectIntl(NoOptimizationsStateBase);

export { NoOptimizationsState };
