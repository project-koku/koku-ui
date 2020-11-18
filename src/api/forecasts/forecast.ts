export interface ForecastData {
  confidence_max?: string;
  confidence_min?: string;
  date?: string;
  rsquared?: string;
  pvalues?: string;
  value?: string;
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
}
