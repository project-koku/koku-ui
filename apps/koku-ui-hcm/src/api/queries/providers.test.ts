import { getProvidersQuery, parseProvidersQuery } from './providersQuery';

const query = {
  type: 'AWS' as any,
};

test('getUserAccessQuery filter_by props are converted', () => {
  expect(getProvidersQuery(query)).toEqual('type=AWS');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(parseProvidersQuery('type=AWS')).toEqual(query);
});
