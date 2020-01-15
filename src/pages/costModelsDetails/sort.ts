import { SortByDirection } from '@patternfly/react-table';

export const costModelsTableMap = {
  updated_timestamp: 4,
  name: 0,
  source_type: 2,
};

interface SortMap {
  [k: string]: number;
}
interface ReverseSortMap {
  [k: number]: string;
}

export const reverseMap = (map: SortMap): ReverseSortMap => {
  return Object.keys(map).reduce((acc, cur) => {
    return {
      ...acc,
      [map[cur]]: cur,
    };
  }, {});
};

export const getSortByData = (sortBy: string, mapper: SortMap) => {
  if (sortBy === null) {
    return {};
  }
  const sortName = sortBy[0] === '-' ? sortBy.slice(1) : sortBy;
  const index = mapper[sortName];
  const direction =
    sortBy[0] === '-' ? SortByDirection.desc : SortByDirection.asc;

  return { index, direction };
};
