import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

type MaintenanceStateOwnProps = InjectedTranslateProps;
type MaintenanceStateProps = MaintenanceStateOwnProps;

class MaintenanceStateBase extends React.Component<MaintenanceStateProps> {
  public render() {
    const { t } = this.props;

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={ExclamationTriangleIcon} />
        <Title headingLevel="h2" size="lg">
          {t('maintenance.empty_state_title')}
        </Title>
        <EmptyStateBody>{t('maintenance.empty_state_desc')}</EmptyStateBody>
      </EmptyState>
    );
  }
}

const MaintenanceState = translate()(MaintenanceStateBase);

export { MaintenanceState };
