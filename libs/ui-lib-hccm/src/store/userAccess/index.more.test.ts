import * as mod from './index';

describe('userAccess index wiring', () => {
	test('exports reducer, selectors, actions, queries, and stateKey', () => {
		// Queries
		expect(mod.awsUserAccessQuery.type).toBe('AWS');
		expect(mod.azureUserAccessQuery.type).toBe('Azure');
		expect(mod.costModelUserAccessQuery.type).toBe('cost_model');
		expect(mod.gcpUserAccessQuery.type).toBe('GCP');
		expect(mod.ocpUserAccessQuery.type).toBe('OCP');
		expect(mod.userAccessQuery).toEqual({});

		// Reducer initializes default slice
		const initial = mod.userAccessReducer(undefined as any, { type: '@@INIT' } as any);
		expect(initial.byId).toBeInstanceOf(Map);
		expect(initial.errors).toBeInstanceOf(Map);
		expect(initial.fetchStatus).toBeInstanceOf(Map);

		// Selectors use stateKey
		const root: any = { [mod.userAccessStateKey]: initial };
		expect(mod.userAccessSelectors.selectUserAccessState(root)).toBe(initial);

		// Actions namespace exists
		expect(typeof mod.userAccessActions.fetchUserAccess).toBe('function');
	});
}); 