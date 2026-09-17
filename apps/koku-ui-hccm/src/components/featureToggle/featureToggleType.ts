/**
 * Old features
 *
 * accountInfoDetails = 'cost-management.ui.account-info-details', // https://issues.redhat.com/browse/COST-5386
 * accountInfoEmptyState = 'cost-management.ui.account-info-empty-state', // https://issues.redhat.com/browse/COST-5335
 * awsEc2Instances = 'cost-management.ui.aws-ec2-instances', // https://issues.redhat.com/browse/COST-4855
 * chartSkeleton = 'cost-management.ui.chart-skeleton', // https://issues.redhat.com/browse/COST-5573
 * clusterInfo = 'cost-management.ui.cluster.info', // https://issues.redhat.com/browse/COST-4559
 * costBreakdownChart = 'cost-management.ui.cost-breakdown-chart', // https://issues.redhat.com/browse/COST-5852
 * detailsDateRange = 'cost-management.ui.details-date-range', // https://issues.redhat.com/browse/COST-5563
 * display = 'cost-management.koku-ui-hccm.display', // https://redhat.atlassian.net/browse/COST-7396
 * efficiency = 'cost-management.koku-ui-hccm.efficiency', // Efficiency scores https://redhat.atlassian.net/browse/COST-7170
 * exactFilter = 'cost-management.koku-ui-hccm.exact-filter', // Exact filter https://redhat.atlassian.net/browse/COST-6744
 * finsights = 'cost-management.ui.finsights', // RHEL support for FINsights https://issues.redhat.com/browse/COST-3306
 * gpu = 'cost-management.koku-ui-hccm.gpu', // Cost model GPU metrics https://redhat.atlassian.net/browse/COST-5334
 * ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
 * mig = 'cost-management.koku-ui-hccm.mig', // Cost of MIG support https://redhat.atlassian.net/browse/COST-7239
 * ocpCloudGroupBys = 'cost-management.ui.ocp-cloud-group-bys', // https://issues.redhat.com/browse/COST-5514
 * ocpCloudNetworking = 'cost-management.ui.ocp-cloud-networking', // https://issues.redhat.com/browse/COST-4781
 * ocpProjectStorage = 'cost-management.ui.ocp-project-storage', // https://issues.redhat.com/browse/COST-4856
 * priceList = 'cost-management.koku-ui-hccm.price-list', // Life cycle of price list https://redhat.atlassian.net/browse/COST-7330
 * providerEmptyState = 'cost-management.ui.provider-empty-state', // https://issues.redhat.com/browse/COST-5613
 * ros = 'cost-management.ui.ros', // ROS support https://issues.redhat.com/browse/COST-3477
 * settingsPlatform = 'cost-management.ui.settings.platform', // Platform projects https://issues.redhat.com/browse/COST-3818
 * tagMapping = 'cost-management.ui.tag.mapping', // https://issues.redhat.com/browse/COST-3824
 * virtualization = 'cost-management.ui.virtualization', // https://issues.redhat.com/browse/COST-5336
 * wastedCost = 'cost-management.koku-ui-hccm.wasted-cost', // Wasted cost https://redhat.atlassian.net/browse/COST-7460
 */

/** Feature toggles shared with useFeatureToggle and webpack-onprem.config.ts. */
export const enum FeatureToggleType {
  awsEc2Instances = 'cost-management.koku-ui-hccm.aws-ec2-instances', // https://redhat.atlassian.net/browse/COST-4855
  debug = 'cost-management.koku-ui-hccm.debug', // Logs user data (e.g., account ID) in browser console
  exchangeRate = 'cost-management.koku-ui-hccm.exchange-rate', // https://redhat.atlassian.net/browse/COST-7324
  exports = 'cost-management.koku-ui-hccm.exports', // Async exports https://redhat.atlassian.net/browse/COST-2223
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://redhat.atlassian.net/browse/COST-6267
  priceListRates = 'cost-management.koku-ui-hccm.price-list-rates', // Price list rates API https://redhat.atlassian.net/browse/COST-7786
  systems = 'cost-management.koku-ui-hccm.systems', // Systems https://redhat.atlassian.net/browse/COST-5718
}
