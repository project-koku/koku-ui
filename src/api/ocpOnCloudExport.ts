import axios from 'axios';
import {
  OcpOnCloudReportType,
  OcpOnCloudReportTypePaths,
} from './ocpOnCloudReports';

export function runExport(reportType: OcpOnCloudReportType, query: string) {
  const path = OcpOnCloudReportTypePaths[reportType];
  return axios.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
