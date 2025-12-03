import type { Provider } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import type { MessageDescriptor } from 'react-intl';

import { normalize } from './normailize';

export const enum StatusType {
  complete = 'complete',
  failed = 'failed',
  inProgress = 'in_progress',
  none = 'none',
  paused = 'paused',
  pending = 'pending',
}

export const lookupKey = (value: string) => {
  switch (normalize(value)) {
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
      return StatusType.none;
  }
};

export const getProviderAvailability = (provider: Provider): { msg: MessageDescriptor; status: StatusType } => {
  let status;
  if (!provider) {
    return status;
  }

  const msg =
    provider.source_type === ProviderType.ocp
      ? messages.dataDetailsIntegrationStatus
      : messages.dataDetailsCloudIntegrationStatus;

  if (provider.active === false && provider.paused === false) {
    status = StatusType.failed; // Inactive sources
  } else if (provider.paused === true) {
    status = StatusType.paused;
  } else {
    status = StatusType.complete;
  }
  return { msg, status };
};

const getProviderStatusMsg = (
  {
    downloadState,
    processingState,
    summaryState,
  }: {
    downloadState: StatusType;
    processingState: StatusType;
    summaryState: StatusType;
  },
  status: StatusType
): MessageDescriptor => {
  let msg;

  // We don't have a separate messages for cloud and on-prem
  if (downloadState === status) {
    msg = messages.dataDetailsRetrieval;
  } else if (processingState === status) {
    msg = messages.dataDetailsProcessing;
  } else if (summaryState === status) {
    msg = messages.dataDetailsIntegrationAndFinalization;
  }
  return msg;
};

export const getProviderStatus = (
  provider: Provider,
  isCloud = false
): { lastUpdated: string; msg: MessageDescriptor; status: StatusType } => {
  let status;
  let msg;
  if (!provider) {
    return status;
  }

  const lastUpdated =
    provider.status?.summary?.end ||
    provider.status?.summary?.start ||
    provider.status?.processing?.end ||
    provider.status?.processing?.start ||
    provider.status?.download?.end ||
    provider.status?.download?.start;

  // Skip summaryState for cloud
  const downloadState = lookupKey(provider.status?.download?.state);
  const processingState = lookupKey(provider.status?.processing?.state);
  const summaryState = isCloud ? StatusType.complete : lookupKey(provider.status?.summary?.state);

  if (
    downloadState === StatusType.failed ||
    processingState === StatusType.failed ||
    summaryState === StatusType.failed
  ) {
    status = StatusType.failed;
    msg = getProviderStatusMsg({ downloadState, processingState, summaryState }, StatusType.failed);
  } else if (
    downloadState === StatusType.inProgress ||
    processingState === StatusType.inProgress ||
    summaryState === StatusType.inProgress
  ) {
    status = StatusType.inProgress;
    msg = getProviderStatusMsg({ downloadState, processingState, summaryState }, StatusType.inProgress);
  } else if (
    downloadState === StatusType.pending ||
    processingState === StatusType.pending ||
    summaryState === StatusType.pending
  ) {
    status = StatusType.pending;
    msg = getProviderStatusMsg({ downloadState, processingState, summaryState }, StatusType.pending);
  } else if (
    downloadState === StatusType.none &&
    processingState === StatusType.none &&
    summaryState === StatusType.none
  ) {
    status = StatusType.none;
    msg = getProviderStatusMsg({ downloadState, processingState, summaryState }, StatusType.none);
  } else if (
    downloadState === StatusType.complete &&
    processingState === StatusType.complete &&
    summaryState === StatusType.complete
  ) {
    status = StatusType.complete;
    msg = messages.dataDetailsIntegrationAndFinalization; // only one final step
  }
  return { lastUpdated, msg, status };
};
