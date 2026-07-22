import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import messages from 'locales/messages';
import { DateRangeType } from 'routes/utils/dateRange';

import { DateRange } from './dateRange';

jest.mock('@patternfly/react-core', () => {
  const React = require('react');

  const cloneMenuItems = (children: React.ReactNode, onSelect: (event: unknown, value: string) => void) =>
    React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      if (child.type && (child.type as { displayName?: string }).displayName === 'DropdownListMock') {
        return React.cloneElement(child as React.ReactElement, {
          children: React.Children.map((child.props as { children?: React.ReactNode }).children, item =>
            React.isValidElement(item)
              ? React.cloneElement(item as React.ReactElement<{ value?: string }>, {
                  onItemSelect: () => onSelect?.(null, (item.props as { value: string }).value),
                })
              : item
          ),
        });
      }

      return child;
    });

  const DropdownList = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  DropdownList.displayName = 'DropdownListMock';

  return {
    __esModule: true,
    Dropdown: ({
      children,
      isOpen,
      onSelect,
      toggle,
    }: {
      children: React.ReactNode;
      isOpen: boolean;
      onSelect: (event: unknown, value: string) => void;
      toggle: (ref: React.Ref<HTMLButtonElement>) => React.ReactNode;
    }) => (
      <div>
        {toggle(React.createRef())}
        {isOpen && <div data-testid="date-range-menu">{cloneMenuItems(children, onSelect)}</div>}
      </div>
    ),
    DropdownList,
    DropdownItem: ({
      children,
      value,
      onItemSelect,
    }: {
      children: React.ReactNode;
      value: string;
      onItemSelect?: () => void;
    }) => (
      <button type="button" data-testid={`option-${value}`} onClick={onItemSelect}>
        {children}
      </button>
    ),
    MenuToggle: React.forwardRef(
      (
        {
          children,
          onClick,
        }: {
          children: React.ReactNode;
          onClick?: () => void;
        },
        ref: React.Ref<HTMLButtonElement>
      ) => (
        <button type="button" ref={ref} onClick={onClick}>
          {children}
        </button>
      )
    ),
  };
});

describe('explorer DateRange', () => {
  const renderDateRange = (props: Partial<React.ComponentProps<typeof DateRange>> = {}) => {
    const onSelect = jest.fn();
    render(
      <IntlProvider locale="en" messages={{}}>
        <DateRange
          dateRangeType={DateRangeType.currentMonthToDate}
          isExplorer
          isDataAvailable
          isCurrentMonthData
          isPreviousMonthData
          onSelect={onSelect}
          {...props}
        />
      </IntlProvider>
    );
    return { onSelect };
  };

  test('shows last 2 months and maximum for 3-month retention', () => {
    renderDateRange({ dataRetentionMonths: 3 });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId(`option-${DateRangeType.lastTwoMonths}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`option-${DateRangeType.lastThreeMonths}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`option-${DateRangeType.lastSixMonths}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`option-${DateRangeType.lastTwelveMonths}`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.maximum}`)).toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.custom}`)).toBeInTheDocument();
  });

  test('includes three- and six-month options for 12-month retention, but not twelve months', () => {
    renderDateRange({ dataRetentionMonths: 12 });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId(`option-${DateRangeType.lastThreeMonths}`)).toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.lastSixMonths}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`option-${DateRangeType.lastTwelveMonths}`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.maximum}`)).toBeInTheDocument();
  });

  test('includes twelve-month option when retention is greater than 12 months', () => {
    renderDateRange({ dataRetentionMonths: 18 });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId(`option-${DateRangeType.lastTwelveMonths}`)).toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.maximum}`)).toBeInTheDocument();
  });

  test('formats maximum option label with months value', () => {
    const formatMessage = jest.fn(
      (descriptor: { id?: string; defaultMessage?: string }, values?: Record<string, unknown>) => {
        if (descriptor?.id === messages.explorerDateRange.id && values?.value === DateRangeType.maximum) {
          return `Maximum (${values.months} months)`;
        }
        return String(values?.value ?? descriptor?.id ?? '');
      }
    );

    jest.spyOn(require('react-intl'), 'useIntl').mockReturnValue({
      formatMessage,
      formatDateTimeRange: () => 'Jan 1 – Mar 1',
    });

    renderDateRange({ dataRetentionMonths: 9, dateRangeType: DateRangeType.maximum });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId(`option-${DateRangeType.lastThreeMonths}`)).toBeInTheDocument();
    expect(screen.getByTestId(`option-${DateRangeType.lastSixMonths}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`option-${DateRangeType.lastTwelveMonths}`)).not.toBeInTheDocument();
    expect(formatMessage).toHaveBeenCalledWith(
      messages.explorerDateRange,
      expect.objectContaining({
        value: DateRangeType.maximum,
        months: 9,
      })
    );
    expect(screen.getByTestId(`option-${DateRangeType.maximum}`)).toHaveTextContent('Maximum (9 months)');

    jest.restoreAllMocks();
  });

  test('calls onSelect when an explorer option is chosen', () => {
    const { onSelect } = renderDateRange({ dataRetentionMonths: 9 });
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTestId(`option-${DateRangeType.lastSixMonths}`));
    expect(onSelect).toHaveBeenCalledWith(DateRangeType.lastSixMonths);
  });
});
