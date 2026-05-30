import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { CreateCostModelAction } from './createCostModelAction';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('CreateCostModelAction', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('clicking create navigates to cost model wizard', () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <CreateCostModelAction canWrite />
        </IntlProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /create cost model/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
