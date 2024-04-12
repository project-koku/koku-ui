import { getQuery, getQueryRoute, parseQuery } from './ocpQuery';

const query = {
  filter_by: {
    project: 'test',
  },
  order_by: {
    project: 'asc',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual('filter[project]=test&order_by[project]=asc');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual('filter_by[project]=test&order_by[project]=asc');
});

test('parseQuery to convert query string to JSON', () => {
  expect(parseQuery('filter_by[project]=test&order_by[project]=asc')).toEqual(query);
});
