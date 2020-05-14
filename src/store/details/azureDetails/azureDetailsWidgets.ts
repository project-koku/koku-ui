import { tagKeyPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { DetailsWidgetType } from 'store/details/common/detailsCommon';
import { AzureDetailsWidget } from '../azureDetails';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: AzureDetailsWidget = {
  id: getId(),
  costBreakdown: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: DetailsWidgetType.costBreakdown,
};

export const accountSummaryWidget: AzureDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'subscription_guid',
    reportPathsType: ReportPathsType.azure,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['resource_location', 'service_name', tagKeyPrefix],
  },
  type: DetailsWidgetType.reportSummary,
};

export const regionSummaryWidget: AzureDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'resource_location',
    reportPathsType: ReportPathsType.azure,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['subscription_guid', 'service_name', tagKeyPrefix],
  },
  type: DetailsWidgetType.reportSummary,
};

export const serviceSummaryWidget: AzureDetailsWidget = {
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
  type: DetailsWidgetType.reportSummary,
};
