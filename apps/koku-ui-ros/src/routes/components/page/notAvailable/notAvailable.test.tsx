import { render, screen } from '@testing-library/react';
import React from 'react';

import NotAvailable from './notAvailable';

describe('NotAvailable', () => {
  test('renders unavailable content', () => {
    render(<NotAvailable />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('renders a title when provided', () => {
    render(<NotAvailable title="Temporarily unavailable" />);
    expect(screen.getByRole('heading', { name: 'Temporarily unavailable' })).toBeInTheDocument();
  });
});
