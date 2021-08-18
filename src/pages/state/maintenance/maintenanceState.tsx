import { Stack, StackItem } from '@patternfly/react-core';
import Maintenance from '@redhat-cloud-services/frontend-components/Maintenance';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

type MaintenanceStateBaseOwnProps = WrappedComponentProps;

class MaintenanceStateBase extends React.Component<MaintenanceStateBaseOwnProps> {
  public render() {
    const { intl } = this.props;

    return (
      <Maintenance
        description={
          <Stack>
            <StackItem>{intl.formatMessage(messages.MaintenanceEmptyStateDesc)}</StackItem>
            <StackItem>
              {intl.formatMessage(messages.MaintenanceEmptyStateInfo, {
                statusUrl: (
                  <a href={intl.formatMessage(messages.RedHatStatusUrl)} rel="noreferrer" target="_blank">
                    "status page"
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

const MaintenanceState = injectIntl(MaintenanceStateBase);
export { MaintenanceState };
