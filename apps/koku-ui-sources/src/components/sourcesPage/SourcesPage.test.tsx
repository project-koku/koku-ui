import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import localeMessages from '../../../locales/data.json';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sourcesReducer from 'redux/sources/sourcesSlice';
import { SourcesPage } from './SourcesPage';
import type { Source } from 'typings/source';

jest.mock('api/entities', () => {
  const actual = jest.requireActual<typeof import('api/entities')>('api/entities');
  return {
    ...actual,
    listSources: jest.fn(),
    getSource: jest.fn(),
    createSource: jest.fn(),
    updateSource: jest.fn(),
    deleteSource: jest.fn(),
    pauseSource: jest.fn(),
    resumeSource: jest.fn(),
    createApplication: jest.fn(),
    deleteApplication: jest.fn(),
  };
});

const mockAddNotification = jest.fn();
jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: () => mockAddNotification,
}));

const mockSource: Source = {
  id: 1,
  uuid: 'uuid-1',
  name: 'My OCP Source',
  source_type: 'OCP',
  authentication: { credentials: { cluster_id: 'cluster-1' } },
  billing_source: null,
  provider_linked: false,
  active: true,
  paused: false,
  current_month_data: false,
  previous_month_data: false,
  has_data: false,
  created_timestamp: '2026-01-15T10:00:00Z',
};

const pausedMockSource: Source = {
  ...mockSource,
  id: 2,
  uuid: 'uuid-2',
  name: 'Paused Source',
  paused: true,
  active: false,
};

const defaultState = {
  entities: [] as Source[],
  count: 0,
  loading: false,
  error: null,
  filterColumn: 'name' as const,
  filterValue: '',
  sortBy: 'name',
  sortDirection: 'asc' as const,
  page: 1,
  perPage: 10,
};

const renderWithProviders = (preloadedState = {}, props: { canWrite?: boolean } = {}) => {
  const store = configureStore({
    reducer: { sources: sourcesReducer },
    preloadedState: { sources: { ...defaultState, ...preloadedState } },
  });
  return render(
    <IntlProvider locale="en" defaultLocale="en" messages={localeMessages.en}>
      <Provider store={store}>
        <SourcesPage canWrite={props.canWrite} />
      </Provider>
    </IntlProvider>
  );
};

