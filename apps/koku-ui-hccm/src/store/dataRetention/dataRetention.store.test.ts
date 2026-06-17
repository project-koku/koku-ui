import { DataRetentionType } from 'api/dataRetention';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';

import {
  fetchDataRetention,
  fetchDataRetentionFailure,
  fetchDataRetentionRequest,
  fetchDataRetentionSuccess,
  resetNotifications,
  resetStatus,
  updateDataRetention,
  updateDataRetentionFailure,
  updateDataRetentionRequest,
  updateDataRetentionSuccess,
} from './dataRetentionActions';
import { dataRetentionStateKey, getFetchId } from './dataRetentionCommon';
import { dataRetentionReducer } from './dataRetentionReducer';
import * as selectors from './dataRetentionSelectors';

jest.mock('components/i18n', () => ({ __esModule: true, intl: { formatMessage: (m: any) => m?.id || 'msg' } }));

jest.mock('api/dataRetention', () => {
  const actual = jest.requireActual('api/dataRetention');
  return { __esModule: true, ...actual, fetchDataRetention: jest.fn(), updateDataRetention: jest.fn() };
});

import * as api from 'api/dataRetention';

describe('dataRetention store', () => {
  beforeEach(() => jest.clearAllMocks());

  const makeRoot = (slice: any) => ({ [dataRetentionStateKey]: slice }) as any;

  const emptySlice = () => ({
    byId: new Map(),
    errors: new Map(),
    notification: new Map(),
    status: new Map(),
  });

  test('resetState returns initial slice shape', () => {
    let state = dataRetentionReducer(undefined as any, fetchDataRetentionRequest({ fetchId: 'x' } as any));
    state = dataRetentionReducer(state, resetState());
    expect(state.byId.size).toBe(0);
    expect(state.errors.size).toBe(0);
    expect(state.notification?.size).toBe(0);
    expect(state.status.size).toBe(0);
  });

  test('resetNotifications and resetStatus clear maps', () => {
    let state: any = emptySlice();
    state.notification.set('x', { title: 't' });
    state.status.set('x', FetchStatus.complete);
    state = dataRetentionReducer(state, resetNotifications());
    expect(state.notification?.size).toBe(0);
    state = dataRetentionReducer(state, resetStatus());
    expect(state.status.size).toBe(0);
  });

  test('fetch request, success, and failure update maps', () => {
    const type = DataRetentionType.dataRetention;
    const qs = 'limit=10';
    const fid = getFetchId(type, qs);
    let state = dataRetentionReducer(undefined as any, fetchDataRetentionRequest({ fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.inProgress);
    const payload: any = { data: [], meta: { count: 0, limit: 10, offset: 0 } };
    state = dataRetentionReducer(state, fetchDataRetentionSuccess(payload, { fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.complete);
    expect(state.byId.get(fid)?.data).toEqual(payload.data);
    expect(state.errors.get(fid)).toBeNull();
    const err = new Error('oops') as any;
    state = dataRetentionReducer(state, fetchDataRetentionFailure(err, { fetchId: fid } as any));
    expect(state.status.get(fid)).toBe(FetchStatus.complete);
    expect(state.errors.get(fid)).toBe(err);
  });

  test('update request, success, and failure', () => {
    const type = DataRetentionType.dataRetentionUpdate;
    const fid = getFetchId(type);
    let state: any = emptySlice();
    state = dataRetentionReducer(state, updateDataRetentionRequest({ fetchId: fid } as any));
    expect(selectors.selectDataRetentionFetchStatus(makeRoot(state), type, '')).toBe(FetchStatus.inProgress);
    state = dataRetentionReducer(
      state,
      updateDataRetentionSuccess({} as any, { fetchId: fid, notification: { t: 1 } } as any)
    );
    expect(selectors.selectDataRetentionFetchStatus(makeRoot(state), type, '')).toBe(FetchStatus.complete);
    expect(selectors.selectDataRetentionNotification(makeRoot(state), type, '')).toEqual({ t: 1 });
    state = dataRetentionReducer(
      state,
      updateDataRetentionFailure({} as any, { fetchId: fid, notification: { e: 1 } } as any)
    );
    expect(selectors.selectDataRetentionError(makeRoot(state), type, '')).toEqual({});
    expect(selectors.selectDataRetentionNotification(makeRoot(state), type, '')).toEqual({ e: 1 });
  });

  test('selectors for fetch slice', () => {
    const type = DataRetentionType.dataRetention;
    const qs = '';
    const fid = getFetchId(type, qs);
    let state: any = emptySlice();
    state = dataRetentionReducer(state, fetchDataRetentionRequest({ fetchId: fid } as any));
    expect(selectors.selectDataRetentionFetchStatus(makeRoot(state), type, qs)).toBe(FetchStatus.inProgress);
    const payload: any = { data: [{ name: 'retention' }], meta: { count: 1 } };
    state = dataRetentionReducer(state, fetchDataRetentionSuccess(payload, { fetchId: fid } as any));
    expect(selectors.selectDataRetention(makeRoot(state), type, qs)).toMatchObject({
      data: payload.data,
      meta: payload.meta,
    });
    state = dataRetentionReducer(state, fetchDataRetentionFailure({} as any, { fetchId: fid } as any));
    expect(selectors.selectDataRetentionError(makeRoot(state), type, qs)).toEqual({});
  });

  test('fetchDataRetention thunk dispatches success and skips when in progress or on error', async () => {
    const type = DataRetentionType.dataRetention;
    const qs = 'limit=5';
    const fid = getFetchId(type, qs);
    const res = { data: { data: [], meta: { count: 0 } } } as any;
    (api.fetchDataRetention as jest.Mock).mockResolvedValue(res);
    const dispatched: any[] = [];
    let getState = () => makeRoot(emptySlice());
    await (fetchDataRetention(type, undefined, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[0].type).toBe('dataRetention/request');
    expect(dispatched[1].type).toBe('dataRetention/success');
    expect(dispatched[1].payload).toBe(res.data);

    const inProgress = emptySlice();
    inProgress.status.set(fid, FetchStatus.inProgress);
    dispatched.length = 0;
    getState = () => makeRoot(inProgress);
    await (fetchDataRetention(type, undefined, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched.length).toBe(0);

    const withError = emptySlice();
    withError.errors.set(fid, new Error('x') as any);
    dispatched.length = 0;
    getState = () => makeRoot(withError);
    await (fetchDataRetention(type, undefined, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched.length).toBe(0);

    (api.fetchDataRetention as jest.Mock).mockRejectedValueOnce(new Error('network'));
    dispatched.length = 0;
    getState = () => makeRoot(emptySlice());
    await (fetchDataRetention(type, undefined, qs) as any)((a: any) => dispatched.push(a), getState);
    expect(dispatched[1].type).toBe('dataRetention/failure');
  });

  test('updateDataRetention thunk: success, failure, and in-progress guard', async () => {
    const dispatched: any[] = [];
    const getState = () => makeRoot(emptySlice());

    (api.updateDataRetention as jest.Mock).mockResolvedValueOnce({} as any);
    await (updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', { name: 'test' }) as any)(
      (a: any) => dispatched.push(a),
      getState
    );
    expect(dispatched[0].type).toBe('dataRetention/update/request');
    expect(dispatched[1].type).toBe('dataRetention/update/success');
    expect(dispatched[1].meta.notification.title).toBe('dataRetentionSuccess');

    dispatched.length = 0;
    (api.updateDataRetention as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await (updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', { name: 'test' }) as any)(
      (a: any) => dispatched.push(a),
      getState
    );
    expect(dispatched[1].type).toBe('dataRetention/update/failure');
    expect(dispatched[1].meta.notification.title).toBe('dataRetentionErrorTitle');

    const inProgress = emptySlice();
    inProgress.status.set(getFetchId(DataRetentionType.dataRetentionUpdate), FetchStatus.inProgress);
    dispatched.length = 0;
    await (updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', { name: 'test' }) as any)(
      (a: any) => dispatched.push(a),
      () => makeRoot(inProgress)
    );
    expect(dispatched.length).toBe(0);
  });
});
