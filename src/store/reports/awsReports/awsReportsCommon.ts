import { AwsReportType } from 'api/reports/awsReports';

export const awsReportsStateKey = 'awsReports';

export function getReportId(type: AwsReportType, query: string) {
  return `${type}--${query}`;
}
