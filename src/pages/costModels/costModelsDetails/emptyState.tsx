import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/js/icons/file-invoice-dollar-icon';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { isCostModelWritePermission } from 'store/rbac/selectors';
import { ReadOnlyTooltip } from './components/readOnlyTooltip';
import { styles } from './emptyState.styles';

interface Props extends InjectedTranslateProps {
  openModal: () => void;
  isWritePermission: boolean;
}

class NoSourcesStateBase extends React.Component<Props> {
  public render() {
    const { t, openModal, isWritePermission } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={FileInvoiceDollarIcon} />
          <Title headingLevel="h2" size="lg">
            {t('cost_models_details.empty_state.title')}
          </Title>
          <EmptyStateBody>
            <p>{t('cost_models_details.empty_state.desc')}</p>
          </EmptyStateBody>
          {isWritePermission && (
            <Button variant="primary" onClick={openModal}>
              {t('cost_models_details.empty_state.primary_action')}
            </Button>
          )}
          {!isWritePermission && (
            <EmptyStateSecondaryActions>
              <ReadOnlyTooltip isDisabled>
                <Button isDisabled>
                  {t('cost_models_details.empty_state.primary_action')}
                </Button>
              </ReadOnlyTooltip>
            </EmptyStateSecondaryActions>
          )}
        </EmptyState>
      </div>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isWritePermission: isCostModelWritePermission(state),
  }))
)(translate()(NoSourcesStateBase));
