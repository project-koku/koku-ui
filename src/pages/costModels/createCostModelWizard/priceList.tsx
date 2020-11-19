import { Rate } from 'api/rates';
import AddPriceList from 'pages/costModels/components/addPriceList';
import { RateFormData, transformFormDataToRequest } from 'pages/costModels/components/rateForm/index';
import React from 'react';

import { CostModelContext } from './context';
import PriceListTable from './priceListTable';

const PriceList = () => {
  const { metricsHash, tiers, submitTiers, goToAddPL } = React.useContext(CostModelContext);
  const [state, setState] = React.useState('table');

  const submit = (rate: Rate) => {
    submitTiers([...tiers, rate]);
    setState('table');
    goToAddPL(true);
  };

  if (state === 'table') {
    return (
      <PriceListTable
        items={tiers}
        deleteRateAction={(index: number) => {
          const items = [...tiers.slice(0, index), ...tiers.slice(index + 1)];
          submitTiers(items);
          if (items.length === 0) {
            setState('form');
            goToAddPL(false);
          }
        }}
        addRateAction={() => {
          setState('form');
          goToAddPL(false);
        }}
      />
    );
  }
  if (state === 'form') {
    return (
      <AddPriceList
        metricsHash={metricsHash}
        submitRate={(rateFormData: RateFormData) => {
          const rate = transformFormDataToRequest(rateFormData, metricsHash);
          submit(rate);
        }}
        cancel={() => {
          setState('table');
          goToAddPL(true);
        }}
      />
    );
  }
  return null;
};

export default PriceList;
