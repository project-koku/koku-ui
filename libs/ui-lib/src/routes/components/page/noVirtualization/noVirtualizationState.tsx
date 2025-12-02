import messages from '@koku-ui/i18n/locales/messages';
import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
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
      <EmptyState
        headingLevel="h5"
        icon={CubesIcon}
        titleText={intl.formatMessage(messages.noVirtualizationStateTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
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
