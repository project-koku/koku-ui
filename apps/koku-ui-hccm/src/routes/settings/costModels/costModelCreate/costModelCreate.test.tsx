import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccessType } from 'api/userAccess';
import { configureStore } from 'store/store';
import { FetchStatus } from 'store/common';
import { userAccessQuery, userAccessStateKey } from 'store/userAccess';
import { getFetchId } from 'store/userAccess/userAccessCommon';

import CostModelCreate from './costModelCreate';

jest.mock('./components/create', () => ({
  CostModelWizard: ({ canWrite }: { canWrite?: boolean }) => (
    <div data-testid="cost-model-wizard" data-can-write={String(canWrite)} />
  ),
}));

jest.mock('./costModelCreateHeader', () => ({
  CostModelCreateHeader: () => <div data-testid="create-header" />,
}));

const userAccessQueryString = getUserAccessQuery(userAccessQuery);
const userAccessFetchId = getFetchId(UserAccessType.all, userAccessQueryString);

describe('CostModelCreate', () => {
  const renderCreate = () => {
    const store = configureStore({
      [userAccessStateKey]: {
        byId: new Map([
          [
            userAccessFetchId,
            {
              data: [{ type: UserAccessType.settings, access: true, write: true }],
            },
          ],
        ]),
        errors: new Map([[userAccessFetchId, null]]),
        fetchStatus: new Map([[userAccessFetchId, FetchStatus.complete]]),
      },
    } as any);

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <CostModelCreate />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  test('renders header and wizard with write access', () => {
    renderCreate();
    expect(screen.getByTestId('create-header')).toBeInTheDocument();
    expect(screen.getByTestId('cost-model-wizard')).toBeInTheDocument();
    expect(screen.getByTestId('cost-model-wizard')).toHaveAttribute('data-can-write', 'true');
  });
});
