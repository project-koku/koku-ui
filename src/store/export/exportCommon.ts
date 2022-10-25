import type { ReportPathsType, ReportType } from 'api/reports/report';

export const exportStateKey = 'export';

export function getExportId(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  return `${reportPathsType}-${reportType}--${query}`;
}
