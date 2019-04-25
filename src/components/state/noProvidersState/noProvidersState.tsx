import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import { onboardingActions } from 'store/onboarding';
import { getTestProps, testIds } from 'testIds';
import { styles } from './noProvidersState.styles';

type NoProvidersStateOwnProps = InjectedTranslateProps;

interface NoProvidersStateDispatchProps {
  openProvidersModal: typeof onboardingActions.openModal;
}

type NoProvidersStateProps = NoProvidersStateOwnProps &
  NoProvidersStateDispatchProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getViewSources = () => {
    const { t } = this.props;

    return (
      <Link to="/sources" {...getTestProps(testIds.providers.view_all_link)}>
        {t('providers.view_sources')}
      </Link>
    );
  };

  public render() {
    const { t } = this.props;

    return (
      <div className={css(styles.container)}>
        <EmptyState>
          <EmptyStateIcon icon={DollarSignIcon} />
          <Title size="lg">{t('providers.empty_state_title')}</Title>
          <EmptyStateBody>{t('providers.empty_state_desc')}</EmptyStateBody>
          <div className={css(styles.viewSources)}>{this.getViewSources()}</div>
        </EmptyState>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<NoProvidersStateOwnProps, {}>(
  (state, {}) => {
    return {};
  }
);

const NoProvidersState = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: onboardingActions.openModal,
    }
  )(NoProvidersStateBase)
);

export { NoProvidersState };
