import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import * as api from 'api/priceList';
import { priceListReducer, priceListStateKey } from 'store/priceList';

import type { DetailsContentHandle } from './detailsContent';
import { EditDetailsModal } from './editDetailsModal';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return {
    ...actual,
    updatePriceList: jest.fn(() => Promise.resolve({ data: {} })),
  };
});

jest.mock('./detailsContent', () => {
  const React = require('react');
  const { forwardRef, useEffect, useImperativeHandle } = React;

  return {
    DetailsContent: forwardRef(
      (
        props: {
          onDisabled?: (v: boolean) => void;
          onSave?: (p: unknown) => void;
        },
        ref: React.Ref<DetailsContentHandle>
      ) => {
        useImperativeHandle(ref, () => ({
          save: () =>
            props.onSave?.({
              currency: 'USD',
              description: 'Updated desc',
              effective_end_date: '2025-12-31',
              effective_start_date: '2025-01-01',
              name: 'Updated PL',
            }),
        }));
        useEffect(() => {
          props.onDisabled?.(false);
        }, []);
        return React.createElement('div', { 'data-testid': 'details-content-stub' });
      }
    ),
  };
});

describe('EditDetailsModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const renderModal = (ui: React.ReactElement, store = setupStore()) =>
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );

  const basePriceList = {
    currency: 'USD',
    description: 'D',
    name: 'PL',
    uuid: 'pl-modal-1',
  } as any;

  beforeEach(() => {
    (api.updatePriceList as jest.Mock).mockClear();
    (api.updatePriceList as jest.Mock).mockResolvedValue({ data: {} });
  });

  test('save invokes onEdit when provided', async () => {
    const onEdit = jest.fn();
    renderModal(<EditDetailsModal isOpen onEdit={onEdit} priceList={basePriceList} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^save$/i }));
    await waitFor(() =>
      expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ currency: 'USD', name: 'Updated PL' }))
    );
    expect(api.updatePriceList).not.toHaveBeenCalled();
  });

  test('save calls API update when onEdit is omitted', async () => {
    renderModal(<EditDetailsModal isOpen priceList={basePriceList} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^save$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    renderModal(<EditDetailsModal isOpen onClose={onClose} priceList={basePriceList} />);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('onSuccess runs after async update completes when using API path', async () => {
    const onSuccess = jest.fn();
    renderModal(<EditDetailsModal isOpen onSuccess={onSuccess} priceList={basePriceList} />);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^save$/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test('resets finish tracking when modal opens', () => {
    const { rerender } = renderModal(<EditDetailsModal isOpen={false} priceList={basePriceList} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Provider store={setupStore()}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditDetailsModal isOpen priceList={basePriceList} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
