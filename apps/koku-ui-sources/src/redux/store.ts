import { configureStore } from '@reduxjs/toolkit';

import { sourcesReducer } from './sources-slice';

export const sourcesStore = configureStore({
  reducer: {
    sources: sourcesReducer,
  },
});

export type RootState = ReturnType<typeof sourcesStore.getState>;
export type AppDispatch = typeof sourcesStore.dispatch;
