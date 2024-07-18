import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AzureCostOverviewWidget } from 'store/breakdown/costOverview/azureCostOverview';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AzureCostOverviewWidget = {
  chartName: 'azureCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'subscription_guid',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['resource_location', 'service_name', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service_name',
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['resource_location', 'subscription_guid', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
