import { AzureReportType } from 'api/reports/azureReports';

export const azureReportsStateKey = 'azureReports';

export function getReportId(type: AzureReportType, query: string) {
  return `${type}--${query}`;
}
