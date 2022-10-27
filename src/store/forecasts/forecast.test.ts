jest.mock('api/forecasts/forecastUtils');

import { waitFor } from '@testing-library/react';
import type { Forecast } from 'api/forecasts/forecast';
import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { runForecast } from 'api/forecasts/forecastUtils';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './forecastActions';
import { forecastStateKey } from './forecastCommon';
import { forecastReducer } from './forecastReducer';
import * as selectors from './forecastSelectors';

const createForecastsStore = createMockStoreCreator({
  [forecastStateKey]: forecastReducer,
});

const runForecastMock = runForecast as jest.Mock;

const mockForecast: Forecast = {
  data: [],
  total: {
    value: 100,
    units: 'USD',
  },
} as any;

const query = 'query';
const forecastType = ForecastType.cost;
const forecastPathsType = ForecastPathsType.aws;

runForecastMock.mockResolvedValue({ data: mockForecast });
global.Date.now = jest.fn(() => 12345);

jest.spyOn(actions, 'fetchForecast');
jest.spyOn(selectors, 'selectForecastFetchStatus');

test('default state', () => {
  const store = createForecastsStore();
  expect(selectors.selectForecastState(store.getState())).toMatchSnapshot();
});

test('fetch forecast success', async () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  expect(runForecastMock).toBeCalled();
  expect(selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectForecastFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectForecastFetchStatus(finishedState, forecastPathsType, forecastType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectForecastError(finishedState, forecastPathsType, forecastType, query)).toBe(null);
});

test('fetch forecast failure', async () => {
  const store = createForecastsStore();
  const error = Symbol('forecast error');
  runForecastMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  expect(runForecast).toBeCalled();
  expect(selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, query)).toBe(
    FetchStatus.inProgress
  );
  await waitFor(() => expect(selectors.selectForecastFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectForecastFetchStatus(finishedState, forecastPathsType, forecastType, query)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectForecastError(finishedState, forecastPathsType, forecastType, query)).toBe(error);
});

test('does not fetch forecast if the request is in progress', () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  expect(runForecast).toHaveBeenCalledTimes(1);
});

test('forecast is not refetched if it has not expired', async () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  await waitFor(() => expect(actions.fetchForecast).toHaveBeenCalled());
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, query));
  expect(runForecast).toHaveBeenCalledTimes(1);
});
