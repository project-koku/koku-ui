import { OcpCloudReportType } from 'api/ocpCloudReports';

export const ocpCloudReportsStateKey = 'ocpCloudReports';

export function getReportId(type: OcpCloudReportType, query: string) {
  return `${type}--${query}`;
}
