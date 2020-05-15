import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { styles } from './maintenanceState.styles';

type MaintenanceStateOwnProps = WrappedComponentProps;
type MaintenanceStateProps = MaintenanceStateOwnProps;

class MaintenanceStateBase extends React.Component<MaintenanceStateProps> {
  public render() {
    const { intl } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title size="lg">
            {intl.formatMessage({ id: 'maintenance.empty_state_title' })}
          </Title>
          <EmptyStateBody>
            {intl.formatMessage({ id: 'maintenance.empty_state_desc' })}
          </EmptyStateBody>
        </EmptyState>
      </div>
    );
  }
}

const MaintenanceState = injectIntl(connect()(MaintenanceStateBase));

export { MaintenanceState };
