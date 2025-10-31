import { getIdKeyForGroupBy } from './getComputedGcpReportItems';

test('get id key for groupBy', () => {
  [
    [{ account: 's', service: 's' }, 'account'],
    [{ region: 's', service: 's' }, 'region'],
    [{ service: 's' }, 'service'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
