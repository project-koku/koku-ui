import { createMockStoreCreator } from 'store/mockStore';

import { FeatureToggleSelectors } from '.';
import * as actions from './featureToggleActions';
import { FeatureToggleReducer, stateKey } from './featureToggleReducer';
import * as selectors from './featureToggleSelectors';

const createUIStore = createMockStoreCreator({
  [stateKey]: FeatureToggleReducer,
});

test('default state', async () => {
  const store = createUIStore();
  expect(selectors.selectFeatureToggleState(store.getState())).toMatchSnapshot();
});

test('Exports feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isExportsToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsExportsToggleEnabled(store.getState())).toBe(true);
});

test('FINsights feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isFinsightsToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsFinsightsToggleEnabled(store.getState())).toBe(true);
});

test('IBM feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isIbmToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsIbmToggleEnabled(store.getState())).toBe(true);
});

test('ROS feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isRosToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsRosToggleEnabled(store.getState())).toBe(true);
});
