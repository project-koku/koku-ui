export interface ForecastItemValue {
  units?: string;
  value?: number | string;
}

export interface ForecastItem {
  confidence_max?: ForecastItemValue;
  confidence_min?: ForecastItemValue;
  rsquared?: ForecastItemValue;
  pvalues?: ForecastItemValue;
  total?: ForecastItemValue;
}

export interface ForecastValue {
  cost?: ForecastItem;
  date?: string;
  infrastructure?: ForecastItem;
  supplementary?: ForecastItem;
}

export interface ForecastData {
  date?: string;
  values?: ForecastValue[]; // tags
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
}

// eslint-disable-next-line no-shadow
export const enum ForecastPathsType {
  aws = 'aws',
  azure = 'azure',
  ocp = 'ocp',
}
