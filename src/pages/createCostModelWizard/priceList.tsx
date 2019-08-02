import React from 'react';
import AddPriceList from './addPriceList';
import { CostModelContext } from './context';
import PriceListTable from './priceListTable';

const PriceList = () => {
  return (
    <CostModelContext.Consumer>
      {({ priceListCurrent }) => {
        if (priceListCurrent.justSaved) {
          return <PriceListTable />;
        }
        return <AddPriceList />;
      }}
    </CostModelContext.Consumer>
  );
};

export default PriceList;
