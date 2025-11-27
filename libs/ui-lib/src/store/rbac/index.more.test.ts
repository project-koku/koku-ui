import * as mod from './index';

describe('rbac index wiring', () => {
	test('exports reducer, actions, selectors and stateKey', () => {
		const initial = mod.rbacReducer(undefined as any, { type: '@@INIT' } as any);
		const root: any = { [mod.rbacStateKey]: initial };
		expect(mod.rbacSelectors.selectRbacState(root)).toBe(initial);
		expect(typeof mod.rbacActions.fetchRbac).toBe('function');
	});
}); 