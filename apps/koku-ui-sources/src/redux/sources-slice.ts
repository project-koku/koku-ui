import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Source } from 'apis/models/sources';
import { SourcesService } from 'apis/sources-service';

import { sourceMatchesAvailabilityFilter } from './availability-filter';

/** Sources list API does not filter by availability; fetch a bounded window then filter client-side. */
const AVAILABILITY_STATUS_CLIENT_FILTER_LIMIT = 2000;

export type AvailabilityFilterValue = '' | 'available' | 'unavailable';

export interface SourcesState {
  entities: Source[];
  count: number;
  loading: boolean;
  error: string | null;
  /** Server-side `name` query param when non-empty. */
  nameFilter: string;
  /** Server-side `type` query param when non-empty. */
  typeFilter: string;
  /** Client-side availability filter; ANDed with name/type via `loadEntities`. */
  availabilityFilter: AvailabilityFilterValue;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  perPage: number;
}

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

export interface ListFiltersPatch {
  nameFilter?: string;
  typeFilter?: string;
  availabilityFilter?: AvailabilityFilterValue;
}

export const loadEntities = createAsyncThunk('sources/loadEntities', async (_, { getState }) => {
  const state = (getState() as { sources: SourcesState }).sources;
  const ordering =
    state.sortBy && state.sortBy.length > 0
      ? state.sortDirection === 'desc'
        ? `-${state.sortBy}`
        : state.sortBy
      : undefined;

  const hasAvailability = state.availabilityFilter === 'available' || state.availabilityFilter === 'unavailable';

  if (hasAvailability) {
    const params: Record<string, string | number> = {
      offset: 0,
      limit: AVAILABILITY_STATUS_CLIENT_FILTER_LIMIT,
    };
    if (state.nameFilter) {
      params.name = state.nameFilter;
    }
    if (state.typeFilter) {
      params.type = state.typeFilter;
    }
    if (ordering) {
      params.ordering = ordering;
    }
    const response = await SourcesService.listSources(params);
    const filtered = response.data.filter((s: Source) => sourceMatchesAvailabilityFilter(s, state.availabilityFilter));
    const total = filtered.length;
    const start = (state.page - 1) * state.perPage;
    const pageRows = filtered.slice(start, start + state.perPage);
    return {
      data: pageRows,
      meta: { count: total },
      links: response.links,
    };
  }

  const params: Record<string, string | number> = {
    offset: (state.page - 1) * state.perPage,
    limit: state.perPage,
  };
  if (state.nameFilter) {
    params.name = state.nameFilter;
  }
  if (state.typeFilter) {
    params.type = state.typeFilter;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return SourcesService.listSources(params);
});

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setListFilters(state, action: PayloadAction<ListFiltersPatch>) {
      const p = action.payload;
      if (p.nameFilter !== undefined) {
        state.nameFilter = p.nameFilter;
      }
      if (p.typeFilter !== undefined) {
        state.typeFilter = p.typeFilter;
      }
      if (p.availabilityFilter !== undefined) {
        state.availabilityFilter = p.availabilityFilter;
      }
      state.page = 1;
    },
    setSort(state, action) {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    setPage(state, action) {
      state.page = action.payload.page;
      state.perPage = action.payload.perPage ?? state.perPage;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadEntities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        state.count = action.payload.meta.count;
      })
      .addCase(loadEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load integrations';
      });
  },
});

export const { setListFilters, setSort, setPage } = sourcesSlice.actions;
export const sourcesReducer = sourcesSlice.reducer;
