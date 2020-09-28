import { ReportPathsType, ReportType } from 'api/reports/report';

// eslint-disable-next-line no-shadow
export const enum HistoricalDataWidgetType {
  cost = 'cost', // This type displays historical cost chart
  trend = 'tend', // This type displays historical trend chart
  usage = 'usage', // This type displays historical usage chart
}

export interface HistoricalDataWidget {
  id: number;
  reportPathsType: ReportPathsType; // Report URL path
  reportType: ReportType; // Report type; cost, storage, etc.
  type: HistoricalDataWidgetType;
}
