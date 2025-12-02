import { FetchStatus } from '../common';
import { reducer as rbacReducer, defaultState, stateKey } from './reducer';
import { fetchRbac, fetchRbacFailure, fetchRbacRequest, fetchRbacSuccess } from './actions';
import * as selectors from './selectors';

jest.mock('@koku-ui/i18n/i18n/intl', () => ({ __esModule: true, default: { formatMessage: (m: any) => m?.id || 'msg' } }));

jest.mock('@koku-ui/api/rbac', () => {
	const actual = jest.requireActual('@koku-ui/api/rbac');
	return { __esModule: true, ...actual, getRBAC: jest.fn() };
});

import * as api from '@koku-ui/api/rbac';

describe('rbac store', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const makeRoot = (slice: any) => ({ [stateKey]: slice }) as any;

	test('resetState returns default', () => {
		let state = rbacReducer(undefined as any, fetchRbacRequest());
		state = rbacReducer(state, (require('store/ui/uiActions') as any).resetState());
		expect(state).toEqual(defaultState);
	});

	test('request/success/failure reducer branches', () => {
		let state = rbacReducer(undefined as any, fetchRbacRequest());
		expect(state.status).toBe(FetchStatus.inProgress);
		const payload: any = { isOrgAdmin: true, permissions: [{ permission: 'cost-management:write:*' }] };
		state = rbacReducer(state, fetchRbacSuccess(payload));
		expect(state.status).toBe(FetchStatus.complete);
		expect(state.error).toBeNull();
		expect(state.isOrgAdmin).toBe(true);
		const err = new Error('fail') as any;
		state = rbacReducer(state, fetchRbacFailure(err, { notification: { title: 't' } } as any));
		expect(state.status).toBe(FetchStatus.complete);
		expect(state.error).toBe(err);
		expect(state.notification).toEqual({ title: 't' });
	});

	test('selectors compute permissions', () => {
		const permissions = [
			{ permission: 'cost-management:write:*' },
			{ permission: 'cost-management:cost_model:write' },
			{ permission: 'cost-management:settings:write' },
		];
		const slice: any = { ...defaultState, isOrgAdmin: false, permissions, status: FetchStatus.complete };
		const root = makeRoot(slice);
		expect(selectors.selectRbacStatus(root)).toBe(FetchStatus.complete);
		expect(selectors.selectRbacError(root)).toBeNull();
		expect(selectors.selectRbacNotification(root)).toBeUndefined();
		expect(selectors.isCostModelWritePermission(root)).toBe(true);
		expect(selectors.isSettingsWritePermission(root)).toBe(true);
	});

	test('selectors respect org admin and null permissions', () => {
		const sliceAdmin: any = { ...defaultState, isOrgAdmin: true };
		expect(selectors.isCostModelWritePermission(makeRoot(sliceAdmin))).toBe(true);
		expect(selectors.isSettingsWritePermission(makeRoot(sliceAdmin))).toBe(true);
		const sliceNull: any = { ...defaultState, isOrgAdmin: false, permissions: null };
		expect(selectors.isCostModelWritePermission(makeRoot(sliceNull))).toBe(false);
		expect(selectors.isSettingsWritePermission(makeRoot(sliceNull))).toBe(false);
	});

	test('fetchRbac thunk success and failure notifications', async () => {
		const ok = { isOrgAdmin: false, permissions: [] } as any;
		(api.getRBAC as jest.Mock).mockResolvedValueOnce(ok);
		const dispatched: any[] = [];
		await (fetchRbac() as any)((a: any) => dispatched.push(a));
		expect(dispatched[0].type).toBe('settings/RBAC/request');
		expect(dispatched[1].type).toBe('settings/RBAC/success');

		const err = new Error('nope') as any;
		(api.getRBAC as jest.Mock).mockRejectedValueOnce(err);
		dispatched.length = 0;
		await (fetchRbac() as any)((a: any) => dispatched.push(a));
		expect(dispatched[0].type).toBe('settings/RBAC/request');
		expect(dispatched[1].type).toBe('settings/RBAC/failure');
		expect(dispatched[1].meta.notification.title).toBe('rbacErrorTitle');
		expect(dispatched[1].meta.notification.description).toBe('rbacErrorDesc');
	});
}); 