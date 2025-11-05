import { uiReducer, uiStateKey } from './uiReducer';
import { closeExportsDrawer, closeOptimizationsDrawer, openExportsDrawer, openOptimizationsDrawer } from './uiActions';
import * as selectors from './uiSelectors';

const buildRoot = (slice: any) => ({ ui: slice } as any);

describe('ui store more', () => {
	test('toggles drawers and payload', () => {
		let state = uiReducer(undefined as any, openExportsDrawer());
		state = uiReducer(state, openOptimizationsDrawer({ a: 1 }));
		state = uiReducer(state, closeExportsDrawer());
		let root: any = buildRoot(state);
		expect(selectors.selectIsExportsDrawerOpen(root)).toBe(false);
		expect(selectors.selectIsOptimizationsDrawerOpen(root)).toBe(true);
		expect(selectors.selectOptimizationsDrawerPayload(root)).toEqual({ a: 1 });
		state = uiReducer(state, closeOptimizationsDrawer());
		root = buildRoot(state);
		expect(selectors.selectIsOptimizationsDrawerOpen(root)).toBe(false);
	});
}); 