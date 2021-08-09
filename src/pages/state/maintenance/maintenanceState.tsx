import { Stack, StackItem } from '@patternfly/react-core';
import Maintenance from '@redhat-cloud-services/frontend-components/Maintenance';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import React from 'react';

class MaintenanceStateBase {
  public render() {
    const intl = createIntlEnv();

    return (
      <Maintenance
        description={
          <Stack>
            <StackItem>{intl.formatMessage(messages.MaintenanceEmptyStateDesc)}</StackItem>
            <StackItem>
              {intl.formatMessage(messages.MaintenanceEmptyStateInfo, {
                statusUrl: (
                  <a href={intl.formatMessage(messages.RedHatStatusUrl)} rel="noreferrer" target="_blank">
                    "Status Page"
                  </a>
                ),
              })}
            </StackItem>
            <StackItem>{intl.formatMessage(messages.MaintenanceEmptyStateThanks)}</StackItem>
          </Stack>
        }
      />
    );
  }
}

const MaintenanceState = MaintenanceStateBase;

export { MaintenanceState };
