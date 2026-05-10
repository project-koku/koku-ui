import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { GpuTagKey } from './gpuTagKey';

const gpuVendorResource = {
  data: [{ value: 'nvidia' }, { value: 'amd' }],
};

jest.mock('store/resources', () => {
  const FetchStatus = require('store/common').FetchStatus;
  const actual = jest.requireActual('store/resources');
  return {
    ...actual,
    resourceActions: {
      ...actual.resourceActions,
      fetchResource: jest.fn(() => ({ type: 'tests/fetchResource-stub' })),
    },
    resourceSelectors: {
      ...actual.resourceSelectors,
      selectResource: jest.fn(() => gpuVendorResource),
      selectResourceFetchStatus: jest.fn(() => FetchStatus.complete),
      selectResourceError: jest.fn(() => undefined),
    },
  };
});

const noopStore = createStore(() => ({}));

describe('GpuTagKey', () => {
  const renderGpuTagKey = (props: Partial<React.ComponentProps<typeof GpuTagKey>> = {}) =>
    render(
      <Provider store={noopStore}>
        <IntlProvider defaultLocale="en" locale="en">
          <GpuTagKey measurement="gpu_meas" metric="GPU" onChange={jest.fn()} tagKey="" {...props} />
        </IntlProvider>
      </Provider>
    );

  test('renders vendor selector when resource data is available', () => {
    renderGpuTagKey();
    expect(screen.getByRole('button', { name: /^vendor$/i })).toBeInTheDocument();
  });

  test('passes duplicate vendor info when rates conflict', () => {
    const rates = [
      {
        cost_type: 'Infrastructure',
        metric: { name: 'gpu_metric' },
        tag_rates: { tag_key: 'nvidia' },
      },
    ];
    renderGpuTagKey({
      costType: 'Infrastructure',
      measurement: 'gpu_meas',
      metric: 'GPU_Request',
      metricsHashByName: {
        gpu_metric: { label_metric: 'GPU_Request' },
      },
      rates,
    });
    expect(screen.getByRole('button', { name: /^vendor$/i })).toBeInTheDocument();
  });
});
