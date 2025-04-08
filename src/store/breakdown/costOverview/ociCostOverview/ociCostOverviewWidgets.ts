import { ReportPathsType, ReportType } from 'api/reports/report';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const costWidget: CostOverviewWidget = {
  chartName: 'ociCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'payer_tenant_id',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'product_service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['payer_tenant_id', 'product_service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'product_service',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'payer_tenant_id', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
