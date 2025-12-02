import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

export const enum HistoricalDataWidgetType {
  cost = 'cost', // This type displays historical cost chart
  network = 'network', // This type displays historical network chart
  trend = 'trend', // This type displays historical trend chart
  usage = 'usage', // This type displays historical usage chart
  volume = 'volume', // This type displays historical volume chart
}

export interface HistoricalDataWidget {
  chartName: string; // Will be the prefix for ids within the chart
  id: number;
  reportPathsType: ReportPathsType; // Report URL path
  reportType: ReportType; // Report type; cost, storage, etc.
  showLimit?: boolean; // Show chart legend for limit data
  showRequest?: boolean; // Show chart legend for request data
  showWidgetOnGroupBy?: string[]; // Show widget when group_by is matched
  type: HistoricalDataWidgetType;
}
