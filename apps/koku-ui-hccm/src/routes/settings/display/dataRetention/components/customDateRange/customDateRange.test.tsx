import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { CustomDateRange } from './customDateRange';

describe('CustomDateRange', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderCustomDateRange = (props: Partial<React.ComponentProps<typeof CustomDateRange>> = {}) => {
    const onUpdate = jest.fn();
    render(
      <IntlProvider locale="en">
        <CustomDateRange inputValue={3} onUpdate={onUpdate} {...props} />
      </IntlProvider>
    );
    return { onUpdate };
  };

  test('renders number input with initial value', () => {
    renderCustomDateRange();
    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toHaveValue(3);
  });

  test('calls onUpdate after delay when plus button is clicked', () => {
    const { onUpdate } = renderCustomDateRange();
    fireEvent.click(screen.getByRole('button', { name: /data retention period plus button/i }));
    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toHaveValue(4);
    expect(onUpdate).not.toHaveBeenCalled();
    jest.advanceTimersByTime(625);
    expect(onUpdate).toHaveBeenCalledWith(4);
  });

  test('calls onUpdate after delay when minus button is clicked', () => {
    const { onUpdate } = renderCustomDateRange({ inputValue: 5 });
    fireEvent.click(screen.getByRole('button', { name: /data retention period minus button/i }));
    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toHaveValue(4);
    expect(onUpdate).not.toHaveBeenCalled();
    jest.advanceTimersByTime(625);
    expect(onUpdate).toHaveBeenCalledWith(4);
  });

  test('debounces onUpdate when plus button is clicked repeatedly', () => {
    const { onUpdate } = renderCustomDateRange();
    const plusButton = screen.getByRole('button', { name: /data retention period plus button/i });

    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toHaveValue(6);
    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(625);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(6);
  });

  test('clamps value to minimum on blur', () => {
    const { onUpdate } = renderCustomDateRange();
    const input = screen.getByRole('spinbutton', { name: /data retention period number input/i });
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(3);
    expect(onUpdate).toHaveBeenCalledWith(3);
  });

  test('clamps value to maximum on blur', () => {
    const { onUpdate } = renderCustomDateRange();
    const input = screen.getByRole('spinbutton', { name: /data retention period number input/i });
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(120);
    expect(onUpdate).toHaveBeenCalledWith(120);
  });

  test('disables input when isDisabled is true', () => {
    renderCustomDateRange({ isDisabled: true });
    expect(screen.getByRole('spinbutton', { name: /data retention period number input/i })).toBeDisabled();
  });
});
