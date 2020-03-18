import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './emptyState.styles';

interface Props extends InjectedTranslateProps {
  openModal: () => void;
}

class NoSourcesStateBase extends React.Component<Props> {
  public render() {
    const { t, openModal } = this.props;

    return (
      <div className={css(styles.container)}>
        <EmptyState>
          <EmptyStateIcon icon={FileInvoiceDollarIcon} />
          <Title size="lg">{t('cost_models_details.empty_state.title')}</Title>
          <EmptyStateBody>
            <p>{t('cost_models_details.empty_state.desc')}</p>
          </EmptyStateBody>
          <Button variant="primary" onClick={openModal}>
            {t('cost_models_details.empty_state.primary_action')}
          </Button>
        </EmptyState>
      </div>
    );
  }
}

export default translate()(NoSourcesStateBase);
