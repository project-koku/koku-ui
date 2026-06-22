import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { NoCostModelState } from './noCostModelState';

jest.mock('routes/settings/costModels/costModelCreate/components/actions', () => ({
  CreateCostModelAction: () => <button type="button">create-cost-model</button>,
}));

describe('NoCostModelState', () => {
  test('renders empty state with create action', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <NoCostModelState canWrite />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(screen.getByText(/what is your hybrid cloud costing you/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create cost model/i })).toBeInTheDocument();
  });
});
