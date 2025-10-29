import { getIdKeyForGroupBy } from './getComputedAzureReportItems';

test('get id key for groupBy', () => {
  [
    [{ subscription_guid: 's', service_name: 's' }, 'subscription_guid'],
    [{ resource_location: 's', service_name: 's' }, 'resource_location'],
    [{ service_name: 's' }, 'service_name'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
