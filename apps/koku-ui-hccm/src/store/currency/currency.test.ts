import { CurrencyType } from 'api/currency';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';

jest.mock('api/currency', () => {
  const actual = jest.requireActual('api/currency');
  return {
    __esModule: true,
    ...actual,
    fetchCurrency: jest.fn(),
  };
});

import * as api from 'api/currency';

import { getFetchId } from './currencyCommon';
import { defaultState } from './currencyReducer';
import { currencyActions, currencyReducer, currencySelectors, currencyStateKey } from './index';

describe('currency store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeRoot = (slice: any) => ({ [currencyStateKey]: slice }) as any;
  const emptySlice = () => ({ byId: new Map(), errors: new Map(), notification: new Map(), status: new Map() });

  test('getFetchId includes the currency type and query', () => {
    expect(getFetchId(CurrencyType.currency)).toBe('currency--');
    expect(getFetchId(CurrencyType.currency, 'limit=1000')).toBe('currency--limit=1000');
  });

  test('resetState returns the default state', () => {
    let state = currencyReducer(undefined, currencyActions.fetchCurrencyRequest({ fetchId: 'x' }));
    state = currencyReducer(state, resetState());
    expect(state).toEqual(defaultState);
  });

  test('resetStatus clears only the given fetch id', () => {
    const keptId = getFetchId(CurrencyType.currency, 'kept');
    const clearedId = getFetchId(CurrencyType.currency, 'cleared');
    let state = currencyReducer(undefined, currencyActions.fetchCurrencyRequest({ fetchId: keptId }));
    state = currencyReducer(state, currencyActions.fetchCurrencyRequest({ fetchId: clearedId }));

    state = currencyReducer(state, currencyActions.resetStatus({ fetchId: clearedId }));

    expect(state.status?.get(clearedId)).toBeUndefined();
    expect(state.status?.get(keptId)).toBe(FetchStatus.inProgress);
  });

  test('request, success, and failure update status, data, and errors', () => {
    const fetchId = getFetchId(CurrencyType.currency, 'limit=1');
    let state = currencyReducer(undefined, currencyActions.fetchCurrencyRequest({ fetchId }));
    expect(state.status?.get(fetchId)).toBe(FetchStatus.inProgress);

    const payload = { data: [{ code: 'USD' }], meta: { count: 1 } } as any;
    state = currencyReducer(state, currencyActions.fetchCurrencySuccess(payload, { fetchId }));
    expect(state.status?.get(fetchId)).toBe(FetchStatus.complete);
    expect(state.byId.get(fetchId)).toEqual(payload);
    expect(state.errors?.get(fetchId)).toBeNull();

    const error = new Error('boom') as any;
    state = currencyReducer(state, currencyActions.fetchCurrencyFailure(error, { fetchId }));
    expect(state.status?.get(fetchId)).toBe(FetchStatus.complete);
    expect(state.errors?.get(fetchId)).toBe(error);
  });

  test('unknown actions leave state unchanged', () => {
    expect(currencyReducer(defaultState, { type: 'currency/unknown' } as any)).toBe(defaultState);
  });

  test('selectors read currency, error, and fetch status', () => {
    const query = 'limit=1';
    const fetchId = getFetchId(CurrencyType.currency, query);
    const payload = { data: [{ code: 'EUR' }], meta: { count: 1 } } as any;
    let slice = currencyReducer(emptySlice(), currencyActions.fetchCurrencySuccess(payload, { fetchId }));

    expect(currencySelectors.selectCurrency(makeRoot(slice), CurrencyType.currency, query)).toEqual(payload);
    expect(currencySelectors.selectCurrencyError(makeRoot(slice), CurrencyType.currency, query)).toBeNull();
    expect(currencySelectors.selectCurrencyFetchStatus(makeRoot(slice), CurrencyType.currency, query)).toBe(
      FetchStatus.complete
    );

    const error = new Error('fail') as any;
    slice = currencyReducer(slice, currencyActions.fetchCurrencyFailure(error, { fetchId }));
    expect(currencySelectors.selectCurrencyError(makeRoot(slice), CurrencyType.currency, query)).toBe(error);
    expect(
      currencySelectors.selectCurrencyFetchStatus(makeRoot(undefined), CurrencyType.currency, query)
    ).toBeUndefined();
    expect(currencySelectors.selectCurrencyError(makeRoot(undefined), CurrencyType.currency, query)).toBeUndefined();
  });

  test('fetchCurrency thunk dispatches request and success', async () => {
    const query = 'limit=1';
    const response = { data: { data: [], meta: { count: 0 } } } as any;
    (api.fetchCurrency as jest.Mock).mockResolvedValue(response);

    const dispatched: any[] = [];
    await (currencyActions.fetchCurrency(CurrencyType.currency, query) as any)(
      (action: any) => dispatched.push(action),
      () => makeRoot(emptySlice())
    );

    expect(api.fetchCurrency).toHaveBeenCalledWith(CurrencyType.currency, query);
    expect(dispatched[0].type).toBe('currency/fetch/request');
    expect(dispatched[1].type).toBe('currency/fetch/success');
    expect(dispatched[1].payload).toBe(response.data);
    expect(dispatched[1].meta.fetchId).toBe(getFetchId(CurrencyType.currency, query));
  });

  test('fetchCurrency thunk dispatches failure when the request rejects', async () => {
    const error = new Error('nope');
    (api.fetchCurrency as jest.Mock).mockRejectedValue(error);

    const dispatched: any[] = [];
    await (currencyActions.fetchCurrency(CurrencyType.currency, '') as any)(
      (action: any) => dispatched.push(action),
      () => makeRoot(emptySlice())
    );

    expect(dispatched[0].type).toBe('currency/fetch/request');
    expect(dispatched[1].type).toBe('currency/fetch/failure');
    expect(dispatched[1].payload).toBe(error);
  });

  test('fetchCurrency thunk does not dispatch while a request is in progress', async () => {
    const query = '';
    const slice = emptySlice();
    slice.status.set(getFetchId(CurrencyType.currency, query), FetchStatus.inProgress);

    const dispatched: any[] = [];
    await (currencyActions.fetchCurrency(CurrencyType.currency, query) as any)(
      (action: any) => dispatched.push(action),
      () => makeRoot(slice)
    );

    expect(dispatched).toHaveLength(0);
    expect(api.fetchCurrency).not.toHaveBeenCalled();
  });

  test('fetchCurrency thunk does not dispatch when a prior error exists', async () => {
    const query = '';
    const slice = emptySlice();
    slice.errors.set(getFetchId(CurrencyType.currency, query), new Error('x'));

    const dispatched: any[] = [];
    await (currencyActions.fetchCurrency(CurrencyType.currency, query) as any)(
      (action: any) => dispatched.push(action),
      () => makeRoot(slice)
    );

    expect(dispatched).toHaveLength(0);
    expect(api.fetchCurrency).not.toHaveBeenCalled();
  });
});
