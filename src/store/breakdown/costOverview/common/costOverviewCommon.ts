import type { ReportPathsType, ReportType } from 'api/reports/report';

// eslint-disable-next-line no-shadow
export const enum CostOverviewWidgetType {
  cluster = 'cluster', // This type displays clusters associated with a project
  cost = 'cost', // This type displays a cost breakdown as a pie chart
  cpuUsage = 'cpuUsage', // This type displays cpu usage as a bullet chart
  memoryUsage = 'memoryUsage', // This type displays memory usage as a bullet chart
  reportSummary = 'summary', // This type displays a cost report summary
  volumeUsage = 'volumeUsage', // This type displays volume usage as a bullet chart
}

export interface CostOverviewWidget {
  chartName?: string; // Will be the prefix for ids within the chart
  id: number;
  cluster?: {
    reportGroupBy: string; // Report group_by
    showWidgetOnGroupBy?: string[]; // Show widget when group_by is matched
  };
  usage?: {
    showCapacityOnGroupBy?: string[]; // Show capacity when group_by is matched
  };
  reportSummary?: {
    reportGroupBy: string; // Report group_by
    showWidgetOnCategory?: string[];
    showWidgetOnGroupBy?: string[]; // Show widget when group_by is matched
    usePlaceholder?: boolean; // Use placeholder to keep card placement when widget is not shown
  };
  reportPathsType: ReportPathsType; // Report URL path
  reportType: ReportType; // Report type; cost, storage, etc.
  type: CostOverviewWidgetType;
}
