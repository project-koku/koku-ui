import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

type WelcomeStateBaseOwnProps = WrappedComponentProps;

class WelcomeStateBase extends React.Component<WelcomeStateBaseOwnProps, any> {
  public render() {
    const { intl } = this.props;

    return (
      <EmptyState
        headingLevel="h5"
        icon={PlusCircleIcon}
        titleText={intl.formatMessage(messages.welcomeTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>
          {intl.formatMessage(messages.welcomeInfo, {
            url: (
              <a href={intl.formatMessage(messages.kokuAppUrl)} rel="noreferrer" target="_blank">
                koku-ui-ros
              </a>
            ),
          })}
        </EmptyStateBody>
      </EmptyState>
    );
  }
}

const WelcomeState = injectIntl(WelcomeStateBase);
export { WelcomeState };
