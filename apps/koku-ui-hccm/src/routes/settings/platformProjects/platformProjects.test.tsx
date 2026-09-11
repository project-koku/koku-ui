import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';
import { settingsActions } from 'store/settings';

import PlatformProjects from './platformProjects';

const mockSettingsState = {
  settings: {
    data: [
      { project: 'payments', group: 'default', default: false },
      { project: 'platform', group: 'platform', default: true },
    ],
    meta: { count: 2, limit: 10, offset: 0 },
  } as any,
  error: undefined as any,
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => jest.fn(),
}));

jest.mock('store/settings', () => ({
  settingsActions: {
    fetchSettings: jest.fn(() => ({ type: 'TEST/FETCH' })),
    updatePlatformSettings: jest.fn(() => ({ type: 'TEST/UPDATE' })),
    resetNotifications: jest.fn(() => ({ type: 'TEST/RESET_N' })),
    resetStatus: jest.fn(() => ({ type: 'TEST/RESET_S' })),
  },
  settingsSelectors: {
    selectSettings: () => mockSettingsState.settings,
    selectSettingsError: () => mockSettingsState.error,
    selectSettingsFetchStatus: () => mockSettingsState.status,
    selectSettingsNotification: () => undefined,
  },
}));

jest.mock('./platformProjectsTable', () => ({
  PlatformProjectsTable: ({ isLoading, onSelect, onSort }: any) => (
    <div>
      {isLoading && <div>table-loading</div>}
      <button type="button" onClick={() => onSelect([{ project: 'payments', default: false }], true)}>
        select-item
      </button>
      <button type="button" onClick={() => onSelect([{ project: 'payments', default: false }], false)}>
        deselect-item
      </button>
      <button type="button" onClick={() => onSort('group', true)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./platformProjectsToolbar', () => ({
  GroupType: { platform: 'Platform' },
  PlatformProjectsToolbar: ({ onAdd, onBulkSelect, onFilterAdded, onFilterRemoved, onRemove, pagination }: any) => (
    <div>
      {pagination}
      <button type="button" onClick={() => onBulkSelect('page')}>
        bulk-page
      </button>
      <button type="button" onClick={() => onBulkSelect('none')}>
        bulk-none
      </button>
      <button type="button" onClick={onAdd}>
        add-projects
      </button>
      <button type="button" onClick={onRemove}>
        remove-projects
      </button>
      <button type="button" onClick={() => onFilterAdded({ type: 'project', value: 'payments' })}>
        add-filter
      </button>
      <button type="button" onClick={() => onFilterRemoved({ type: 'project', value: 'payments' })}>
        remove-filter
      </button>
    </div>
  ),
}));

const renderPage = () =>
  render(
    <Provider store={createStore(() => ({}))}>
      <PlatformProjects canWrite />
    </Provider>
  );

describe('PlatformProjects', () => {
  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    jest.clearAllMocks();
  });

  test('renders the description and table', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'select-item' })).toBeInTheDocument();
  });

  test('shows not available content on error', () => {
    mockSettingsState.error = { message: 'boom' };
    renderPage();
    expect(screen.getByRole('heading', { name: /temporarily unavailable/i })).toBeInTheDocument();
  });

  test('shows a loading state', () => {
    mockSettingsState.status = FetchStatus.inProgress;
    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('selects, bulk selects, and adds or removes projects', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();

    await user.click(screen.getByRole('button', { name: 'select-item' }));
    await user.click(screen.getByRole('button', { name: 'bulk-page' }));
    await user.click(screen.getByRole('button', { name: 'add-projects' }));
    await waitFor(() => expect(settingsActions.updatePlatformSettings).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'select-item' }));
    await user.click(screen.getByRole('button', { name: 'remove-projects' }));
    await waitFor(() => expect(settingsActions.updatePlatformSettings).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole('button', { name: 'add-filter' }));
    await user.click(screen.getByRole('button', { name: 'remove-filter' }));
    await user.click(screen.getByRole('button', { name: 'sort' }));
    await user.click(screen.getByRole('button', { name: 'bulk-none' }));
    await user.click(screen.getByRole('button', { name: 'deselect-item' }));
  });
});
