import * as mod from './index';

jest.mock('../../../init', () => ({
  getUserIdentity: () => Promise.resolve(undefined),
}));

describe('awsOcpDashboard wiring', () => {
	test('index exports selectors namespace and reducer', () => {
		expect(typeof mod.awsOcpDashboardSelectors).toBe('object');
		expect(typeof mod.awsOcpDashboardReducer).toBe('function');
	});
}); 