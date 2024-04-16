import { getQuery, getQueryRoute, parseQuery } from './ociQuery';

const query = {
  filter_by: {
    payer_tenant_id: 'test',
  },
  order_by: {
    payer_tenant_id: 'asc',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual('filter[payer_tenant_id]=test&order_by[payer_tenant_id]=asc');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual('filter_by[payer_tenant_id]=test&order_by[payer_tenant_id]=asc');
});

test('parseQuery to convert query string to JSON', () => {
  expect(parseQuery('filter_by[payer_tenant_id]=test&order_by[payer_tenant_id]=asc')).toEqual(query);
});
