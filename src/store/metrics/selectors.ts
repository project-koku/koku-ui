import { MetricHash } from 'api/metrics';
import { AxiosError } from 'axios';
import { parseApiError } from 'routes/costModels/createCostModelWizard/parseError';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';

import { stateKey } from './reducer';

export const metricsState = (state: RootState) => state[stateKey];

export const status = (state: RootState): FetchStatus => metricsState(state).status;

export const error = (state: RootState): string => {
  const err: AxiosError = metricsState(state).error;
  if (err === null) {
    return '';
  }
  return parseApiError(err);
};

export const metrics = (state: RootState): MetricHash => {
  const metricsPayload = metricsState(state).metrics;
  if (metricsPayload === null) {
    return {};
  }

  return metricsPayload.data.reduce((acc, curr) => {
    const prev = acc[curr.label_metric] ? { ...acc[curr.label_metric] } : {};
    return {
      ...acc,
      [curr.label_metric]: { ...prev, [curr.label_measurement]: curr },
    };
  }, {});
};

export const maxRate = (state: RootState): number => {
  const metricsPayload = metricsState(state).metrics;
  if (metricsPayload === null) {
    return 0;
  }
  return metricsPayload.data.length;
};

export const costTypes = (state: RootState): string[] => {
  const metricsPayload = metricsState(state).metrics;
  if (metricsPayload === null) {
    return [];
  }

  return metricsPayload.data.reduce((acc, curr) => {
    if (acc.includes(curr.default_cost_type)) {
      return acc;
    }
    return [curr.default_cost_type, ...acc];
  }, []);
};
