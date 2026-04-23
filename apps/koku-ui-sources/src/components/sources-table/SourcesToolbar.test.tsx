import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import type { AvailabilityFilterValue } from 'redux/sources-slice';
import { SourcesToolbar } from './SourcesToolbar';

type ToolbarHarnessProps = {
  count: number;
  page: number;
  perPage: number;
  nameFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  onNameFilterChange: jest.Mock;
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
  availabilityFilter: '',
  onNameFilterChange: jest.fn(),
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

const openFilterFieldMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Filter integrations by field' }));
};

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

  it('exposes filter field options Name and Status only', async () => {
    const user = userEvent.setup();
    renderToolbar();

    await openFilterFieldMenu(user);
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options.map(o => o.textContent)).toEqual(['Name', 'Status']);
  });

  it('shows name SearchInput and hides status controls when Name field is selected', async () => {
    const user = userEvent.setup();
    renderToolbar();

    expect(screen.getByPlaceholderText('Filter by name')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Filter by status' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Apply availability filter' })).not.toBeInTheDocument();

    await openFilterFieldMenu(user);
    await user.click(screen.getByRole('option', { name: 'Status' }));
    expect(screen.queryByPlaceholderText('Filter by name')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter by status' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply availability filter' })).toBeInTheDocument();
  });

  it('renders availability radios inside the status menu when opened', async () => {
    const user = userEvent.setup();
    renderToolbar();

    await openFilterFieldMenu(user);
    await user.click(screen.getByRole('option', { name: 'Status' }));
    await user.click(screen.getByRole('button', { name: 'Filter by status' }));

    const group = screen.getByRole('radiogroup', { name: 'Filter integrations by availability' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Available' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Unavailable' })).toBeInTheDocument();
  });

  it('keeps status menu toggle as Filter by status while staging; Apply commits draft', async () => {
    const user = userEvent.setup();
    const onAvailabilityFilterChange = jest.fn();
    renderToolbar({ onAvailabilityFilterChange });

    await openFilterFieldMenu(user);
    await user.click(screen.getByRole('option', { name: 'Status' }));
    expect(screen.getByRole('button', { name: 'Filter by status' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Filter by status' }));
    await user.click(screen.getByRole('radio', { name: 'Available' }));
    expect(screen.getByRole('button', { name: 'Filter by status' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply availability filter' }));
    expect(onAvailabilityFilterChange).toHaveBeenCalledWith('available');
    expect(screen.getByRole('button', { name: 'Filter by status' })).toBeInTheDocument();
  });

  it('does not apply availability until submit; applies on Apply button', async () => {
    const user = userEvent.setup();
    const onAvailabilityFilterChange = jest.fn();
    renderToolbar({ onAvailabilityFilterChange });

    await openFilterFieldMenu(user);
    await user.click(screen.getByRole('option', { name: 'Status' }));
    await user.click(screen.getByRole('button', { name: 'Filter by status' }));
    await user.click(screen.getByRole('radio', { name: 'Unavailable' }));
    expect(onAvailabilityFilterChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Apply availability filter' }));
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

  it('submits name without clearing availability (AND regression)', async () => {
    const user = userEvent.setup();
    const onNameFilterChange = jest.fn();
    const onAvailabilityFilterChange = jest.fn();
    renderToolbar({
      onNameFilterChange,
      onAvailabilityFilterChange,
      availabilityFilter: 'unavailable',
    });

    const searchInput = screen.getByPlaceholderText('Filter by name');
    await user.type(searchInput, 'prod{Enter}');

    expect(onNameFilterChange).toHaveBeenCalledWith('prod');
    expect(onAvailabilityFilterChange).not.toHaveBeenCalled();
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

  it('places filter field control before Add integration in document order', () => {
    renderToolbar();
    const buttons = screen.getAllByRole('button');
    const fieldIdx = buttons.findIndex(b => b.getAttribute('aria-label') === 'Filter integrations by field');
    const addIdx = buttons.findIndex(b => b.textContent === 'Add integration');
    expect(fieldIdx).toBeGreaterThanOrEqual(0);
    expect(addIdx).toBeGreaterThanOrEqual(0);
    expect(fieldIdx).toBeLessThan(addIdx);
  });
});
