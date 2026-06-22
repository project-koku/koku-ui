import { SortByDirection } from '@patternfly/react-table';
import {
  initialCostModelsQuery,
  stringifySearch,
  objectifySearch,
  parseOrdering,
  limitTransform,
  offsetTransform,
} from './query';

describe('costModelsDetails/utils/query', () => {
  test.each([
    [{ ...initialCostModelsQuery, name: 'foo' }, '?limit=10&offset=0&name=foo'],
    [{ ...initialCostModelsQuery, source_type: 'AWS', limit: 20 }, '?limit=20&offset=0&source_type=AWS'],
    [initialCostModelsQuery, '?limit=10&offset=0'],
  ])('stringifySearch %#', (q, expected) => {
    expect(stringifySearch(q)).toBe(expected);
  });

  test.each([
    ['', initialCostModelsQuery],
    ['?name=foo', { ...initialCostModelsQuery, name: 'foo' }],
    ['?description=bar&source_type=AWS&ordering=-name&limit=50&offset=20',
      { name: null, description: 'bar', source_type: 'AWS', ordering: '-name', limit: 50, offset: 20 }],
  ])('objectifySearch %#', (search, expected) => {
    expect(objectifySearch(search)).toEqual(expected as any);
  });

  test.each([
    [{ ordering: null } as any, [], {}],
    [{ ordering: '-name' } as any, [{ data: { orderName: 'name' } } as any], { index: 0, direction: SortByDirection.desc }],
    [{ ordering: 'source_type' } as any, [{ data: { orderName: 'name' } } as any, { data: { orderName: 'source_type' } } as any],
      { index: 1, direction: SortByDirection.asc }],
  ])('parseOrdering %#', (query, cells, expected) => {
    expect(parseOrdering(query as any, cells as any)).toEqual(expected as any);
  });

  test('transforms', () => {
    expect(limitTransform(25)).toBe(25);
    expect(offsetTransform(3, 10)).toBe(20);
  });
}); 