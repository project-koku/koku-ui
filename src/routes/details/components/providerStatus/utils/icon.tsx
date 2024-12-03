import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { PauseIcon } from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import { PendingIcon } from '@patternfly/react-icons/dist/esm/icons/pending-icon';
import { WarningTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/warning-triangle-icon';
import React from 'react';

import { lookupKey, StatusType } from './status';

export const getProgressStepIcon = (value: string) => {
  switch (lookupKey(value)) {
    case StatusType.inProgress:
      return <InProgressIcon />;
    case StatusType.paused:
      return <PauseIcon />;
    case StatusType.pending:
      return <PendingIcon />;
    default:
      return undefined;
  }
};

export const getOverallStatusIcon = (status: StatusType) => {
  let icon;
  let variant;

  switch (status) {
    case StatusType.complete:
      icon = <CheckCircleIcon />;
      variant = 'success'; // Use green color
      break;
    case StatusType.failed:
      icon = <ExclamationCircleIcon />;
      variant = 'danger'; // Use red color
      break;
    case StatusType.inProgress:
      icon = <InProgressIcon />;
      break;
    case StatusType.paused:
      icon = <PauseIcon />;
      break;
    case StatusType.pending:
      icon = <PendingIcon />;
      break;
    default:
      break;
  }
  return icon ? <Icon status={variant}>{icon}</Icon> : null;
};

export const getWarningStatusIcon = () => {
  return (
    <Icon status="warning">
      <WarningTriangleIcon />
    </Icon>
  );
};
