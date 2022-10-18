import { ReportType } from 'api/reports/report';

export const ocpReportsStateKey = 'ocpReports';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
