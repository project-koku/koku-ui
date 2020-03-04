export interface ReportDatum {
  value: number;
  units: string;
}

export interface ReportValue {
  cost: ReportDatum;
  count?: ReportDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  derived_cost: ReportDatum;
  infrastructure_cost: ReportDatum;
  usage?: ReportDatum;
}

export interface ReportData {
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  key?: string;
  values?: ReportValue[];
}

export interface ReportMeta {
  count: number;
  delta?: {
    percent: number;
    value: number;
  };
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
  total?: {
    cost: ReportDatum;
    derived_cost: ReportDatum;
    infrastructure_cost: ReportDatum;
    markup_cost?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface ReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface Report {
  meta: ReportMeta;
  links: ReportLinks;
  data: ReportData[];
}
