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

test('cost distribution feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isCostDistributionFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(store.getState())).toBe(true);
});

test('cost type feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isCostTypeFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsCostTypeFeatureEnabled(store.getState())).toBe(true);
});

test('FINsights feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isFINsightsFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsFINsightsFeatureEnabled(store.getState())).toBe(true);
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

test('negative filtering feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isNegativeFilteringFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsNegativeFilteringFeatureEnabled(store.getState())).toBe(true);
});

test('OCI feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isOciFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsOciFeatureEnabled(store.getState())).toBe(true);
});

test('platform costs feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isPlatformCostsFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsPlatformCostsFeatureEnabled(store.getState())).toBe(true);
});

test('unallocated costs feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isUnallocatedCostsFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsUnallocatedCostsFeatureEnabled(store.getState())).toBe(true);
});
