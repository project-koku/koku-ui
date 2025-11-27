import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Label, Tooltip } from '@patternfly/react-core';
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
