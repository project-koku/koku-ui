import { fireEvent, render } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import type { RatesContentHandle } from './ratesContent';
import { RatesContent } from './ratesContent';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

jest.mock('store/metrics', () => {
  const FetchStatus = require('store/common').FetchStatus;
  const actual = jest.requireActual('store/metrics');
  const cpu = {
    default_cost_type: 'Infrastructure',
    label_measurement: 'Core-hour',
    label_measurement_unit: 'hrs',
    label_metric: 'CPU_Request',
    metric: 'cpu_core_request',
    name: 'cpu_core_request',
  };
  const nested = { CPU_Request: { cpu_core_request: cpu } };
  const byName = {
    cpu_core_request: {
      ...cpu,
      cpu_core_request: cpu,
    },
  };
  return {
    ...actual,
    metricsSelectors: {
      ...actual.metricsSelectors,
      metrics: jest.fn(() => nested),
      metricsByName: jest.fn(() => byName),
      status: jest.fn(() => FetchStatus.complete),
    },
  };
});

jest.mock('store/resources', () => {
  const FetchStatus = require('store/common').FetchStatus;
  const actual = jest.requireActual('store/resources');
  const resource = { data: [{ value: 'nvidia' }] };
  return {
    ...actual,
    resourceSelectors: {
      ...actual.resourceSelectors,
      selectResource: jest.fn(() => resource),
      selectResourceFetchStatus: jest.fn(() => FetchStatus.complete),
      selectResourceError: jest.fn(() => undefined),
    },
  };
});

jest.mock('store/featureToggle', () => {
  const actual = jest.requireActual('store/featureToggle');
  return {
    ...actual,
    FeatureToggleSelectors: {
      ...actual.FeatureToggleSelectors,
      selectIsGpuToggleEnabled: jest.fn(() => true),
    },
  };
});

const noopStore = createStore(() => ({}));

const samplePriceList = {
  currency: 'USD',
  rates: [
    {
      cost_type: 'Infrastructure',
      custom_name: 'CPU rate',
      description: 'd',
      metric: {
        label_measurement: 'Core-hour',
        name: 'cpu_core_request',
      },
      tiered_rates: [{ unit: 'USD', value: 0.42 }],
    },
  ],
  uuid: 'pl-1',
} as any;

describe('RatesContent interactions', () => {
  const renderContent = (ui: React.ReactElement) =>
    render(
      <Provider store={noopStore}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );

  test('changing name and description updates inputs', () => {
    renderContent(<RatesContent priceList={samplePriceList} rateIndex={0} />);

    const name = document.getElementById('name') as HTMLInputElement;
    fireEvent.change(name, { target: { value: 'Updated name' } });
    expect(name.value).toBe('Updated name');

    const description = document.getElementById('description') as HTMLTextAreaElement;
    fireEvent.change(description, { target: { value: 'New desc' } });
    expect(description.value).toBe('New desc');
  });

  test('save merges tiered rate payload for existing CPU rate', () => {
    const onSave = jest.fn();
    const ref = createRef<RatesContentHandle>();
    renderContent(<RatesContent ref={ref} onSave={onSave} priceList={samplePriceList} rateIndex={0} />);

    const name = document.getElementById('name') as HTMLInputElement;
    fireEvent.change(name, { target: { value: 'Updated name' } });

    ref.current?.save();
    expect(onSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          custom_name: 'Updated name',
          tiered_rates: expect.any(Array),
        }),
      ])
    );
  });
});
