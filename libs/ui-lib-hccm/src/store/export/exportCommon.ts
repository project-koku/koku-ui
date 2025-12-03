import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

export const exportStateKey = 'export';

export function getFetchId(reportPathsType: ReportPathsType, reportType: ReportType, reportQueryString: string) {
  return `${reportPathsType}-${reportType}--${reportQueryString}`;
}
