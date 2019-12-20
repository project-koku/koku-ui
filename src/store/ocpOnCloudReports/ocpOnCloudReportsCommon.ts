import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';

export const ocpOnCloudReportsStateKey = 'ocpOnCloudReports';

export function getReportId(type: OcpOnCloudReportType, query: string) {
  return `${type}--${query}`;
}
