import { RootState } from 'store/rootReducer';

import { getReportId, stateKey } from './costTypeCommon';

export const selectCostTypeState = (state: RootState) => state[stateKey];

// Fetch costType

export const selectCostType = (state: RootState) => selectCostTypeState(state).byId.get(getReportId());

export const selectCostTypeFetchStatus = (state: RootState) =>
  selectCostTypeState(state).fetchStatus.get(getReportId());

export const selectCostTypeError = (state: RootState) => selectCostTypeState(state).errors.get(getReportId());
