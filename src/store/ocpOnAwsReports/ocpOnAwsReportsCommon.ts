import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';

export const ocpOnAwsReportsStateKey = 'ocpOnAwsReports';

export function getReportId(type: OcpOnAwsReportType, query: string) {
  return `${type}--${query}`;
}
