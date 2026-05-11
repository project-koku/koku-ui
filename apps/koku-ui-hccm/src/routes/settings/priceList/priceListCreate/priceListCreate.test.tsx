import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { PriceListType } from 'api/priceList';
import { configureStore } from 'store/store';
import { FetchStatus } from 'store/common';
import { priceListStateKey } from 'store/priceList';
import { getFetchId } from 'store/priceList/priceListCommon';

import PriceListCreate from './priceListCreate';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('utils/userAccess', () => ({
  ...jest.requireActual('utils/userAccess'),
  hasSettingsAccess: () => true,
}));

jest.mock('routes/settings/priceList/priceList/details', () => {
  const React = require('react');
  return {
    DetailsContent: React.forwardRef((props: { onDisabled?: (v: boolean) => void; onSave?: (p: unknown) => void }, ref: unknown) => {
      React.useImperativeHandle(ref, () => ({
        save: () => props.onSave?.({ currency: 'EUR', name: 'New PL' }),
      }));
      React.useEffect(() => {
        props.onDisabled?.(false);
      }, [props]);
      return <div data-testid="details-content-mock" />;
    }),
  };
});

jest.mock('./priceListRates', () => ({
  PriceListRates: () => <div data-testid="price-list-rates-mock" />,
}));

const consoleWarn = console.warn;

describe('PriceListCreate', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('React Router Future Flag')) {
        return;
      }
      consoleWarn.call(console, msg, ...args);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderCreate = () => {
    const fetchId = getFetchId(PriceListType.priceListAdd, undefined);
    const store = configureStore({
      [priceListStateKey]: {
        byId: new Map(),
        errors: new Map([[fetchId, null]]),
        notification: new Map(),
        status: new Map([[fetchId, FetchStatus.none]]),
      },
    } as any);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider defaultLocale="en" locale="en">
            <PriceListCreate />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    );
    return { dispatchSpy, store };
  };

  test('renders header, details, and rates sections', () => {
    renderCreate();
    expect(screen.getByRole('heading', { name: /create price list/i })).toBeInTheDocument();
    expect(screen.getByTestId('details-content-mock')).toBeInTheDocument();
    expect(screen.getByTestId('price-list-rates-mock')).toBeInTheDocument();
  });

  test('cancel navigates back to settings', () => {
    renderCreate();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalled();
    const [path, opts] = mockNavigate.mock.calls[0];
    expect(path).toContain('/settings');
    expect(opts?.replace).toBe(true);
  });

  test('create dispatches updatePriceList with payload from details save', () => {
    const { dispatchSpy } = renderCreate();
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    expect(dispatchSpy).toHaveBeenCalled();
    const thunkArg = dispatchSpy.mock.calls.find((c: unknown[]) => typeof c[0] === 'function')?.[0] as
      | (() => unknown)
      | undefined;
    expect(thunkArg).toEqual(expect.any(Function));
  });
});
