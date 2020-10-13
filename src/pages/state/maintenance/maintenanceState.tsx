import { Stack, StackItem } from '@patternfly/react-core';
import { Maintenance } from '@redhat-cloud-services/frontend-components/components/Maintenance';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

type MaintenanceStateOwnProps = WithTranslation;
type MaintenanceStateProps = MaintenanceStateOwnProps;

class MaintenanceStateBase extends React.Component<MaintenanceStateProps> {
  public render() {
    const { t } = this.props;

    return (
      <Maintenance
        description={
          <Stack>
            <StackItem>{t('maintenance.empty_state_desc')}</StackItem>
            <StackItem>
              {t('maintenance.empty_state_info')} <a href="https://status.redhat.com">status.redhat.com</a>.
            </StackItem>
            <StackItem>{t('maintenance.empty_state_thanks')}</StackItem>
          </Stack>
        }
      />
    );
  }
}

const MaintenanceState = withTranslation()(MaintenanceStateBase);

export { MaintenanceState };
