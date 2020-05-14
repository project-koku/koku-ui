import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/costOverview/common/costOverviewCommon';
import { AwsCostOverviewWidget } from './awsCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AwsCostOverviewWidget = {
  id: getId(),
  cost: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['region', 'service', tagKeyPrefix],
  },
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['account', 'service', tagKeyPrefix],
  },
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['region', 'account', tagKeyPrefix],
  },
  type: CostOverviewWidgetType.reportSummary,
};
