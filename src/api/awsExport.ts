import axios from 'axios';
import { AwsReportType, awsReportTypePaths } from './awsReports';

export function runExport(reportType: AwsReportType, query: string) {
  const path = awsReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
