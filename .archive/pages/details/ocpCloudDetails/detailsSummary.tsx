import {
  Summary,
  SummaryProps,
} from 'routes/details/components/summary/summary';
import React from 'react';
import { Omit } from 'react-redux';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';

export const getIdKeyForTab = (
  tab: OcpCloudDetailsTab
): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpCloudDetailsTab.accounts:
      return 'account';
    case OcpCloudDetailsTab.projects:
      return 'project';
    case OcpCloudDetailsTab.regions:
      return 'region';
    case OcpCloudDetailsTab.services:
      return 'service';
  }
};

export const enum OcpCloudDetailsTab {
  accounts = 'accounts',
  projects = 'projects',
  regions = 'regions',
  services = 'services',
}

const DetailsSummary: React.SFC<Omit<
  SummaryProps,
  'availableTabs' | 'getIdKeyForTab' | 't'
>> = props => (
  <Summary
    availableTabs={[
      OcpCloudDetailsTab.projects,
      OcpCloudDetailsTab.services,
      OcpCloudDetailsTab.accounts,
      OcpCloudDetailsTab.regions,
    ]}
    getIdKeyForTab={getIdKeyForTab}
    {...props}
  />
);

export { DetailsSummary };
