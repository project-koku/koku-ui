import * as mod from './index';

describe('providers index wiring', () => {
	test('exports queries, reducer, selectors, actions, and stateKey', () => {
		// queries
		expect(mod.awsProvidersQuery.type).toBe('AWS');
		expect(mod.azureProvidersQuery.type).toBe('Azure');
		expect(mod.gcpProvidersQuery.type).toBe('GCP');
		expect(mod.ocpProvidersQuery.type).toBe('OCP');
		expect(mod.providersQuery.limit).toBe(1000);

		const initial = mod.providersReducer(undefined as any, { type: '@@INIT' } as any);
		const root: any = { [mod.providersStateKey]: initial };
		expect(mod.providersSelectors.selectProvidersState(root)).toBe(initial);
		expect(typeof mod.providersActions.fetchProviders).toBe('function');
	});
}); 