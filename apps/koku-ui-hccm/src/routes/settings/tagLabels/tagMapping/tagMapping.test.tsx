import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';

import TagMapping from './tagMapping';

const mockSettingsState = {
  settings: {
    data: [{ uuid: 'map-1', parent: 'env', child: 'stage' }],
    meta: { count: 1, limit: 10, offset: 0 },
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

jest.mock('./tagMappingTable', () => ({
  TagMappingTable: ({ isLoading, onClose, onSort }: any) => (
    <div>
      {isLoading && <div>table-loading</div>}
      <button type="button" onClick={() => onSort('parent', false)}>
        sort
      </button>
      <button type="button" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));

jest.mock('./tagMappingToolbar', () => ({
  TagMappingToolbar: ({ onClose, onFilterAdded, onFilterRemoved, pagination }: any) => (
    <div>
      {pagination}
      <button type="button" onClick={() => onFilterAdded({ type: 'parent', value: 'env' })}>
        add-filter
      </button>
      <button type="button" onClick={() => onFilterRemoved({ type: 'parent', value: 'env' })}>
        remove-filter
      </button>
      <button type="button" onClick={onClose}>
        toolbar-close
      </button>
    </div>
  ),
}));

jest.mock('./tagMappingEmptyState', () => ({
  TagMappingEmptyState: ({ onWizardClose }: any) => (
    <button type="button" onClick={onWizardClose}>
      empty-close
    </button>
  ),
}));

const renderPage = () =>
  render(
    <Provider store={createStore(() => ({}))}>
      <TagMapping canWrite />
    </Provider>
  );

describe('TagMapping', () => {
  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    mockSettingsState.settings = {
      data: [{ uuid: 'map-1', parent: 'env', child: 'stage' }],
      meta: { count: 1, limit: 10, offset: 0 },
    };
  });

  test('renders mappings and sorts parent with child order', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();
    expect(screen.getByRole('button', { name: 'sort' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'sort' }));
    await user.click(screen.getByRole('button', { name: 'add-filter' }));
    await user.click(screen.getByRole('button', { name: 'remove-filter' }));
    await user.click(screen.getByRole('button', { name: 'close' }));
  });

  test('shows unavailable content on error', () => {
    mockSettingsState.error = { message: 'boom' };
    renderPage();
    expect(screen.getByRole('heading', { name: /temporarily unavailable/i })).toBeInTheDocument();
  });

  test('shows a loading state', () => {
    mockSettingsState.status = FetchStatus.inProgress;
    renderPage();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows the empty state when there are no mappings', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockSettingsState.settings = { data: [], meta: { count: 0, limit: 10, offset: 0 } };
    renderPage();
    await user.click(screen.getByRole('button', { name: 'empty-close' }));
  });
});
