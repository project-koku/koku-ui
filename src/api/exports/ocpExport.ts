import { OcpReportType, OcpReportTypePaths } from 'api/reports/ocpReports';
import axios from 'axios';

export function runExport(reportType: OcpReportType, query: string) {
  const path = OcpReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
