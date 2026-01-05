import type { ReportPathsType, ReportType } from 'api/reports/report';

export const enum CostOverviewWidgetType {
  cluster = 'cluster', // This type displays clusters associated with a project
  cost = 'cost', // This type displays a cost breakdown as a pie chart
  costBreakdown = 'costBreakdown', // This type displays a cost breakdown as a sankey chart
  costDistribution = 'costDistribution', // This type displays cost distribution as a pie chart
  cpuUsage = 'cpuUsage', // This type displays cpu usage as a bullet chart
  gpu = 'gpu', // This type displays gpu data as a table
  memoryUsage = 'memoryUsage', // This type displays memory usage as a bullet chart
  pvc = 'pvc', // This type displays persistent volume claim as a bullet chart
  reportSummary = 'summary', // This type displays a cost report summary
  volumeUsage = 'volumeUsage', // This type displays volume usage as a bullet chart
}

export interface CostOverviewWidget {
  chartName?: string; // Will be the prefix for ids within the chart
  id: number;
  cluster?: {
    reportGroupBy: string; // Report group_by
  };
  reportSummary?: {
    reportGroupBy: string; // Report group_by
    usePlaceholder?: boolean; // Use placeholder to keep card placement when widget is not shown
  };
  reportPathsType: ReportPathsType; // Report URL path
  reportType: ReportType; // Report type; cost, storage, etc.
  showWidgetOnGroupBy?: string[]; // Show widget when group_by is matched
  showWidgetOnPlatformCategory?: string[]; // Show widget when platform category is matched
  type: CostOverviewWidgetType;
}
