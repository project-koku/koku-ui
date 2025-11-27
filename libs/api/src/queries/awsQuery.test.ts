import { getQuery, getQueryRoute, parseQuery } from './awsQuery';

const query = {
  filter_by: {
    account: 'test',
  },
  order_by: {
    account: 'asc',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual('filter[account]=test&order_by[account]=asc');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual('filter_by[account]=test&order_by[account]=asc');
});

test('parseQuery to convert query string to JSON', () => {
  expect(parseQuery('filter_by[account]=test&order_by[account]=asc')).toEqual(query);
});
