import { FetchStatus } from '../common';
import { accountSettingsReducer, defaultState } from './accountSettingsReducer';
import { accountSettingsStateKey, getFetchId } from './accountSettingsCommon';
import {
	fetchAccountSettings,
	fetchAccountSettingsFailure,
	fetchAccountSettingsRequest,
	fetchAccountSettingsSuccess,
	updateAccountSettings,
	updateAccountSettingsFailure,
	updateAccountSettingsRequest,
	updateAccountSettingsSuccess,
} from './accountSettingsActions';
import * as selectors from './accountSettingsSelectors';
import { AccountSettingsType } from '@koku-ui/api/accountSettings';

jest.mock('utils/sessionStorage', () => ({
	__esModule: true,
	isCostTypeAvailable: jest.fn(() => false),
	isCurrencyAvailable: jest.fn(() => false),
	setAccountCostType: jest.fn(),
	setAccountCurrency: jest.fn(),
	setCostType: jest.fn(),
	setCurrency: jest.fn(),
}));

jest.mock('@koku-ui/i18n/i18n/intl', () => ({ __esModule: true, default: { formatMessage: (m: any) => m?.id || 'msg' } }));

jest.mock('@koku-ui/api/accountSettings', () => {
	const actual = jest.requireActual('@koku-ui/api/accountSettings');
	return { __esModule: true, ...actual, fetchAccountSettings: jest.fn(), updateAccountSettings: jest.fn() };
});

import * as api from '@koku-ui/api/accountSettings';

describe('accountSettings store', () => {
	beforeEach(() => jest.clearAllMocks());

	const makeRoot = (slice: any) => ({ [accountSettingsStateKey]: slice }) as any;
	const emptySlice = () => ({ byId: new Map(), errors: new Map(), notification: new Map(), status: new Map() });

	test('resetState returns default state', () => {
		let state = accountSettingsReducer(undefined as any, fetchAccountSettingsRequest({ fetchId: 'x' } as any));
		state = accountSettingsReducer(state, (require('store/ui/uiActions') as any).resetState());
		expect(state).toEqual(defaultState);
	});

	test('request/success/failure reducer branches call init setters and update maps', () => {
		const type = AccountSettingsType.settings;
		const fid = getFetchId(type);
		let state = accountSettingsReducer(undefined as any, fetchAccountSettingsRequest({ fetchId: fid } as any));
		expect(state.status?.get(fid)).toBe(FetchStatus.inProgress);
		const payload: any = { data: { cost_type: 'unblended', currency: 'USD' }, meta: {} };
		state = accountSettingsReducer(state, fetchAccountSettingsSuccess(payload, { fetchId: fid } as any));
		expect(state.status?.get(fid)).toBe(FetchStatus.complete);
		expect(state.byId.get(fid)).toEqual(payload);
		expect(state.errors?.get(fid)).toBeNull();
		const err = new Error('oops') as any;
		state = accountSettingsReducer(state, fetchAccountSettingsFailure(err, { fetchId: fid } as any));
		expect(state.errors?.get(fid)).toBe(err);
	});

	test('update success/failure update status and notification', () => {
		const type = AccountSettingsType.currency;
		const fid = getFetchId(type);
		let state: any = emptySlice();
		state = accountSettingsReducer(state, updateAccountSettingsRequest({ fetchId: fid } as any));
		expect(selectors.selectAccountSettingsUpdateStatus(makeRoot(state), type)).toBe(FetchStatus.inProgress);
		state = accountSettingsReducer(state, updateAccountSettingsSuccess({} as any, { fetchId: fid, notification: { t: 1 } } as any));
		expect(selectors.selectAccountSettingsUpdateStatus(makeRoot(state), type)).toBe(FetchStatus.complete);
		expect(selectors.selectAccountSettingsUpdateNotification(makeRoot(state), type)).toEqual({ t: 1 });
		state = accountSettingsReducer(state, updateAccountSettingsFailure({} as any, { fetchId: fid, notification: { e: 1 } } as any));
		expect(selectors.selectAccountSettingsUpdateError(makeRoot(state), type)).toEqual({});
	});

	test('selectors fetch and update selectors work', () => {
		const type = AccountSettingsType.costType;
		const fid = getFetchId(type);
		let state: any = emptySlice();
		state = accountSettingsReducer(state, fetchAccountSettingsRequest({ fetchId: fid } as any));
		expect(selectors.selectAccountSettingsStatus(makeRoot(state), type)).toBe(FetchStatus.inProgress);
		const payload: any = { data: { cost_type: 'amortized' }, meta: {} };
		state = accountSettingsReducer(state, fetchAccountSettingsSuccess(payload, { fetchId: fid } as any));
		expect(selectors.selectAccountSettings(makeRoot(state), type)).toEqual(payload);
		state = accountSettingsReducer(state, fetchAccountSettingsFailure({} as any, { fetchId: fid } as any));
		expect(selectors.selectAccountSettingsError(makeRoot(state), type)).toEqual({});
	});

	test('fetchAccountSettings thunk: success and early return when in progress or error', async () => {
		const type = AccountSettingsType.settings;
		const fid = getFetchId(type);
		const res = { data: { data: { cost_type: 'unblended', currency: 'USD' }, meta: {} } } as any;
		(api.fetchAccountSettings as jest.Mock).mockResolvedValue(res);
		const dispatched: any[] = [];
		let getState = () => makeRoot(emptySlice());
		await (fetchAccountSettings(type) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('settings/fetch/request');
		expect(dispatched[1].type).toBe('settings/fetch/success');
		expect(dispatched[1].payload).toBe(res.data);
		// in-progress early return
		const inProgress = emptySlice();
		inProgress.status.set(fid, FetchStatus.inProgress);
		dispatched.length = 0;
		getState = () => makeRoot(inProgress);
		await (fetchAccountSettings(type) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
		// error early return
		const withError = emptySlice();
		withError.errors.set(fid, new Error('x') as any);
		dispatched.length = 0;
		getState = () => makeRoot(withError);
		await (fetchAccountSettings(type) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	test('updateAccountSettings thunk: success and failure notifications', async () => {
		const type = AccountSettingsType.settings;
		const payload = { currency: 'USD', cost_type: 'unblended' } as any;
		(api.updateAccountSettings as jest.Mock).mockResolvedValueOnce({} as any);
		const dispatched: any[] = [];
		await (updateAccountSettings(type, payload) as any)((a: any) => dispatched.push(a), () => makeRoot(emptySlice()));
		expect(dispatched[0].type).toBe('settings/awsCategoryKeys/update/request');
		expect(dispatched[1].type).toBe('settings/update/success');
		expect(dispatched[1].meta.notification.title).toBe('settingsSuccessTitle');
		expect(dispatched[1].meta.notification.description).toBe('settingsSuccessDesc');

		(api.updateAccountSettings as jest.Mock).mockRejectedValueOnce(new Error('fail'));
		dispatched.length = 0;
		await (updateAccountSettings(type, payload) as any)((a: any) => dispatched.push(a), () => makeRoot(emptySlice()));
		expect(dispatched[0].type).toBe('settings/awsCategoryKeys/update/request');
		expect(dispatched[1].type).toBe('settings/update/failure');
		expect(dispatched[1].meta.notification.title).toBe('settingsErrorTitle');
		expect(dispatched[1].meta.notification.description).toBe('settingsErrorDesc');
	});
}); 