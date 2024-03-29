import { getIdKeyForGroupBy } from './getComputedRhelReportItems';

test('get id key for groupBy', () => {
  [
    [{ project: 's', cluster: 's' }, 'project'],
    [{ cluster: 's', node: 's' }, 'cluster'],
    [{ node: 's' }, 'node'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
