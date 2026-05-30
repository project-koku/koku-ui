import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { CostModelsToolbar } from './costModelsToolbar';

describe('CostModelsToolbar', () => {
  const dummyReducer = (state: Record<string, unknown> = {}) => state;

  const renderToolbar = (ui: React.ReactElement) => {
    const store = createStore(dummyReducer as any);
    return render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );
  };

  const noop = jest.fn();
  const baseQuery = { filter_by: {} } as any;

  test('renders filter toolbar wired for name chips', () => {
    renderToolbar(
      <CostModelsToolbar
        isDisabled={false}
        itemsPerPage={2}
        itemsTotal={2}
        onFilterAdded={noop}
        onFilterRemoved={noop}
        query={baseQuery}
      />
    );
    expect(screen.getByRole('button', { name: /show filters/i })).toBeInTheDocument();
  });
});
