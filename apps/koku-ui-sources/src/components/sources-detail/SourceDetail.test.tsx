import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import localeMessages from '../../../locales/data.json';
import { IntlProvider } from 'react-intl';
import type { Source } from '../../apis/models/sources';
import { SourcesService } from '../../apis/sources-service';

import { SourceDetail } from './SourceDetail';

jest.mock('apis/sources-service', () => {
  const actual = jest.requireActual<typeof import('../../apis/sources-service')>('../../apis/sources-service');
  return {
    ...actual,
    SourcesService: {
      ...actual.SourcesService,
      getSource: jest.fn(),
      pauseSource: jest.fn(),
      resumeSource: jest.fn(),
    },
  };
});

const mockAddNotification = jest.fn();
jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => mockAddNotification,
}));

jest.mock('components/modals/SourceRemoveModal', () => ({
  SourceRemoveModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="remove-modal">Remove Modal</div> : null,
}));

jest.mock('components/modals/SourceRenameModal', () => ({
  SourceRenameModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="rename-modal">Rename Modal</div> : null,
}));

jest.mock('components/sources-detail/CredentialForm', () => ({
  CredentialForm: () => <div data-testid="credential-form" />,
}));

const mockedGetSource = SourcesService.getSource as jest.MockedFunction<typeof SourcesService.getSource>;
const mockedPauseSource = SourcesService.pauseSource as jest.MockedFunction<typeof SourcesService.pauseSource>;
const mockedResumeSource = SourcesService.resumeSource as jest.MockedFunction<typeof SourcesService.resumeSource>;

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const activeSource: Source = {
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

const pausedSource: Source = {
  ...activeSource,
  id: 2,
  uuid: 'uuid-2',
  name: 'Paused OCP Source',
  source_type: 'OCP',
  active: false,
  paused: true,
};

const renderDetail = async (uuid = 'uuid-1', onBack = jest.fn(), canWrite = false) => {
  await act(async () => {
    render(
      <IntlProvider locale="en" defaultLocale="en" messages={localeMessages.en}>
        <SourceDetail uuid={uuid} onBack={onBack} canWrite={canWrite} />
      </IntlProvider>
    );
  });
  return { onBack };
};

describe('SourceDetail', () => {
  it('shows spinner while loading', () => {
    mockedGetSource.mockReturnValue(new Promise(() => {}));
    render(
      <IntlProvider locale="en" defaultLocale="en" messages={localeMessages.en}>
        <SourceDetail uuid="uuid-1" onBack={jest.fn()} />
      </IntlProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows "Integration not found" when fetch fails', async () => {
    mockedGetSource.mockRejectedValue(new Error('not found'));
    await renderDetail();

    expect(screen.getByText('Integration not found')).toBeInTheDocument();
  });

  it('renders source name, type, and "Available" status for an active source', async () => {
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail();

    expect(screen.getByRole('heading', { level: 1, name: 'My OCP Source' })).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
  });

  it('shows "Paused" label and warning alert for a paused source', async () => {
    mockedGetSource.mockResolvedValue(pausedSource);
    await renderDetail('uuid-2');

    expect(screen.getByRole('heading', { level: 1, name: 'Paused OCP Source' })).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Integration paused')).toBeInTheDocument();
    expect(screen.getByText('Resume connection')).toBeInTheDocument();
  });

  it('shows "Unavailable" for an active=false, non-paused source', async () => {
    const unavailableSource: Source = { ...activeSource, active: false, paused: false };
    mockedGetSource.mockResolvedValue(unavailableSource);
    await renderDetail();

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('calls pauseSource when Pause is selected from the kebab menu', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    mockedPauseSource.mockResolvedValue({ ...activeSource, paused: true });
    await renderDetail('uuid-1', jest.fn(), true);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Pause'));

    expect(mockedPauseSource).toHaveBeenCalledWith(activeSource);
  });

  it('calls resumeSource when Resume is selected from the kebab menu', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(pausedSource);
    mockedResumeSource.mockResolvedValue({ ...pausedSource, paused: false });
    await renderDetail('uuid-2', jest.fn(), true);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Resume'));

    expect(mockedResumeSource).toHaveBeenCalledWith(pausedSource);
  });

  it('calls resumeSource when the "Resume connection" alert link is clicked', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(pausedSource);
    mockedResumeSource.mockResolvedValue({ ...pausedSource, paused: false });
    await renderDetail('uuid-2', jest.fn(), true);

    await user.click(screen.getByText('Resume connection'));

    expect(mockedResumeSource).toHaveBeenCalledWith(pausedSource);
  });

  it('opens the rename modal when Rename is selected from the kebab', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail('uuid-1', jest.fn(), true);

    expect(screen.queryByTestId('rename-modal')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Rename'));

    expect(screen.getByTestId('rename-modal')).toBeInTheDocument();
  });

  it('opens the remove modal when Remove is selected from the kebab', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail('uuid-1', jest.fn(), true);

    expect(screen.queryByTestId('remove-modal')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Remove'));

    expect(screen.getByTestId('remove-modal')).toBeInTheDocument();
  });

  it('does not show the paused alert for an active source', async () => {
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail();

    expect(screen.queryByText('Integration paused')).not.toBeInTheDocument();
    expect(screen.queryByText('Resume connection')).not.toBeInTheDocument();
  });

  it('navigates back via breadcrumb link', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    const onBack = jest.fn();
    await renderDetail('uuid-1', onBack);

    await user.click(screen.getByText('Integrations'));

    expect(onBack).toHaveBeenCalled();
  });

  it('returns early from fetchSource when uuid is empty', async () => {
    await renderDetail('', jest.fn());
    expect(mockedGetSource).not.toHaveBeenCalled();
  });

  it('calls handleCheckAvailability when the refresh button is clicked', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail();

    const refreshBtn = screen.getByRole('button', { name: 'Check integration availability' });
    await user.click(refreshBtn);

    await waitFor(() => {
      expect(mockedGetSource).toHaveBeenCalledTimes(2);
    });
  });

  it('handles handleCheckAvailability error gracefully', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValueOnce(activeSource).mockRejectedValueOnce(new Error('fail'));
    await renderDetail();

    const refreshBtn = screen.getByRole('button', { name: 'Check integration availability' });
    await user.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'My OCP Source' })).toBeInTheDocument();
    });
  });

  it('shows an alert when pause fails', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    mockedPauseSource.mockReset();
    mockedPauseSource.mockImplementation(() => Promise.reject(new Error('fail')));
    await renderDetail('uuid-1', jest.fn(), true);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    // Same as SourcesPage pause-fail test: async kebab action + `act` (https://react.dev/reference/react/act).
    await act(async () => {
      await user.click(await screen.findByText('Pause'));
    });

    await waitFor(() => {
      expect(mockedPauseSource).toHaveBeenCalledWith(activeSource);
    });
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalled();
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'danger',
        description: 'fail',
        dismissable: true,
      })
    );
    expect(mockAddNotification.mock.calls[0][0].title).toBe('Could not pause integration');
  });

  it('shows an alert when resume fails', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(pausedSource);
    mockedResumeSource.mockReset();
    mockedResumeSource.mockImplementation(() => Promise.reject(new Error('resume fail')));
    await renderDetail('uuid-2', jest.fn(), true);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await act(async () => {
      await user.click(await screen.findByText('Resume'));
    });

    await waitFor(() => {
      expect(mockedResumeSource).toHaveBeenCalledWith(pausedSource);
    });
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalled();
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'danger',
        description: 'resume fail',
        dismissable: true,
      })
    );
    expect(mockAddNotification.mock.calls[0][0].title).toBe('Could not resume integration');
  });

  it('renders the SourceRemoveModal and SourceRenameModal close handlers', async () => {
    const user = userEvent.setup();
    mockedGetSource.mockResolvedValue(activeSource);
    await renderDetail('uuid-1', jest.fn(), true);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Remove'));
    expect(screen.getByTestId('remove-modal')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Rename'));
    expect(screen.getByTestId('rename-modal')).toBeInTheDocument();
  });
});
