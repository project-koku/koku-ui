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

export interface ForecastMeta {
  count: number;
}

export interface ForecastLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Forecast {
  meta: ForecastMeta;
  links: ForecastLinks;
  data: ForecastData[];
}

// eslint-disable-next-line no-shadow
export const enum ForecastType {
  cost = 'cost',
  infrastructure = 'infrastructure',
  supplementary = 'supplementary',
}

// eslint-disable-next-line no-shadow
export const enum ForecastPathsType {
  aws = 'aws',
  awsOcp = 'aws_ocp',
  azure = 'azure',
  azureOcp = 'azure_ocp',
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp',
  ibm = 'gcp', // Todo: update to use ibm backend apis when they become available
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud',
}
