import { getIdKeyForGroupBy } from './getComputedAzureReportItems';

test('get id key for groupBy', () => {
  [
    [{ subscription_guid: 's', instance_type: 's' }, 'subscription_guid'],
    [{ instance_type: 's', resource_location: 's' }, 'instance_type'],
    [{ resource_location: 's', service_name: 's' }, 'resource_location'],
    [{ service_name: 's' }, 'service_name'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});
