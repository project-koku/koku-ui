import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';

import { getFetchId, priceListStateKey } from './priceListCommon';
import {
  fetchPriceList,
  fetchPriceListFailure,
  fetchPriceListRequest,
  fetchPriceListSuccess,
  updatePriceList,
  updatePriceListFailure,
  updatePriceListRequest,
  updatePriceListSuccess,
} from './priceListActions';
import { priceListReducer } from './priceListReducer';
import * as selectors from './priceListSelectors';
jest.mock('components/i18n', () => ({ __esModule: true, intl: { formatMessage: (m: any) => m?.id || 'msg' } }));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, fetchPriceList: jest.fn(), updatePriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('priceList store', () => {
  beforeEach(() => jest.clearAllMocks());

  const makeRoot = (slice: any) => ({ [priceListStateKey]: slice }) as any;

  const emptySlice = () => ({
    byId: new Map(),
    errors: new Map(),
    notification: new Map(),
    status: new Map(),
  });

  test('resetState returns initial slice shape', () => {
    let state = priceListReducer(undefined as any, fetchPriceListRequest({ fetchId: 'x' } as any));
    state = priceListReducer(state, resetState());
    expect(state.byId.size).toBe(0);
    expect(state.errors.size).toBe(0);
    expect(state.notification?.size).toBe(0);
    expect(state.status.size).toBe(0);
  });

  test('fetch request, success, and failure update maps', () => {
    const type = PriceListType.priceList;
    const qs = 'limit=10';
    const fid = getFetchId(type, qs);
    let state = priceListReducer(undefined as any, fetchPriceListRequest({ fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.inProgress);
    const payload: any = { data: [], meta: { count: 0, limit: 10, offset: 0 } };
    state = priceListReducer(state, fetchPriceListSuccess(payload, { fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.complete);
    expect(state.byId.get(fid)?.data).toEqual(payload.data);
    expect(state.errors.get(fid)).toBeNull();
    const err = new Error('oops') as any;
    state = priceListReducer(state, fetchPriceListFailure(err, { fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.complete);
    expect(state.errors.get(fid)).toBe(err);
  });

  test('update request, success, and failure', () => {
    const type = PriceListType.priceListAdd;
    const fid = getFetchId(type);
    let state: any = emptySlice();
    state = priceListReducer(state, updatePriceListRequest({ fetchId: fid } as any));
    expect(selectors.selectPriceListUpdateStatus(makeRoot(state), type)).toBe(FetchStatus.inProgress);
    state = priceListReducer(
      state,
      updatePriceListSuccess({} as any, { fetchId: fid, notification: { t: 1 } } as any)
    );
    expect(selectors.selectPriceListUpdateStatus(makeRoot(state), type)).toBe(FetchStatus.complete);
    expect(selectors.selectPriceListUpdateNotification(makeRoot(state), type)).toEqual({ t: 1 });
    state = priceListReducer(state, updatePriceListFailure({} as any, { fetchId: fid, notification: { e: 1 } } as any));
    expect(selectors.selectPriceListUpdateError(makeRoot(state), type)).toEqual({});
    expect(selectors.selectPriceListUpdateNotification(makeRoot(state), type)).toEqual({ e: 1 });
  });

  test('selectors for fetch slice', () => {
    const type = PriceListType.priceList;
    const qs = '';
    const fid = getFetchId(type, qs);
    let state: any = emptySlice();
    state = priceListReducer(state, fetchPriceListRequest({ fetchId: fid } as any));
    expect(selectors.selectPriceListStatus(makeRoot(state), type, qs)).toBe(FetchStatus.inProgress);
    const payload: any = { data: [{ name: 'pl' }], meta: { count: 1 } };
    state = priceListReducer(state, fetchPriceListSuccess(payload, { fetchId: fid } as any));
    expect(selectors.selectPriceList(makeRoot(state), type, qs)).toMatchObject({
      data: payload.data,
      meta: payload.meta,
    });
    state = priceListReducer(state, fetchPriceListFailure({} as any, { fetchId: fid } as any));
    expect(selectors.selectPriceListError(makeRoot(state), type, qs)).toEqual({});
  });

  test('fetchPriceList thunk dispatches success and skips when in progress, on error, or after failure', async () => {
    const type = PriceListType.priceList;
    const qs = 'limit=5';
    const fid = getFetchId(type, qs);
    const res = { data: { data: [], meta: { count: 0 } } } as any;
    (api.fetchPriceList as jest.Mock).mockResolvedValue(res);
    const dispatched: any[] = [];
    let getState = () => makeRoot(emptySlice());
    await (fetchPriceList(type, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[0].type).toBe('priceList/request');
    expect(dispatched[1].type).toBe('priceList/success');
    expect(dispatched[1].payload).toBe(res.data);

    const inProgress = emptySlice();
    inProgress.status.set(fid, FetchStatus.inProgress);
    dispatched.length = 0;
    getState = () => makeRoot(inProgress);
    await (fetchPriceList(type, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched.length).toBe(0);

    const withError = emptySlice();
    withError.errors.set(fid, new Error('x') as any);
    dispatched.length = 0;
    getState = () => makeRoot(withError);
    await (fetchPriceList(type, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched.length).toBe(0);

    (api.fetchPriceList as jest.Mock).mockRejectedValueOnce(new Error('network'));
    dispatched.length = 0;
    getState = () => makeRoot(emptySlice());
    await (fetchPriceList(type, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[1].type).toBe('priceList/failure');
  });

  test('updatePriceList thunk: success, failure for remove vs add, and in-progress guard', async () => {
    const dispatched: any[] = [];
    const getState = () => makeRoot(emptySlice());

    (api.updatePriceList as jest.Mock).mockResolvedValueOnce({} as any);
    await (updatePriceList(PriceListType.priceListRemove, '?uuid=1') as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[0].type).toBe('priceList/update/request');
    expect(dispatched[1].type).toBe('priceList/update/success');
    expect(dispatched[1].meta.notification.variant).toBe('success');

    dispatched.length = 0;
    (api.updatePriceList as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await (updatePriceList(PriceListType.priceListRemove, '?uuid=1') as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[1].type).toBe('priceList/update/failure');
    expect(dispatched[1].meta.notification.title).toBe('priceListRemoveErrorTitle');

    dispatched.length = 0;
    (api.updatePriceList as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await (updatePriceList(PriceListType.priceListAdd) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[1].meta.notification.title).toBe('priceListAddErrorTitle');

    const inProgress = emptySlice();
    inProgress.status.set(getFetchId(PriceListType.priceListUpdate), FetchStatus.inProgress);
    dispatched.length = 0;
    await (updatePriceList(PriceListType.priceListUpdate, '?uuid=1', { enabled: false }) as any)(
      (a: any) => dispatched.push(a),
      () => makeRoot(inProgress)
    );
    expect(dispatched.length).toBe(0);
  });
});
