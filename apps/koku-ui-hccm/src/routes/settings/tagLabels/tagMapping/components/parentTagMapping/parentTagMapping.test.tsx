import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';
import { settingsActions } from 'store/settings';

import ParentTagMapping from './parentTagMapping';

const mockSettingsState = {
  error: undefined as any,
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/settings', () => ({
  settingsActions: {
    updateTagSettings: jest.fn(() => ({ type: 'TEST/UPDATE' })),
    resetStatus: jest.fn(() => ({ type: 'TEST/RESET' })),
  },
  settingsSelectors: {
    selectSettingsError: () => mockSettingsState.error,
    selectSettingsFetchStatus: () => mockSettingsState.status,
  },
}));

jest.mock('store/settings/settingsCommon', () => ({
  getFetchId: () => 'tagsMappingsChildAdd--',
}));

jest.mock('routes/settings/tagLabels/tagMapping/components/parentTags', () => ({
  ParentTags: ({ onBulkSelect, onSelect }: any) => (
    <div>
      <button type="button" onClick={() => onSelect([{ uuid: 'p-1' }], true)}>
        select-parent
      </button>
      <button type="button" onClick={() => onBulkSelect([{ uuid: 'p-1' }])}>
        bulk-parent
      </button>
    </div>
  ),
}));

jest.mock('routes/settings/tagLabels/tagMapping/components/childTags', () => ({
  ChildTags: ({ onBulkSelect, onSelect }: any) => (
    <div>
      <button type="button" onClick={() => onSelect([{ uuid: 'c-1' }], true)}>
        select-child
      </button>
      <button type="button" onClick={() => onBulkSelect([{ uuid: 'c-1' }])}>
        bulk-child
      </button>
    </div>
  ),
}));

jest.mock('./parentTagMappingReview', () => ({
  ParentTagMappingReview: () => <div>review-step</div>,
}));

jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    ...actual,
    Wizard: ({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) => (
      <div>
        {header}
        {children}
      </div>
    ),
    WizardHeader: ({ title, onClose }: { title?: React.ReactNode; onClose?: () => void }) => (
      <div>
        {title}
        <button type="button" onClick={onClose}>
          close-wizard
        </button>
      </div>
    ),
    WizardStep: ({ children, footer }: { children?: React.ReactNode; footer?: any }) => (
      <div>
        {children}
        {footer?.onNext && (
          <button type="button" onClick={footer.onNext}>
            {footer.nextButtonText || 'wizard-next'}
          </button>
        )}
      </div>
    ),
  };
});

jest.mock('./parentTagMappingEmptyState', () => ({
  ParentTagMappingEmptyState: ({ onClose, onReset }: any) => (
    <div>
      <button type="button" onClick={onClose}>
        empty-close
      </button>
      <button type="button" onClick={onReset}>
        empty-reset
      </button>
    </div>
  ),
}));

describe('ParentTagMapping', () => {
  beforeEach(() => {
    mockSettingsState.status = FetchStatus.complete;
    jest.clearAllMocks();
  });

  test('opens the wizard and selects parent and child tags', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    render(
      <Provider store={createStore(() => ({}))}>
        <ParentTagMapping canWrite onClose={onClose} />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /create tag mapping/i }));
    expect(await screen.findByRole('button', { name: 'select-parent' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'select-parent' }));
    await user.click(screen.getByRole('button', { name: 'bulk-parent' }));
    await user.click(screen.getByRole('button', { name: 'select-child' }));
    await user.click(screen.getByRole('button', { name: 'bulk-child' }));
    const createButtons = screen.getAllByRole('button', { name: /create tag mapping/i });
    await user.click(createButtons[createButtons.length - 1]);
    expect(settingsActions.updateTagSettings).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'close-wizard' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('disables the create action when the user cannot write', () => {
    render(
      <Provider store={createStore(() => ({}))}>
        <ParentTagMapping canWrite={false} />
      </Provider>
    );
    expect(screen.getByRole('button', { name: /create tag mapping/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
