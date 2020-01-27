type FilterByValue = string | string[];

interface FilterBys {
  tag?: FilterByValue;
}

export interface Query {
  filter_by?: FilterBys;
}
