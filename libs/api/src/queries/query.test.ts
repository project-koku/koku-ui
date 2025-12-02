import { logicalAndPrefix, logicalOrPrefix } from '@koku-ui/utils/props';

import { convertFilterBy, getQuery, getQueryRoute, parseFilterByPrefix, parseGroupByPrefix, parseQuery } from './query';

const query = {
  filter_by: {
    [`${logicalAndPrefix}project`]: 'test',
    [`${logicalOrPrefix}node`]: 'test',
  },
  group_by: {
    [`${logicalAndPrefix}project`]: 'test',
    [`${logicalOrPrefix}node`]: 'test',
  },
};

test('getQuery filter_by props are converted', () => {
  expect(getQuery(query)).toEqual(
    'filter[and:project]=test&filter[or:node]=test&group_by[and:project]=test&group_by[or:node]=test'
  );
});

test('getQueryRoute filter_by props are not converted', () => {
  expect(getQueryRoute(query)).toEqual(
    'filter_by[and:project]=test&filter_by[or:node]=test&group_by[and:project]=test&group_by[or:node]=test'
  );
});

test('parseQuery to convert query string to JSON', () => {
  expect(
    parseQuery('filter_by[and:project]=test&filter_by[or:node]=test&group_by[and:project]=test&group_by[or:node]=test')
  ).toEqual({
    filter_by: { project: 'test', node: 'test' },
    group_by: { project: 'test', node: 'test' },
  });
});

test('Convert filter_by props to filter props', () => {
  expect(convertFilterBy(query)).toEqual({
    filter: { 'and:project': 'test', 'or:node': 'test' },
    filter_by: undefined,
    group_by: { 'and:project': 'test', 'or:node': 'test' },
  });
});

test('Return query without AND/OR prefix for filter_by', () => {
  expect(parseFilterByPrefix(query)).toEqual({
    filter_by: { node: 'test', project: 'test' },
    group_by: { 'or:node': 'test', 'and:project': 'test' },
  });
});

test('Return query without AND/OR prefix for group_by', () => {
  expect(parseGroupByPrefix(query)).toEqual({
    filter_by: { 'or:node': 'test', 'and:project': 'test' },
    group_by: { node: 'test', project: 'test' },
  });
});
