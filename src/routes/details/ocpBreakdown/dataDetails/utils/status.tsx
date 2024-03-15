import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { PendingIcon } from '@patternfly/react-icons/dist/esm/icons/pending-icon';
import type { Provider } from 'api/providers';
import React from 'react';

export const lookupKey = value => (value ? value.toLowerCase().replace('-', '_') : undefined);

export const getCloudAvailability = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  if (
    provider.infrastructure.source_status?.availability_status !== 'available' &&
    provider.infrastructure.paused === false
  ) {
    status = 'failed'; // Inactive sources
  } else {
    status = 'complete';
  }
  return status;
};

export const getCloudStatus = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  if (
    provider.status.download?.state === 'failed' ||
    provider.status.processing?.state === 'failed' ||
    provider.status.summary?.state === 'failed'
  ) {
    status = 'failed';
  } else if (
    provider.status.download?.state === 'in_progress' ||
    provider.status.processing?.state === 'in_progress' ||
    provider.status.summary?.state === 'in_progress'
  ) {
    status = 'in_progress';
  } else if (
    provider.status.download?.state === 'pending' ||
    provider.status.processing?.state === 'pending' ||
    provider.status.summary?.state === 'pending'
  ) {
    status = 'pending';
  } else if (
    provider.status.download?.state === 'complete' &&
    provider.status.processing?.state === 'complete' &&
    provider.status.summary?.state === 'complete'
  ) {
    status = 'complete';
  }
  return status;
};

export const getClusterAvailability = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  if (provider.active === false && provider.paused === false) {
    status = 'failed'; // Inactive sources
  } else {
    status = 'complete';
  }
  return status;
};

export const getClusterStatus = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  if (
    provider.status.download?.state === 'failed' ||
    provider.status.processing?.state === 'failed' ||
    provider.status.summary?.state === 'failed'
  ) {
    status = 'failed';
  } else if (
    provider.status.download?.state === 'in_progress' ||
    provider.status.processing?.state === 'in_progress' ||
    provider.status.summary?.state === 'in_progress'
  ) {
    status = 'in_progress';
  } else if (
    provider.status.download?.state === 'pending' ||
    provider.status.processing?.state === 'pending' ||
    provider.status.summary?.state === 'pending'
  ) {
    status = 'pending';
  } else if (
    provider.status.download?.state === 'complete' ||
    provider.status.processing?.state === 'complete' ||
    provider.status.summary?.state === 'complete'
  ) {
    status = 'complete';
  }
  return status;
};

export const getProgressStepIcon = (status: string) => {
  const key = lookupKey(status);
  if (key === 'in_progress') {
    return <InProgressIcon />;
  } else if (key === 'pending') {
    return <PendingIcon />;
  }
  return undefined;
};

export const getStatus = (val: string) => {
  const key = lookupKey(val);
  switch (key) {
    case 'complete':
      return 'success';
    case 'failed':
      return 'danger';
    case 'in_progress':
    case 'pending':
      return 'pending';
    default:
      return 'default';
  }
};

export const getStatusIcon = (status: string) => {
  let icon;
  let variant;

  switch (lookupKey(status)) {
    case 'complete':
      icon = <CheckCircleIcon />;
      variant = 'success';
      break;
    case 'failed':
      icon = <ExclamationCircleIcon />;
      variant = 'danger';
      break;
    case 'in_progress':
      icon = <InProgressIcon />;
      break;
    case 'pending':
      icon = <PendingIcon />;
      break;
    default:
      break;
  }
  return icon ? <Icon status={variant}>{icon}</Icon> : null;
};
