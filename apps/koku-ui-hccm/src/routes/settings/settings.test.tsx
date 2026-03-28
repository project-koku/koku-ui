/// <reference types="@testing-library/jest-dom" />

import { UserAccessType, type UserAccess } from '../../api/userAccess';
import { getUserAccessQuery } from '../../api/queries/userAccessQuery';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FetchStatus } from '../../store/common';
import { rootReducer, type RootState } from '../../store/rootReducer';
import { userAccessQuery, userAccessStateKey } from '../../store/userAccess';
import { getFetchId } from '../../store/userAccess/userAccessCommon';

import Settings, { getIdKeyForTab } from './settings';

jest.mock('utils/chrome', () => ({
  withChrome: (Component: React.ComponentType) => Component,
}));

jest.mock('components/featureToggle/featureToggle', () => ({
  __esModule: true,
  ...jest.requireActual('components/featureToggle/featureToggle'),
  isSourcesSettingsTabEnabled: true,
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: () => <div data-testid="mock-scalprum-sources">Sources</div>,
}));

jest.mock('routes/settings/costModels', () => ({
  CostModelsDetails: () => <div>cost-models-tab</div>,
}));
jest.mock('routes/settings/calculations', () => ({
  Calculations: () => <div>calculations-tab</div>,
}));
jest.mock('routes/settings/tagLabels', () => ({
  TagLabels: () => <div>tags-tab</div>,
}));
jest.mock('routes/settings/costCategory', () => ({
  CostCategory: () => <div>cost-category-tab</div>,
}));
jest.mock('routes/settings/platformProjects', () => ({
  PlatformProjects: () => <div>platform-projects-tab</div>,
}));

jest.mock('routes/components/page/notAuthorized', () => ({
  NotAuthorized: ({ pathname }: { pathname?: string }) => (
    <div data-testid="not-authorized-mock" data-pathname={pathname ?? ''} />
  ),
}));

const userAccessQueryString = getUserAccessQuery(userAccessQuery);
const userAccessFetchId = getFetchId(UserAccessType.all, userAccessQueryString);

function buildUserAccessState(data: UserAccess) {
  return {
    byId: new Map([[userAccessFetchId, data]]),
    fetchStatus: new Map([[userAccessFetchId, FetchStatus.complete]]),
    errors: new Map([[userAccessFetchId, null]]),
  };
}

function renderSettings(partial: Partial<RootState> = {}) {
  const store = createStore(rootReducer, {
    ...partial,
    [userAccessStateKey]: partial[userAccessStateKey] ?? buildUserAccessState({ meta: {} as any, data: [] }),
  } as Partial<RootState> as any);
  return render(
    <Provider store={store}>
      <IntlProvider locale="en">
        <Settings />
      </IntlProvider>
    </Provider>
  );
}

describe('settings/getIdKeyForTab', () => {
  it('maps each settings tab to its id key', () => {
    expect(getIdKeyForTab('cost_models' as any)).toBe('cost_models');
    expect(getIdKeyForTab('calculations' as any)).toBe('calculations');
    expect(getIdKeyForTab('cost_category' as any)).toBe('cost_category');
    expect(getIdKeyForTab('platform_projects' as any)).toBe('platform_projects');
    expect(getIdKeyForTab('tags' as any)).toBe('tags');
    expect(getIdKeyForTab('sources' as any)).toBe('sources');
  });
});

describe('settings page (sources tab flag on)', () => {
  it('shows loading state while user access is fetching', () => {
    renderSettings({
      [userAccessStateKey]: {
        byId: new Map(),
        fetchStatus: new Map([[userAccessFetchId, FetchStatus.inProgress]]),
        errors: new Map(),
      },
    });
    expect(screen.getByText('Looking for integrations...')).toBeInTheDocument();
  });

  const fullAccessUserAccess = buildUserAccessState({
    meta: {} as any,
    data: [
      { type: UserAccessType.cost_model, access: true },
      { type: UserAccessType.settings, access: true, write: true },
    ],
  });

  it('shows Integrations tab and renders scalprum when selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings({ [userAccessStateKey]: fullAccessUserAccess });

    expect(screen.getByRole('tab', { name: 'Integrations' })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Integrations' }));

    expect(screen.getByTestId('mock-scalprum-sources')).toBeInTheDocument();
  });

  it('renders each built-in settings tab panel when its tab is selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSettings({ [userAccessStateKey]: fullAccessUserAccess });

    expect(screen.getByText('cost-models-tab')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Currency and calculations' }));
    expect(screen.getByText('calculations-tab')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tags and labels' }));
    expect(screen.getByText('tags-tab')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Cost categories' }));
    expect(screen.getByText('cost-category-tab')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Platform projects' }));
    expect(screen.getByText('platform-projects-tab')).toBeInTheDocument();
  });

  it('shows not authorized for Integrations when settings access is missing', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const noSettings = buildUserAccessState({
      meta: {} as any,
      data: [
        { type: UserAccessType.cost_model, access: true },
        { type: UserAccessType.settings, access: false },
      ],
    });
    renderSettings({ [userAccessStateKey]: noSettings });

    await user.click(screen.getByRole('tab', { name: 'Integrations' }));

    expect(screen.queryByTestId('mock-scalprum-sources')).not.toBeInTheDocument();
    expect(screen.getByTestId('not-authorized-mock')).toBeInTheDocument();
  });
});
