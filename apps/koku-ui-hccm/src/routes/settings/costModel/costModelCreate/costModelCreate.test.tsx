import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { configureStore } from 'store/store';

import CostModelCreate from './costModelCreate';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate, useLocation: () => ({ state: {} }) };
});

jest.mock('./costModelCreateHeader', () => ({
  CostModelCreateHeader: ({ onCancel, onCreate }: any) => (
    <div data-testid="create-header">
      <button type="button" onClick={onCancel}>
        cancel
      </button>
      <button type="button" onClick={onCreate}>
        create
      </button>
    </div>
  ),
}));

jest.mock('routes/settings/priceList/priceLists/components/details', () => ({
  DetailContent: React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      save: () => _props.onSave?.({ name: 'New PL', currency: 'USD' }),
    }));
    React.useEffect(() => _props.onDisabled?.(false), [_props.onDisabled]);
    return <div data-testid="detail-content" />;
  }),
}));

describe('CostModelCreate', () => {
  beforeEach(() => mockNavigate.mockClear());

  test('renders header and detail content', () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModelCreate />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByTestId('create-header')).toBeInTheDocument();
    expect(screen.getByTestId('detail-content')).toBeInTheDocument();
  });

  test('cancel navigates to settings', () => {
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider locale="en">
          <MemoryRouter>
            <CostModelCreate />
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
