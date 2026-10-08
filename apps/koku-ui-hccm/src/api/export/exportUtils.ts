import type { ReportType } from 'api/reports/report';
import { ReportPathsType } from 'api/reports/report';
import { SettingsType } from 'api/settings';

import { runExport as runAwsExport } from './awsExport';
import { runExport as runAwsOcpExport } from './awsOcpExport';
import { runExport as runAzureExport } from './azureExport';
import { runExport as runAzureOcpExport } from './azureOcpExport';
import { runExport as runCurrencyExport } from './currencyExport';
import type { ExportPathsType, ExportType } from './export';
import { runExport as runGcpExport } from './gcpExport';
import { runExport as runGcpOcpExport } from './gcpOcpExport';
import { runExport as runOcpCloudExport } from './ocpCloudExport';
import { runExport as runOcpExport } from './ocpExport';

export function runExport(exportPathsType: ExportPathsType, exportType: ExportType, query: string) {
  let result;
  switch (exportPathsType) {
    case ReportPathsType.aws:
      result = runAwsExport(exportType as ReportType, query);
      break;
    case ReportPathsType.awsOcp:
      result = runAwsOcpExport(exportType as ReportType, query);
      break;
    case ReportPathsType.azure:
      result = runAzureExport(exportType as ReportType, query);
      break;
    case ReportPathsType.azureOcp:
      result = runAzureOcpExport(exportType as ReportType, query);
      break;
    case SettingsType.currency:
      result = runCurrencyExport(exportType as SettingsType, query);
      break;
    case ReportPathsType.gcp:
      result = runGcpExport(exportType as ReportType, query);
      break;
    case ReportPathsType.gcpOcp:
      result = runGcpOcpExport(exportType as ReportType, query);
      break;
    case ReportPathsType.ocpCloud:
      result = runOcpCloudExport(exportType as ReportType, query);
      break;
    case ReportPathsType.ocp:
      result = runOcpExport(exportType as ReportType, query);
      break;
  }
  return result;
}
