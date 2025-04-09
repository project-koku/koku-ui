import { ReportPathsType, ReportType } from 'api/reports/report';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const costWidget: CostOverviewWidget = {
  chartName: 'azureCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'subscription_guid',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['resource_location', 'service_name', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service_name',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['resource_location', 'subscription_guid', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
