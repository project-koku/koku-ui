import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import { getReleasePath } from 'utils/pathname';
import { styles } from './noProvidersState.styles';

type NoProvidersStateOwnProps = WrappedComponentProps;
type NoProvidersStateProps = NoProvidersStateOwnProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getViewSources = () => {
    const { intl } = this.props;
    const release = getReleasePath();

    return (
      <a
        href={`${release}/settings/sources`}
        {...getTestProps(testIds.providers.view_all_link)}
      >
        {intl.formatMessage({ id: 'providers.view_sources' })}
      </a>
    );
  };

  public render() {
    const { intl } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={DollarSignIcon} />
          <Title size="lg">
            {intl.formatMessage({ id: 'providers.empty_state_title' })}
          </Title>
          <EmptyStateBody>
            {intl.formatMessage({ id: 'providers.empty_state_desc' })}
          </EmptyStateBody>
          <div style={styles.viewSources}>{this.getViewSources()}</div>
        </EmptyState>
      </div>
    );
  }
}

const NoProvidersState = injectIntl(connect()(NoProvidersStateBase));

export { NoProvidersState };
