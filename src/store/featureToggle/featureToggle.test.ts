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

test('AWS EC2 instances feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isAwsEc2InstancesToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsAwsEc2InstancesToggleEnabled(store.getState())).toBe(true);
});

test('Cloud info feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isClusterInfoToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsClusterInfoToggleEnabled(store.getState())).toBe(true);
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

test('OCP on cloud networking feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isOcpCloudNetworkingToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsOcpCloudNetworkingToggleEnabled(store.getState())).toBe(true);
});

test('OCP project storage feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isOcpProjectStorageToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsOcpProjectStorageToggleEnabled(store.getState())).toBe(true);
});

test('ROS feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isRosToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsRosToggleEnabled(store.getState())).toBe(true);
});

test('Settings platform feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isSettingsPlatformToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsSettingsPlatformToggleEnabled(store.getState())).toBe(true);
});

test('Tag mapping feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isTagMappingToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsTagMappingToggleEnabled(store.getState())).toBe(true);
});
