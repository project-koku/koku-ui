import { ReportType } from 'api/reports/report';

export const ocpCloudReportsStateKey = 'ocpCloudReports';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
