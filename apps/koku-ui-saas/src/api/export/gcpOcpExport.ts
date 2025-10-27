import { axiosInstance } from 'api';
import { ReportTypePaths } from 'api/reports/gcpOcpReports';
import type { ReportType } from 'api/reports/report';

export function runExport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axiosInstance.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
