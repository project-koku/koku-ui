import { AwsReportType, AwsReportTypePaths } from 'api/reports/awsReports';
import axios from 'axios';

export function runExport(reportType: AwsReportType, query: string) {
  const path = AwsReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
