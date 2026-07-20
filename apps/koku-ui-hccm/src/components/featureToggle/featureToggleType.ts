/** Feature toggles shared with useFeatureToggle and webpack-onprem.config.ts. */
export const enum FeatureToggleType {
  awsEc2Instances = 'cost-management.koku-ui-hccm.aws-ec2-instances', // https://redhat.atlassian.net/browse/COST-4855
  debug = 'cost-management.koku-ui-hccm.debug', // Logs user data (e.g., account ID) in browser console
  display = 'cost-management.koku-ui-hccm.display', // https://redhat.atlassian.net/browse/COST-7396
  efficiency = 'cost-management.koku-ui-hccm.efficiency', // Efficiency scores https://redhat.atlassian.net/browse/COST-7170
  exactFilter = 'cost-management.koku-ui-hccm.exact-filter', // Exact filter https://redhat.atlassian.net/browse/COST-6744
  exports = 'cost-management.koku-ui-hccm.exports', // Async exports https://redhat.atlassian.net/browse/COST-2223
  gpu = 'cost-management.koku-ui-hccm.gpu', // Cost model GPU metrics https://redhat.atlassian.net/browse/COST-5334
  mig = 'cost-management.koku-ui-hccm.mig', // Cost of MIG support https://redhat.atlassian.net/browse/COST-7239
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://redhat.atlassian.net/browse/COST-6267
  priceList = 'cost-management.koku-ui-hccm.price-list', // Life cycle of price list https://redhat.atlassian.net/browse/COST-7330
  priceListRates = 'cost-management.koku-ui-hccm.price-list-rates', // Price list rates API https://redhat.atlassian.net/browse/COST-7786
  systems = 'cost-management.koku-ui-hccm.systems', // Systems https://redhat.atlassian.net/browse/COST-5718
  wastedCost = 'cost-management.koku-ui-hccm.wasted-cost', // Wasted cost https://redhat.atlassian.net/browse/COST-7460
}
