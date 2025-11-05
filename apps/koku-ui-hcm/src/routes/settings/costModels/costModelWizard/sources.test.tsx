import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Sources from './sources';
import { CostModelContext } from './context';

jest.mock('routes/components/state/loadingState', () => ({ __esModule: true, LoadingState: () => <div>loading</div> }));
jest.mock('routes/settings/costModels/components/errorState', () => ({ __esModule: true, SourceStepErrorState: (props: any) => <button onClick={props.onRefresh}>error</button> }));
jest.mock('./sourcesTable', () => ({ __esModule: true, default: () => <div>table</div> }));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Sources', () => {
  test('renders loading and error', () => {
    const ctxLoading = { loading: true, fetchSources: jest.fn(), dataFetched: true } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctxLoading}>
        <Sources />
      </CostModelContext.Provider>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();

    const ctxError = { loading: false, apiError: 'x', fetchSources: jest.fn(), dataFetched: true } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctxError}>
        <Sources />
      </CostModelContext.Provider>
    );
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  test('renders table by default and fetches on mount when not dataFetched', () => {
    const fetchSources = jest.fn();
    const ctx = { loading: false, apiError: null, dataFetched: false, type: 'Azure', query: {}, page: 1, perPage: 10, fetchSources } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Sources />
      </CostModelContext.Provider>
    );
    expect(screen.getByText('table')).toBeInTheDocument();
    expect(fetchSources).toHaveBeenCalledWith('Azure', {}, 1, 10);
  });
});
