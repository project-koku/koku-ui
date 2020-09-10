import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/js/icons/file-invoice-dollar-icon';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { isCostModelWritePermission } from 'store/rbac/selectors';

import { ReadOnlyTooltip } from './components/readOnlyTooltip';

interface Props extends InjectedTranslateProps {
  openModal: () => void;
  isWritePermission: boolean;
}

class NoSourcesStateBase extends React.Component<Props> {
  public render() {
    const { t, openModal, isWritePermission } = this.props;

    return (
      <Main>
        <EmptyState
          variant={EmptyStateVariant.large}
          className="pf-m-redhat-font"
        >
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
      </Main>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isWritePermission: isCostModelWritePermission(state),
  }))
)(translate()(NoSourcesStateBase));
