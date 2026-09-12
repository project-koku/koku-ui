import { getProvidersQuery, parseProvidersQuery } from './providersQuery';
import { getQuery, getQueryRoute, parseQuery } from './rosQuery';
import { getUserAccessQuery, parseUserAccessQuery } from './userAccessQuery';
import { getQuery as getOcpQuery, getQueryRoute as getOcpQueryRoute, parseQuery as parseOcpQuery } from './ocpQuery';
import {
  getQuery as getOcpCloudQuery,
  getQueryRoute as getOcpCloudQueryRoute,
  parseQuery as parseOcpCloudQuery,
} from './ocpCloudQuery';

describe('query helpers', () => {
  test('user access query stringify and parse', () => {
    const query = getUserAccessQuery({ type: 'OCP', page_size: 10 });
    expect(query).toContain('type=OCP');
    expect(parseUserAccessQuery(query)).toEqual({ type: 'OCP', page_size: '10' });
  });

  test('providers query stringify and parse', () => {
    const query = getProvidersQuery({ type: 'OCP', limit: 20 });
    expect(query).toContain('type=OCP');
    expect(parseProvidersQuery(query)).toEqual({ type: 'OCP', limit: '20' });
  });

  test('ros, ocp, and ocp cloud queries delegate to shared helpers', () => {
    const query = { filter_by: { project: 'app' } };
    expect(getQuery(query)).toBe(getOcpQuery(query));
    expect(getQueryRoute(query)).toBe(getOcpQueryRoute(query));
    expect(parseQuery('?limit=1')).toEqual(parseOcpQuery('?limit=1'));
    expect(getOcpCloudQuery(query)).toBe(getQuery(query));
    expect(getOcpCloudQueryRoute(query)).toBe(getQueryRoute(query));
    expect(parseOcpCloudQuery('?limit=1')).toEqual(parseQuery('?limit=1'));
  });
});
