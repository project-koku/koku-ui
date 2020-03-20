import { ReportType } from 'api/reports/report';

export const reportStateKey = 'report';

export function getReportId(type: ReportType, query: string) {
  return `${type}--${query}`;
}
