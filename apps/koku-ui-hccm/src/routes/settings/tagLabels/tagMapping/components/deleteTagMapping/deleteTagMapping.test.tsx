import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { SettingsType } from 'api/settings';
import { FetchStatus } from 'store/common';
import { settingsActions } from 'store/settings';

import DeleteTagMapping from './deleteTagMapping';

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

describe('DeleteTagMapping', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    mockSettingsState.error = undefined;
    mockSettingsState.status = FetchStatus.complete;
    onClose.mockClear();
    jest.clearAllMocks();
  });

  test('deletes a parent mapping and closes on success', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <Provider store={createStore(() => ({}))}>
        <DeleteTagMapping
          isOpen
          item={{ uuid: 'p-1', key: 'env' } as any}
          onClose={onClose}
          settingsType={SettingsType.tagsMappingsParentRemove}
        />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(settingsActions.updateTagSettings).toHaveBeenCalledWith(SettingsType.tagsMappingsParentRemove, {
      ids: ['p-1'],
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('cancels a child mapping removal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <Provider store={createStore(() => ({}))}>
        <DeleteTagMapping
          isOpen
          isChild
          item={{ uuid: 'c-1', key: 'app' } as any}
          onClose={onClose}
          settingsType={SettingsType.tagsMappingsChildRemove}
        />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
