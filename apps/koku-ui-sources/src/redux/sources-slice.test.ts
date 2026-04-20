import { configureStore } from '@reduxjs/toolkit';

import { SourcesService } from 'apis/sources-service';
import type { Source } from 'apis/models/sources';

import { sourcesReducer, setListFilters, setSort, setPage, loadEntities, type SourcesState } from './sources-slice';

jest.mock('apis/sources-service', () => ({
  SourcesService: {
    listSources: jest.fn(),
  },
}));

const listSourcesMock = SourcesService.listSources as jest.MockedFunction<typeof SourcesService.listSources>;

const initialState: SourcesState = {
  entities: [],
  count: 0,
  loading: false,
  error: null,
  nameFilter: '',
  typeFilter: '',
  availabilityFilter: '',
  sortBy: 'name',
  sortDirection: 'asc',
  page: 1,
  perPage: 10,
};

describe('sourcesSlice', () => {
  describe('setListFilters', () => {
    it('sets typeFilter and resets page to 1', () => {
      const state = sourcesReducer({ ...initialState, page: 3 }, setListFilters({ typeFilter: 'OCP' }));
      expect(state.typeFilter).toBe('OCP');
      expect(state.page).toBe(1);
    });

    it('updates only provided filter fields', () => {
      const state = sourcesReducer(
        { ...initialState, nameFilter: 'keep', availabilityFilter: 'available' },
        setListFilters({ nameFilter: 'new' })
      );
      expect(state.nameFilter).toBe('new');
      expect(state.availabilityFilter).toBe('available');
    });
  });

  describe('setSort', () => {
    it('sets sortBy and sortDirection', () => {
      const state = sourcesReducer(initialState, setSort({ sortBy: 'created_timestamp', sortDirection: 'desc' }));
      expect(state.sortBy).toBe('created_timestamp');
      expect(state.sortDirection).toBe('desc');
    });
  });

  describe('setPage', () => {
    it('sets page', () => {
      const state = sourcesReducer(initialState, setPage({ page: 2 }));
      expect(state.page).toBe(2);
    });

    it('sets page and perPage when both provided', () => {
      const state = sourcesReducer(initialState, setPage({ page: 3, perPage: 25 }));
      expect(state.page).toBe(3);
      expect(state.perPage).toBe(25);
    });

    it('keeps existing perPage when not provided', () => {
      const state = sourcesReducer({ ...initialState, perPage: 20 }, setPage({ page: 2 }));
      expect(state.perPage).toBe(20);
    });
  });

  describe('loadEntities.pending', () => {
    it('sets loading true and clears error', () => {
      const pendingAction = { type: loadEntities.pending.type };
      const state = sourcesReducer({ ...initialState, error: 'Previous error' }, pendingAction);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('loadEntities.fulfilled', () => {
    it('sets entities, count, and loading false', () => {
      const mockSources = [
        {
          id: 1,
          uuid: 'uuid-1',
          name: 'Source 1',
          source_type: 'OCP',
          authentication: {},
          billing_source: null,
          provider_linked: false,
          active: true,
          paused: false,
          current_month_data: false,
          previous_month_data: false,
          has_data: false,
        },
      ];
      const fulfilledAction = {
        type: loadEntities.fulfilled.type,
        payload: { data: mockSources, meta: { count: 2 } },
      };
      const state = sourcesReducer({ ...initialState, loading: true }, fulfilledAction);
      expect(state.entities).toEqual(mockSources);
      expect(state.count).toBe(2);
      expect(state.loading).toBe(false);
    });
  });

  describe('loadEntities (availability status, client-side)', () => {
    const mk = (over: Partial<Source>): Source =>
      ({
        id: 1,
        uuid: '00000000-0000-0000-0000-000000000001',
        name: 'A',
        source_type: 'OCP',
        authentication: {},
        billing_source: null,
        provider_linked: true,
        current_month_data: false,
        previous_month_data: false,
        has_data: false,
        ...over,
      }) as Source;

    beforeEach(() => {
      listSourcesMock.mockReset();
    });

    it('requests a large page then filters to Available rows', async () => {
      listSourcesMock.mockResolvedValue({
        data: [
          mk({ id: 1, active: true, paused: false }),
          mk({ id: 2, uuid: '2', name: 'B', active: false, paused: false }),
          mk({ id: 3, uuid: '3', name: 'C', active: true, paused: true }),
        ],
        meta: { count: 3 },
        links: { first: '', next: null, previous: null, last: '' },
      });

      const store = configureStore({
        reducer: { sources: sourcesReducer },
        preloadedState: {
          sources: {
            ...initialState,
            availabilityFilter: 'available',
            page: 1,
            perPage: 10,
            sortBy: 'name',
            sortDirection: 'asc',
          },
        },
      });

      await store.dispatch(loadEntities());

      expect(listSourcesMock).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 0, limit: 2000, ordering: 'name' })
      );
      expect(store.getState().sources.count).toBe(1);
      expect(store.getState().sources.entities).toHaveLength(1);
      expect(store.getState().sources.entities[0].id).toBe(1);
    });

    it('applies name and availability filters together (intersection)', async () => {
      // Simulates API narrowing by name; client then applies availability (mock does not re-filter by name).
      listSourcesMock.mockResolvedValue({
        data: [
          mk({ id: 1, name: 'AWS Production', active: true, paused: false }),
          mk({ id: 2, uuid: '2', name: 'AWS Sandbox', active: false, paused: false }),
        ],
        meta: { count: 2 },
        links: { first: '', next: null, previous: null, last: '' },
      });

      const store = configureStore({
        reducer: { sources: sourcesReducer },
        preloadedState: {
          sources: {
            ...initialState,
            nameFilter: 'AWS',
            availabilityFilter: 'available',
            page: 1,
            perPage: 10,
            sortBy: 'name',
            sortDirection: 'asc',
          },
        },
      });

      await store.dispatch(loadEntities());

      expect(listSourcesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          offset: 0,
          limit: 2000,
          name: 'AWS',
          ordering: 'name',
        })
      );
      expect(store.getState().sources.count).toBe(1);
      expect(store.getState().sources.entities).toHaveLength(1);
      expect(store.getState().sources.entities[0].name).toBe('AWS Production');
    });

    it('paginates filtered Unavailable results client-side', async () => {
      listSourcesMock.mockResolvedValue({
        data: [
          mk({ id: 1, active: true, paused: false }),
          mk({ id: 2, uuid: '2', name: 'B', active: false, paused: false }),
        ],
        meta: { count: 2 },
        links: { first: '', next: null, previous: null, last: '' },
      });

      const store = configureStore({
        reducer: { sources: sourcesReducer },
        preloadedState: {
          sources: {
            ...initialState,
            availabilityFilter: 'unavailable',
            page: 1,
            perPage: 1,
          },
        },
      });

      await store.dispatch(loadEntities());
      expect(store.getState().sources.count).toBe(1);
      expect(store.getState().sources.entities).toHaveLength(1);
      expect(store.getState().sources.entities[0].id).toBe(2);

      listSourcesMock.mockResolvedValue({
        data: [
          mk({ id: 1, active: true, paused: false }),
          mk({ id: 2, uuid: '2', name: 'B', active: false, paused: false }),
        ],
        meta: { count: 2 },
        links: { first: '', next: null, previous: null, last: '' },
      });

      await store.dispatch(setPage({ page: 2, perPage: 1 }));
      await store.dispatch(loadEntities());
      expect(store.getState().sources.entities).toHaveLength(0);
    });
  });

  describe('loadEntities.rejected', () => {
    it('sets error message and loading false', () => {
      const rejectedAction = {
        type: loadEntities.rejected.type,
        error: { message: 'Network error' },
      };
      const state = sourcesReducer({ ...initialState, loading: true }, rejectedAction);
      expect(state.error).toBe('Network error');
      expect(state.loading).toBe(false);
    });

    it('uses fallback message when error message is missing', () => {
      const rejectedAction = {
        type: loadEntities.rejected.type,
        error: {},
      };
      const state = sourcesReducer({ ...initialState, loading: true }, rejectedAction);
      expect(state.error).toBe('Failed to load integrations');
      expect(state.loading).toBe(false);
    });
  });
});
