import { Label, Tooltip } from '@patternfly/react-core';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';

export const getOperatorStatus = (status: boolean) => {
  let operatorLabel;

  if (status === true) {
    operatorLabel = (
      <Tooltip content={intl.formatMessage(messages.newOperatorAvailable)}>
        <Label status="warning" variant="outline">
          {intl.formatMessage(messages.newVersionAvailable)}
        </Label>
      </Tooltip>
    );
  } else if (status === false) {
    operatorLabel = (
      <Label status="success" variant="outline">
        {intl.formatMessage(messages.upToDate)}
      </Label>
    );
  } else {
    operatorLabel = (
      <Label status="info" variant="outline">
        {intl.formatMessage(messages.notAvailable)}
      </Label>
    );
  }
  return operatorLabel;
};
