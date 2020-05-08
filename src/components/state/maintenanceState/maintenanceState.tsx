import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { styles } from './maintenanceState.styles';

type MaintenanceStateOwnProps = InjectedTranslateProps;
type MaintenanceStateProps = MaintenanceStateOwnProps;

class MaintenanceStateBase extends React.Component<MaintenanceStateProps> {
  public render() {
    const { t } = this.props;

    return (
      <div style={styles.container}>
        <EmptyState>
          <EmptyStateIcon icon={ExclamationTriangleIcon} />
          <Title headingLevel="h2" size="lg">
            {t('maintenance.empty_state_title')}
          </Title>
          <EmptyStateBody>{t('maintenance.empty_state_desc')}</EmptyStateBody>
        </EmptyState>
      </div>
    );
  }
}

const MaintenanceState = translate()(connect()(MaintenanceStateBase));

export { MaintenanceState };
