import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import PriceListTable from './priceListTable';
import { CostModelContext } from './context';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));

jest.mock('store/metrics', () => ({ __esModule: true, metricsSelectors: { metrics: () => ({}) } }));

jest.mock('routes/settings/costModels/components/hoc/withPriceListSearch', () => ({
  __esModule: true,
  WithPriceListSearch: ({ children }: any) => children({
    search: { primary: 'metrics', metrics: [], measurements: [] },
    setSearch: jest.fn(),
    onRemove: jest.fn(),
    onSelect: jest.fn(),
    onClearAll: jest.fn(),
  }),
}));

jest.mock('routes/components/selectWrapper', () => ({
  __esModule: true,
  SelectWrapper: (props: any) => <button onClick={() => props.onSelect({}, { value: 'metrics' })}>select</button>,
  SelectCheckboxWrapper: (props: any) => <button onClick={() => props.onSelect({}, { value: 'val' })}>check</button>,
}));

jest.mock('routes/settings/costModels/components/rateTable', () => ({
  __esModule: true,
  RateTable: (props: any) => (
    <div>
      <button onClick={() => props.actions[0].onClick(null, null, { data: { stateIndex: 0 } })}>delete-row</button>
    </div>
  ),
}));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('PriceListTable', () => {
  test('renders toolbar even when no items', () => {
    renderWithIntl(
      <CostModelContext.Provider value={{ priceListPagination: { page: 1, perPage: 10, onPageSet: jest.fn(), onPerPageSet: jest.fn() } } as any}>
        <PriceListTable addRateAction={jest.fn()} deleteRateAction={jest.fn()} items={[]} metricsHash={{}} intl={{ formatMessage: (_: any, __?: any) => '' }} />
      </CostModelContext.Provider>
    );
    expect(document.getElementById('price-list-toolbar')).toBeTruthy();
  });

  test('add button triggers addRateAction', () => {
    const addRateAction = jest.fn();
    renderWithIntl(
      <CostModelContext.Provider value={{ priceListPagination: { page: 1, perPage: 10, onPageSet: jest.fn(), onPerPageSet: jest.fn() } } as any}>
        <PriceListTable addRateAction={addRateAction} deleteRateAction={jest.fn()} items={[]} metricsHash={{}} intl={{ formatMessage: (_: any, __?: any) => 'x' }} />
      </CostModelContext.Provider>
    );
    const buttons = screen.getAllByRole('button');
    // click the primary create button (last section's first button)
    fireEvent.click(buttons.find(b => b.className.includes('pf-m-primary'))!);
    expect(addRateAction).toHaveBeenCalled();
  });

  test('delete action triggers deleteRateAction', () => {
    const deleteRateAction = jest.fn();
    const items = [{ metric: { label_metric: 'cpu', label_measurement: 'Hrs', label_measurement_unit: 'hrs' } }];
    renderWithIntl(
      <CostModelContext.Provider value={{ priceListPagination: { page: 1, perPage: 10, onPageSet: jest.fn(), onPerPageSet: jest.fn() } } as any}>
        <PriceListTable addRateAction={jest.fn()} deleteRateAction={deleteRateAction} items={items as any} metricsHash={{}} intl={{ formatMessage: (_: any, __?: any) => 'x' }} />
      </CostModelContext.Provider>
    );
    fireEvent.click(screen.getByText('delete-row'));
    expect(deleteRateAction).toHaveBeenCalledWith(0);
  });
}); 