import { AzureReportType } from 'api/azureReports';

export const azureReportsStateKey = 'azureReports';

export function getReportId(type: AzureReportType, query: string) {
  return `${type}--${query}`;
}
