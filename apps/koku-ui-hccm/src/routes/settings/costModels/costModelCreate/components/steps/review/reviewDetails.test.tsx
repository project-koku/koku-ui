import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { FetchStatus } from 'store/common';
import { defaultState, stateKey } from 'store/costModels/costModelReducer';
import { configureStore } from 'store/store';

import { ReviewDetails } from './reviewDetails';

jest.mock('components/featureToggle', () => ({
  useIsGpuToggleEnabled: () => false,
}));

describe('ReviewDetails', () => {
  test('renders cost model summary fields', () => {
    const store = configureStore({
      [stateKey]: {
        ...defaultState,
        add: { ...defaultState.add, status: FetchStatus.none, error: null },
      },
    } as any);

    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ReviewDetails
            currency="USD"
            description="Desc"
            name="New model"
            sourceType="AWS"
            markup="10"
            priceLists={[]}
            sources={[]}
          />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getByText(/new model/i)).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});
