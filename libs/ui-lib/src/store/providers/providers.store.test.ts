import { FetchStatus } from '../common';
import { providersReducer, defaultState } from './providersReducer';
import { stateKey, getFetchId } from './providersCommon';
import {
	fetchProviders,
	fetchProvidersFailure,
	fetchProvidersRequest,
	fetchProvidersSuccess,
} from './providersActions';
import * as selectors from './providersSelectors';

jest.mock('@koku-ui/api/providers', () => {
	const actual = jest.requireActual('@koku-ui/api/providers');
	return { __esModule: true, ...actual, fetchProviders: jest.fn() };
});

import * as api from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';

describe('providers store', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
	});

	afterEach(() => {
		(Date.now as jest.MockedFunction<any>).mockRestore?.();
	});

	const makeRoot = (slice: any) => ({ [stateKey]: slice }) as any;
	const emptySlice = () => ({ byId: new Map(), errors: new Map(), fetchStatus: new Map() });

	test('resetState returns default', () => {
		let state = providersReducer(undefined as any, fetchProvidersRequest({ fetchId: 'x' } as any));
		state = providersReducer(state, (require('store/ui/uiActions') as any).resetState());
		expect(state).toEqual(defaultState);
	});

	test('request/success/failure reducer branches include timeRequested', () => {
		const type = ProviderType.aws;
		const q = 'limit=1';
		const fid = getFetchId(type, q);
		let state = providersReducer(undefined as any, fetchProvidersRequest({ fetchId: fid } as any));
		expect(state.fetchStatus.get(fid)).toBe(FetchStatus.inProgress);
		const payload: any = { data: [], meta: {} };
		state = providersReducer(state, fetchProvidersSuccess(payload, { fetchId: fid } as any));
		const cached = state.byId.get(fid);
		expect(state.fetchStatus.get(fid)).toBe(FetchStatus.complete);
		expect(cached.data).toEqual([]);
		expect(typeof cached.timeRequested).toBe('number');
		expect(state.errors.get(fid)).toBeNull();
		const err = new Error('bad') as any;
		state = providersReducer(state, fetchProvidersFailure(err, { fetchId: fid } as any));
		expect(state.errors.get(fid)).toBe(err);
	});

	test('selectors access slice correctly', () => {
		const type = ProviderType.azure;
		const q = '';
		const fid = getFetchId(type, q);
		let slice: any = emptySlice();
		slice = providersReducer(slice, fetchProvidersRequest({ fetchId: fid } as any));
		expect(selectors.selectProvidersFetchStatus(makeRoot(slice), type, q)).toBe(FetchStatus.inProgress);
		slice = providersReducer(slice, fetchProvidersSuccess({ data: [], meta: {} } as any, { fetchId: fid } as any));
		expect(selectors.selectProviders(makeRoot(slice), type, q)?.data).toEqual([]);
		slice = providersReducer(slice, fetchProvidersFailure({} as any, { fetchId: fid } as any));
		expect(selectors.selectProvidersError(makeRoot(slice), type, q)).toEqual({});
	});

	test('fetchProviders thunk: success dispatches request and success', async () => {
		const type = ProviderType.gcp;
		const q = 'limit=2';
		const res = { data: { data: [{ id: '1' }], meta: {} } } as any;
		(api.fetchProviders as jest.Mock).mockResolvedValue(res);
		const dispatched: any[] = [];
		const getState = () => makeRoot(emptySlice());
		await (fetchProviders(type, q) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('providers/fetch/request');
		expect(dispatched[1].type).toBe('providers/fetch/success');
		expect(dispatched[1].payload).toBe(res.data);
	});

	test('fetchProviders thunk: early return when in progress or error', async () => {
		const type = ProviderType.ocp;
		const q = '';
		const fid = getFetchId(type, q);
		const slice: any = emptySlice();
		slice.fetchStatus.set(fid, FetchStatus.inProgress);
		const dispatched: any[] = [];
		const getState = () => makeRoot(slice);
		await (fetchProviders(type, q) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
		slice.fetchStatus.delete(fid);
		slice.errors.set(fid, new Error('x') as any);
		await (fetchProviders(type, q) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);
	});

	test('fetchProviders thunk: expiration logic skips recent cache, fetches when expired', async () => {
		const type = ProviderType.aws;
		const q = 'a=b';
		const fid = getFetchId(type, q);
		const slice: any = emptySlice();
		// Recent cache should skip
		slice.byId.set(fid, { data: [], meta: {}, timeRequested: 1_000_000 - 1_000 } as any);
		const dispatched: any[] = [];
		let getState = () => makeRoot(slice);
		await (fetchProviders(type, q) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched.length).toBe(0);

		// Expired cache should fetch
		slice.byId.set(fid, { data: [], meta: {}, timeRequested: 1_000_000 - 2_000_000 } as any);
		(api.fetchProviders as jest.Mock).mockResolvedValue({ data: { data: [], meta: {} } } as any);
		dispatched.length = 0;
		getState = () => makeRoot(slice);
		await (fetchProviders(type, q) as any)((a: any) => dispatched.push(a), getState);
		expect(dispatched[0].type).toBe('providers/fetch/request');
		expect(dispatched[1].type).toBe('providers/fetch/success');
	});
}); 