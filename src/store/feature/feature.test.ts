import { createMockStoreCreator } from 'store/mockStore';

import { featureSelectors } from '.';
import * as actions from './featureActions';
import { featureReducer, stateKey } from './featureReducer';
import * as selectors from './featureSelectors';

const createUIStore = createMockStoreCreator({
  [stateKey]: featureReducer,
});

test('default state', async () => {
  const store = createUIStore();
  expect(selectors.selectFeatureState(store.getState())).toMatchSnapshot();
});

test('currency feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.initFeatures({ isCurrencyFeatureEnabled: true }));
  expect(featureSelectors.selectIsCurrencyFeatureEnabled(store.getState())).toBe(true);
});

test('exports feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.initFeatures({ isExportsFeatureEnabled: true }));
  expect(featureSelectors.selectIsExportsFeatureEnabled(store.getState())).toBe(true);
});

test('IBM feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.initFeatures({ isIbmFeatureEnabled: true }));
  expect(featureSelectors.selectIsIbmFeatureEnabled(store.getState())).toBe(true);
});

test('OCI feature is enabled', async () => {
  const store = createUIStore();
  store.dispatch(actions.initFeatures({ isOciFeatureEnabled: true }));
  expect(featureSelectors.selectIsOciFeatureEnabled(store.getState())).toBe(true);
});
