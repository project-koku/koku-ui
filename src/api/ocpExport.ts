import axios from 'axios';
import { OcpReportType, OcpReportTypePaths } from './ocpReports';

export function runExport(reportType: OcpReportType, query: string) {
  const path = OcpReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
