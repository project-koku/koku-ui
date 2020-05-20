import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/costOverview/common/costOverviewCommon';
import { AwsCostOverviewWidget } from './awsCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
    showWidgetOnGroupBy: ['region', 'service', tagKeyPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    showWidgetOnGroupBy: ['account', 'service', tagKeyPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    showWidgetOnGroupBy: ['region', 'account', tagKeyPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
