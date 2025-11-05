import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import PriceList from './priceList';
import { CostModelContext } from './context';

jest.mock('./priceListTable', () => ({ __esModule: true, default: (props: any) => (
  <div>
    <button onClick={props.addRateAction}>add</button>
    <button onClick={() => props.deleteRateAction(0)}>delete</button>
  </div>
)}));

jest.mock('routes/settings/costModels/components/rateForm/index', () => ({
  __esModule: true,
  transformFormDataToRequest: () => ({ metric: { label_metric: 'cpu', label_measurement: 'Hrs', label_measurement_unit: 'hrs' } }),
}));

jest.mock('routes/settings/costModels/components/addPriceList', () => ({ __esModule: true, default: (props: any) => (
  <div>
    <button onClick={() => props.submitRate({})}>submit</button>
    <button onClick={props.cancel}>cancel</button>
  </div>
)}));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('PriceList', () => {
  test('switches to form and submits a rate', () => {
    const submitTiers = jest.fn();
    const goToAddPL = jest.fn();
    renderWithIntl(
      <CostModelContext.Provider value={{ currencyUnits: 'USD', metricsHash: {}, tiers: [], submitTiers, goToAddPL } as any}>
        <PriceList />
      </CostModelContext.Provider>
    );

    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('submit'));

    expect(submitTiers).toHaveBeenCalled();
    expect(goToAddPL).toHaveBeenCalledWith(true);
  });

  test('cancel returns to table', () => {
    const goToAddPL = jest.fn();
    renderWithIntl(
      <CostModelContext.Provider value={{ currencyUnits: 'USD', metricsHash: {}, tiers: [], submitTiers: jest.fn(), goToAddPL } as any}>
        <PriceList />
      </CostModelContext.Provider>
    );
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('cancel'));
    expect(goToAddPL).toHaveBeenCalledWith(true);
  });
}); 