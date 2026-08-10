import * as mod from './index';

describe('azureOcpDashboard wiring', () => {
  test('exports reducer, selectors, actions, stateKey, and tab enum', () => {
    expect(mod.azureOcpDashboardStateKey).toBe('azureOcpDashboard');
    expect(mod.AzureOcpDashboardTab.service_names).toBe('service_names');

    const initial = mod.azureOcpDashboardReducer(undefined as any, { type: '@@INIT' } as any);
    expect(initial.widgets).toBeTruthy();
    expect(initial.currentWidgets.length).toBeGreaterThan(0);

    const root: any = { [mod.azureOcpDashboardStateKey]: initial };
    expect(mod.azureOcpDashboardSelectors.selectAzureOcpDashboardState(root)).toBe(initial);
    expect(typeof mod.azureOcpDashboardSelectors.selectWidgets).toBe('function');
    expect(typeof mod.azureOcpDashboardActions.fetchWidgetReports).toBe('function');
  });
});
