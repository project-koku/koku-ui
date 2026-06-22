import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ReviewSuccess } from './reviewSuccess';

describe('ReviewSuccess', () => {
  test('renders success message and close calls onClose', () => {
    const onClose = jest.fn();
    render(
      <IntlProvider locale="en">
        <ReviewSuccess name="My model" onClose={onClose} />
      </IntlProvider>
    );
    expect(screen.getByText(/my model/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
