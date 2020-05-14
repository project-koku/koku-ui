import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { DetailsWidgetType } from 'store/details/common/detailsCommon';
import { AwsDetailsWidget } from './awsDetailsCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: AwsDetailsWidget = {
  id: getId(),
  costBreakdown: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: DetailsWidgetType.costBreakdown,
};

export const accountSummaryWidget: AwsDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['region', 'service', tagKeyPrefix],
  },
  type: DetailsWidgetType.reportSummary,
};

export const regionSummaryWidget: AwsDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['account', 'service', tagKeyPrefix],
  },
  type: DetailsWidgetType.reportSummary,
};

export const serviceSummaryWidget: AwsDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    reportPathsType: ReportPathsType.aws,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['region', 'account', tagKeyPrefix],
  },
  type: DetailsWidgetType.reportSummary,
};
