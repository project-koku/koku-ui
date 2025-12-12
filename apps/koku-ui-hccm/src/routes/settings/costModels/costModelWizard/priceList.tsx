import type { Rate } from 'api/rates';
import React from 'react';
import AddPriceList from 'routes/settings/costModels/components/addPriceList';
import type { RateFormData } from 'routes/settings/costModels/components/rateForm/index';
import { transformFormDataToRequest } from 'routes/settings/costModels/components/rateForm/index';

import { CostModelContext } from './context';
import PriceListTable from './priceListTable';

const PriceList = () => {
  const { currencyUnits, goToAddPL, gpuModels, gpuVendors, metricsHash, tiers, submitTiers } =
    React.useContext(CostModelContext);
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
        cancel={() => {
          setState('table');
          goToAddPL(true);
        }}
        currencyUnits={currencyUnits}
        gpuModels={gpuModels}
        gpuVendors={gpuVendors}
        metricsHash={metricsHash}
        submitRate={(rateFormData: RateFormData) => {
          const rate = transformFormDataToRequest(rateFormData, metricsHash, currencyUnits);
          submit(rate);
        }}
      />
    );
  }
  return null;
};

export default PriceList;
