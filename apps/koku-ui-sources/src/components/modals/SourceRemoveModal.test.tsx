import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import type { Source } from '../../apis/models/sources';
import { SourcesService } from '../../apis/sources-service';

import { SourceRemoveModal } from './SourceRemoveModal';

jest.mock('apis/sources-service', () => ({
  SourcesService: {
    deleteSource: jest.fn(),
  },
}));

const mockedDeleteSource = SourcesService.deleteSource as jest.MockedFunction<typeof SourcesService.deleteSource>;

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

const renderModal = (props: Partial<React.ComponentProps<typeof SourceRemoveModal>> = {}) => {
  const defaultProps = {
    isOpen: true,
    source: mockSource,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };
  const merged = { ...defaultProps, ...props };
  render(
    <IntlProvider locale="en" defaultLocale="en">
      <SourceRemoveModal {...merged} />
    </IntlProvider>
  );
  return merged;
};

const getRemoveButton = () => screen.getAllByText('Remove')[1].closest('button')!;

describe('SourceRemoveModal', () => {
  it('renders the source name in the confirmation text', () => {
    renderModal();

    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    expect(screen.getByText('My OCP Source')).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
  });

  it('calls deleteSource + onSuccess + onClose on successful remove', async () => {
    const user = userEvent.setup();
    mockedDeleteSource.mockResolvedValue(undefined);
    const props = renderModal();

    await user.click(getRemoveButton());

    await waitFor(() => {
      expect(mockedDeleteSource).toHaveBeenCalledWith('uuid-1');
    });
    expect(props.onSuccess).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalled();
  });

  it('shows error alert when deleteSource rejects with an Error', async () => {
    const user = userEvent.setup();
    mockedDeleteSource.mockRejectedValue(new Error('Network error'));
    const props = renderModal();

    await act(async () => {
      await user.click(getRemoveButton());
      await Promise.resolve();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(props.onSuccess).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('shows generic error when deleteSource rejects with a non-Error', async () => {
    const user = userEvent.setup();
    mockedDeleteSource.mockRejectedValue('unexpected');
    renderModal();

    await act(async () => {
      await user.click(getRemoveButton());
      await Promise.resolve();
    });

    expect(screen.getByText('Failed to remove source')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByText('Cancel').closest('button')!);

    expect(props.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
    expect(screen.queryByText('My OCP Source')).not.toBeInTheDocument();
  });
});
