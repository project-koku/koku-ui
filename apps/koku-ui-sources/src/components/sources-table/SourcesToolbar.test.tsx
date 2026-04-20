import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import type { AvailabilityFilterValue } from 'redux/sources-slice';
import { SourcesToolbar } from './SourcesToolbar';

type ToolbarHarnessProps = {
  count: number;
  page: number;
  perPage: number;
  nameFilter: string;
  typeFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  onNameFilterChange: jest.Mock;
  onTypeFilterChange: jest.Mock;
  onAvailabilityFilterChange: jest.Mock;
  onPageChange: jest.Mock;
  onAddSource: jest.Mock;
  canWrite: boolean;
};

beforeEach(() => {
  jest.useRealTimers();
});

const defaultProps: ToolbarHarnessProps = {
  count: 25,
  page: 1,
  perPage: 10,
  nameFilter: '',
  typeFilter: '',
  availabilityFilter: '',
  onNameFilterChange: jest.fn(),
  onTypeFilterChange: jest.fn(),
  onAvailabilityFilterChange: jest.fn(),
  onPageChange: jest.fn(),
  onAddSource: jest.fn(),
  canWrite: true,
};

const renderToolbar = (props: Partial<ToolbarHarnessProps> = {}) =>
  render(
    <IntlProvider locale="en" defaultLocale="en">
      <SourcesToolbar {...defaultProps} {...props} />
    </IntlProvider>
  );

describe('SourcesToolbar', () => {
  it('renders the Add integration button', () => {
    renderToolbar();
    expect(screen.getByText('Add integration').closest('button')).toBeEnabled();
  });

  it('disables the Add integration button when canWrite is false', () => {
    renderToolbar({ canWrite: false });
    expect(screen.getByText('Add integration').closest('button')).toBeDisabled();
  });

  it('calls onAddSource when Add integration is clicked', async () => {
    const user = userEvent.setup();
    const onAddSource = jest.fn();
    renderToolbar({ onAddSource });

    await user.click(screen.getByText('Add integration'));
    expect(onAddSource).toHaveBeenCalled();
  });

  it('renders pagination', () => {
    renderToolbar({ count: 42 });
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('renders availability radios inside the status menu when opened', async () => {
    const user = userEvent.setup();
    renderToolbar();

    await user.click(screen.getByRole('button', { name: 'Filter by status' }));

    const group = screen.getByRole('radiogroup', { name: 'Filter integrations by availability' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Available' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Unavailable' })).toBeInTheDocument();
  });

  it('calls onAvailabilityFilterChange when an availability radio is selected in the menu', async () => {
    const user = userEvent.setup();
    const onAvailabilityFilterChange = jest.fn();
    renderToolbar({ onAvailabilityFilterChange });

    await user.click(screen.getByRole('button', { name: 'Filter by status' }));
    await user.click(screen.getByRole('radio', { name: 'Unavailable' }));
    expect(onAvailabilityFilterChange).toHaveBeenCalledWith('unavailable');
  });

  it('submits the name filter on Enter', async () => {
    const user = userEvent.setup();
    const onNameFilterChange = jest.fn();
    renderToolbar({ onNameFilterChange });

    const searchInput = screen.getByPlaceholderText('Filter by name');
    await user.type(searchInput, 'test{Enter}');

    expect(onNameFilterChange).toHaveBeenCalledWith('test');
  });

  it('clears the name filter', async () => {
    const user = userEvent.setup();
    const onNameFilterChange = jest.fn();
    renderToolbar({ onNameFilterChange, nameFilter: 'existing' });

    const clearButton = screen.getByLabelText('Reset');
    await user.click(clearButton);

    expect(onNameFilterChange).toHaveBeenCalledWith('');
  });

  it('calls onPageChange when page changes', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    renderToolbar({ onPageChange, count: 25, page: 1, perPage: 10 });

    const nextBtn = screen.getByLabelText('Go to next page');
    await user.click(nextBtn);

    expect(onPageChange).toHaveBeenCalledWith(2, 10);
  });
});
