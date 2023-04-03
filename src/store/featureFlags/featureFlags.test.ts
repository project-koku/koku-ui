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

test('cost distribution feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isCostDistributionFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(store.getState())).toBe(true);
});

test('FINsights feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isFinsightsFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsFinsightsFeatureEnabled(store.getState())).toBe(true);
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

test('ROS feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureFlags({ isRosFeatureEnabled: true }));
  expect(featureFlagsSelectors.selectIsRosFeatureEnabled(store.getState())).toBe(true);
});
