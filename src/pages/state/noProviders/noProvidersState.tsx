import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons/dist/js/icons/dollar-sign-icon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';
import { getReleasePath } from 'utils/pathname';

import { styles } from './noProvidersState.styles';

type NoProvidersStateOwnProps = WithTranslation;
type NoProvidersStateProps = NoProvidersStateOwnProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getViewSources = () => {
    const { t } = this.props;
    const release = getReleasePath();

    return (
      <a href={`${release}/settings/sources`} {...getTestProps(testIds.providers.view_all_link)}>
        {t('providers.view_sources')}
      </a>
    );
  };

  public render() {
    const { t } = this.props;

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={DollarSignIcon} />
        <Title headingLevel="h5" size="lg">
          {t('providers.empty_state_title')}
        </Title>
        <EmptyStateBody>{t('providers.empty_state_desc')}</EmptyStateBody>
        <div style={styles.viewSources}>{this.getViewSources()}</div>
      </EmptyState>
    );
  }
}

const NoProvidersState = withTranslation()(NoProvidersStateBase);

export { NoProvidersState };
