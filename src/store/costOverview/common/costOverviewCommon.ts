import { ReportPathsType, ReportType } from 'api/reports/report';

export const enum CostOverviewWidgetType {
  costBreakdown = 'costBreakdown', // This type displays cost breakdown pie chart
  cpuUsage = 'cpuUsage', // This type displays CPU usage
  memoryUsage = 'memoryUsage', // This type displays memory usage
  reportSummary = 'summary', // This type displays cost report summary
}

export interface CostOverviewWidget {
  id: number;
  costBreakdown?: {
    reportPathsType: ReportPathsType; // Report URL path
    reportType: ReportType; // Report type; cost, storage, etc.
  };
  cpuUsage?: {
    reportPathsType: ReportPathsType; // Report URL path
    reportType: ReportType; // Report type; cost, storage, etc.
    showCapacityOnGroupBy?: string[]; // Show capacity when group_by is matched
  };
  memoryUsage?: {
    reportPathsType: ReportPathsType; // Report URL path
    reportType: ReportType; // Report type; cost, storage, etc.
    showCapacityOnGroupBy?: string[]; // Show capacity when group_by is matched
  };
  reportSummary?: {
    reportGroupBy: string; // Report group_by
    reportPathsType: ReportPathsType; // Report URL path
    reportType: ReportType; // Report type; cost, storage, etc.
    showWidgetOnGroupBy?: string[]; // Show widget when group_by is matched
    usePlaceholder?: boolean; // Use placeholder to keep card placement when widget is not shown
  };
  type: CostOverviewWidgetType;
}
