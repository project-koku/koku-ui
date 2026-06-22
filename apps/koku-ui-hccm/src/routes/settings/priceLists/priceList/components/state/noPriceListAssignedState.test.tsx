import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { routerFuture } from 'testUtils';

import { NoPriceListAssignedState } from './noPriceListAssignedState';

describe('NoPriceListAssignedState', () => {
  test('renders empty state with create action when canWrite', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <IntlProvider locale="en">
          <NoPriceListAssignedState canWrite />
        </IntlProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/no price lists are assigned/i)).toBeInTheDocument();
    expect(screen.getByText(/use assign price lists/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create a price list/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create a price list/i })).not.toHaveAttribute('aria-disabled', 'true');
  });
});
