import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';

import ParentTags from './parentTags';

const mockSettingsState = {
  settings: {
    data: [
      { uuid: 'p-1', key: 'env' },
      { uuid: 'p-2', key: 'app' },
    ],
    meta: { count: 2, limit: 10, offset: 0 },
  } as any,
  error: undefined as any,
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/settings', () => ({
  settingsActions: {
    fetchSettings: jest.fn(() => ({ type: 'TEST/FETCH' })),
  },
  settingsSelectors: {
    selectSettings: () => mockSettingsState.settings,
    selectSettingsError: () => mockSettingsState.error,
    selectSettingsFetchStatus: () => mockSettingsState.status,
    selectSettingsNotification: () => undefined,
  },
}));

jest.mock('./parentTagsTable', () => ({
  ParentTagsTable: ({ isLoading, onSelect, onSort }: any) => (
    <div>
      {isLoading && <div>table-loading</div>}
      <button type="button" onClick={() => onSelect([{ uuid: 'p-1' }], true)}>
        select-item
      </button>
      <button type="button" onClick={() => onSort('key', false)}>
        sort
      </button>
    </div>
  ),
}));

jest.mock('./parentTagsToolbar', () => ({
  ParentTagsToolbar: ({ onBulkSelect, onFilterAdded, onFilterRemoved, pagination }: any) => (
    <div>
      {pagination}
      <button type="button" onClick={() => onBulkSelect('page')}>
        bulk-page
      </button>
      <button type="button" onClick={() => onBulkSelect('none')}>
        bulk-none
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

describe('ParentTags', () => {
  const onBulkSelect = jest.fn();
  const onSelect = jest.fn();

  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    onBulkSelect.mockClear();
    onSelect.mockClear();
  });

  const renderPage = () =>
    render(
      <Provider store={createStore(() => ({}))}>
        <ParentTags onBulkSelect={onBulkSelect} onSelect={onSelect} selectedItems={[{ uuid: 'p-1' }]} />
      </Provider>
    );

  test('renders and bulk selects the page', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();
    await user.click(screen.getByRole('button', { name: 'bulk-page' }));
    expect(onBulkSelect).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ uuid: 'p-2' })]));
    await user.click(screen.getByRole('button', { name: 'bulk-none' }));
    expect(onBulkSelect).toHaveBeenCalledWith([]);
    await user.click(screen.getByRole('button', { name: 'select-item' }));
    expect(onSelect).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'add-filter' }));
    await user.click(screen.getByRole('button', { name: 'remove-filter' }));
    await user.click(screen.getByRole('button', { name: 'sort' }));
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
});
