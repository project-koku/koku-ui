import { OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import {
  OcpOnAwsDetailsTab,
  OcpOnAwsDetailsWidget,
} from './ocpOnAwsDetailsCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: OcpOnAwsDetailsWidget = {
  id: getId(),
  reportType: OcpOnAwsReportType.cost,
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
    OcpOnAwsDetailsTab.projects,
    OcpOnAwsDetailsTab.services,
    OcpOnAwsDetailsTab.accounts,
    OcpOnAwsDetailsTab.regions,
  ],
  currentTab: OcpOnAwsDetailsTab.projects,
};
