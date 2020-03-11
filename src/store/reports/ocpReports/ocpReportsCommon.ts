import { OcpReportType } from 'api/ocpReports';

export const ocpReportsStateKey = 'ocpReports';

export function getReportId(type: OcpReportType, query: string) {
  return `${type}--${query}`;
}
