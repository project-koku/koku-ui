import { createMockStoreCreator } from 'store/mockStore';

import { featureFlagsSelectors } from '.';
import * as actions from './featureFlagsActions';
import { featureFlagsReducer, stateKey } from './featureFlagsReducer';
import * as selectors from './featureFlagsSelectors';

const createUIStore = createMockStoreCreator({
  [stateKey]: featureFlagsReducer,
});

test('default state', async () => {
  const store = createUIStore();
  expect(selectors.selectFeatureFlagsState(store.getState())).toMatchSnapshot();
});

test('currency feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isCurrencyFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsCurrencyFeatureEnabled(store.getState())).toBe(true);
});

test('exports feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isExportsFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsExportsFeatureEnabled(store.getState())).toBe(true);
});

test('IBM feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isIbmFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsIbmFeatureEnabled(store.getState())).toBe(true);
});

test('OCI feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isOciFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsOciFeatureEnabled(store.getState())).toBe(true);
});
