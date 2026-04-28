import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { TagValues } from './tagValues';

describe('TagValues', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

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

  test('renders tag value rows and forwards changes', () => {
    const onValueChange = jest.fn();
    const onRateChange = jest.fn();
    const tagValues = [
      {
        default: false,
        description: '',
        tag_value: 'v1',
        unit: 'USD',
        value: 1,
      },
    ] as any;

    render(
      <Provider store={setupStore()}>
        <IntlProvider defaultLocale="en" locale="en">
          <TagValues
            currency="USD"
            errors={[{ tag_value: undefined }]}
            tagValues={tagValues}
            onRateChange={onRateChange}
            onValueChange={onValueChange}
          />
        </IntlProvider>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter a tag value/i), {
      target: { value: 'app' },
    });
    expect(onValueChange).toHaveBeenCalled();

    fireEvent.change(screen.getAllByLabelText(/^rate$/i)[0], { target: { value: '2' } });
    expect(onRateChange).toHaveBeenCalled();
  });
});
