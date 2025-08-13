import * as mod from './index';

describe('accountSettings index wiring', () => {
	test('exports reducer, selectors, actions and stateKey', () => {
		const initial = mod.accountSettingsReducer(undefined as any, { type: '@@INIT' } as any);
		const root: any = { [mod.accountSettingsStateKey]: initial };
		expect(mod.accountSettingsSelectors.selectAccountSettingsState(root)).toBe(initial);
		expect(typeof mod.accountSettingsActions.fetchAccountSettings).toBe('function');
	});
}); 