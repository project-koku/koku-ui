import { ReportTypePaths } from 'api/reports/ociReports';
import { ReportType } from 'api/reports/report';
import axios from 'axios';

export function runExport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
