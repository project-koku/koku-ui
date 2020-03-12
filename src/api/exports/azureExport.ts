import {
  AzureReportType,
  AzureReportTypePaths,
} from 'api/reports/azureReports';
import axios from 'axios';

export function runExport(reportType: AzureReportType, query: string) {
  const path = AzureReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
