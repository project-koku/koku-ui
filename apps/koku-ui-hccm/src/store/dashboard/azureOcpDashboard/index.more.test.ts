import * as mod from './index';

describe('azureOcpDashboard wiring', () => {
	test('index exports selector and reducer APIs', () => {
		expect(typeof mod.azureOcpDashboardSelectors.selectWidgets).toBe('function');
		expect(typeof mod.azureOcpDashboardReducer).toBe('function');
	});
}); 