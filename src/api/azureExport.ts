import axios from 'axios';
import { AzureReportType, AzureReportTypePaths } from './azureReports';

export function runExport(reportType: AzureReportType, query: string) {
  const path = AzureReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
