import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CostModelCreateHeader } from './costModelCreateHeader';

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

describe('CostModelCreateHeader', () => {
  test('renders breadcrumb with cost models link and create label', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <IntlProvider locale="en">
          <CostModelCreateHeader />
        </IntlProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /cost models/i })).toHaveAttribute('href', expect.stringMatching(/\/settings$/));
    expect(screen.getByText(/create cost model/i)).toBeInTheDocument();
  });
});
