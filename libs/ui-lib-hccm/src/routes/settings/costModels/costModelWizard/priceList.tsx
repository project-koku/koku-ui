import type { Rate } from '@koku-ui/api/rates';
import React from 'react';

import AddPriceList from '../components/addPriceList';
import type { RateFormData } from '../components/rateForm';
import { transformFormDataToRequest } from '../components/rateForm';
import { CostModelContext } from './context';
import PriceListTable from './priceListTable';

const PriceList = () => {
  const { currencyUnits, goToAddPL, metricsHash, tiers, submitTiers } = React.useContext(CostModelContext);
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
            goToAddPL(true);
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
        currencyUnits={currencyUnits}
        metricsHash={metricsHash}
        submitRate={(rateFormData: RateFormData) => {
          const rate = transformFormDataToRequest(rateFormData, metricsHash, currencyUnits);
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
