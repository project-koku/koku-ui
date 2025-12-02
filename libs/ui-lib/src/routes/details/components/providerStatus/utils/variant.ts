import { lookupKey, StatusType } from './status';

export const getProgressStepVariant = (value: string) => {
  switch (lookupKey(value)) {
    case StatusType.complete:
      return 'success';
    case StatusType.failed:
      return 'danger';
    case StatusType.pending:
      return 'pending';
    case StatusType.inProgress: // Use 'default' status with custom icon
    case StatusType.paused:
    default:
      return 'default';
  }
};
