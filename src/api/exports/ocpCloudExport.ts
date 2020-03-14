import {
  OcpCloudReportType,
  OcpCloudReportTypePaths,
} from 'api/reports/ocpCloudReports';
import axios from 'axios';

export function runExport(reportType: OcpCloudReportType, query: string) {
  const path = OcpCloudReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
