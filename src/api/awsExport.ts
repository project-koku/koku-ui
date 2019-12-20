import axios from 'axios';
import { AwsReportType, AwsReportTypePaths } from './awsReports';

export function runExport(reportType: AwsReportType, query: string) {
  const path = AwsReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