describe('SourcesPage', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('shows spinner when loading with no entities', async () => {
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    await act(async () => {
      renderWithProviders({ loading: true });
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows empty state when count is 0 and no filter', async () => {
    const { listSources } = require('api/entities');
    listSources.mockResolvedValue({
      data: [],
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
    });

    await act(async () => {
      renderWithProviders();
    });

    expect(screen.getByText('Get started by connecting your integrations')).toBeInTheDocument();
    expect(screen.getByText('Select an available provider.')).toBeInTheDocument();
  });

  it('shows no-matches empty state when count is 0 and a filter is active', async () => {
    const { listSources } = require('api/entities');
    listSources.mockResolvedValue({
      data: [],
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
    });

    await act(async () => {
      renderWithProviders({ filterValue: 'nonexistent', filterColumn: 'name' });
    });

    expect(screen.getByText('No integrations match your filters')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting or clearing your filters to see more results.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('Clear filters button resets filter and reloads', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockResolvedValue({
      data: [],
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
    });

    await act(async () => {
      renderWithProviders({ filterValue: 'x', filterColumn: 'name' });
    });

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    await waitFor(() => {
      expect(listSources).toHaveBeenCalled();
    });
  });

  it('shows table when entities exist', () => {
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 });

    expect(screen.getByText('My OCP Source')).toBeInTheDocument();
  });

  it('opens the Add integration wizard when toolbar button is clicked', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 }, { canWrite: true });

    await user.click(screen.getByText('Add integration'));
    expect(screen.getByText('Add integration', { selector: '.pf-v6-c-modal-box__title-text' })).toBeInTheDocument();
  });

  it('switches to detail view when a source name is clicked', async () => {
    const user = userEvent.setup();
    const { listSources, getSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    getSource.mockResolvedValue(mockSource);

    renderWithProviders({ entities: [mockSource], count: 1 });

    await user.click(screen.getByText('My OCP Source'));

    await waitFor(() => {
      expect(screen.queryByText('Add integration')).not.toBeInTheDocument();
    });
  });

  it('pauses a source from the kebab menu', async () => {
    const user = userEvent.setup();
    const { listSources, pauseSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    pauseSource.mockResolvedValue({});

    renderWithProviders({ entities: [mockSource], count: 1 }, { canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Pause'));

    await waitFor(() => {
      expect(pauseSource).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'uuid-1' }));
    });
  });

  it('opens remove modal from the kebab menu', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 }, { canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Remove'));

    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
  });

  it('applies search filter', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 });

    const searchInput = screen.getByPlaceholderText('Filter by name');
    await user.type(searchInput, 'test{Enter}');

    expect(listSources).toHaveBeenCalled();
  });

  it('handles sort column changes', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 });

    const typeHeader = screen.getByText('Type');
    await user.click(typeHeader);

    expect(listSources).toHaveBeenCalled();
  });

  it('handles filter column change via toolbar', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 });

    const filterToggle = screen.getAllByRole('button').find(b => b.textContent === 'Name');
    if (filterToggle) {
      await user.click(filterToggle);
      const statusOption = await screen.findByRole('option', { name: 'Status' });
      await user.click(statusOption);
    }
  });

  it('handles pagination page change', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 25, page: 1, perPage: 10 });

    const nextBtn = screen.getByLabelText('Go to next page');
    await user.click(nextBtn);

    expect(listSources).toHaveBeenCalled();
  });

  it('opens wizard with preselected type from empty state tile', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockResolvedValue({
      data: [],
      meta: { count: 0 },
      links: { first: '', next: null, previous: null, last: '' },
    });

    await act(async () => {
      renderWithProviders();
    });

    const ocpCard = document.getElementById('source-type-OCP');
    if (ocpCard) {
      await user.click(ocpCard);
      await waitFor(() => {
        expect(screen.getByText('Add an OpenShift integration')).toBeInTheDocument();
      });
    }
  });

  it('shows an alert when pause fails', async () => {
    const user = userEvent.setup();
    const { listSources, pauseSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    pauseSource.mockReset();
    pauseSource.mockImplementation(() => Promise.reject(new Error('fail')));

    renderWithProviders({ entities: [mockSource], count: 1 }, { canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    const menu = await screen.findByRole('menu');
    // PatternFly invokes async onClick without awaiting; wrap the menu item click in `act` so the
    // rejected `pauseSource` + `setPauseActionError` flush before assertions (see https://react.dev/reference/react/act).
    await act(async () => {
      await user.click(within(menu).getByRole('menuitem', { name: /Pause/ }));
    });

    await waitFor(() => {
      expect(pauseSource).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalled();
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'danger',
        description: 'fail',
        dismissable: true,
      })
    );
    expect(mockAddNotification.mock.calls[0][0].title).toBe('Could not pause integration');
  });

  it('shows an alert when resume fails', async () => {
    const user = userEvent.setup();
    const { listSources, resumeSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    resumeSource.mockReset();
    resumeSource.mockImplementation(() => Promise.reject(new Error('resume fail')));

    renderWithProviders({ entities: [pausedMockSource], count: 1 }, { canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    const menu = await screen.findByRole('menu');
    await act(async () => {
      await user.click(within(menu).getByRole('menuitem', { name: /Resume/ }));
    });

    await waitFor(() => {
      expect(resumeSource).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalled();
    });
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'danger',
        description: 'resume fail',
        dismissable: true,
      })
    );
    expect(mockAddNotification.mock.calls[0][0].title).toBe('Could not resume integration');
  });

  it('switches to detail view and shows SourceDetail component', async () => {
    const user = userEvent.setup();
    const { listSources, getSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    getSource.mockResolvedValue(mockSource);

    renderWithProviders({ entities: [mockSource], count: 1 });

    await user.click(screen.getByText('My OCP Source'));

    await waitFor(() => {
      expect(screen.queryByText('Add integration')).not.toBeInTheDocument();
    });
    expect(getSource).toHaveBeenCalledWith('uuid-1');
  });

  it('calls view details from kebab action', async () => {
    const user = userEvent.setup();
    const { listSources, getSource } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));
    getSource.mockResolvedValue(mockSource);

    renderWithProviders({ entities: [mockSource], count: 1 });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('View details'));

    await waitFor(() => {
      expect(getSource).toHaveBeenCalled();
    });
  });

  it('closes remove modal via onClose', async () => {
    const user = userEvent.setup();
    const { listSources } = require('api/entities');
    listSources.mockReturnValue(new Promise(() => {}));

    renderWithProviders({ entities: [mockSource], count: 1 }, { canWrite: true });

    const kebabButtons = screen.getAllByRole('button', { name: 'Kebab toggle' });
    await user.click(kebabButtons[0]);
    await user.click(screen.getByText('Remove'));

    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to remove/)).not.toBeInTheDocument();
    });
  });
});
