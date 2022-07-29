import { runReport as runAwsOcpReport } from './awsOcpReports';
import { runReport as runAwsReport } from './awsReports';
import { runReport as runAzureOcpReport } from './azureOcpReports';
import { runReport as runAzureReport } from './azureReports';
import { runReport as runGcpOcpReport } from './gcpOcpReports';
import { runReport as runGcpReport } from './gcpReports';
import { runReport as runIbmReport } from './ibmReports';
import { runReport as runOciReport } from './ociReports';
import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';
import { runReport as runOcpUsageReport } from './ocpUsageReports';
import { ReportPathsType, ReportType } from './report';

export function runReport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let report;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      report = runAwsReport(reportType, query);
      break;
    case ReportPathsType.awsOcp:
      report = runAwsOcpReport(reportType, query);
      break;
    case ReportPathsType.azure:
      report = runAzureReport(reportType, query);
      break;
    case ReportPathsType.azureOcp:
      report = runAzureOcpReport(reportType, query);
      break;
    case ReportPathsType.gcp:
      report = runGcpReport(reportType, query);
      break;
    case ReportPathsType.gcpOcp:
      report = runGcpOcpReport(reportType, query);
      break;
    case ReportPathsType.ibm:
      report = runIbmReport(reportType, query);
      break;
    case ReportPathsType.oci:
      report = runOciReport(reportType, query);
      break;
    case ReportPathsType.ocp:
      report = runOcpReport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      report = runOcpCloudReport(reportType, query);
      break;
    case ReportPathsType.ocpUsage:
      report = runOcpUsageReport(reportType, query);
      break;
  }
  return report;
}
