import { getUserAccessQuery, parseUserAccessQuery } from './userAccessQuery';

const query = {
  type: 'AWS' as any,
};

test('getUserAccessQuery filter_by props are converted', () => {
  expect(getUserAccessQuery(query)).toEqual('type=AWS');
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(parseUserAccessQuery('type=AWS')).toEqual(query);
});
