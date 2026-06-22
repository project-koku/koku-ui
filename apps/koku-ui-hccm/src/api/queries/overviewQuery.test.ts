import { getQuery, getQueryRoute, parseQuery } from './overviewQuery';

const query = {
  filter_by: {
    ocpPerspective: 'test',
  },
  order_by: {
    ocpPerspective: 'asc',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual('filter%5BocpPerspective%5D=test&order_by%5BocpPerspective%5D=asc');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual('filter_by%5BocpPerspective%5D=test&order_by%5BocpPerspective%5D=asc');
});

test('parseQuery to convert query string to JSON', () => {
  expect(parseQuery('filter_by[ocpPerspective]=test&order_by[ocpPerspective]=asc')).toEqual(query);
});
