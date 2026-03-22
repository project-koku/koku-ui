import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { SourcesToolbar } from './SourcesToolbar';

beforeEach(() => {
  jest.useRealTimers();
});

const defaultProps = {
  count: 25,
  page: 1,
  perPage: 10,
  filterValue: '',
  filterColumn: 'name' as const,
  onFilterChange: jest.fn(),
  onFilterColumnChange: jest.fn(),
  onPageChange: jest.fn(),
  onAddSource: jest.fn(),
  canWrite: true,
};

const renderToolbar = (props: Partial<typeof defaultProps> = {}) =>
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

  it('opens filter column selector and changes column (OCP-only: Type hidden; Status available)', async () => {
    const user = userEvent.setup();
    const onFilterColumnChange = jest.fn();
    renderToolbar({ onFilterColumnChange });

    await user.click(screen.getByText('Name'));

    const statusOption = screen.getByText('Status');
    await user.click(statusOption);

    expect(onFilterColumnChange).toHaveBeenCalledWith('availability_status');
  });

  it('submits the search filter on Enter', async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();
    renderToolbar({ onFilterChange });

    const searchInput = screen.getByPlaceholderText('Filter by name');
    await user.type(searchInput, 'test{Enter}');

    expect(onFilterChange).toHaveBeenCalledWith('test');
  });

  it('clears the search filter', async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();
    renderToolbar({ onFilterChange, filterValue: 'existing' });

    const clearButton = screen.getByLabelText('Reset');
    await user.click(clearButton);

    expect(onFilterChange).toHaveBeenCalledWith('');
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
