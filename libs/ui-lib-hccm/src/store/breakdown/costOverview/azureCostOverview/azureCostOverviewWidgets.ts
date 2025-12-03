import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { tagPrefix } from '@koku-ui/utils/props';

import type { CostOverviewWidget } from '../common/costOverviewCommon';
import { CostOverviewWidgetType } from '../common/costOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
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
