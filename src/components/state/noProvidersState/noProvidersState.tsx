import {
  Button,
  ButtonType,
  ButtonVariant,
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
import { createMapStateToProps } from 'store/common';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { styles } from './noProvidersState.styles';

type NoProvidersStateOwnProps = InjectedTranslateProps;

interface NoProvidersStateDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type NoProvidersStateProps = NoProvidersStateOwnProps &
  NoProvidersStateDispatchProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getAddSourceButton = () => {
    const { openProvidersModal, t } = this.props;

    return (
      <Button
        {...getTestProps(testIds.providers.add_btn)}
        onClick={openProvidersModal}
        type={ButtonType.submit}
        variant={ButtonVariant.primary}
      >
        {t('providers.add_source')}
      </Button>
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
          {this.getAddSourceButton()}
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
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(NoProvidersStateBase)
);

export { NoProvidersState };
