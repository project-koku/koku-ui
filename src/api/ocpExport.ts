import axios from 'axios';
import { OcpReportType, ocpReportTypePaths } from './ocpReports';

export function runExport(reportType: OcpReportType, query: string) {
  const path = ocpReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
