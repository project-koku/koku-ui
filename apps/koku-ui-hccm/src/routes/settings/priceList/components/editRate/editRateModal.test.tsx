import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { getQuery } from 'api/queries/query';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import { FetchStatus } from 'store/common';
import { metricsStateKey } from 'store/metrics';
import { resourceStateKey } from 'store/resources';
import { getFetchId } from 'store/resources/resourceCommon';
import { configureStore } from 'store/store';

import { EditRateModal } from './editRateModal';

const consoleWarn = console.warn;

jest.mock('./tag/tagValues', () => ({ TagValues: () => null }));
jest.mock('./gpu/gpuTagKey', () => ({ GpuTagKey: () => null }));
jest.mock('./gpu/gpuTagValues', () => ({ GpuTagValues: () => null }));

/** Avoid async Redux updates after render (act warnings) by skipping initial metrics / GPU vendor fetches. */
function preloadedStateForEditRateModal() {
  const vendorQueryString = getQuery({ limit: 100 });
  const vendorFetchId = getFetchId(ResourcePathsType.ocp, ResourceType.gpuVendor, vendorQueryString);
  return {
    [metricsStateKey]: {
      error: null,
      status: FetchStatus.complete,
      metrics: {
        data: [],
        meta: { count: 0 },
        links: { first: '', previous: '', next: '', last: '' },
      },
    },
    [resourceStateKey]: {
      byId: new Map([
        [
          vendorFetchId,
          {
            data: [],
            meta: { count: 0 },
            links: { first: '', previous: '', next: '', last: '' },
            timeRequested: Date.now(),
          },
        ],
      ]),
      fetchStatus: new Map([[vendorFetchId, FetchStatus.complete]]),
      errors: new Map([[vendorFetchId, null]]),
    },
  };
}

describe('EditRateModal', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('Selector unknown')) {
        return;
      }
      consoleWarn.call(console, msg, ...args);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const priceList = {
    name: 'PL',
    uuid: 'pl-u',
    rates: [
      {
        cost_type: 'Infrastructure',
        description: 'd',
        metric: { name: 'cpu_core', label_metric: 'CPU', label_measurement: 'Req', label_measurement_unit: 'h' },
        tiered_rates: [{ unit: 'USD', value: 1 }],
      },
    ],
  } as any;

  test('renders closed without throwing (stores hydrated via configureStore)', () => {
    const store = configureStore(preloadedStateForEditRateModal());

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isOpen={false} priceList={priceList} />
        </IntlProvider>
      </Provider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders add-rate dialog when open', async () => {
    const store = configureStore(preloadedStateForEditRateModal());
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isAddRate isOpen priceList={priceList} />
        </IntlProvider>
      </Provider>
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  test('edit existing rate opens dialog for given index', async () => {
    const store = configureStore(preloadedStateForEditRateModal());
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isOpen priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  test('add-rate modal exposes description field', async () => {
    const store = configureStore(preloadedStateForEditRateModal());
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isAddRate isOpen priceList={priceList} />
        </IntlProvider>
      </Provider>
    );

    await screen.findByRole('dialog');
    expect(document.getElementById('description')).toBeInstanceOf(HTMLTextAreaElement);
  });
});
