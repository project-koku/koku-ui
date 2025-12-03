import { FetchStatus } from '../common';
import { userAccessReducer, defaultState } from './userAccessReducer';
import { stateKey, getFetchId } from './userAccessCommon';
import {
	fetchUserAccess,
	fetchUserAccessFailure,
	fetchUserAccessRequest,
	fetchUserAccessSuccess,
} from './userAccessActions';
import * as selectors from './userAccessSelectors';

jest.mock('@koku-ui/api/userAccess', () => {
	const actual = jest.requireActual('@koku-ui/api/userAccess');
	return { __esModule: true, ...actual, fetchUserAccess: jest.fn() };
});

import * as api from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';

describe('userAccess store', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const makeRoot = (slice: any) => ({ [stateKey]: slice }) as any;
	const emptySlice = () => ({ byId: new Map(), errors: new Map(), fetchStatus: new Map() });

	test('resetState returns default state', () => {
		let state = userAccessReducer(undefined as any, fetchUserAccessRequest({ fetchId: 'x' } as any));
		state = userAccessReducer(state, (require('store/ui/uiActions') as any).resetState());
		expect(state).toEqual(defaultState);
	});

	test('request/success/failure reducer branches', () => {
		const fid = getFetchId(UserAccessType.aws as any, 'q=1');
		let state = userAccessReducer(undefined as any, fetchUserAccessRequest({ fetchId: fid } as any));
		expect(state.fetchStatus.get(fid)).toBe(FetchStatus.inProgress);
		const payload: any = { data: [{ access: true, type: 'aws', write: false }], meta: {} };
		state = userAccessReducer(state, fetchUserAccessSuccess(payload, { fetchId: fid } as any));
		expect(state.fetchStatus.get(fid)).toBe(FetchStatus.complete);
		expect(state.byId.get(fid)).toEqual(payload);
		expect(state.errors.get(fid)).toBeNull();
		const err = new Error('oops') as any;
		state = userAccessReducer(state, fetchUserAccessFailure(err, { fetchId: fid } as any));
		expect(state.errors.get(fid)).toBe(err);
	});

	test('selectors read state', () => {
		const type = UserAccessType.aws;
		const query = '';
		const fid = getFetchId(type, query);
		let slice: any = emptySlice();
		slice = userAccessReducer(slice, fetchUserAccessRequest({ fetchId: fid } as any));
		expect(selectors.selectUserAccessFetchStatus(makeRoot(slice), type, query)).toBe(FetchStatus.inProgress);
		const payload: any = { data: [{ access: true }], meta: {} };
		slice = userAccessReducer(slice, fetchUserAccessSuccess(payload, { fetchId: fid } as any));
		expect(selectors.selectUserAccess(makeRoot(slice), type, query)).toEqual(payload);
		slice = userAccessReducer(slice, fetchUserAccessFailure({} as any, { fetchId: fid } as any));
		expect(selectors.selectUserAccessError(makeRoot(slice), type, query)).toEqual({});
	});

	test('fetchUserAccess thunk: success dispatches request and success', async () => {
		const type = UserAccessType.aws;
		const query = 'type=aws';
		const res = { data: { data: [{ access: true, type: 'aws', write: false }], meta: {} } } as any;
		(api.fetchUserAccess as jest.Mock).mockResolvedValue(res);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (fetchUserAccess(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('userAccess/fetch/request');
		expect(dispatched[1].type).toBe('userAccess/fetch/success');
		expect(dispatched[1].payload).toBe(res.data);
	});

	test('fetchUserAccess thunk: does not dispatch when in progress or has error', async () => {
		const type = UserAccessType.aws;
		const query = '';
		const fid = getFetchId(type, query);
		const slice: any = emptySlice();
		slice.fetchStatus.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (fetchUserAccess(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);

		slice.fetchStatus.delete(fid);
		slice.errors.set(fid, new Error('x') as any);
		await (fetchUserAccess(type, query) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});
}); 