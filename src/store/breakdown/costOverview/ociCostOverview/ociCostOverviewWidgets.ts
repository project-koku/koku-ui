import { tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { OciCostOverviewWidget } from 'store/breakdown/costOverview/ociCostOverview';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OciCostOverviewWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'subscription_guid',
    showWidgetOnGroupBy: ['resource_location', 'service_name', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
    showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service_name',
    showWidgetOnGroupBy: ['resource_location', 'subscription_guid', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
