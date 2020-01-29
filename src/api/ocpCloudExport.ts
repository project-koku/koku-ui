import axios from 'axios';
import { OcpCloudReportType, OcpCloudReportTypePaths } from './ocpCloudReports';

export function runExport(reportType: OcpCloudReportType, query: string) {
  const path = OcpCloudReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
