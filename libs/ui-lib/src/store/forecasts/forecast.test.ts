jest.mock('@koku-ui/api/forecasts/forecastUtils');

import { waitFor } from '@testing-library/react';
import type { Forecast } from '@koku-ui/api/forecasts/forecast';
import { ForecastPathsType, ForecastType } from '@koku-ui/api/forecasts/forecast';
import { runForecast } from '@koku-ui/api/forecasts/forecastUtils';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

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

const forecastType = ForecastType.cost;
const forecastPathsType = ForecastPathsType.aws;
const reportQueryString = 'reportQueryString';

runForecastMock.mockResolvedValue({ data: mockForecast });
global.Date.now = jest.fn(() => 12345);

test('default state', () => {
  const store = createForecastsStore();
  expect(selectors.selectForecastState(store.getState())).toMatchSnapshot();
});

test('fetch forecast success', async () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  expect(runForecastMock).toHaveBeenCalled();
  expect(
    selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, reportQueryString)
  ).toBe(FetchStatus.inProgress);
  await waitFor(() =>
    expect(
      selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, reportQueryString)
    ).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectForecastFetchStatus(finishedState, forecastPathsType, forecastType, reportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectForecastError(finishedState, forecastPathsType, forecastType, reportQueryString)).toBe(null);
});

test('fetch forecast failure', async () => {
  const store = createForecastsStore();
  const error = Symbol('forecast error');
  runForecastMock.mockRejectedValueOnce(error);
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  expect(runForecast).toHaveBeenCalled();
  expect(
    selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, reportQueryString)
  ).toBe(FetchStatus.inProgress);
  await waitFor(() =>
    expect(
      selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, reportQueryString)
    ).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectForecastFetchStatus(finishedState, forecastPathsType, forecastType, reportQueryString)).toBe(
    FetchStatus.complete
  );
  expect(selectors.selectForecastError(finishedState, forecastPathsType, forecastType, reportQueryString)).toBe(error);
});

test('does not fetch forecast if the request is in progress', () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  expect(runForecast).toHaveBeenCalledTimes(1);
});

test('forecast is not refetched if it has not expired', async () => {
  const store = createForecastsStore();
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  await waitFor(() =>
    expect(
      selectors.selectForecastFetchStatus(store.getState(), forecastPathsType, forecastType, reportQueryString)
    ).toBe(FetchStatus.complete)
  );
  store.dispatch(actions.fetchForecast(forecastPathsType, forecastType, reportQueryString));
  expect(runForecast).toHaveBeenCalledTimes(1);
});
