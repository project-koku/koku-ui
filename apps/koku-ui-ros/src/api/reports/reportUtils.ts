import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';
import type { ReportType } from './report';
import { ReportPathsType } from './report';

export function runReport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let result;
  switch (reportPathsType) {
    case ReportPathsType.ocp:
      result = runOcpReport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      result = runOcpCloudReport(reportType, query);
      break;
  }
  return result;
}
