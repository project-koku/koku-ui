/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  AWS: {
    defaultMessage: 'EN Amazon Web Services',
    description: 'Amazon Web Services',
    id: 'AWS',
  },
  AWSComputeTitle: {
    defaultMessage: 'EN Compute (EC2) instances usage',
    description: 'Compute (EC2) instances usage',
    id: 'AWSComputeTitle',
  },
  AWSCostTrendTitle: {
    defaultMessage: 'EN Amazon Web Services cumulative cost comparison ({units})',
    description: 'Amazon Web Services cumulative cost comparison ({units})',
    id: 'AWSCostTrendTitle',
  },
  AWSDailyCostTrendTitle: {
    defaultMessage: 'EN Amazon Web Services daily cost comparison ({units})',
    description: 'Amazon Web Services daily cost comparison ({units})',
    id: 'AWSDailyCostTrendTitle',
  },
  AWSDashboardCostTitle: {
    defaultMessage: 'EN Amazon Web Services cost',
    description: 'Amazon Web Services cost',
    id: 'AWSDashboardCostTitle',
  },
  AWSDesc: {
    defaultMessage: 'EN Raw cost from Amazon Web Services infrastructure.',
    description: 'Raw cost from Amazon Web Services infrastructure.',
    id: 'AWSDesc',
  },
  AWSOcpDashboardCostTitle: {
    defaultMessage: 'EN Amazon Web Services filtered by OpenShift cost',
    description: 'Amazon Web Services filtered by OpenShift cost',
    id: 'AWSOcpDashboardCostTitle',
  },
  Azure: {
    defaultMessage: 'EN Microsoft Azure',
    description: 'Microsoft Azure',
    id: 'Azure',
  },
  AzureComputeTitle: {
    defaultMessage: 'EN Virtual machines usage',
    description: 'Virtual machines usage',
    id: 'AzureComputeTitle',
  },
  AzureCostTrendTitle: {
    defaultMessage: 'EN Microsoft Azure cumulative cost comparison ({units})',
    description: 'Microsoft Azure cumulative cost comparison ({units})',
    id: 'AzureCostTrendTitle',
  },
  AzureDailyCostTrendTitle: {
    defaultMessage: 'EN Microsoft Azure daily cost comparison ({units})',
    description: 'Microsoft Azure daily cost comparison ({units})',
    id: 'AzureDailyCostTrendTitle',
  },
  AzureDashboardCostTitle: {
    defaultMessage: 'EN Microsoft Azure cost',
    description: 'Microsoft Azure cost',
    id: 'AzureDashboardCostTitle',
  },
  AzureDesc: {
    defaultMessage: 'EN Raw cost from Azure infrastructure.',
    description: 'Raw cost from Azure infrastructure.',
    id: 'AzureDesc',
  },
  AzureOcpDashboardCostTitle: {
    defaultMessage: 'EN Microsoft Azure filtered by OpenShift cost',
    description: 'Microsoft Azure filtered by OpenShift cost',
    id: 'AzureOcpDashboardCostTitle',
  },
  BreakDownTotalCostDate: {
    defaultMessage:
      '{count, plural, ' +
      'one {EN {groupByValue} total cost ({month} {startDate})} ' +
      'other {EN {groupByValue} total cost ({month} {startDate}-{endDate})}}',
    description: 'Break down total cost by date',
    id: 'BreakDownTotalCostDate',
  },
  ChartCostForecastConeLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Cost confidence ({month} {startDate})} other {EN Cost confidence ({month} {startDate}-{endDate})}}',
    description: 'Cost forecast cone date label',
    id: 'ChartCostForecastConeLegendLabel',
  },
  ChartCostForecastConeLegendTooltip: {
    defaultMessage: 'EN Cost confidence ({month})',
    description: 'Cost confidence forecast date label tooltip',
    id: 'ChartCostForecastConeLegendTooltip',
  },
  ChartCostForecastConeTooltip: {
    defaultMessage: 'EN {value0} - {value1}',
    description: '{value0} - {value1}',
    id: 'ChartCostForecastConeTooltip',
  },
  ChartCostForecastLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Cost forecast ({month} {startDate})} other {EN Cost forecast ({month} {startDate}-{endDate})}}',
    description: 'Cost forecast date label',
    id: 'ChartCostForecastLegendLabel',
  },
  ChartCostForecastLegendTooltip: {
    defaultMessage: 'EN Cost forecast ({month})',
    description: 'Cost forecast date label tooltip',
    id: 'ChartCostForecastLegendTooltip',
  },
  ChartCostInfrastructureForecastConeLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Infrastructure confidence ({month} {startDate})} other {EN Infrastructure confidence ({month} {startDate}-{endDate})}}',
    description: 'Infrastructure date label',
    id: 'ChartCostInfrastructureForecastConeLegendLabel',
  },
  ChartCostInfrastructureForecastConeLegendTooltip: {
    defaultMessage: 'EN Infrastructure confidence ({month})',
    description: 'Infrastructure date label tooltip',
    id: 'ChartCostInfrastructureForecastConeLegendTooltip',
  },
  ChartCostInfrastructureForecastLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Infrastructure forecast ({month} {startDate})} other {EN Infrastructure forecast ({month} {startDate}-{endDate})}}',
    description: 'Infrastructure date label',
    id: 'ChartCostInfrastructureForecastLegendLabel',
  },
  ChartCostInfrastructureForecastLegendTooltip: {
    defaultMessage: 'EN Infrastructure forecast ({month})',
    description: 'Infrastructure date label tooltip',
    id: 'ChartCostInfrastructureForecastLegendTooltip',
  },
  ChartCostInfrastructureLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Infrastructure ({month} {startDate})} other {EN Infrastructure ({month} {startDate}-{endDate})}}',
    description: 'Infrastructure date label',
    id: 'ChartCostInfrastructureLegendLabel',
  },
  ChartCostInfrastructureLegendTooltip: {
    defaultMessage: 'EN Infrastructure ({month})',
    description: 'Infrastructure date label tooltip',
    id: 'ChartCostInfrastructureLegendTooltip',
  },
  ChartCostLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Cost ({month} {startDate})} other {EN Cost ({month} {startDate}-{endDate})}}',
    description: 'Cost date label',
    id: 'ChartCostLegendLabel',
  },
  ChartCostLegendTooltip: {
    defaultMessage: 'EN Cost ({month})',
    description: 'Cost ({month})',
    id: 'ChartCostLegendTooltip',
  },
  ChartCostSupplementaryLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Supplementary cost ({month} {startDate})} other {EN Supplementary cost ({month} {startDate}-{endDate})}}',
    description: 'Supplementary cost date label',
    id: 'ChartCostSupplementaryLegendLabel',
  },
  ChartCostSupplementaryLegendTooltip: {
    defaultMessage: 'EN Supplementary cost ({month})',
    description: 'Supplementary cost ({month})',
    id: 'ChartCostSupplementaryLegendTooltip',
  },
  ChartDateRange: {
    defaultMessage:
      '{count, plural, one {EN {month} {startDate} {year}} other {EN {startDate}-{endDate} {month} {year}}}',
    description: 'Date range that handles singular and plural',
    id: 'ChartDateRange',
  },
  ChartDayOfTheMonth: {
    defaultMessage: 'EN Day {day}',
    description: 'The day of the month',
    id: 'ChartDayOfTheMonth',
  },
  ChartLimitLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Limit ({month} {startDate})} other {EN Limit ({month} {startDate}-{endDate})}}',
    description: 'Limit date label',
    id: 'ChartLimitLegendLabel',
  },
  ChartLimitLegendTooltip: {
    defaultMessage: 'EN Limit ({month})',
    description: 'Limit ({month})',
    id: 'ChartLimitLegendTooltip',
  },
  ChartNoData: {
    defaultMessage: 'EN no data',
    description: 'no data',
    id: 'ChartNoData',
  },
  ChartOthers: {
    defaultMessage: '{count, plural, one {EN {count} Other} other {EN {count} Others}}',
    description: 'Other || Others',
    id: 'ChartOthers',
  },
  ChartRequestsLegendLabel: {
    defaultMessage:
      '{count, plural, one {EN Requests ({month} {startDate})} other {EN Requests ({month} {startDate}-{endDate})}}',
    description: 'Requests date label',
    id: 'ChartRequestLegendLabel',
  },
  ChartRequestsLegendTooltip: {
    defaultMessage: 'EN Requests ({month})',
    description: 'Requests ({month})',
    id: 'ChartRequestLegendTooltip',
  },
  ChartUsageLegendTooltip: {
    defaultMessage: 'EN Usage ({month})',
    description: 'Usage ({month})',
    id: 'ChartUsageLegendTooltip',
  },
  ChartUsageLegendlabel: {
    defaultMessage:
      '{count, plural, one {EN Usage ({month} {startDate})} other {EN Usage ({month} {startDate}-{endDate})}}',
    description: 'Usage ({month} {startDate})',
    id: 'ChartUsageLegendlabel',
  },
  Cost: {
    defaultMessage: 'EN Cost',
    description: 'Cost',
    id: 'Cost',
  },
  CostModelsDetailsAssignSourcesErrorDescription: {
    defaultMessage:
      'EN You cannot assign a source at this time. Try refreshing this page. If the problem persists, contact your organization administrator or visit our {statusUrl} for known outages.',
    description: 'You cannot assign a source at this time',
    id: 'CostModelsDetailsAssignSourcesErrorDescription',
  },
  CostModelsDetailsAssignSourcesErrorTitle: {
    defaultMessage: 'EN This action is temporarily unavailable',
    description: 'This action is temporarily unavailable',
    id: 'CostModelsDetailsAssignSourcesErrorTitle',
  },
  CostModelsRefreshDialog: {
    defaultMessage: 'EN Refresh this dialog',
    description: 'Refresh this dialog',
    id: 'CostModelsRefreshDialog',
  },
  CostModelsRouterErrorTitle: {
    defaultMessage: 'EN Fail routing to cost model',
    description: 'cost models router error title',
    id: 'CostModelsRouterErrorTitle',
  },
  CostModelsRouterServerError: {
    defaultMessage: 'EN Server error: could not get the cost model.',
    description: 'Server error: could not get the cost model.',
    id: 'CostModelsRouterServerError',
  },
  CostModelsWizardSourceErrorDescription: {
    defaultMessage:
      'EN Try refreshing this step or you can skip this step (as it is optional) and assign the source to the cost model at a later time. If the problem persists, contact your organization administrator or visit our {statusUrl} for known outages.',
    description: 'This step is temporarily unavailable',
    id: 'CostModelsWizardSourceErrorDescription',
  },
  CostModelsWizardSourceErrorTitle: {
    defaultMessage: 'EN This step is temporarily unavailable',
    description: 'This step is temporarily unavailable',
    id: 'CostModelsWizardSourceErrorTitle',
  },
  CostModelsWizardSourceTitle: {
    defaultMessage: 'EN Assign sources to the cost model (optional)',
    description: 'Assign sources to the cost model (optional)',
    id: 'CostModelsWizardSourceTitle',
  },
  Custom: {
    defaultMessage: 'EN {msg}',
    description: 'translate any message',
    id: 'Custom',
  },
  DashBoardWidgetSubTitle: {
    defaultMessage: '{count, plural, one {EN {month} {startDate}} other {EN {month} {startDate}-{endDate}}}',
    description: 'dashboard widget subtitle date|dates',
    id: 'DashBoardWidgetSubTitle',
  },
  DashboardCumulativeCostComparison: {
    defaultMessage: 'EN Cumulative cost comparison ({units})',
    description: 'Cumulative cost comparison ({units})',
    id: 'DashboardCumulativeCostComparison',
  },
  DashboardDailyUsageComparison: {
    defaultMessage: 'EN Daily usage comparison ({units})',
    description: 'Daily usage comparison ({units})',
    id: 'DashboardDailyUsageComparison',
  },
  DashboardDatabaseTitle: {
    defaultMessage: 'EN Database services cost',
    description: 'Database services cost',
    id: 'DashboardDatabaseTitle',
  },
  DashboardNetworkTitle: {
    defaultMessage: 'EN Network services cost',
    description: 'Network services cost',
    id: 'DashboardNetworkTitle',
  },
  DashboardStorageTitle: {
    defaultMessage: 'EN Storage services cost',
    description: 'Storage services cost',
    id: 'DashboardStorageTitle',
  },
  DashboardTotalCostTooltip: {
    defaultMessage:
      'EN This total cost is the sum of the infrastructure cost {infrastructureCost} and supplementary cost {supplementaryCost}',
    description: 'total cost is the sum of the infrastructure cost and supplementary cost',
    id: 'DashboardTotalCostTooltip',
  },
  DetailsColumnManagementTitle: {
    defaultMessage: 'EN Manage columns',
    description: 'Manage columns',
    id: 'DetailsColumnManagementTitle',
  },
  FilterByButtonAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Filter button for account name} ' +
      'cluster {EN Filter button for cluster name} ' +
      'name {EN Filter button for name name} ' +
      'node {EN Filter button for node name} ' +
      'org_unit_id {EN Filter button for organizational unit name} ' +
      'project {EN Filter button for project name} ' +
      'region {EN Filter button for region name} ' +
      'resource_location {EN Filter button for region name} ' +
      'service {EN Filter button for service name} ' +
      'service_name {EN Filter button for service_name name} ' +
      'subscription_guid {EN Filter button for account name} ' +
      'tag {EN Filter button for tag name} ' +
      'other {}}',
    description: 'Filter button for "value" name',
    id: 'FilterByButtonAriaLabel',
  },
  FilterByInputAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Input for account name} ' +
      'cluster {EN Input for cluster name} ' +
      'name {EN Input for name name} ' +
      'node {EN Input for node name} ' +
      'org_unit_id {EN Input for organizational unit name} ' +
      'project {EN Input for project name} ' +
      'region {EN Input for region name} ' +
      'resource_location {EN Input for region name} ' +
      'service {EN Input for service name} ' +
      'service_name {EN Input for service_name name} ' +
      'subscription_guid {EN Input for account name} ' +
      'tag {EN Input for tag name} ' +
      'other {}}',
    description: 'Input for {value} name',
    id: 'FilterByInputAriaLabel',
  },
  FilterByOrgUnitAriaLabel: {
    defaultMessage: 'EN Organizational units',
    description: 'Organizational units',
    id: 'FilterByOrgUnitAriaLabel',
  },
  FilterByOrgUnitPlaceholder: {
    defaultMessage: 'EN Choose unit',
    description: 'Choose unit',
    id: 'FilterByOrgUnitPlaceholder',
  },
  FilterByPlaceholder: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Filter by account} ' +
      'cluster {EN Filter by cluster} ' +
      'name {EN Filter by name} ' +
      'node {EN Filter by node} ' +
      'org_unit_id {EN Filter by organizational unit} ' +
      'project {EN Filter by project} ' +
      'region {EN Filter by region} ' +
      'resource_location {EN Filter by region} ' +
      'service {EN Filter by service} ' +
      'service_name {EN Filter by service_name} ' +
      'subscription_guid {EN Filter by account} ' +
      'tag {EN Filter by tag} ' +
      'other {}}',
    description: 'Filter by "value"',
    id: 'FilterByPlaceholder',
  },
  FilterByTagKeyAriaLabel: {
    defaultMessage: 'EN Tag keys',
    description: 'Tag keys',
    id: 'FilterByTagKeyAriaLabel',
  },
  FilterByTagKeyPlaceholder: {
    defaultMessage: 'EN Choose key',
    description: 'Choose key',
    id: 'FilterByTagKeyPlaceholder',
  },
  FilterByTagValueAriaLabel: {
    defaultMessage: 'EN Tag values',
    description: 'Tag values',
    id: 'FilterByTagValueAriaLabel',
  },
  FilterByTagValueButtonAriaLabel: {
    defaultMessage: 'EN Filter button for tag value',
    description: 'Filter button for tag value',
    id: 'FilterByTagValueButtonAriaLabel',
  },
  FilterByTagValueInputPlaceholder: {
    defaultMessage: 'EN Filter by value',
    description: 'Filter by value',
    id: 'FilterByTagValueInputPlaceholder',
  },
  FilterByTagValuePlaceholder: {
    defaultMessage: 'EN Choose value',
    description: 'Choose value',
    id: 'FilterByTagValuePlaceholder',
  },
  FilterByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {EN account} ' +
      'cluster {EN cluster} ' +
      'name {EN name} ' +
      'node {EN node} ' +
      'org_unit_id {EN organizational unit} ' +
      'project {EN project} ' +
      'region {EN region} ' +
      'resource_location {EN region} ' +
      'service {EN service} ' +
      'service_name {EN service_name} ' +
      'subscription_guid {EN account} ' +
      'tag {EN tag} ' +
      'other {}}',
    description: 'Filter by values',
    id: 'FilterByValues',
  },
  FilterByValuesName: {
    defaultMessage: 'EN Name',
    description: 'Name',
    id: 'FilterByValuesName',
  },
  FilterByValuesTitleCase: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Account} ' +
      'cluster {EN Cluster} ' +
      'name {EN Name} ' +
      'node {EN Node} ' +
      'org_unit_id {EN Organizational unit} ' +
      'project {EN Project} ' +
      'region {EN Region} ' +
      'resource_location {EN Region} ' +
      'service {EN Service} ' +
      'service_name {EN Service_name} ' +
      'subscription_guid {EN Account} ' +
      'tag {EN Tag} ' +
      'other {}}',
    description: 'Filter by values',
    id: 'FilterByValuesTitleCase',
  },
  ForDate: {
    defaultMessage:
      '{count, plural, one {EN {value} for {month} {startDate}} other {EN {value} for {month} {startDate}-{endDate}}}',
    description: '{value} for date range',
    id: 'ForDate',
  },
  GCP: {
    defaultMessage: 'EN Google Cloud Platform',
    description: 'Google Cloud Platform',
    id: 'GCP',
  },
  GCPComputeTitle: {
    defaultMessage: 'EN Compute instances usage',
    description: 'Compute instances usage',
    id: 'GCPComputeTitle',
  },
  GCPCostTitle: {
    defaultMessage: 'EN Google Cloud Platform Services cost',
    description: 'Google Cloud Platform Services cost',
    id: 'GCPCostTitle',
  },
  GCPCostTrendTitle: {
    defaultMessage: 'EN Google Cloud Platform Services cumulative cost comparison ({units})',
    description: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    id: 'GCPCostTrendTitle',
  },
  GCPDailyCostTrendTitle: {
    defaultMessage: 'EN Google Cloud Platform Services daily cost comparison ({units})',
    description: 'Google Cloud Platform Services daily cost comparison ({units})',
    id: 'GCPDailyCostTrendTitle',
  },
  GCPDesc: {
    defaultMessage: 'EN Raw cost from Google Cloud Platform infrastructure.',
    description: 'Raw cost from Google Cloud Platform infrastructure.',
    id: 'GCPDesc',
  },
  GroupByAll: {
    defaultMessage: 'EN All {groupBy}s',
    description: 'All group by value',
    id: 'GroupByAll',
  },
  GroupByTop: {
    defaultMessage: 'EN Top {groupBy}s',
    description: 'Top group by value',
    id: 'GroupByTop',
  },
  GroupByTopValueAccount: {
    defaultMessage: 'EN accounts',
    description: 'accounts',
    id: 'GroupByTopValueAccount',
  },
  GroupByTopValueCluster: {
    defaultMessage: 'EN clusters',
    description: 'clusters',
    id: 'GroupByTopValueCluster',
  },
  GroupByTopValueInstanceType: {
    defaultMessage: 'EN Instance types',
    description: 'Instance types',
    id: 'GroupByTopValueInstanceType',
  },
  GroupByTopValueNode: {
    defaultMessage: 'EN Nodes',
    description: 'Nodes',
    id: 'GroupByTopValueNode',
  },
  GroupByTopValueOrganizationalUnitID: {
    defaultMessage: 'Organizational units',
    description: 'Organizational units',
    id: 'GroupByTopValueOrganizationalUnitID',
  },
  GroupByTopValuePod: {
    defaultMessage: 'EN Pods',
    description: 'Pods',
    id: 'GroupByTopValuePod',
  },
  GroupByTopValueProject: {
    defaultMessage: 'EN Projects',
    description: 'Projects',
    id: 'GroupByTopValueProject',
  },
  GroupByTopValueRegion: {
    defaultMessage: 'EN Regions',
    description: 'Regions',
    id: 'GroupByTopValueRegion',
  },
  GroupByTopValueService: {
    defaultMessage: 'EN Services',
    description: 'Services',
    id: 'GroupByTopValueService',
  },
  GroupByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {EN Account} other {EN Accounts}}} ' +
      'cluster {{count, plural, one {EN Cluster} other {EN Clusters}}} ' +
      'instanceType {{count, plural, one {EN Instance Type} other {EN Instance Types}}} ' +
      'node {{count, plural, one {EN Node} other {EN Node}}} ' +
      'orgUnitId {{count, plural, one {EN Organizational unit} other {EN Organizational units}}} ' +
      'pod {{count, plural, one {EN Pod} other {EN Pods}}} ' +
      'project {{count, plural, one {EN Project} other {EN Projects}}} ' +
      'region {{count, plural, one {EN Region} other {EN Region}}} ' +
      'resourceLocation {{count, plural, one {EN Region} other {EN Region}}} ' +
      'service {{count, plural, one {EN Service} other {EN Services}}} ' +
      'serviceName {{count, plural, one {EN Service} other {EN Services}}} ' +
      'subscriptionGuid {{count, plural, one {EN Account} other {EN Accounts}}} ' +
      'tag {{count, plural, one {EN Tag} other {EN Tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'GroupByValues',
  },
  IBM: {
    defaultMessage: 'EN IBM Cloud',
    description: 'IBM Cloud',
    id: 'IBM',
  },
  IBMComputeTitle: {
    defaultMessage: 'EN Compute instances usage',
    description: 'Compute instances usage',
    id: 'IBMComputeTitle',
  },
  IBMCostTitle: {
    defaultMessage: 'EN IBM Cloud Services cost',
    description: 'IBM Cloud Services cost',
    id: 'IBMCostTitle',
  },
  IBMCostTrendTitle: {
    defaultMessage: 'EN IBM Cloud Services cumulative cost comparison ({units})',
    description: 'IBM Cloud Services cumulative cost comparison ({units})',
    id: 'IBMCostTrendTitle',
  },
  IBMDailyCostTrendTitle: {
    defaultMessage: 'EN IBM Cloud Services daily cost comparison ({units})',
    description: 'IBM Cloud Services daily cost comparison ({units})',
    id: 'IBMDailyCostTrendTitle',
  },
  IBMDesc: {
    defaultMessage: 'EN Raw cost from IBM Cloud infrastructure.',
    description: 'Raw cost from IBM Cloud infrastructure.',
    id: 'IBMDesc',
  },
  Infrastructure: {
    defaultMessage: 'EN Infrastructure',
    description: 'Infrastructure',
    id: 'Infrastructure',
  },
  MaintenanceEmptyStateDesc: {
    defaultMessage:
      'EN Cost Management is currently undergoing scheduled maintenance and will be unavailable from 13:00 - 19:00 UTC (09:00 AM - 03:00 PM EDT).',
    description: 'Cost Management is currently undergoing scheduled maintenance',
    id: 'MaintenanceEmptyStateDesc',
  },
  MaintenanceEmptyStateInfo: {
    defaultMessage: 'EN For more information visit {statusUrl}',
    description: 'more information url',
    id: 'MaintenanceEmptyStateInfo',
  },
  MaintenanceEmptyStateThanks: {
    defaultMessage: 'EN We will be back soon. Thank you for your patience!',
    description: 'thanks you for your patience',
    id: 'MaintenanceEmptyStateThanks',
  },
  NoDataForDate: {
    defaultMessage:
      '{count, plural, one {EN No data available for {month} {startDate}} other {EN No data available for {month} {startDate}-{endDate}}}',
    description: 'No data available for date range',
    id: 'NoDataForDate',
  },
  NoDataStateDesc: {
    defaultMessage:
      'EN We have detected a source, but we are not done processing the incoming data. The time to process could take up to 24 hours. Try refreshing the page at a later time.',
    description: 'still processing request, 24 hour message',
    id: 'NoDataStateDesc',
  },
  NoDataStateRefresh: {
    defaultMessage: 'EN Refresh this page',
    description: 'Refresh this page',
    id: 'NoDataStateRefresh',
  },
  NoDataStateTitle: {
    defaultMessage: 'EN Still processing the data',
    description: 'Still processing the data',
    id: 'NoDataStateTitle',
  },
  OCPCPUUsageAndRequests: {
    defaultMessage: 'EN CPU usage and requests',
    description: 'CPU usage and requests',
    id: 'OCPCPUUsageAndRequests',
  },
  OCPCloudDashboardComputeTitle: {
    defaultMessage: 'EN Compute services usage',
    description: 'Compute services usage',
    id: 'OCPCloudDashboardComputeTitle',
  },
  OCPCloudDashboardCostTitle: {
    defaultMessage: 'EN All cloud filtered by OpenShift cost',
    description: 'All cloud filtered by OpenShift cost',
    id: 'OCPCloudDashboardCostTitle',
  },
  OCPCloudDashboardCostTrendTitle: {
    defaultMessage: 'EN All cloud filtered by OpenShift cumulative cost comparison ({units})',
    description: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    id: 'OCPCloudDashboardCostTrendTitle',
  },
  OCPCloudDashboardDailyCostTrendTitle: {
    defaultMessage: 'EN All cloud filtered by OpenShift daily cost comparison ({units})',
    description: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    id: 'OCPCloudDashboardDailyCostTrendTitle',
  },
  OCPDailyUsageAndRequestComparison: {
    defaultMessage: 'EN Daily usage and requests comparison ({units})',
    description: 'Daily usage and requests comparison',
    id: 'OCPDailyUsageAndRequestComparison',
  },
  OCPDashboardCPUUsageAndRequests: {
    defaultMessage: 'EN OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'OCPDashboardCPUUsageAndRequests',
  },
  OCPDashboardCostTitle: {
    defaultMessage: 'EN All OpenShift cost',
    description: 'All OpenShift cost',
    id: 'OCPDashboardCostTitle',
  },
  OCPDashboardCostTrendTitle: {
    defaultMessage: 'EN All OpenShift cumulative cost comparison ({units})',
    description: 'All OpenShift cumulative cost comparison in units',
    id: 'OCPDashboardCostTrendTitle',
  },
  OCPDashboardDailyCostTitle: {
    defaultMessage: 'EN All OpenShift daily cost comparison ({units})',
    description: 'All OpenShift daily cost comparison in units',
    id: 'OCPDashboardDailyCostTitle',
  },
  OCPDashboardMemoryUsageAndRequests: {
    defaultMessage: 'EN OpenShift Memory usage and requests',
    description: 'OpenShift Memory usage and requests',
    id: 'OCPDashboardMemoryUsageAndRequests',
  },
  OCPDashboardVolumeUsageAndRequests: {
    defaultMessage: 'EN OpenShift Volume usage and requests',
    description: 'OpenShift Volume usage and requests',
    id: 'OCPUsageAndRequests',
  },
  OCPInfrastructureCostTitle: {
    defaultMessage: 'EN OpenShift infrastructure cost',
    description: 'OpenShift infrastructure cost',
    id: 'OCPInfrastructureCostTitle',
  },
  OCPInfrastructureCostTrendTitle: {
    defaultMessage: 'EN OpenShift cumulative infrastructure cost comparison ({units})',
    description: 'OpenShift cumulative infrastructure cost comparison with units',
    id: 'OCPInfrastructureCostTrendTitle',
  },
  OCPInfrastructureDailyCostTrendTitle: {
    defaultMessage: 'EN OpenShift daily infrastructure cost comparison ({units})',
    description: 'OpenShift daily infrastructure cost comparison with units',
    id: 'OCPInfrastructureDailyCostTrendTitle',
  },
  OCPMemoryUsageAndRequests: {
    defaultMessage: 'EN Memory usage and requests',
    description: 'Memory usage and requests',
    id: 'OCPMemoryUsageAndRequests',
  },
  OCPSupplementaryCostTitle: {
    defaultMessage: 'EN OpenShift supplementary cost',
    description: 'OpenShift supplementary cost',
    id: 'OCPSupplementaryCostTitle',
  },
  OCPSupplementaryCostTrendTitle: {
    defaultMessage: 'EN OpenShift cumulative supplementary cost comparison ({units})',
    description: 'OpenShift cumulative supplementary cost comparison with units',
    id: 'OCPSupplementaryCostTrendTitle',
  },
  OCPSupplementaryDailyCostTrendTitle: {
    defaultMessage: 'EN OpenShift daily supplementary cost comparison ({units})',
    description: 'OpenShift daily supplementary cost comparison with units',
    id: 'OCPSupplementaryDailyCostTrendTitle',
  },
  OCPUsageCostTitle: {
    defaultMessage: 'EN OpenShift usage cost',
    description: 'OpenShift usage cost',
    id: 'OCPUsageCostTitle',
  },
  OCPUsageDashboardCPUTitle: {
    defaultMessage: 'EN OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'OCPUsageDashboardCPUTitle',
  },
  OCPUsageDashboardCostTrendTitle: {
    defaultMessage: 'EN Metering cumulative cost comparison ({units})',
    description: 'Metering cumulative cost comparison with units',
    id: 'OCPUsageDashboardCostTrendTitle',
  },
  OCPVolumeUsageAndRequests: {
    defaultMessage: 'EN Volume usage and requests',
    description: 'Volume usage and requests',
    id: 'OCPVolumeUsageAndRequests',
  },
  OpenShift: {
    defaultMessage: 'EN OpenShift',
    description: 'OpenShift',
    id: 'OpenShift',
  },
  OpenShiftCloudInfrastructure: {
    defaultMessage: 'EN OpenShift cloud infrastructure',
    description: 'OpenShift cloud infrastructure',
    id: 'OpenShiftCloudInfrastructure',
  },
  OpenShiftCloudInfrastructureDesc: {
    defaultMessage:
      'EN Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    description:
      'Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    id: 'OpenShiftCloudInfrastructureDesc',
  },
  OpenShiftDesc: {
    defaultMessage:
      'EN Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    description:
      'Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    id: 'OpenShiftDesc',
  },
  OverviewInfoArialLabel: {
    defaultMessage: 'EN A description of perspectives',
    description: 'A description of perspectives',
    id: 'OverviewInfoArialLabel',
  },
  OverviewTitle: {
    defaultMessage: 'EN Cost Management Overview',
    description: 'Cost Management Overview',
    id: 'OverviewTitle',
  },
  PercentTotalCost: {
    defaultMessage: 'EN {unit}{value} ({percent}%)',
    description: '{value} {units} ({percent}%)',
    id: 'PercentTotalCost',
  },
  RbacErrorDescription: {
    defaultMessage:
      'EN There was a problem receiving user permissions. Refreshing this page may fix it. If it does not, please contact your admin.',
    description: 'rbac error description',
    id: 'RbacErrorDescription',
  },
  RbacErrorTitle: {
    defaultMessage: 'EN Failed to get RBAC information',
    description: 'rbac error title',
    id: 'RbacErrorTitle',
  },
  RedHatStatusUrl: {
    defaultMessage: 'https://status.redhat.com',
    description: 'Red Hat status url for cloud services',
    id: 'RedHatStatusUrl',
  },
  Requests: {
    defaultMessage: 'EN Requests',
    description: 'Requests',
    id: 'Requests',
  },
  SinceDate: {
    defaultMessage: '{count, plural, one {EN {month} {startDate}} other {EN {month} {startDate}-{endDate}}}',
    description: 'SinceDate',
    id: 'SinceDate',
  },
  ToolBarBulkSelectAll: {
    defaultMessage: 'EN Select all ({value} items)',
    description: 'Select all ({value} items)',
    id: 'ToolBarBulkSelectAll',
  },
  ToolBarBulkSelectAriaDeselect: {
    defaultMessage: 'EN Deselect all items',
    description: 'Deselect all items',
    id: 'ToolBarBulkSelectAriaDeselect',
  },
  ToolBarBulkSelectAriaSelect: {
    defaultMessage: 'EN Select all items',
    description: 'Select all items',
    id: 'ToolBarBulkSelectAriaSelect',
  },
  ToolBarBulkSelectNone: {
    defaultMessage: 'EN Select none (0 items)',
    description: 'Select none (0 items)',
    id: 'ToolBarBulkSelectNone',
  },
  ToolBarBulkSelectPage: {
    defaultMessage: 'EN Select page ({value} items)',
    description: 'Select page ({value} items)',
    id: 'ToolBarBulkSelectPage',
  },
  UnitTooltips: {
    defaultMessage:
      '{units, select, ' +
      'coreHours {{value} EN core-hours} ' +
      'gb {{value} EN GB} ' +
      'gbHours {{value} EN GB-hours} ' +
      'gbMo {{value} EN GB-month} ' +
      'gibibyteMonth {{value} EN GiB-month} ' +
      'hour {{value} EN hours} ' +
      'hrs {{value} EN hours} ' +
      'usd {{value} EN} ' +
      'vmHours {{value} EN VM-hours} ' +
      'other {EN {value}}}',
    description: 'return value and unit based on key: "units"',
    id: 'UnitTooltips',
  },
  Units: {
    defaultMessage:
      '{units, select, ' +
      'coreHours {EN core-hours} ' +
      'gb {EN GB} ' +
      'gbHours {EN GB-hours} ' +
      'gbMo {EN GB-month} ' +
      'gibibyteMonth {EN GiB-month} ' +
      'hour {EN hours} ' +
      'hrs {EN hours} ' +
      'usd {$USD} ' +
      'vmHours {EN VM-hours} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'Units',
  },
  Usage: {
    defaultMessage: 'EN Usage',
    description: 'Usage',
    id: 'Usage',
  },
});
