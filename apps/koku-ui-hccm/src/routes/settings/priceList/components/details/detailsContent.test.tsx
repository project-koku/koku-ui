import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import type { PriceListData } from 'api/priceList';

import { DetailsContent, type DetailsContentHandle } from './detailsContent';

type CalendarPickOverride = { end: Date; start: Date };

const getCalendarOverride = (): CalendarPickOverride | undefined =>
  (globalThis as { __detailsContentCalendarDates?: CalendarPickOverride }).__detailsContentCalendarDates;

const setCalendarOverride = (value: CalendarPickOverride | undefined) => {
  (globalThis as { __detailsContentCalendarDates?: CalendarPickOverride }).__detailsContentCalendarDates = value;
};

jest.mock('routes/components/currency', () => ({
  Currency: ({
    currency,
    isDisabled,
    onSelect,
  }: {
    currency?: string;
    isDisabled?: boolean;
    onSelect?: (c: string) => void;
  }) =>
    isDisabled ? (
      <span data-testid="currency-readonly">{currency}</span>
    ) : (
      <button type="button" data-testid="currency-picker" onClick={() => onSelect?.('EUR')}>
        {currency}
      </button>
    ),
}));

jest.mock('@patternfly/react-core', () => {
  const React = require('react');
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    ...actual,
    CalendarMonth: (props: {
      id?: string;
      onMonthChange?: (_event: unknown, date: Date) => void;
    }) =>
      React.createElement(
        'button',
        {
          'data-testid': `calendar-${props.id}`,
          type: 'button',
          onClick: () => {
            const defaults = {
              end: new Date('2023-02-15'),
              start: new Date('2026-03-15'),
            };
            const pick = getCalendarOverride() ?? defaults;
            const date = props.id === 'start-date' ? pick.start : pick.end;
            props.onMonthChange?.(null, date);
          },
        },
        `cal-${props.id}`
      ),
  };
});

const renderDetails = (ui: React.ReactElement) =>
  render(<IntlProvider defaultLocale="en" locale="en">{ui}</IntlProvider>);

const nameInput = () => document.getElementById('name') as HTMLInputElement;

const descriptionInput = () => document.getElementById('description') as HTMLTextAreaElement;

describe('DetailsContent', () => {
  const basePriceList: PriceListData = {
    currency: 'USD',
    description: 'Baseline description',
    effective_end_date: '2024-12-15',
    effective_start_date: '2024-03-01',
    name: 'North America',
    uuid: 'pl-1',
  } as PriceListData;

  afterEach(() => {
    setCalendarOverride(undefined);
  });

  test('renders currency as read-only text with tooltip in edit mode', () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    expect(screen.queryByTestId('currency-picker')).not.toBeInTheDocument();
    expect(screen.getByTestId('currency-readonly')).toHaveTextContent('USD');
  });

  test('renders currency picker when not editing existing details (add flow)', () => {
    renderDetails(<DetailsContent priceList={basePriceList} />);
    expect(screen.getByTestId('currency-picker')).toBeInTheDocument();
  });

  test('shows validity period warning alert', () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    expect(
      screen.getByText(/start period must be the same as or before the end period/i)
    ).toBeInTheDocument();
  });

  test('calls onDisabled when unsaved / validation state changes', async () => {
    const onDisabled = jest.fn();
    renderDetails(
      <DetailsContent isEditDetails onDisabled={onDisabled} onSave={jest.fn()} priceList={basePriceList} />
    );
    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(true));
    fireEvent.change(nameInput(), { target: { value: 'Renamed list' } });
    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(false));
  });

  test('surfaces name validation when value is empty after edit', async () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    fireEvent.change(nameInput(), { target: { value: '' } });
    await waitFor(() => expect(screen.getByText('This field is required')).toBeInTheDocument());
  });

  test('surfaces description validation when over 500 characters', async () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    fireEvent.change(descriptionInput(), { target: { value: 'x'.repeat(501) } });
    await waitFor(() =>
      expect(screen.getByText('Should not exceed 500 characters')).toBeInTheDocument()
    );
  });

  test('shows start period error when start is after end', async () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    fireEvent.click(screen.getByTestId('calendar-start-date'));
    await waitFor(() =>
      expect(screen.getByText('Start period must be <= end period')).toBeInTheDocument()
    );
  });

  test('shows end period error when end is before start', async () => {
    renderDetails(<DetailsContent isEditDetails priceList={basePriceList} />);
    fireEvent.click(screen.getByTestId('calendar-end-date'));
    await waitFor(() =>
      expect(screen.getByText('End period must be >= start period')).toBeInTheDocument()
    );
  });

  test('imperative save calls onSave with formatted payload', async () => {
    const onSave = jest.fn();
    const ref = createRef<DetailsContentHandle>();
    renderDetails(
      <DetailsContent ref={ref} isEditDetails onSave={onSave} priceList={basePriceList} />
    );
    fireEvent.change(nameInput(), {
      target: { value: 'Updated name' },
    });
    await waitFor(() => expect(ref.current).not.toBeNull());
    ref.current?.save();
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const payload = onSave.mock.calls[0][0];
    expect(payload).toMatchObject({
      currency: 'USD',
      description: 'Baseline description',
      name: 'Updated name',
    });
    expect(payload.effective_start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(payload.effective_end_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('add-details flow enables save when all fields differ from baseline', async () => {
    setCalendarOverride({
      end: new Date('2025-12-01'),
      start: new Date('2024-06-01'),
    });
    const onDisabled = jest.fn();
    const onSave = jest.fn();
    const ref = createRef<DetailsContentHandle>();
    renderDetails(
      <DetailsContent ref={ref} onDisabled={onDisabled} onSave={onSave} priceList={basePriceList} />
    );
    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(true));

    fireEvent.click(screen.getByTestId('currency-picker'));
    fireEvent.change(nameInput(), {
      target: { value: `${basePriceList.name}x` },
    });
    fireEvent.change(descriptionInput(), {
      target: { value: `${basePriceList.description}x` },
    });
    fireEvent.click(screen.getByTestId('calendar-start-date'));
    fireEvent.click(screen.getByTestId('calendar-end-date'));

    await waitFor(() => expect(onDisabled).toHaveBeenCalledWith(false));
    ref.current?.save();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][0].currency).toBe('EUR');
  });

  test('renders with minimal price list (missing optional dates)', () => {
    const minimal = { currency: 'USD', name: 'N', uuid: 'u' } as PriceListData;
    renderDetails(<DetailsContent isEditDetails priceList={minimal} />);
    expect(nameInput()).toHaveValue('N');
  });

  test('save includes default validity dates when API omitted effective_start/end', async () => {
    const minimal = { currency: 'USD', name: 'Only', uuid: 'u' } as PriceListData;
    const onSave = jest.fn();
    const ref = createRef<DetailsContentHandle>();
    renderDetails(
      <DetailsContent ref={ref} isEditDetails onSave={onSave} priceList={minimal} />
    );
    fireEvent.change(nameInput(), { target: { value: 'Only+' } });
    await waitFor(() => expect(ref.current).not.toBeNull());
    ref.current?.save();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    const payload = onSave.mock.calls[0][0];
    // getEffectiveDate() fills “today” when dates are absent, so save still sends month bounds.
    expect(payload.effective_start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(payload.effective_end_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
