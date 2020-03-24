import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { onboardingActions } from 'store/onboarding';
import { styles } from './noSourcesState.styles';

interface Props extends InjectedTranslateProps {
  openModal: typeof onboardingActions.openModal;
}

class NoSourcesStateBase extends React.Component<Props> {
  public render() {
    const { t, openModal } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={WrenchIcon} />
          <Title size="lg">{t('source_details.no_sources.title')}</Title>
          <EmptyStateBody>
            <p>{t('source_details.no_sources.desc')}</p>
            <br />
            <p>{t('source_details.no_sources.sub_desc')}</p>
          </EmptyStateBody>
          <Button variant="primary" onClick={openModal}>
            {t('source_details.no_sources.action')}
          </Button>
        </EmptyState>
      </div>
    );
  }
}

export default translate()(
  connect(null, {
    openModal: onboardingActions.openModal,
  })(NoSourcesStateBase)
);
