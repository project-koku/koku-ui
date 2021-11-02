import { ReportPathsType, ReportType } from 'api/reports/report';
import { isBetaFeature } from 'utils/feature';
import { getCostType } from 'utils/localStorage';
export const reportStateKey = 'report';

export function getReportId(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  // Todo: Show in-progress features in beta environment only
  if (isBetaFeature()) {
    switch (reportType) {
      case ReportType.cost:
      case ReportType.database:
      case ReportType.network:
        return `${reportPathsType}--${reportType}--${getCostType()}--${query}`;
    }
  }
  return `${reportPathsType}--${reportType}--${query}`;
}
