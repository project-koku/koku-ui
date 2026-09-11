import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';
import { settingsActions } from 'store/settings';

import Tags from './tags';

const mockSettingsState = {
  settings: {
    data: [
      { uuid: 'tag-1', key: 'env', enabled: false },
      { uuid: 'tag-2', key: 'app', enabled: true },
    ],
    meta: { count: 2, limit: 10, offset: 0, enabled_tags_count: 1, enabled_tags_limit: 10 },
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
    updateTagSettings: jest.fn(() => ({ type: 'TEST/UPDATE' })),
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

jest.mock('./tagsTable', () => ({
  TagsTable: ({ isLoading, onSelect, onSort }: any) => (
    <div>
      {isLoading && <div>table-loading</div>}
      <button type="button" onClick={() => onSelect([{ uuid: 'tag-1', enabled: false }], true)}>
        select-item
      </button>
      <button type="button" onClick={() => onSelect([{ uuid: 'tag-1', enabled: false }], false)}>
        deselect-item
      </button>
      <button type="button" onClick={() => onSort('key', false)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./tagsToolbar', () => ({
  TagsToolbar: ({ onBulkSelect, onDisableTags, onEnableTags, onFilterAdded, onFilterRemoved, pagination }: any) => (
    <div>
      {pagination}
      <button type="button" onClick={() => onBulkSelect('page')}>
        bulk-page
      </button>
      <button type="button" onClick={() => onBulkSelect('none')}>
        bulk-none
      </button>
      <button type="button" onClick={onEnableTags}>
        enable-tags
      </button>
      <button type="button" onClick={onDisableTags}>
        disable-tags
      </button>
      <button type="button" onClick={() => onFilterAdded({ type: 'key', value: 'env' })}>
        add-filter
      </button>
      <button type="button" onClick={() => onFilterRemoved({ type: 'key', value: 'env' })}>
        remove-filter
      </button>
    </div>
  ),
}));

const renderPage = (canWrite = true) =>
  render(
    <Provider store={createStore(() => ({}))}>
      <Tags canWrite={canWrite} />
    </Provider>
  );

describe('Tags', () => {
  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    mockSettingsState.settings = {
      data: [
        { uuid: 'tag-1', key: 'env', enabled: false },
        { uuid: 'tag-2', key: 'app', enabled: true },
      ],
      meta: { count: 2, limit: 10, offset: 0, enabled_tags_count: 1, enabled_tags_limit: 10 },
    };
    jest.clearAllMocks();
  });

  test('renders the description and table', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'select-item' })).toBeInTheDocument();
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

  test('selects, bulk selects, filters, sorts, and enables tags', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();

    await user.click(screen.getByRole('button', { name: 'select-item' }));
    await user.click(screen.getByRole('button', { name: 'bulk-page' }));
    await user.click(screen.getByRole('button', { name: 'enable-tags' }));
    await waitFor(() => expect(settingsActions.updateTagSettings).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'select-item' }));
    await user.click(screen.getByRole('button', { name: 'disable-tags' }));
    await waitFor(() => expect(settingsActions.updateTagSettings).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole('button', { name: 'add-filter' }));
    await user.click(screen.getByRole('button', { name: 'remove-filter' }));
    await user.click(screen.getByRole('button', { name: 'sort' }));
    await user.click(screen.getByRole('button', { name: 'bulk-none' }));
    await user.click(screen.getByRole('button', { name: 'deselect-item' }));
  });
});
