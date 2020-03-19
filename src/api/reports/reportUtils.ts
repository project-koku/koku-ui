import { runReport as runAwsReport } from './awsReports';
import { runReport as runAzureReport } from './azureReports';
import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';
import { ReportPathsType, ReportType } from './report';

export function runReport(
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) {
  let report;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      report = runAwsReport(reportType, query);
      break;
    case ReportPathsType.azure:
      report = runAzureReport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      report = runOcpCloudReport(reportType, query);
      break;
    case ReportPathsType.ocp:
      report = runOcpReport(reportType, query);
      break;
  }
  return report;
}
