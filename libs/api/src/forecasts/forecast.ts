import type { PagedMetaData, PagedResponse } from '../api';

export interface ForecastValue {
  units?: string;
  value?: number | string;
}

export interface ForecastItemValue {
  confidence_max?: ForecastValue;
  confidence_min?: ForecastValue;
  rsquared?: ForecastValue;
  pvalues?: ForecastValue;
  total?: ForecastValue;
}

export interface ForecastItem {
  cost?: ForecastItemValue;
  date?: string;
  infrastructure?: ForecastItemValue;
  supplementary?: ForecastItemValue;
}

export interface ForecastData {
  date?: string;
  values?: ForecastItem[];
}

export type Forecast = PagedResponse<ForecastData, PagedMetaData>;

export const enum ForecastType {
  cost = 'cost',
  infrastructure = 'infrastructure',
  supplementary = 'supplementary',
}

export const enum ForecastPathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
