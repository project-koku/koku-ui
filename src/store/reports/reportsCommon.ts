import { ReportType } from 'api/reports';

export const reportsStateKey = 'reports';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
