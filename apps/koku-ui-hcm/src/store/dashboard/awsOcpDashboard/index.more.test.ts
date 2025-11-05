import * as mod from './index';

describe('awsOcpDashboard wiring', () => {
	test('index exports selectors namespace and reducer', () => {
		expect(typeof mod.awsOcpDashboardSelectors).toBe('object');
		expect(typeof mod.awsOcpDashboardReducer).toBe('function');
	});
}); 