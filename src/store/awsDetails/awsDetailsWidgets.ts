import { AwsReportType } from 'api/awsReports';
import { AwsDetailsTab, AwsDetailsWidget } from './awsDetailsCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: AwsDetailsWidget = {
  id: getId(),
  reportType: AwsReportType.cost,
  details: {
    formatOptions: {
      fractionDigits: 2,
    },
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDetailsTab.services,
    AwsDetailsTab.accounts,
    AwsDetailsTab.regions,
  ],
  currentTab: AwsDetailsTab.services,
};
