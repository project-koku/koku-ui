import {
  Summary,
  SummaryProps,
} from 'routes/details/components/summary/summary';
import React from 'react';
import { Omit } from 'react-redux';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';

export const getIdKeyForTab = (
  tab: AwsDetailsTab
): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsDetailsTab.accounts:
      return 'account';
    case AwsDetailsTab.regions:
      return 'region';
    case AwsDetailsTab.services:
      return 'service';
  }
};

export const enum AwsDetailsTab {
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
      AwsDetailsTab.services,
      AwsDetailsTab.accounts,
      AwsDetailsTab.regions,
    ]}
    getIdKeyForTab={getIdKeyForTab}
    {...props}
  />
);

export { DetailsSummary };
