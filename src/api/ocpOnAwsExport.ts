import axios from 'axios';
import { OcpOnAwsReportType, ocpOnAwsReportTypePaths } from './ocpOnAwsReports';

export function runExport(reportType: OcpOnAwsReportType, query: string) {
  const path = ocpOnAwsReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
