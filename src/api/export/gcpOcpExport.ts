import { ReportTypePaths } from 'api/reports/gcpOcpReports';
import type { ReportType } from 'api/reports/report';
import axios from 'axios';

export function runExport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  const fetch = () =>
    axios.get<string>(`${path}?${query}`, {
      headers: {
        Accept: 'text/csv',
      },
    });

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
