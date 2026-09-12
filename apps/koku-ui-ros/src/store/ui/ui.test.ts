import { createMockStoreCreator } from 'store/mockStore';

import { uiSelectors } from '.';
import * as actions from './uiActions';
import { stateKey, uiReducer } from './uiReducer';
import * as selectors from './uiSelectors';

const createUIStore = createMockStoreCreator({
  [stateKey]: uiReducer,
});

test('default state', async () => {
  const store = createUIStore();
  expect(selectors.selectUIState(store.getState())).toMatchSnapshot();
});

test('close export drawer', async () => {
  const store = createUIStore();
  store.dispatch(actions.closeExportsDrawer());
  expect(uiSelectors.selectIsExportsDrawerOpen(store.getState())).toBe(false);
});

test('open export drawer', async () => {
  const store = createUIStore();
  store.dispatch(actions.openExportsDrawer());
  expect(uiSelectors.selectIsExportsDrawerOpen(store.getState())).toBe(true);
});

test('open and close optimizations drawer', () => {
  const store = createUIStore();
  store.dispatch(actions.openOptimizationsDrawer({ id: 'opt-1' }));
  expect(uiSelectors.selectIsOptimizationsDrawerOpen(store.getState())).toBe(true);
  expect(uiSelectors.selectOptimizationsDrawerPayload(store.getState())).toEqual({ id: 'opt-1' });
  store.dispatch(actions.closeOptimizationsDrawer());
  expect(uiSelectors.selectIsOptimizationsDrawerOpen(store.getState())).toBe(false);
});

test('reset state restores defaults', () => {
  const store = createUIStore();
  store.dispatch(actions.openExportsDrawer());
  store.dispatch(actions.resetState());
  expect(uiSelectors.selectIsExportsDrawerOpen(store.getState())).toBe(false);
});
