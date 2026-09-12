import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccessType } from 'api/userAccess';
import { SettingsTab } from 'routes/settings/settings';
import { FetchStatus } from 'store/common';
import { configureStore } from 'store/store';
import { userAccessQuery, userAccessStateKey } from 'store/userAccess';
import { getFetchId } from 'store/userAccess/userAccessCommon';

import IntegrationBreakdown from './integrationBreakdown';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: ({ onBack, uuid }: { onBack?: () => void; uuid?: string }) => (
    <>
      <div data-testid="source-detail">{uuid}</div>
      <button type="button" onClick={onBack}>
        Integrations
      </button>
    </>
  ),
}));

jest.mock('routes/components/page/notAuthorized', () => ({
  NotAuthorized: () => <div data-testid="not-authorized" />,
}));

const userAccessQueryString = getUserAccessQuery(userAccessQuery);
const userAccessFetchId = getFetchId(UserAccessType.all, userAccessQueryString);

describe('IntegrationBreakdown', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderDetail = (
    userAccessData: { type: string; access: boolean; write: boolean }[],
    { fetchStatus = FetchStatus.complete }: { fetchStatus?: FetchStatus } = {}
  ) => {
    const store = configureStore({
      [userAccessStateKey]: {
        byId: new Map([
          [
            userAccessFetchId,
            {
              data: userAccessData,
            },
          ],
        ]),
        errors: new Map([[userAccessFetchId, null]]),
        fetchStatus: new Map([[userAccessFetchId, fetchStatus]]),
      },
    } as any);

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/settings/integrations/detail/src-uuid']}>
          <Routes>
            <Route
              path="/settings/integrations/detail/:uuid"
              element={
                <IntlProvider locale="en">
                  <IntegrationBreakdown />
                </IntlProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('mounts the federated source detail for a user with sources access', async () => {
    renderDetail([{ type: UserAccessType.sources, access: true, write: true }]);

    expect(await screen.findByTestId('source-detail')).toHaveTextContent('src-uuid');
    expect(screen.queryByTestId('not-authorized')).not.toBeInTheDocument();
  });

  test('denies the page for a user without sources access', async () => {
    renderDetail([{ type: UserAccessType.settings, access: true, write: true }]);

    expect(await screen.findByTestId('not-authorized')).toBeInTheDocument();
    expect(screen.queryByTestId('source-detail')).not.toBeInTheDocument();
  });

  test('shows a loading state while user access is in progress', async () => {
    renderDetail([], { fetchStatus: FetchStatus.inProgress });

    expect(await screen.findByText(/looking for user access/i)).toBeInTheDocument();
    expect(screen.queryByTestId('source-detail')).not.toBeInTheDocument();
  });

  test('denies the page when uuid is missing', async () => {
    const store = configureStore({
      [userAccessStateKey]: {
        byId: new Map([
          [
            userAccessFetchId,
            {
              data: [{ type: UserAccessType.sources, access: true, write: true }],
            },
          ],
        ]),
        errors: new Map([[userAccessFetchId, null]]),
        fetchStatus: new Map([[userAccessFetchId, FetchStatus.complete]]),
      },
    } as any);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/settings/integrations/detail']}>
          <Routes>
            <Route
              path="/settings/integrations/detail"
              element={
                <IntlProvider locale="en">
                  <IntegrationBreakdown />
                </IntlProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByTestId('not-authorized')).toBeInTheDocument();
    expect(screen.queryByTestId('source-detail')).not.toBeInTheDocument();
  });

  test('navigates back to Settings with the Integrations tab selected by name', async () => {
    renderDetail([{ type: UserAccessType.sources, access: true, write: true }]);

    fireEvent.click(await screen.findByRole('button', { name: /^integrations$/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/openshift/cost-management/settings', {
      state: {
        settingsState: {
          activeTab: SettingsTab.sources,
        },
      },
    });
  });
});
