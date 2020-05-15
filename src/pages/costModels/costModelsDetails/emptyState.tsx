import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { isCostModelWritePermission } from 'store/rbac/selectors';
import { ReadOnlyTooltip } from './components/readOnlyTooltip';
import { styles } from './emptyState.styles';

interface Props extends WrappedComponentProps {
  openModal: () => void;
  isWritePermission: boolean;
}

class NoSourcesStateBase extends React.Component<Props> {
  public render() {
    const { intl, openModal, isWritePermission } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={FileInvoiceDollarIcon} />
          <Title size="lg">
            {intl.formatMessage({
              id: 'cost_models_details.empty_state.title',
            })}
          </Title>
          <EmptyStateBody>
            <p>
              {intl.formatMessage({
                id: 'cost_models_details.empty_state.desc',
              })}
            </p>
          </EmptyStateBody>
          {isWritePermission && (
            <Button variant="primary" onClick={openModal}>
              {intl.formatMessage({
                id: 'cost_models_details.empty_state.primary_action',
              })}
            </Button>
          )}
          {!isWritePermission && (
            <EmptyStateSecondaryActions>
              <ReadOnlyTooltip isDisabled>
                <Button isDisabled>
                  {intl.formatMessage({
                    id: 'cost_models_details.empty_state.primary_action',
                  })}
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
)(injectIntl(NoSourcesStateBase));
