import type { DataRetentionType } from 'api/dataRetention';
export const dataRetentionStateKey = 'dataRetention';

export function getFetchId(dataRetentionType: DataRetentionType, dataRetentionQueryString?: string) {
  return `${dataRetentionType}--${dataRetentionQueryString ?? ''}`;
}
