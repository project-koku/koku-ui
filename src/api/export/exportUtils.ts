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
import { runExport as runRhelExport } from './rhelExport';

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
    case ReportPathsType.oci:
      result = runOciExport(reportType, query);
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
    case ReportPathsType.ibm:
      result = runIbmExport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      result = runOcpCloudExport(reportType, query);
      break;
    case ReportPathsType.ocp:
      result = runOcpExport(reportType, query);
      break;
    case ReportPathsType.rhel:
      result = runRhelExport(reportType, query);
      break;
  }
  return result;
}
