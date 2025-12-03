import { getQuery, getQueryRoute, parseQuery } from './azureQuery';

const query = {
  filter_by: {
    subscription_guid: 'test',
  },
  order_by: {
    subscription_guid: 'asc',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual('filter[subscription_guid]=test&order_by[subscription_guid]=asc');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual('filter_by[subscription_guid]=test&order_by[subscription_guid]=asc');
});

test('parseQuery to convert query string to JSON', () => {
  expect(parseQuery('filter_by[subscription_guid]=test&order_by[subscription_guid]=asc')).toEqual(query);
});
