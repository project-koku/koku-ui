import { ReportType } from 'api/reports/report';

export const azureReportsStateKey = 'azureReports';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
