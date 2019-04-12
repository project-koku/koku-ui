jest.mock('api/users');

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

test('close providers modal', async () => {
  const store = createUIStore();
  store.dispatch(actions.closeProvidersModal());
  expect(uiSelectors.selectIsProvidersModalOpen(store.getState())).toBe(false);
});

test('open providers modal', async () => {
  const store = createUIStore();
  store.dispatch(actions.openProvidersModal());
  expect(uiSelectors.selectIsProvidersModalOpen(store.getState())).toBe(true);
});

test('toggle sidebar', async () => {
  const store = createUIStore();
  store.dispatch(actions.toggleSidebar());
  expect(uiSelectors.selectIsSidebarOpen(store.getState())).toBe(true);
});
