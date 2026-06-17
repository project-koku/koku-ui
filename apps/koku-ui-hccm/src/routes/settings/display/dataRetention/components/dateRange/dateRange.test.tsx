import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { DateRange, DateRangeType } from './dateRange';

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
          isDisabled,
        }: {
          children: React.ReactNode;
          onClick?: () => void;
          isDisabled?: boolean;
        },
        ref: React.Ref<HTMLButtonElement>
      ) => (
        <button type="button" ref={ref} disabled={isDisabled} onClick={onClick}>
          {children}
        </button>
      )
    ),
  };
});

describe('DateRange', () => {
  const renderDateRange = (props: Partial<React.ComponentProps<typeof DateRange>> = {}) => {
    const onSelect = jest.fn();
    render(
      <IntlProvider locale="en">
        <DateRange dateRangeType={DateRangeType.threeMonths} onSelect={onSelect} {...props} />
      </IntlProvider>
    );
    return { onSelect };
  };

  test('renders the selected date range in the toggle', () => {
    renderDateRange();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls onSelect when an option is chosen', () => {
    const { onSelect } = renderDateRange();
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTestId(`option-${DateRangeType.sixMonths}`));
    expect(onSelect).toHaveBeenCalledWith(DateRangeType.sixMonths);
  });

  test('disables the toggle when isDisabled is true', () => {
    renderDateRange({ isDisabled: true });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
