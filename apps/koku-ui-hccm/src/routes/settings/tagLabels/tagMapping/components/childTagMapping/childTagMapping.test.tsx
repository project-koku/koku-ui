import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';
import { settingsActions } from 'store/settings';

import ChildTagMapping from './childTagMapping';

const mockSettingsState = {
  error: undefined as any,
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/settings', () => ({
  settingsActions: {
    updateTagSettings: jest.fn(() => ({ type: 'TEST/UPDATE' })),
  },
  settingsSelectors: {
    selectSettingsError: () => mockSettingsState.error,
    selectSettingsFetchStatus: () => mockSettingsState.status,
  },
}));

jest.mock('../childTags', () => ({
  ChildTags: ({ onBulkSelect, onSelect }: any) => (
    <div>
      <button type="button" onClick={() => onSelect([{ uuid: 'c-1' }], true)}>
        select-child
      </button>
      <button type="button" onClick={() => onSelect([{ uuid: 'c-1' }], false)}>
        deselect-child
      </button>
      <button type="button" onClick={() => onBulkSelect([{ uuid: 'c-1' }])}>
        bulk-child
      </button>
    </div>
  ),
}));

describe('ChildTagMapping', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    onClose.mockClear();
    jest.clearAllMocks();
  });

  test('selects child tags and creates a mapping', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <Provider store={createStore(() => ({}))}>
        <ChildTagMapping isOpen item={{ uuid: 'p-1', key: 'env' } as any} onClose={onClose} />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: 'select-child' }));
    await user.click(screen.getByRole('button', { name: 'deselect-child' }));
    await user.click(screen.getByRole('button', { name: 'select-child' }));
    await user.click(screen.getByRole('button', { name: 'bulk-child' }));
    await user.click(screen.getByRole('button', { name: /add child tags/i }));
    expect(settingsActions.updateTagSettings).toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('shows an error alert and cancel closes the modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockSettingsState.error = { message: 'already mapped' };
    render(
      <Provider store={createStore(() => ({}))}>
        <ChildTagMapping isOpen item={{ uuid: 'p-1', key: 'env' } as any} onClose={onClose} />
      </Provider>
    );

    expect(screen.getByText('already mapped')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
