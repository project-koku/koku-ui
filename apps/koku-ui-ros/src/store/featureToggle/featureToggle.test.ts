import { createMockStoreCreator } from 'store/mockStore';

import { featureToggleSelectors } from '.';
import * as actions from './featureToggleActions';
import { featureToggleReducer, stateKey } from './featureToggleReducer';
import * as selectors from './featureToggleSelectors';

const createUIStore = createMockStoreCreator({
  [stateKey]: featureToggleReducer,
});

test('default state', async () => {
  const store = createUIStore();
  expect(selectors.selectFeatureToggleState(store.getState())).toMatchSnapshot();
});

test('Namespace and debug features are enabled', () => {
  const store = createUIStore();
  store.dispatch(
    actions.setFeatureToggle({
      isNamespaceToggleEnabled: true,
      isDebugToggleEnabled: true,
    })
  );
  expect(featureToggleSelectors.selectIsNamespaceToggleEnabled(store.getState())).toBe(true);
  expect(featureToggleSelectors.selectIsDebugToggleEnabled(store.getState())).toBe(true);
  expect(featureToggleSelectors.selectHasFeatureToggle(store.getState())).toBe(true);
});
