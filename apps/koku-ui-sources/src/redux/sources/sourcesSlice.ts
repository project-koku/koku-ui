import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listSources as listSourcesApi } from 'api/entities';
import type { Source } from 'typings/source';

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
  const params: Record<string, any> = {
    offset: (state.page - 1) * state.perPage,
    limit: state.perPage,
  };
  if (state.filterColumn === 'availability_status' && state.filterValue) {
    const statusLower = state.filterValue.toLowerCase();
    if (statusLower === 'available') {
      params.active = true;
      params.paused = false;
    } else if (statusLower === 'paused') {
      params.paused = true;
      params.active = false;
    } else if (statusLower === 'unavailable') {
      params.active = false;
    }
  } else if (state.filterValue) {
    const paramKey = state.filterColumn === 'source_type' ? 'type' : state.filterColumn;
    // Backend expects type=OCP|AWS|Azure|GCP (source_type__icontains). Toolbar type filter uses a Select, so filterValue is always the id.
    params[paramKey] = state.filterValue;
  }
  if (state.sortBy) {
    params.ordering = state.sortDirection === 'desc' ? `-${state.sortBy}` : state.sortBy;
  }
  return listSourcesApi(params);
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
export default sourcesSlice.reducer;
