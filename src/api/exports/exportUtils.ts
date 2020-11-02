import { ReportPathsType, ReportType } from 'api/reports/report';

import { runExport as runAwsExport } from './awsExport';
import { runExport as runAzureExport } from './azureExport';
import { runExport as runGcpExport } from './gcpExport';
import { runExport as runOcpCloudExport } from './ocpCloudExport';
import { runExport as runOcpExport } from './ocpExport';

export function runExport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let report;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      report = runAwsExport(reportType, query);
      break;
    case ReportPathsType.azure:
      report = runAzureExport(reportType, query);
      break;
    case ReportPathsType.gcp:
      report = runGcpExport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      report = runOcpCloudExport(reportType, query);
      break;
    case ReportPathsType.ocp:
      report = runOcpExport(reportType, query);
      break;
  }
  return report;
}
