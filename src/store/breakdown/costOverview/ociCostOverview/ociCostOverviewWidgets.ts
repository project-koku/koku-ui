import { tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { OciCostOverviewWidget } from 'store/breakdown/costOverview/ociCostOverview';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OciCostOverviewWidget = {
  chartName: 'ociCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'payer_tenant_id',
    showWidgetOnGroupBy: ['region', 'product_service', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    showWidgetOnGroupBy: ['payer_tenant_id', 'product_service', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'product_service',
    showWidgetOnGroupBy: ['region', 'payer_tenant_id', tagPrefix],
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
