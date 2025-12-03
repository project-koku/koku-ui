import type { ReportType } from '../reports/report';
import { ReportPathsType } from '../reports/report';
import { runExport as runAwsExport } from './awsExport';
import { runExport as runAwsOcpExport } from './awsOcpExport';
import { runExport as runAzureExport } from './azureExport';
import { runExport as runAzureOcpExport } from './azureOcpExport';
import { runExport as runGcpExport } from './gcpExport';
import { runExport as runGcpOcpExport } from './gcpOcpExport';
import { runExport as runOcpCloudExport } from './ocpCloudExport';
import { runExport as runOcpExport } from './ocpExport';

export function runExport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let result;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      result = runAwsExport(reportType, query);
      break;
    case ReportPathsType.awsOcp:
      result = runAwsOcpExport(reportType, query);
      break;
    case ReportPathsType.azure:
      result = runAzureExport(reportType, query);
      break;
    case ReportPathsType.azureOcp:
      result = runAzureOcpExport(reportType, query);
      break;
    case ReportPathsType.gcp:
      result = runGcpExport(reportType, query);
      break;
    case ReportPathsType.gcpOcp:
      result = runGcpOcpExport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      result = runOcpCloudExport(reportType, query);
      break;
    case ReportPathsType.ocp:
      result = runOcpExport(reportType, query);
      break;
  }
  return result;
}
