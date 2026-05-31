import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { routerFuture } from 'testUtils';

import { CreatePriceListAction } from './createPriceListAction';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreatePriceListAction', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('navigates to price list create when clicked and writable', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <IntlProvider locale="en">
          <CreatePriceListAction canWrite />
        </IntlProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /create a price list/i }));

    expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ replace: true }));
  });
});
