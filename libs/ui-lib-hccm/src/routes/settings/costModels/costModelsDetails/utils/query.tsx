import type { ICell, ISortBy } from '@patternfly/react-table';
import { SortByDirection } from '@patternfly/react-table';

export const initialCostModelsQuery = {
  limit: 10 as null | number,
  offset: 0 as null | number,
  ordering: null as null | string,
  name: null as null | string,
  source_type: null as null | string,
  description: null as null | string,
};

export const costModelsQueryKeys = Object.keys(initialCostModelsQuery);

export type CostModelsQuery = typeof initialCostModelsQuery;

export function stringifySearch(query: CostModelsQuery): string {
  return Object.keys(query).reduce((acc, cur) => {
    if (query[cur] === null) {
      return acc;
    }
    return acc === '' ? `?${cur}=${query[cur]}` : `${acc}&${cur}=${query[cur]}`;
  }, '');
}

export function objectifySearch(search: string): CostModelsQuery {
  if (!search) {
    return initialCostModelsQuery;
  }
  const urlQuery = search
    .slice(1)
    .split('&')
    .map(term => term.split('='))
    .filter(key_value => key_value.length === 2);
  const nameTerm = urlQuery.find(term => term[0] === 'name');
  const sourceTypeTerm = urlQuery.find(term => term[0] === 'source_type');
  const descriptionTerm = urlQuery.find(term => term[0] === 'description');
  const orderingTerm = urlQuery.find(term => term[0] === 'ordering');
  const limitTerm = urlQuery.find(term => term[0] === 'limit');
  const offsetTerm = urlQuery.find(term => term[0] === 'offset');
  return {
    name: nameTerm === undefined ? null : nameTerm[1],
    description: descriptionTerm === undefined ? null : descriptionTerm[1],
    source_type: sourceTypeTerm === undefined ? null : sourceTypeTerm[1],
    ordering: orderingTerm === undefined ? null : orderingTerm[1],
    offset: offsetTerm === undefined ? 0 : Number(offsetTerm[1]),
    limit: limitTerm === undefined ? 10 : Number(limitTerm[1]),
  };
}

export function parseOrdering(query: CostModelsQuery, cells: ICell[]): ISortBy {
  const { ordering } = query;
  if (ordering === null) {
    return {};
  }
  const name = ordering[0] === '-' ? ordering.slice(1) : ordering;
  const direction = ordering[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
  const index = cells.findIndex(cell => cell?.data?.orderName === name);
  return { index, direction };
}

export function limitTransform(perPage: number): number {
  return perPage;
}

export function offsetTransform(page: number, perPage: number): number {
  return (page - 1) * perPage;
}
