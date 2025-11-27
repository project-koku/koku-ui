import { createMockStoreCreator } from '../mockStore';

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

test('Systems feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.setFeatureToggle({ isSystemsToggleEnabled: true }));
  expect(FeatureToggleSelectors.selectIsSystemsToggleEnabled(store.getState())).toBe(true);
});

