import { tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AzureCostOverviewWidget } from 'store/breakdown/costOverview/azureCostOverview';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';

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
    showWidgetOnGroupBy: ['resource_location', 'service_name', tagPrefix],
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
    showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagPrefix],
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service_name',
    showWidgetOnGroupBy: ['resource_location', 'subscription_guid', tagPrefix],
  },
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
