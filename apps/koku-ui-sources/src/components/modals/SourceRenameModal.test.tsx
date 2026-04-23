import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import type { Source } from '../../apis/models/sources';
import { SourcesService } from '../../apis/sources-service';

import { SourceRenameModal } from './SourceRenameModal';

jest.mock('apis/sources-service', () => ({
  SourcesService: {
    updateSource: jest.fn(),
  },
}));

const mockedUpdateSource = SourcesService.updateSource as jest.MockedFunction<typeof SourcesService.updateSource>;

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const mockSource: Source = {
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
};

const renderModal = (props: Partial<React.ComponentProps<typeof SourceRenameModal>> = {}) => {
  const defaultProps = {
    isOpen: true,
    source: mockSource,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };
  const merged = { ...defaultProps, ...props };
  render(
    <IntlProvider locale="en" defaultLocale="en">
      <SourceRenameModal {...merged} />
    </IntlProvider>
  );
  return merged;
};

describe('SourceRenameModal', () => {
  it('renders modal with title, pre-filled name input, and action buttons', () => {
    renderModal();

    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My OCP Source')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('disables Save when name is cleared', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.clear(screen.getByDisplayValue('My OCP Source'));

    expect(screen.getByText('Save').closest('button')).toBeDisabled();
  });

  it('disables Save when name is whitespace only', async () => {
    const user = userEvent.setup();
    renderModal();

    const input = screen.getByDisplayValue('My OCP Source');
    await user.clear(input);
    await user.type(input, '   ');

    expect(screen.getByText('Save').closest('button')).toBeDisabled();
  });

  it('calls updateSource with trimmed name and fires onSuccess', async () => {
    const user = userEvent.setup();
    mockedUpdateSource.mockResolvedValue({ ...mockSource, name: 'New Name' });
    const props = renderModal();

    const input = screen.getByDisplayValue('My OCP Source');
    await user.clear(input);
    await user.type(input, '  New Name  ');
    await user.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedUpdateSource).toHaveBeenCalledWith('uuid-1', { name: 'New Name' });
    });
    expect(props.onSuccess).toHaveBeenCalled();
  });

  it('shows error alert when updateSource rejects with an Error', async () => {
    const user = userEvent.setup();
    mockedUpdateSource.mockRejectedValue(new Error('Network error'));
    const props = renderModal();

    await act(async () => {
      await user.click(screen.getByText('Save'));
      await Promise.resolve();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(props.onSuccess).not.toHaveBeenCalled();
  });

  it('shows generic error for non-Error exceptions', async () => {
    const user = userEvent.setup();
    mockedUpdateSource.mockRejectedValue('unexpected');
    renderModal();

    await act(async () => {
      await user.click(screen.getByText('Save'));
      await Promise.resolve();
    });

    expect(screen.getByText('Failed to rename source')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByText('Cancel'));

    expect(props.onClose).toHaveBeenCalled();
  });

  it('does not call updateSource when Save is clicked with empty name', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.clear(screen.getByDisplayValue('My OCP Source'));

    // Save button should be disabled, but verify updateSource is never called
    expect(screen.getByText('Save').closest('button')).toBeDisabled();
    expect(mockedUpdateSource).not.toHaveBeenCalled();
  });
});
