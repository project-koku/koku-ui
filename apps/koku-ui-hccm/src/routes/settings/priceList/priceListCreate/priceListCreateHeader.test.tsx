import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { PriceListCreateHeader } from './priceListCreateHeader';

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

describe('PriceListCreateHeader', () => {
  const renderHeader = (props: Partial<React.ComponentProps<typeof PriceListCreateHeader>> = {}) => {
    const onCancel = jest.fn();
    const onCreate = jest.fn();
    render(
      <MemoryRouter future={routerFuture}>
        <IntlProvider defaultLocale="en" locale="en">
          <PriceListCreateHeader
            canWrite
            isDisabled={false}
            onCancel={onCancel}
            onCreate={onCreate}
            priceList={{ description: 'Test description' } as any}
            {...props}
          />
        </IntlProvider>
      </MemoryRouter>
    );
    return { onCancel, onCreate };
  };

  test('renders title, description, and breadcrumb', () => {
    renderHeader();
    expect(screen.getByRole('heading', { name: /create price list/i })).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /price list/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/settings$/)
    );
  });

  test('invokes onCreate when primary button clicked', () => {
    const { onCreate } = renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /^create$/i }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  test('invokes onCancel when cancel clicked', () => {
    const { onCancel } = renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('create button respects canWrite and isDisabled', () => {
    renderHeader({ canWrite: false, isDisabled: false });
    expect(screen.getByRole('button', { name: /^create$/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
