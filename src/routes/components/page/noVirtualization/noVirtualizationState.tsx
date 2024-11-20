import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface NoVirtualizationStateOwnProps {
  // TBD...
}

type NoVirtualizationStateProps = NoVirtualizationStateOwnProps & WrappedComponentProps;

class NoVirtualizationStateBase extends React.Component<NoVirtualizationStateProps, any> {
  public render() {
    const { intl } = this.props;

    // Todo: Update URL when virtualization docs are available
    return (
      <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
        <EmptyStateHeader
          titleText={intl.formatMessage(messages.noVirtualizationStateTitle)}
          icon={<EmptyStateIcon icon={CubesIcon} />}
          headingLevel="h5"
        />
        <EmptyStateBody>{intl.formatMessage(messages.noVirtualizationStateDesc)}</EmptyStateBody>
        <EmptyStateFooter>
          <a href={intl.formatMessage(messages.docsCostManagement)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.learnMore)}
          </a>
        </EmptyStateFooter>
      </EmptyState>
    );
  }
}

const NoVirtualizationState = injectIntl(NoVirtualizationStateBase);

export { NoVirtualizationState };
