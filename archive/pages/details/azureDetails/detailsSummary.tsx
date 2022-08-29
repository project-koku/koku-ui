import {
  Summary,
  SummaryProps,
} from 'routes/details/components/summary/summary';
import React from 'react';
import { Omit } from 'react-redux';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';

export const getIdKeyForTab = (
  tab: AzureDetailsTab
): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDetailsTab.accounts:
      return 'subscription_guid';
    case AzureDetailsTab.regions:
      return 'resource_location';
    case AzureDetailsTab.services:
      return 'service_name';
  }
};

export const enum AzureDetailsTab {
  accounts = 'accounts',
  regions = 'regions',
  services = 'services',
}

const DetailsSummary: React.SFC<Omit<
  SummaryProps,
  'availableTabs' | 'getIdKeyForTab' | 't'
>> = props => (
  <Summary
    availableTabs={[
      AzureDetailsTab.services,
      AzureDetailsTab.accounts,
      AzureDetailsTab.regions,
    ]}
    getIdKeyForTab={getIdKeyForTab}
    {...props}
  />
);

export { DetailsSummary };
