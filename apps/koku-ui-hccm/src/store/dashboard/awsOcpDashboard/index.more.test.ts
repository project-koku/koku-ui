import * as mod from './index';

describe('awsOcpDashboard wiring', () => {
	test('exports reducer, selectors, actions, stateKey, and tab enum', () => {
		expect(mod.awsOcpDashboardStateKey).toBe('awsOcpDashboard');
		expect(mod.AwsOcpDashboardTab.services).toBe('services');

		const initial = mod.awsOcpDashboardReducer(undefined as any, { type: '@@INIT' } as any);
		expect(initial.widgets).toBeTruthy();
		expect(initial.currentWidgets.length).toBeGreaterThan(0);

		const root: any = { [mod.awsOcpDashboardStateKey]: initial };
		expect(mod.awsOcpDashboardSelectors.selectAwsOcpDashboardState(root)).toBe(initial);
		expect(typeof mod.awsOcpDashboardSelectors.selectWidgets).toBe('function');
		expect(typeof mod.awsOcpDashboardActions.fetchWidgetReports).toBe('function');
	});
});
