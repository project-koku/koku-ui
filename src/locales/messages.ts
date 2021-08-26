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
  AWSDetailsTitle: {
    defaultMessage: 'EN Amazon Web Services Details',
    description: 'Amazon Web Services Details',
    id: 'AWSDetailsTitle',
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
  AzureDetailsTitle: {
    defaultMessage: 'EN Microsoft Azure details',
    description: 'Microsoft Azure details',
    id: 'AzureDetailsTitle',
  },
  AzureOcpDashboardCostTitle: {
    defaultMessage: 'EN Microsoft Azure filtered by OpenShift cost',
    description: 'Microsoft Azure filtered by OpenShift cost',
    id: 'AzureOcpDashboardCostTitle',
  },
  BreakdownBackToDetails: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {EN Back to {value} account details} ' +
      'cluster {EN Back to {value} cluster details} ' +
      'instance_type {EN Back to {value} instance type details} ' +
      'node {EN Back to {value} node details} ' +
      'org_unit_id {EN Back to {value} organizational unit details} ' +
      'project {EN Back to {value} project details} ' +
      'region {EN Back to {value} region details} ' +
      'resource_location {EN Back to {value} region details} ' +
      'service {EN Back to {value} service details} ' +
      'service_name {EN Back to {value} service details} ' +
      'subscription_guid {EN Back to {value} account details} ' +
      'tag {EN Cost by tags} ' +
      'other {}}',
    description: 'Back to {value} {groupBy} details',
    id: 'BreakdownBackToDetails',
  },
  BreakdownCostBreakdownAriaLabel: {
    defaultMessage: 'EN A description of markup, raw cost and usage cost',
    description: 'A description of markup, raw cost and usage cost',
    id: 'BreakdownCostBreakdownAriaLabel',
  },
  BreakdownCostBreakdownTitle: {
    defaultMessage: 'EN Cost breakdown',
    description: 'A description of markup, raw cost and usage cost',
    id: 'BreakdownCostBreakdownTitle',
  },
  BreakdownCostChartAriaDesc: {
    defaultMessage: 'EN Breakdown of markup, raw, and usage costs',
    description: 'Breakdown of markup, raw, and usage costs',
    id: 'BreakdownCostChartAriaDesc',
  },
  BreakdownCostChartTooltip: {
    defaultMessage: 'EN {name}: {value}',
    description: '{name}: {value}',
    id: 'BreakdownCostChartTooltip',
  },
  BreakdownCostOverviewTitle: {
    defaultMessage: 'EN Cost overview',
    description: 'Cost overview',
    id: 'BreakdownCostOverviewTitle',
  },
  BreakdownHistoricalDataTitle: {
    defaultMessage: 'EN Historical data',
    description: 'Historical data',
    id: 'BreakdownHistoricalDataTitle',
  },
  BreakdownSummaryTitle: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Cost by accounts} ' +
      'cluster {EN Cost by clusters} ' +
      'instance_type {EN Cost by instance types} ' +
      'node {EN Cost by Node} ' +
      'org_unit_id {EN Cost by organizational units} ' +
      'project {EN Cost by projects} ' +
      'region {EN Cost by regions} ' +
      'resource_location {EN Cost by regions} ' +
      'service {EN Cost by services} ' +
      'service_name {EN Cost by services} ' +
      'subscription_guid {EN Cost by accounts} ' +
      'tag {EN Cost by tags} ' +
      'other {}}',
    description: 'Cost by {value}',
    id: 'BreakdownSummaryTitle',
  },
  BreakdownTitle: {
    defaultMessage: 'EN {value}',
    description: 'breakdown title',
    id: 'BreakdownTitle',
  },
  BreakdownTotalCostDate: {
    defaultMessage:
      '{count, plural, ' +
      'one {EN {value} total cost ({month} {startDate})} ' +
      'other {EN {value} total cost ({month} {startDate}-{endDate})}}',
    description: 'Break down total cost by date',
    id: 'BreakdownTotalCostDate',
  },
  Cancel: {
    defaultMessage: 'EN Cancel',
    description: 'Cancel',
    id: 'Cancel',
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
  Clusters: {
    defaultMessage: 'EN Clusters',
    description: 'Clusters',
    id: 'Clusters',
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
  CpuTitle: {
    defaultMessage: 'EN CPU',
    description: 'CPU',
    id: 'CPUTitle',
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
  DetailsActionsExport: {
    defaultMessage: 'EN Export data',
    description: 'Export data',
    id: 'DetailsActionsExport',
  },
  DetailsActionsPriceList: {
    defaultMessage: 'EN View all price lists',
    description: 'View all price lists',
    id: 'DetailsActionsPriceList',
  },
  DetailsClustersModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {EN account {name} clusters} ' +
      'cluster {EN cluster {name} clusters} ' +
      'instance_type {EN instance type {name} clusters} ' +
      'node {EN node {name} clusters} ' +
      'org_unit_id {EN organizational unit {name} clusters} ' +
      'project {EN project {name} clusters} ' +
      'region {EN region {name} clusters} ' +
      'resource_location {EN region {name} clusters} ' +
      'service {EN service {name} clusters} ' +
      'service_name {EN service {name} clusters} ' +
      'subscription_guid {account {name} clusters} ' +
      'tag {EN tags {name} clusters} ' +
      'other {}}',
    description: '{groupBy} {name} clusters',
    id: 'DetailsClustersModalTitle',
  },
  DetailsColumnManagementTitle: {
    defaultMessage: 'EN Manage columns',
    description: 'Manage columns',
    id: 'DetailsColumnManagementTitle',
  },
  DetailsEmptyState: {
    defaultMessage: 'EN Processing data to generate a list of all services that sums to a total cost...',
    description: 'Processing data to generate a list of all services that sums to a total cost...',
    id: 'DetailsEmptyState',
  },
  DetailsMoreClusters: {
    defaultMessage: 'EN, {value} more...',
    description: ', {value} more...',
    id: 'DetailsMoreClusters',
  },
  DetailsResourceNames: {
    defaultMessage:
      '{value, select, ' +
      'account {EN Account names} ' +
      'cluster {EN Cluster names} ' +
      'instance_type {EN Instance type names} ' +
      'node {EN Node names} ' +
      'org_unit_id {EN Organizational unit names} ' +
      'project {EN Project names} ' +
      'region {EN Region names} ' +
      'resource_location {EN Region names} ' +
      'service {EN Service names} ' +
      'service_name {EN Service names} ' +
      'subscription_guid {EN Account names} ' +
      'tag {EN Tag names} ' +
      'other {}}',
    description: 'details table resource names',
    id: 'DetailsResourceNames',
  },
  DetailsUnusedRequestsLabel: {
    defaultMessage: 'EN Unrequested capacity',
    description: 'Unrequested capacity',
    id: 'DetailsUnusedRequestsLabel',
  },
  DetailsUnusedUnits: {
    defaultMessage: 'EN {units} ({percentage}% of capacity)',
    description: '{units} ({percentage}% of capacity)',
    id: 'DetailsUnusedUsageUnits',
  },
  DetailsUnusedUsageLabel: {
    defaultMessage: 'EN Unused capacity',
    description: 'Unused capacity',
    id: 'DetailsUnusedUsageLabel',
  },
  DetailsUsageCapacity: {
    defaultMessage: 'EN Capacity - {value} {units}',
    description: 'Capacity - {value} {units}',
    id: 'DetailsUsageCapacity',
  },
  DetailsUsageLimit: {
    defaultMessage: 'EN Limit - {value} {units}',
    description: 'Limit - {value} {units}',
    id: 'DetailsUsageLimit',
  },
  DetailsUsageRequests: {
    defaultMessage: 'EN Requests - {value} {units}',
    description: 'Requests - {value} {units}',
    id: 'DetailsUsageRequests',
  },
  DetailsUsageUsage: {
    defaultMessage: 'EN Usage - {value} {units}',
    description: 'Usage - {value} {units}',
    id: 'DetailsUsageUsage',
  },
  DetailsViewAll: {
    defaultMessage:
      '{value, select, ' +
      'account {EN View all accounts} ' +
      'cluster {EN View all clusters} ' +
      'instance_type {EN View all instance types} ' +
      'node {EN View all nodes} ' +
      'org_unit_id {EN View all organizational units} ' +
      'project {EN View all projects} ' +
      'region {EN View all regions} ' +
      'resource_location {EN View all regions} ' +
      'service {EN View all Services} ' +
      'service_name {EN View all services} ' +
      'subscription_guid {EN View all accounts} ' +
      'tag {EN View all tags} ' +
      'other {}}',
    description: 'View all {value}',
    id: 'DetailsViewAll',
  },
  DocsCostModelTerminology: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#cost-model-terminology',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#cost-model-terminology',
    id: 'DocsCostModelTerminology',
  },
  ExportAggregateType: {
    defaultMessage: 'EN Select aggregate type',
    description: 'Export aggregate type',
    id: 'ExportAggregateType',
  },
  ExportAll: {
    defaultMessage: 'EN All',
    description: 'Export all',
    id: 'ExportAll',
  },
  ExportDownload: {
    defaultMessage: 'EN Generate and download',
    description: 'Export download',
    id: 'ExportDownload',
  },
  ExportError: {
    defaultMessage: 'EN Something went wrong, please try fewer selections',
    description: 'Export error',
    id: 'ExportError',
  },
  ExportFileName: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{resolution, select, daily {{provider}-accounts-daily-{date}} monthly {{provider}-accounts-monthly-{date}} other {}}} ' +
      'cluster {{resolution, select, daily {{provider}-clusters-daily-{date}} monthly {{provider}-clusters-monthly-{date}} other {}}} ' +
      'instance_type {{resolution, select, daily {{provider}-instances-daily-{date}} monthly {{provider}-instances-monthly-{date}} other {}}} ' +
      'node {{resolution, select, daily {{provider}-node-daily-{date}} monthly {{provider}-node-monthly-{date}} other {}}} ' +
      'org_unit_id {{resolution, select, daily {{provider}-org_units-daily-{date}} monthly {{provider}-org_units-monthly-{date}} other {}}} ' +
      'project {{resolution, select, daily {{provider}-projects-daily-{date}} monthly {{provider}-projects-monthly-{date}} other {}}} ' +
      'region {{resolution, select, daily {{provider}-regions-daily-{date}} monthly {{provider}-regions-monthly-{date}} other {}}} ' +
      'resource_location {{resolution, select, daily {{provider}-regions-daily-{date}} monthly {{provider}-regions-monthly-{date}} other {}}} ' +
      'service {{resolution, select, daily {{provider}-services-daily-{date}} monthly {{provider}-services-monthly-{date}} other {}}} ' +
      'service_name {{resolution, select, daily {{provider}-services-daily-{date}} monthly {{provider}-services-monthly-{date}} other {}}} ' +
      'subscription_guid {{resolution, select, daily {{provider}-accounts-daily-{date}} monthly {{provider}-accounts-monthly-{date}} other {}}} ' +
      'tag {{resolution, select, daily {{provider}-tags-daily-{date}} monthly {{provider}-tags-monthly-{date}} other {}}} ' +
      'other {}}',
    description: 'Export file name',
    id: 'ExportFileName',
  },
  ExportHeading: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {EN Aggregates of the following accounts will be exported to a .csv file.} ' +
      'cluster {EN Aggregates of the following clusters will be exported to a .csv file.} ' +
      'instance_type {EN Aggregates of the following instance types will be exported to a .csv file.} ' +
      'node {EN Aggregates of the following nodes will be exported to a .csv file.} ' +
      'org_unit_id {EN Aggregates of the following organizational units will be exported to a .csv file.} ' +
      'project {EN Aggregates of the following projects will be exported to a .csv file.} ' +
      'region {EN Aggregates of the following regions will be exported to a .csv file.} ' +
      'resource_location {EN Aggregates of the regions will be exported to a .csv file.} ' +
      'service {EN Aggregates of the following services will be exported to a .csv file.} ' +
      'service_name {EN Aggregates of the following services will be exported to a .csv file.} ' +
      'subscription_guid {EN Aggregates of the following accounts will be exported to a .csv file.} ' +
      'tag {EN Aggregates of the following tags will be exported to a .csv file.} ' +
      'other {}}',
    description: 'Export heading',
    id: 'ExportHeading',
  },
  ExportResolution: {
    defaultMessage: '{value, select, daily {EN Daily} monthly {EN Monthly} other {}}',
    description: 'Export file name',
    id: 'ExportResolution',
  },
  ExportSelected: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {EN Selected accounts} ' +
      'cluster {EN Selected clusters} ' +
      'instance_type {EN Selected instance types} ' +
      'node {EN Selected nodes} ' +
      'org_unit_id {EN Selected organizational units} ' +
      'project {EN Selected projects} ' +
      'region {EN Selected regions} ' +
      'resource_location {EN Selected regions} ' +
      'service {EN Selected services} ' +
      'service_name {EN Selected services} ' +
      'subscription_guid {EN Selected accounts} ' +
      'tag {EN Selected tags} ' +
      'other {}}',
    description: 'Selected items for export',
    id: 'ExportSelected',
  },
  ExportTimeScope: {
    defaultMessage: '{value, select, current {EN Current {date}} previous {EN Previous {date}} other {}}',
    description: 'Export time scope',
    id: 'ExportTimeScope',
  },
  ExportTimeScopeTitle: {
    defaultMessage: 'EN Select month',
    description: 'Export time scope title',
    id: 'ExportTimeScopeTitle',
  },
  ExportTitle: {
    defaultMessage: 'EN Export',
    description: 'Export title',
    id: 'ExportTitle',
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
  GCPDetailsTitle: {
    defaultMessage: 'EN Google Cloud Platform Details',
    description: 'Google Cloud Platform Details',
    id: 'GCPDetailsTitle',
  },
  GroupByAll: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {EN All Account} other {EN All Accounts}}} ' +
      'cluster {{count, plural, one {EN All Cluster} other {EN All Clusters}}} ' +
      'instance_type {{count, plural, one {EN All Instance type} other {EN All Instance types}}} ' +
      'node {{count, plural, one {EN All Node} other {EN All Node}}} ' +
      'org_unit_id {{count, plural, one {EN All Organizational unit} other {EN All Organizational units}}} ' +
      'project {{count, plural, one {EN All Project} other {EN All Projects}}} ' +
      'region {{count, plural, one {EN All Region} other {EN All Regions}}} ' +
      'resource_location {{count, plural, one {EN All Region} other {EN All Regions}}} ' +
      'service {{count, plural, one {EN All Service} other {EN All Services}}} ' +
      'service_name {{count, plural, one {EN All Service} other {EN All Services}}} ' +
      'subscription_guid {{count, plural, one {EN All Account} other {EN All Accounts}}} ' +
      'tag {{count, plural, one {EN All Tag} other {EN All Tags}}} ' +
      'other {}}',
    description: 'All group by value',
    id: 'GroupByAll',
  },
  GroupByLabel: {
    defaultMessage: 'EN Group by',
    description: 'group by label',
    id: 'GroupByLabel',
  },
  GroupByTop: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {EN Top account} other {EN Top accounts}}} ' +
      'cluster {{count, plural, one {EN Top cluster} other {EN Top clusters}}} ' +
      'instance_type {{count, plural, one {EN Top instance type} other {EN Top instance types}}} ' +
      'node {{count, plural, one {EN Top node} other {EN Top node}}} ' +
      'org_unit_id {{count, plural, one {EN Top organizational unit} other {EN Top organizational units}}} ' +
      'project {{count, plural, one {EN Top project} other {EN Top projects}}} ' +
      'region {{count, plural, one {EN Top region} other {EN Top regions}}} ' +
      'resource_location {{count, plural, one {EN Top region} other {EN Top regions}}} ' +
      'service {{count, plural, one {EN Top service} other {EN Top services}}} ' +
      'service_name {{count, plural, one {EN Top service} other {EN Top services}}} ' +
      'subscription_guid {{count, plural, one {EN Top account} other {EN Top accounts}}} ' +
      'tag {{count, plural, one {EN Top tag} other {EN Top tags}}} ' +
      'other {}}',
    description: 'Top group by value',
    id: 'GroupByTop',
  },
  GroupByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {EN account} other {EN accounts}}} ' +
      'cluster {{count, plural, one {EN cluster} other {EN clusters}}} ' +
      'instance_type {{count, plural, one {EN instance type} other {EN instance types}}} ' +
      'node {{count, plural, one {EN node} other {EN node}}} ' +
      'org_unit_id {{count, plural, one {EN organizational unit} other {EN organizational units}}} ' +
      'project {{count, plural, one {EN project} other {EN projects}}} ' +
      'region {{count, plural, one {EN region} other {EN regions}}} ' +
      'resource_location {{count, plural, one {EN region} other {EN regions}}} ' +
      'service {{count, plural, one {EN service} other {EN services}}} ' +
      'service_name {{count, plural, one {EN service} other {EN services}}} ' +
      'subscription_guid {{count, plural, one {EN account} other {EN accounts}}} ' +
      'tag {{count, plural, one {EN tag} other {EN tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'GroupByValues',
  },
  GroupByValuesTitleCase: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {EN Account} other {EN Accounts}}} ' +
      'cluster {{count, plural, one {EN Cluster} other {EN Clusters}}} ' +
      'instance_type {{count, plural, one {EN Instance type} other {EN Instance types}}} ' +
      'node {{count, plural, one {EN Node} other {EN Node}}} ' +
      'org_unit_id {{count, plural, one {EN Organizational unit} other {EN Organizational units}}} ' +
      'project {{count, plural, one {EN Project} other {EN Projects}}} ' +
      'region {{count, plural, one {EN Region} other {EN Regions}}} ' +
      'resource_location {{count, plural, one {EN Region} other {EN Regions}}} ' +
      'service {{count, plural, one {EN Service} other {EN Services}}} ' +
      'service_name {{count, plural, one {EN Service} other {EN Services}}} ' +
      'subscription_guid {{count, plural, one {EN Account} other {EN Accounts}}} ' +
      'tag {{count, plural, one {EN Tag} other {EN Tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'GroupByValuesTitleCase',
  },
  HistoricalChartLabel: {
    defaultMessage:
      '{value, select, ' +
      'cost {{units, select, core_hours {EN Cost (core-hours)} gb {EN Cost (GB)} gb_hours {EN Cost (GB-hours)} gb_mo {EN Cost (GB-month)} gibibyte_month {EN Cost (GiB-month)} hour {EN Cost (hours)} hrs {EN Cost (hours)} usd {EN Cost ($USD)} vm_hours {EN Cost (VM-hours)} other {}}} ' +
      'day_of_month {EN Day of Month} ' +
      'instance_type {EN hrs} ' +
      'storage {EN gb-mo} ' +
      'units {{units, select, core_hours {EN core-hours} gb {EN GB} gb_hours {EN GB-hours} gb_mo {EN GB-month} gibibyte_month {EN GiB-month} hour {EN hours} hrs {EN hours} usd {EN $USD} vm_hours {EN VM-hours} other {}}} ' +
      'other {}}',
    description: 'historical chart titles',
    id: 'HistoricalChartLabel',
  },
  HistoricalChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'cost {EN Cost comparison} ' +
      'cpu {EN CPU usage, request, and limit comparison} ' +
      'instance_type {EN Compute usage comparison} ' +
      'memory {EN Memory usage, request, and limit comparison} ' +
      'modal {EN {name} daily usage comparison} ' +
      'storage {EN Storage usage comparison} ' +
      'other {}}',
    description: 'historical chart titles',
    id: 'HistoricalChartTitle',
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
  IBMDetailsTitle: {
    defaultMessage: 'EN IBM Cloud Details',
    description: 'IBM details title',
    id: 'IBMDetailsTitle',
  },
  Infrastructure: {
    defaultMessage: 'EN Infrastructure',
    description: 'Infrastructure',
    id: 'Infrastructure',
  },
  LearnMore: {
    defaultMessage: 'EN Learn more',
    description: 'Learn more',
    id: 'LearnMore',
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
  ManageColumnsAriaLabel: {
    defaultMessage: 'EN Table column management',
    description: 'Table column management',
    id: 'ManageColumnsAriaLabel',
  },
  ManageColumnsDesc: {
    defaultMessage: 'EN Selected categories will be displayed in the table',
    description: 'Selected categories will be displayed in the table',
    id: 'ManageColumnsDesc',
  },
  ManageColumnsTitle: {
    defaultMessage: 'EN Manage columns',
    description: 'Manage columns',
    id: 'ManageColumnsTitle',
  },
  MarkupDescription: {
    defaultMessage:
      'EN The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    description:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    id: 'MarkupDescription',
  },
  MarkupTitle: {
    defaultMessage: 'EN Markup',
    description: 'Markup',
    id: 'MarkupTitle',
  },
  MemoryTitle: {
    defaultMessage: 'EN Memory',
    description: 'Memory',
    id: 'MemoryTitle',
  },
  MonthOverMonthChange: {
    defaultMessage: 'EN Month over month change',
    description: 'Month over month change',
    id: 'MonthOverMonthChange',
  },
  Names: {
    defaultMessage: 'EN Names',
    description: 'Names',
    id: 'Names',
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
  OCPDetailsInfrastructureCost: {
    defaultMessage: 'EN Infrastructure cost',
    description: 'Infrastructure cost',
    id: 'OCPDetailsInfrastructureCost',
  },
  OCPDetailsInfrastructureCostDesc: {
    defaultMessage: 'EN The cost based on raw usage data from the underlying infrastructure.',
    description: 'The cost based on raw usage data from the underlying infrastructure.',
    id: 'OCPDetailsInfrastructureCostDesc',
  },
  OCPDetailsSupplementaryCost: {
    defaultMessage: 'EN Infrastructure cost',
    description: 'Infrastructure cost',
    id: 'OCPDetailsSupplementaryCost',
  },
  OCPDetailsSupplementaryCostDesc: {
    defaultMessage:
      'EN All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    description:
      'All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    id: 'OCPDetailsSupplementaryCostDesc',
  },
  OCPDetailsTitle: {
    defaultMessage: 'EN OpenShift details',
    description: 'OpenShift details title',
    id: 'OCPDetailsTitle',
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
  Percent: {
    defaultMessage: 'EN {value}%',
    description: 'percent value',
    id: 'Percent',
  },
  PercentOfCost: {
    defaultMessage: 'EN {value} % of cost',
    description: '{value} % of cost',
    id: 'PercentOfCost',
  },
  PercentTotalCost: {
    defaultMessage: 'EN {unit}{value} ({percent}%)',
    description: '{value} {units} ({percent}%)',
    id: 'PercentTotalCost',
  },
  Perspective: {
    defaultMessage: 'EN Perspective',
    description: 'Perspective dropdown label',
    id: 'Perspective',
  },
  PerspectiveValues: {
    defaultMessage:
      '{value, select, ' +
      'aws {EN Amazon Web Services} ' +
      'aws_ocp {EN Amazon Web Services filtered by OpenShift} ' +
      'azure {EN Microsoft Azure} ' +
      'azure_ocp {EN Microsoft Azure filtered by OpenShift} ' +
      'gcp {EN Google Cloud Platform} ' +
      'gcp_ocp {EN Google Cloud Platform filtered by OpenShift} ' +
      'ibm {EN IBM Cloud} ' +
      'ocp {EN All OpenShift} ' +
      'ocp_cloud {EN All cloud filtered by OpenShift} ' +
      'other {}}',
    description: 'Perspective values',
    id: 'PerspectiveValues',
  },
  RawCostDescription: {
    defaultMessage: 'EN The costs reported by a cloud provider without any cost model calculations applied.',
    description: 'The costs reported by a cloud provider without any cost model calculations applied.',
    id: 'RawCostDescription',
  },
  RawCostTitle: {
    defaultMessage: 'EN Raw cost',
    description: 'Raw cost',
    id: 'RawCostTitle',
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
  Save: {
    defaultMessage: 'EN Save',
    description: 'Save',
    id: 'Save',
  },
  SelectAll: {
    defaultMessage: 'EN Select all',
    description: 'Select all',
    id: 'SelectAll',
  },
  SinceDate: {
    defaultMessage: '{count, plural, one {EN {month} {startDate}} other {EN {month} {startDate}-{endDate}}}',
    description: 'SinceDate',
    id: 'SinceDate',
  },
  TagNames: {
    defaultMessage: 'EN Tag names',
    description: 'Tag Names',
    id: 'TagNames',
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
      'core_hours {{value} EN core-hours} ' +
      'gb {{value} EN GB} ' +
      'gb_hours {{value} ES GB-hours} ' +
      'gb_mo {{value} EN GB-month} ' +
      'gibibyte_month {{value} EN GiB-month} ' +
      'hour {{value} EN hours} ' +
      'hrs {{value} EN hours} ' +
      'usd {{value} EN} ' +
      'vm_hours {{value} EN VM-hours} ' +
      'other {EN {value}}}',
    description: 'return value and unit based on key: "units"',
    id: 'UnitTooltips',
  },
  Units: {
    defaultMessage:
      '{units, select, ' +
      'core_hours {EN core-hours} ' +
      'gb {EN GB} ' +
      'gb_hours {EN GB-hours} ' +
      'gb_mo {EN GB-month} ' +
      'gibibyte_month {EN GiB-month} ' +
      'hour {EN hours} ' +
      'hrs {EN hours} ' +
      'usd {$USD} ' +
      'vm_hours {EN VM-hours} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'Units',
  },
  Usage: {
    defaultMessage: 'EN Usage',
    description: 'Usage',
    id: 'Usage',
  },
  UsageCostDescription: {
    defaultMessage: 'EN The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    description: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    id: 'UsageCostDescription',
  },
  UsageCostTitle: {
    defaultMessage: 'EN Usage cost',
    description: 'Usage cost',
    id: 'UsageCostTitle',
  },
});
