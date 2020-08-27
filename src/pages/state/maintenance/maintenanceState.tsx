import { Stack, StackItem } from '@patternfly/react-core';
import { Maintenance } from '@redhat-cloud-services/frontend-components/components/Maintenance';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

type MaintenanceStateOwnProps = InjectedTranslateProps;
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
              {t('maintenance.empty_state_info')}{' '}
              <a href="https://status.redhat.com">status.redhat.com</a>.
            </StackItem>
            <StackItem>{t('maintenance.empty_state_thanks')}</StackItem>
          </Stack>
        }
      />
    );
  }
}

const MaintenanceState = translate()(MaintenanceStateBase);

export { MaintenanceState };
