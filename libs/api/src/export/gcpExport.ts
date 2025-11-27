import axiosInstance from '../api';
import { ReportTypePaths } from '../reports/gcpReports';
import type { ReportType } from '../reports/report';

export function runExport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
