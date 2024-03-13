import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { CircleIcon } from '@patternfly/react-icons/dist/esm/icons/circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import React from 'react';

export const lookupKey = value => (value ? value.toLowerCase().replace('-', '_') : undefined);

export const getIcon = (status: string) => {
  let icon;
  let variant;

  switch (lookupKey(status)) {
    case 'complete':
      icon = <CheckCircleIcon />;
      variant = 'success';
      break;
    case 'in_progress':
      icon = <InProgressIcon />;
      break;
    case 'pending':
      icon = <CircleIcon />;
      break;
    default:
      icon = null;
      break;
  }
  return icon ? <Icon status={variant}>{icon}</Icon> : null;
};

export const getProgressIcon = (status: string) => {
  const key = lookupKey(status);
  if (key === 'in_progress') {
    return <InProgressIcon />;
  }
  return undefined;
};

export const getVariant = (status: string) => {
  const key = lookupKey(status);
  switch (key) {
    case 'complete':
      return 'success';
    case 'in_progress':
    case 'pending':
      return 'pending';
    default:
      return 'default';
  }
};
