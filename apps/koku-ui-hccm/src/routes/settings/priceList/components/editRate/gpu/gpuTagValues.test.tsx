import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { configureStore } from 'store/store';

import { GpuTagValues } from './gpuTagValues';

jest.mock('api/resources/resourceUtils', () => ({
  runResource: jest.fn().mockResolvedValue({
    data: { data: [{ value: 'L40S' }] },
  }),
}));

describe('GpuTagValues', () => {
  const consoleWarn = console.warn;
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args: unknown[]) => {
      const s = typeof msg === 'string' ? msg : '';
      if (s.includes('Table headers must have an accessible name')) {
        return;
      }
      consoleWarn.call(console, msg, ...args);
    });
  });
  afterAll(() => jest.restoreAllMocks());

  test('renders GPU model column and forwards rate changes', async () => {
    const onRateChange = jest.fn();
    const tagValues = [
      {
        default: false,
        description: '',
        tag_value: '',
        unit: 'USD',
        value: 0,
      },
    ] as any;

    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <GpuTagValues
            currency="USD"
            errors={[{}]}
            tagKey="nvidia"
            tagValues={tagValues}
            onRateChange={onRateChange}
          />
        </IntlProvider>
      </Provider>
    );

    const rateInput = await screen.findByLabelText(/^rate$/i);
    fireEvent.change(rateInput, { target: { value: '3.5' } });
    expect(onRateChange).toHaveBeenCalled();
  });
});
