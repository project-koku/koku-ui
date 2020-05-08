import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons/dist/js/icons/dollar-sign-icon';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import { getReleasePath } from 'utils/pathname';
import { styles } from './noProvidersState.styles';

type NoProvidersStateOwnProps = InjectedTranslateProps;
type NoProvidersStateProps = NoProvidersStateOwnProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getViewSources = () => {
    const { t } = this.props;
    const release = getReleasePath();

    return (
      <a
        href={`${release}/settings/sources`}
        {...getTestProps(testIds.providers.view_all_link)}
      >
        {t('providers.view_sources')}
      </a>
    );
  };

  public render() {
    const { t } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={DollarSignIcon} />
          <Title headingLevel="h2" size="lg">
            {t('providers.empty_state_title')}
          </Title>
          <EmptyStateBody>{t('providers.empty_state_desc')}</EmptyStateBody>
          <div style={styles.viewSources}>{this.getViewSources()}</div>
        </EmptyState>
      </div>
    );
  }
}

const NoProvidersState = translate()(connect()(NoProvidersStateBase));

export { NoProvidersState };
