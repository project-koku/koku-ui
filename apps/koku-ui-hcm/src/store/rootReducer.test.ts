import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
	test('returns combined state object with known slice keys', () => {
		const state = rootReducer(undefined as any, { type: '@@INIT' } as any);
		// Verify a sampling of important keys to avoid flakiness if new slices are added.
		expect(state).toHaveProperty('accountSettings');
		expect(state).toHaveProperty('metrics');
		expect(state).toHaveProperty('providers');
		expect(state).toHaveProperty('RBAC');
		expect(state).toHaveProperty('ui');
		expect(state).toHaveProperty('userAccess');
	});
}); 