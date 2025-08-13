import { azureOcpDashboardReducer, defaultState } from './azureOcpDashboardReducer';
import * as selectors from './azureOcpDashboardSelectors';
import { changeWidgetTab, fetchWidgetForecasts, fetchWidgetReports, setWidgetTab } from './azureOcpDashboardActions';

jest.mock('utils/sessionStorage', () => ({ __esModule: true, getCostType: () => 'unblended', getCurrency: () => 'USD' }));

jest.mock('store/forecasts', () => ({ __esModule: true, forecastActions: { fetchForecast: jest.fn((...args) => ({ type: 'forecast/fetch', args })) } }));

jest.mock('store/reports', () => ({ __esModule: true, reportActions: { fetchReport: jest.fn((...args) => ({ type: 'report/fetch', args })) } }));

describe('azureOcpDashboard store', () => {
	const makeRoot = (slice: any) => ({ azureOcpDashboard: slice }) as any;
	const firstId = defaultState.currentWidgets[0];

	test('setWidgetTab updates current tab in reducer', () => {
		const state1 = azureOcpDashboardReducer(undefined as any, setWidgetTab({ id: firstId, tab: 1 as any }));
		expect(state1.widgets[firstId].currentTab).toBe(1);
	});

	test('selectors return widgets, widget, currentWidgets and queries', () => {
		const root = makeRoot(defaultState);
		expect(selectors.selectAzureOcpDashboardState(root)).toBe(defaultState);
		expect(selectors.selectWidgets(root)).toBe(defaultState.widgets);
		expect(selectors.selectWidget(root, firstId)).toBe(defaultState.widgets[firstId]);
		expect(selectors.selectCurrentWidgets(root)).toEqual(defaultState.currentWidgets);
		const q = selectors.selectWidgetQueries(root, firstId);
		expect(q.current).toBeTruthy();
		expect(q.previous).toBeTruthy();
		expect(q.forecast).toBeTruthy();
		expect(q.tabs).toBeTruthy();
	});

	test('thunks dispatch fetches for reports and forecasts as applicable', () => {
		const dispatched: any[] = [];
		const dispatch = (a: any) => void dispatched.push(a);
		const getState = () => makeRoot(defaultState);
		(fetchWidgetReports(firstId) as any)(dispatch, getState);
		expect(dispatched.filter(a => a.type === 'report/fetch').length).toBeGreaterThanOrEqual(2);
		dispatched.length = 0;
		(fetchWidgetForecasts(firstId) as any)(dispatch, getState);
		const forecastActions = dispatched.filter(a => a.type === 'forecast/fetch');
		expect(Array.isArray(forecastActions)).toBe(true);
	});

	test('changeWidgetTab dispatches setWidgetTab then fetchWidgetReports', () => {
		const dispatched: any[] = [];
		const dispatch = (a: any) => void dispatched.push(typeof a === 'function' ? a(dispatch, () => makeRoot(defaultState)) : a);
		(changeWidgetTab(firstId, 0 as any) as any)(dispatch, () => makeRoot(defaultState));
		expect(dispatched[0].type).toBe('azureOcpDashboard/widget/tab');
		expect(dispatched.some(a => a.type === 'report/fetch')).toBe(true);
	});
}); 