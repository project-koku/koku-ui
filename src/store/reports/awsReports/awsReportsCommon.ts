import { AwsReportType } from 'api/awsReports';

export const awsReportsStateKey = 'awsReports';

export function getReportId(type: AwsReportType, query: string) {
  return `${type}--${query}`;
}
