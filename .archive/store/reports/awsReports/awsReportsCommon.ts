import { ReportType } from 'api/reports/report';

export const awsReportsStateKey = 'awsReports';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
