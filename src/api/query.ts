type FilterByValue = string | string[];

export const groupByAnd = 'and:';
export const tagKey = 'tag:'; // Show 'others' with group_by https://github.com/project-koku/koku-ui/issues/1090

interface FilterBys {
  tag?: FilterByValue;
}

export interface Query {
  filter_by?: FilterBys;
}
