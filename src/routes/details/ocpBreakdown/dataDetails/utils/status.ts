import type { Provider } from 'api/providers';

// eslint-disable-next-line no-shadow
export const enum StatusType {
  complete = 'complete',
  failed = 'failed',
  inProgress = 'in_progress',
  paused = 'paused',
  pending = 'pending',
}

export const lookupKey = (value: string) => {
  switch (normalizeValue(value)) {
    case 'complete':
      return StatusType.complete;
    case 'failed':
      return StatusType.failed;
    case 'in_progress':
      return StatusType.inProgress;
    case 'paused':
      return StatusType.paused;
    case 'pending':
      return StatusType.pending;
    default:
      return undefined;
  }
};

export const normalizeValue = (value: string) => {
  return value ? value.toLowerCase().replace('-', '_') : undefined;
};

export const getProviderAvailability = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  if (provider.active === false && provider.paused === false) {
    status = StatusType.failed; // Inactive sources
  } else if (provider.infrastructure.paused === true) {
    status = StatusType.paused;
  } else {
    status = StatusType.complete;
  }
  return status;
};

export const getProviderStatus = (provider: Provider) => {
  let status;
  if (!provider) {
    return status;
  }

  const downloadState = lookupKey(provider.status.download.state);
  const processingState = lookupKey(provider.status.processing.state);
  const summaryState = lookupKey(provider.status.summary.state);

  if (
    downloadState === StatusType.failed ||
    processingState === StatusType.failed ||
    summaryState === StatusType.failed
  ) {
    status = StatusType.failed;
  } else if (
    downloadState === StatusType.inProgress ||
    processingState === StatusType.inProgress ||
    summaryState === StatusType.inProgress
  ) {
    status = StatusType.inProgress;
  } else if (
    downloadState === StatusType.pending ||
    processingState === StatusType.pending ||
    summaryState === StatusType.pending
  ) {
    status = StatusType.pending;
  } else if (
    downloadState === StatusType.complete ||
    processingState === StatusType.complete ||
    summaryState === StatusType.complete
  ) {
    status = StatusType.complete;
  }
  return status;
};
