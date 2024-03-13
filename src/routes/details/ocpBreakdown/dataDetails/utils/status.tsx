import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import React from 'react';

export const lookupKey = value => (value ? value.toLowerCase().replace('-', '_') : undefined);

export const getIcon = (status: string) => {
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
