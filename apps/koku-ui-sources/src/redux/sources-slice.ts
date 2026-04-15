import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Source } from 'apis/models/sources';
import { SourcesService } from 'apis/sources-service';

import { sourceMatchesAvailabilityFilter } from './availability-filter';

/** Sources list API does not filter by availability; fetch a bounded window then filter client-side. */
const AVAILABILITY_STATUS_CLIENT_FILTER_LIMIT = 2000;

export interface SourcesState {
  entities: Source[];
  count: number;
  loading: boolean;
  error: string | null;
  filterColumn: 'name' | 'source_type' | 'availability_status';
  filterValue: string;
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
  filterColumn: 'name',
  filterValue: '',
  sortBy: 'name',
  sortDirection: 'asc',
  page: 1,
  perPage: 10,
};

export const loadEntities = createAsyncThunk('sources/loadEntities', async (_, { getState }) => {
  const state = (getState() as { sources: SourcesState }).sources;
  const ordering =
    state.sortBy && state.sortBy.length > 0
      ? state.sortDirection === 'desc'
        ? `-${state.sortBy}`
        : state.sortBy
      : undefined;

  if (state.filterColumn === 'availability_status' && state.filterValue) {
    const params: Record<string, string | number> = {
      offset: 0,
      limit: AVAILABILITY_STATUS_CLIENT_FILTER_LIMIT,
    };
    if (ordering) {
      params.ordering = ordering;
    }
    const response = await SourcesService.listSources(params);
    const filtered = response.data.filter((s: Source) =>
      sourceMatchesAvailabilityFilter(s, state.filterValue)
    );
    const total = filtered.length;
    const start = (state.page - 1) * state.perPage;
    const pageRows = filtered.slice(start, start + state.perPage);
    return {
      data: pageRows,
      meta: { count: total },
      links: response.links,
    };
  }

  const params: Record<string, any> = {
    offset: (state.page - 1) * state.perPage,
    limit: state.perPage,
  };
  if (state.filterValue) {
    const paramKey = state.filterColumn === 'source_type' ? 'type' : state.filterColumn;
    // Backend list filter: name column uses the param name; source_type column maps to query param `type`.
    params[paramKey] = state.filterValue;
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
    setFilter(state, action) {
      state.filterColumn = action.payload.filterColumn ?? state.filterColumn;
      state.filterValue = action.payload.filterValue ?? '';
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

export const { setFilter, setSort, setPage } = sourcesSlice.actions;
export const sourcesReducer = sourcesSlice.reducer;
