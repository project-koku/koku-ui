import { getIdKeyForGroupBy } from './getComputedGcpReportItems';

test('get id key for groupBy', () => {
  [
    [{ account: 's', instance_type: 's' }, 'account'],
    [{ instance_type: 's', region: 's' }, 'instance_type'],
    [{ region: 's', service: 's' }, 'region'],
    [{ service: 's' }, 'service'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
