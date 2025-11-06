import { combineReducers } from 'redux';
import { accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
import { forecastReducer, forecastStateKey } from 'store/forecasts';
import { reportReducer, reportStateKey } from 'store/reports';
import { resourceReducer, resourceStateKey } from 'store/resources';
import { rosReducer, rosStateKey } from 'store/ros';
import type { StateType } from 'typesafe-actions';

import { featureToggleReducer, featureToggleStateKey } from './featureToggle';
import { providersReducer, providersStateKey } from './providers';
import { uiReducer, uiStateKey } from './ui';
import { userAccessReducer, userAccessStateKey } from './userAccess';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [accountSettingsStateKey]: accountSettingsReducer,
  [featureToggleStateKey]: featureToggleReducer,
  [forecastStateKey]: forecastReducer,
  [providersStateKey]: providersReducer,
  [reportStateKey]: reportReducer,
  [resourceStateKey]: resourceReducer,
  [rosStateKey]: rosReducer,
  [uiStateKey]: uiReducer,
  [userAccessStateKey]: userAccessReducer,
});
