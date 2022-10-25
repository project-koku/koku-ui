import type { ReportPathsType, ReportType } from 'api/reports/report';
export const reportStateKey = 'report';

export function getReportId(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  return `${reportPathsType}--${reportType}--${query}`;
}
