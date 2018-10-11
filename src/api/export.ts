import axios from 'axios';
import { ReportType, reportTypePaths } from './reports';

export function runExport(reportType: ReportType, query: string) {
  const path = reportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
