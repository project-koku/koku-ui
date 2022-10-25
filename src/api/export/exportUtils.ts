import type { ReportType } from 'api/reports/report';
import { ReportPathsType } from 'api/reports/report';

import { runExport as runAwsExport } from './awsExport';
import { runExport as runAwsOcpExport } from './awsOcpExport';
import { runExport as runAzureExport } from './azureExport';
import { runExport as runAzureOcpExport } from './azureOcpExport';
import { runExport as runGcpExport } from './gcpExport';
import { runExport as runGcpOcpExport } from './gcpOcpExport';
import { runExport as runIbmExport } from './ibmExport';
import { runExport as runOciExport } from './ociExport';
import { runExport as runOcpCloudExport } from './ocpCloudExport';
import { runExport as runOcpExport } from './ocpExport';

export function runExport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let report;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      report = runAwsExport(reportType, query);
      break;
    case ReportPathsType.awsOcp:
      report = runAwsOcpExport(reportType, query);
      break;
    case ReportPathsType.azure:
      report = runAzureExport(reportType, query);
      break;
    case ReportPathsType.oci:
      report = runOciExport(reportType, query);
      break;
    case ReportPathsType.azureOcp:
      report = runAzureOcpExport(reportType, query);
      break;
    case ReportPathsType.gcp:
      report = runGcpExport(reportType, query);
      break;
    case ReportPathsType.gcpOcp:
      report = runGcpOcpExport(reportType, query);
      break;
    case ReportPathsType.ibm:
      report = runIbmExport(reportType, query);
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
