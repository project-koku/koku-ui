import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { GpuTagKey } from './gpuTagKey';

jest.mock('api/resources/resourceUtils', () => ({
  runResource: jest.fn().mockResolvedValue({
    data: { data: [{ value: 'L40S' }, { value: 'A100' }] },
  }),
}));

describe('GpuTagKey', () => {
  test('renders vendor selector when measurement is provided', async () => {
    const store = configureStore({} as any);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <GpuTagKey
            costType="Infrastructure"
            measurement="gpu_usage"
            metric="GPU"
            metricsHashByName={{}}
            onChange={jest.fn()}
            rates={[]}
            tagKey=""
          />
        </IntlProvider>
      </Provider>
    );

    expect(await screen.findByLabelText(/^vendor$/i)).toBeInTheDocument();
  });
});
