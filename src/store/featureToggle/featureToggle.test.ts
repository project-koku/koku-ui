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

test('Account info empty state feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isAccountInfoEmptyStateToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsAccountInfoEmptyStateToggleEnabled(store.getState())).toBe(true);
});

test('AWS EC2 instances feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isAwsEc2InstancesToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsAwsEc2InstancesToggleEnabled(store.getState())).toBe(true);
});

test('Debug feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isDebugToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsDebugToggleEnabled(store.getState())).toBe(true);
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

test('OCP on cloud group bys feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isOcpCloudGroupBysToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsOcpCloudGroupBysToggleEnabled(store.getState())).toBe(true);
});
