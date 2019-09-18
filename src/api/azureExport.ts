import axios from 'axios';
import { AzureReportType, azureReportTypePaths } from './azureReports';

export function runExport(reportType: AzureReportType, query: string) {
  const path = azureReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
