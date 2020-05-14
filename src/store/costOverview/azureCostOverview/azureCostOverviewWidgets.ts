import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/costOverview/common/costOverviewCommon';
import { AzureCostOverviewWidget } from '../azureCostOverview';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AzureCostOverviewWidget = {
  id: getId(),
  cost: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'subscription_guid',
    reportPathsType: ReportPathsType.azure,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['resource_location', 'service_name', tagKeyPrefix],
  },
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
    reportPathsType: ReportPathsType.azure,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagKeyPrefix],
  },
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AzureCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service_name',
    reportPathsType: ReportPathsType.azure,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: [
      'resource_location',
      'subscription_guid',
      tagKeyPrefix,
    ],
  },
  type: CostOverviewWidgetType.reportSummary,
};
