import * as mod from './index';

jest.mock('../../../init', () => ({
  getUserIdentity: () => Promise.resolve(undefined),
}));

describe('azureOcpDashboard wiring', () => {
	test('index exports selector and reducer APIs', () => {
		expect(typeof mod.azureOcpDashboardSelectors.selectWidgets).toBe('function');
		expect(typeof mod.azureOcpDashboardReducer).toBe('function');
	});
}); 