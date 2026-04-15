import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { SourcesTable } from './SourcesTable';
import type { Source } from '../../apis/models/sources';

beforeEach(() => {
  jest.useRealTimers();
});

const mockSources: Source[] = [
  {
    id: 1,
    uuid: 'uuid-1',
    name: 'My OCP Source',
    source_type: 'OCP',
    authentication: {},
    billing_source: null,
    provider_linked: false,
    active: true,
    paused: false,
    current_month_data: false,
    previous_month_data: false,
    has_data: false,
    created_timestamp: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    uuid: 'uuid-2',
    name: 'Second OCP Source',
    source_type: 'OCP',
    authentication: {},
    billing_source: null,
    provider_linked: false,
    active: false,
    paused: true,
    current_month_data: false,
    previous_month_data: false,
    has_data: false,
    created_timestamp: '2026-01-10T08:00:00Z',
  },
];

const renderWithIntl = (sources: Source[], props: Partial<Parameters<typeof SourcesTable>[0]> = {}) => {
  const defaultProps = {
    sources,
    onSelectSource: jest.fn(),
    onRemove: jest.fn(),
    onTogglePause: jest.fn(),
    sortBy: 'name',
    sortDirection: 'asc' as const,
    onSort: jest.fn(),
  };
  return render(
    <IntlProvider locale="en" defaultLocale="en">
      <SourcesTable {...defaultProps} {...props} />
    </IntlProvider>
  );
};

describe('SourcesTable', () => {
  it('renders table headers (Name, Type, Date added, Status)', () => {
    renderWithIntl([]);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Date added')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders source rows with correct data', () => {
    renderWithIntl(mockSources);

    expect(screen.getByText('My OCP Source')).toBeInTheDocument();
    expect(screen.getAllByText('OpenShift Container Platform').length).toBe(2);
    const availableStatus = screen.getByText('Available');
    expect(availableStatus).toBeInTheDocument();
    expect(availableStatus.closest('.pf-v6-c-label')).toBeInTheDocument();

    expect(screen.getByText('Second OCP Source')).toBeInTheDocument();
    const pausedStatus = screen.getByText('Paused');
    expect(pausedStatus).toBeInTheDocument();
    expect(pausedStatus.closest('.pf-v6-c-label')).toBeInTheDocument();
  });

  it('renders relative dates in Date added column', () => {
    renderWithIntl(mockSources);
    // formatRelativeDate produces strings like "2 months ago" for Jan 2026 dates (vs Mar 2026)
    expect(screen.getAllByText(/months? ago|\d+ days? ago|today|yesterday/).length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelectSource when row is clicked', async () => {
    const user = userEvent.setup();
    const onSelectSource = jest.fn();
    renderWithIntl(mockSources, { onSelectSource });

    await user.click(screen.getByText('My OCP Source'));

    expect(onSelectSource).toHaveBeenCalledWith(mockSources[0]);
  });

  it('renders actions kebab menu', async () => {
    const user = userEvent.setup();
    const onSelectSource = jest.fn();
    const onTogglePause = jest.fn();
    const onRemove = jest.fn();
    renderWithIntl(mockSources, {
      onSelectSource,
      onTogglePause,
      onRemove,
    });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    expect(kebabButtons.length).toBeGreaterThan(0);

    await user.click(kebabButtons[0]);

    expect(screen.getByText('View details')).toBeInTheDocument();
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('calls onTogglePause when Pause action is clicked', async () => {
    const user = userEvent.setup();
    const onTogglePause = jest.fn();
    renderWithIntl(mockSources, { onTogglePause, canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Pause'));

    expect(onTogglePause).toHaveBeenCalledWith(mockSources[0]);
  });

  it('calls onRemove when Remove action is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    renderWithIntl(mockSources, { onRemove, canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Remove'));

    expect(onRemove).toHaveBeenCalledWith(mockSources[0]);
  });

  it('shows Resume instead of Pause for a paused source', async () => {
    const user = userEvent.setup();
    renderWithIntl([mockSources[1]]);

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.queryByText('Pause')).not.toBeInTheDocument();
  });

  it('calls onTogglePause when Resume action is clicked for a paused source', async () => {
    const user = userEvent.setup();
    const onTogglePause = jest.fn();
    renderWithIntl([mockSources[1]], { onTogglePause, canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Resume'));

    expect(onTogglePause).toHaveBeenCalledWith(mockSources[1]);
  });

  it('calls onSort when a sortable column header is clicked', async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();
    renderWithIntl(mockSources, { onSort });

    const nameHeader = screen.getByText('Name');
    await user.click(nameHeader);

    expect(onSort).toHaveBeenCalled();
  });

  it('calls onSort for the Type column', async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();
    renderWithIntl(mockSources, { onSort });

    const typeHeader = screen.getByText('Type');
    await user.click(typeHeader);

    expect(onSort).toHaveBeenCalledWith(expect.any(String), expect.any(String));
  });

  it('calls onSort for the Date added column', async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();
    renderWithIntl(mockSources, { onSort });

    const dateHeader = screen.getByText('Date added');
    await user.click(dateHeader);

    expect(onSort).toHaveBeenCalledWith(expect.any(String), expect.any(String));
  });

  it('calls onSelectSource when View details action is clicked', async () => {
    const user = userEvent.setup();
    const onSelectSource = jest.fn();
    renderWithIntl(mockSources, { onSelectSource, canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('View details'));

    expect(onSelectSource).toHaveBeenCalledWith(mockSources[0]);
  });
});
