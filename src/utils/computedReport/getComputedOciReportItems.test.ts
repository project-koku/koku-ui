import { getIdKeyForGroupBy } from './getComputedOciReportItems';

test('get id key for groupBy', () => {
  [
    [{ payer_tenant_id: 's', product_service: 's' }, 'payer_tenant_id'],
    [{ region: 's', product_service: 's' }, 'region'],
    [{ product_service: 's' }, 'product_service'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
