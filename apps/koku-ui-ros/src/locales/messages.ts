import { defineMessages } from 'react-intl';

export default defineMessages({
  actualUsage: {
    defaultMessage: 'Actual usage ({dateRange})',
    description: 'Actual usage (Jan 1-31)',
    id: 'actualUsage',
  },
  breakdownBackToOptimizations: {
    defaultMessage: 'Back to optimizations',
    description: 'Back to optimizations',
    id: 'breakdownBackToOptimizations',
  },
  breakdownBackToOptimizationsProject: {
    defaultMessage: 'Back to optimizations for project {value}',
    description: 'Back to optimizations for project {value}',
    id: 'breakdownBackToOptimizationsProject',
  },
  breakdownTotalCostDate: {
    defaultMessage: '{value} total cost ({dateRange})',
    description: '{value} total cost (January 1-31)',
    id: 'breakdownTotalCostDate',
  },
  chartCostForecastConeTooltip: {
    defaultMessage: '{value0} - {value1}',
    description: 'Cost forecast confidence min/max tooltip',
    id: 'chartCostForecastConeTooltip',
  },
  chartNoData: {
    defaultMessage: 'no data',
    description: 'no data',
    id: 'chartNoData',
  },
  chartOthers: {
    defaultMessage: '{count, plural, one {{count} Other} other {{count} Others}}',
    description: 'Others category for top costliest',
    id: 'chartOthers',
  },
  chartUsageTooltip: {
    defaultMessage:
      'Min: {min} {units}, Max: {max} {units}{br}Median: {median} {units}{br}Q1: {q1} {units}, Q3: {q3} {units}',
    description:
      'Min: {min} {units}, Max: {max} {units}{br}Median: {median} {units}{br}Q1: {q1} {units}, Q3: {q3} {units}',
    id: 'chartUsageTooltip',
  },
  chooseValuePlaceholder: {
    defaultMessage: 'Choose value',
    description: 'Choose value',
    id: 'chooseValuePlaceholder',
  },
  copyToClipboard: {
    defaultMessage: 'Copy to clipboard',
    description: 'Copy to clipboard',
    id: 'copyToClipboard',
  },
  copyToClipboardSuccessfull: {
    defaultMessage: 'Successfully copied to clipboard!',
    description: 'Successfully copied to clipboard!',
    id: 'copyToClipboardSuccessfull',
  },
  cost: {
    defaultMessage: 'Cost',
    description: 'Cost',
    id: 'cost',
  },
  costManagement: {
    defaultMessage: 'Cost Management ROS',
    description: 'Cost Management ROS',
    id: 'costManagement',
  },
  cpu: {
    defaultMessage: 'CPU',
    description: 'CPU',
    id: 'cpu',
  },
  cpuUtilization: {
    defaultMessage: 'CPU utilization',
    description: 'CPU utilization',
    id: 'cpuUtilization',
  },
  currencyAbbreviations: {
    defaultMessage:
      '{symbol, select, ' +
      'billion {{value} B} ' +
      'million {{value} M} ' +
      'quadrillion {{value} q} ' +
      'thousand {{value} K} ' +
      'trillion {{value} t} ' +
      'other {}}',
    description: 'str.match(/([\\D]*)([\\d.,]+)([\\D]*)/)',
    id: 'currencyAbbreviations',
  },
  currentConfiguration: {
    defaultMessage: 'Current configuration',
    description: 'Current configuration',
    id: 'currentConfiguration',
  },
  dataTableAriaLabel: {
    defaultMessage: 'Details table',
    description: 'Details table',
    id: 'dataTableAriaLabel',
  },
  detailsEmptyState: {
    defaultMessage: 'Processing data to generate a list of all services that sums to a total cost...',
    description: 'Processing data to generate a list of all services that sums to a total cost...',
    id: 'detailsEmptyState',
  },
  docsOptimizations: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/getting_started_with_resource_optimization_for_openshift/optimizations-ros',
    description: 'Resource optimization for OpenShift optimization reports',
    id: 'docsOptimizations',
  },
  emptyFilterStateSubtitle: {
    defaultMessage: 'Sorry, no data with the given filter was found.',
    description: 'Sorry, no data with the given filter was found.',
    id: 'emptyFilterStateSubtitle',
  },
  emptyFilterStateTitle: {
    defaultMessage: 'No match found',
    description: 'No match found',
    id: 'emptyFilterStateTitle',
  },
  errorStateNotAuthorizedDesc: {
    defaultMessage: 'Contact the cost management administrator to provide access to this application',
    description: 'Contact the cost management administrator to provide access to this application',
    id: 'errorStateNotAuthorizedDesc',
  },
  errorStateNotAuthorizedTitle: {
    defaultMessage: "You don't have access to the Cost management application",
    description: "You don't have access to the Cost management application",
    id: 'errorStateNotAuthorizedTitle',
  },
  errorStateUnexpectedDesc: {
    defaultMessage: 'We encountered an unexpected error. Contact your administrator.',
    description: 'We encountered an unexpected error. Contact your administrator.',
    id: 'errorStateUnexpectedDesc',
  },
  errorStateUnexpectedTitle: {
    defaultMessage: 'Oops!',
    description: 'Oops!',
    id: 'errorStateUnexpectedTitle',
  },
  excludeLabel: {
    defaultMessage: 'Excludes: {value}',
    description: 'Excludes filter label',
    id: 'excludeLabel',
  },
  excludeValues: {
    defaultMessage: '{value, select, ' + 'excludes {excludes} ' + 'includes {includes} ' + 'other {}}',
    description: 'Exclude filter values',
    id: 'excludeValues',
  },
  filterByInputAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Input for account name} ' +
      'aws_category {Input for cost category name} ' +
      'cluster {Input for cluster name} ' +
      'gcp_project {Input for GCP project name} ' +
      'name {Input for name} ' +
      'node {Input for node name} ' +
      'org_unit_id {Input for organizational unit name} ' +
      'payer_tenant_id {Input for account name} ' +
      'product_service {Input for service_name} ' +
      'project {Input for project name} ' +
      'region {Input for region name} ' +
      'resource_location {Input for region name} ' +
      'service {Input for service name} ' +
      'service_name {Input for service_name} ' +
      'subscription_guid {Input for account name} ' +
      'status {Input for status value} ' +
      'tag {Input for tag name} ' +
      'other {}}',
    description: 'Input for {value} name',
    id: 'filterByInputAriaLabel',
  },
  filterByPlaceholder: {
    defaultMessage:
      '{value, select, ' +
      'account {Filter by account} ' +
      'aws_category {Filter by cost category} ' +
      'cluster {Filter by cluster} ' +
      'container {Filter by container} ' +
      'description {Filter by description} ' +
      'gcp_project {Filter by GCP project} ' +
      'group {Filter by group} ' +
      'name {Filter by name} ' +
      'node {Filter by node} ' +
      'org_unit_id {Filter by organizational unit} ' +
      'payer_tenant_id {Filter by account} ' +
      'persistent_volume_claim {Filter by persistent volume claim} ' +
      'product_service {Filter by service} ' +
      'project {Filter by project} ' +
      'region {Filter by region} ' +
      'resource_location {Filter by region} ' +
      'service {Filter by service} ' +
      'service_name {Filter by service} ' +
      'source_type {Filter by source type} ' +
      'status {Filter by status} ' +
      'storage_class {Filter by StorageClass} ' +
      'subscription_guid {Filter by account} ' +
      'workload {Filter by workload name} ' +
      'workload_type {Filter by workload type} ' +
      'tag {Filter by tag} ' +
      'other {}}',
    description: 'Filter by "value"',
    id: 'filterByPlaceholder',
  },
  filterByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {Account} ' +
      'aws_category {Cost category} ' +
      'cluster {Cluster} ' +
      'container {Container} ' +
      'gcp_project {GCP project} ' +
      'group {Group} ' +
      'name {Name} ' +
      'node {Node} ' +
      'org_unit_id {Organizational unit} ' +
      'payer_tenant_id {Account} ' +
      'persistent_volume_claim {Persistent volume claim} ' +
      'product_service {Service} ' +
      'project {Project} ' +
      'region {Region} ' +
      'resource_location {Region} ' +
      'service {Service} ' +
      'service_name {Service} ' +
      'source_type {Source type} ' +
      'status {Status} ' +
      'storage_class {StorageClass} ' +
      'subscription_guid {Account} ' +
      'tag {Tag} ' +
      'workload {Workload name} ' +
      'workload_type {Workload type} ' +
      'other {}}',
    description: 'Filter by values',
    id: 'filterByValues',
  },
  filterByValuesAriaLabel: {
    defaultMessage: 'Values',
    description: 'Values',
    id: 'filterByValuesAriaLabel',
  },
  forDate: {
    defaultMessage: '{value} for {dateRange}',
    description: '{value} for {Jan 1-31}',
    id: 'forDate',
  },
  kokuAppUrl: {
    defaultMessage: 'https://github.com/project-koku/koku-ui/tree/main/apps/koku-ui-ros',
    description: 'https://github.com/project-koku/koku-ui/tree/main/apps/koku-ui-ros',
    id: 'kokuAppUrl',
  },
  learnMore: {
    defaultMessage: 'Learn more',
    description: 'Learn more',
    id: 'learnMore',
  },
  limit: {
    defaultMessage: 'Limit',
    description: 'Limit',
    id: 'limit',
  },
  loadingStateDesc: {
    defaultMessage: 'Searching for your sources. Do not refresh the browser',
    description: 'Searching for your sources. Do not refresh the browser',
    id: 'loadingStateDesc',
  },
  loadingStateTitle: {
    defaultMessage: 'Looking for sources...',
    description: 'Looking for sources',
    id: 'loadingStateTitle',
  },
  memory: {
    defaultMessage: 'Memory',
    description: 'Memory',
    id: 'memory',
  },
  memoryUtilization: {
    defaultMessage: 'Memory utilization',
    description: 'Memory utilization',
    id: 'memoryUtilization',
  },
  names: {
    defaultMessage: '{count, plural, one {Name} other {Names}}',
    description: 'Name plural or singular',
    id: 'names',
  },
  noDataForDate: {
    defaultMessage: 'No data available for {dateRange}',
    description: 'No data available for Jan 1-31',
    id: 'noDataForDate',
  },
  noOptimizationsDesc: {
    defaultMessage:
      'Resource Optimization is now available in preview for select customers. If your organization wants to participate, tell us through the Feedback button, which is purple and located on the right. Otherwise, there is not enough data available to generate an optimization.',
    description:
      'Resource Optimization is now available in preview for select customers. If your organization wants to participate, tell us through the Feedback button, which is purple and located on the right. Otherwise, there is not enough data available to generate an optimization.',
    id: 'noOptimizationsDesc',
  },
  noOptimizationsTitle: {
    defaultMessage: 'No optimizations available',
    description: 'No optimizations available',
    id: 'noOptimizationsTitle',
  },
  noResultsFound: {
    defaultMessage: 'No results found',
    description: 'No results found',
    id: 'noResultsFound',
  },
  notConfiguredChanges: {
    defaultMessage: 'Changes will be reflected within 24 hours. {learnMore}',
    description: 'Changes will be reflected within 24 hours. {learnMore}',
    id: 'notConfiguredChanges',
  },
  notConfiguredCli: {
    defaultMessage: 'In the CLI, run {clipboard}',
    description: 'In the CLI, run {clipboard}',
    id: 'notConfiguredCli',
  },
  notConfiguredDesc: {
    defaultMessage:
      'To receive resource optimization recommendations for your namespaces, you must first enable each namespace.',
    description:
      'To receive resource optimization recommendations for your namespaces, you must first enable each namespace.',
    id: 'notConfiguredDesc',
  },
  notConfiguredNamespace: {
    defaultMessage: 'To enable a namespace, label it with {clipboard}',
    description: 'To enable a namespace, label it with {clipboard}',
    id: 'notConfiguredNamespace',
  },
  notConfiguredTitle: {
    defaultMessage: 'Optimizations may not be configured',
    description: 'Optimizations may not be configured',
    id: 'notConfiguredTitle',
  },
  notificationsAlertTitle: {
    defaultMessage: 'Duration based notifications',
    description: 'Duration based notifications',
    id: 'notificationsAlertTitle',
  },
  openShift: {
    defaultMessage: 'OpenShift',
    description: 'OpenShift',
    id: 'openShift',
  },
  optimizableContainers: {
    defaultMessage: 'Optimizable containers on this project',
    description: 'Optimizable containers on this project',
    id: 'optimizableContainers',
  },
  optimizations: {
    defaultMessage: 'Optimizations',
    description: 'Optimizations',
    id: 'optimizations',
  },
  optimizationsCost: {
    defaultMessage: 'Cost optimizations',
    description: 'Cost optimizations',
    id: 'optimizationsCost',
  },
  optimizationsDetails: {
    defaultMessage: '{count, plural, =0 {No optimizations} =1 {{count} optimization} other {{count} optimizations}}',
    description: 'Optimization details',
    id: 'optimizationsDetails',
  },
  optimizationsDesc: {
    defaultMessage: 'Get detailed recommendations for how to optimize your Red Hat OpenShift cost and performance.',
    description: 'Get detailed recommendations for how to optimize your Red Hat OpenShift cost and performance.',
    id: 'optimizationsDesc',
  },
  optimizationsInfoArialLabel: {
    defaultMessage: 'A description of optimizations',
    description: 'A description of optimizations',
    id: 'optimizationsInfoArialLabel',
  },
  optimizationsInfoButtonArialLabel: {
    defaultMessage: 'A dialog with a description of optimizations',
    description: 'A dialog with a description of optimizations',
    id: 'optimizationsInfoButtonArialLabel',
  },
  optimizationsInfoDesc: {
    defaultMessage: 'To receive these recommendations, you must first enable your namespaces. {learnMore}',
    description: 'To receive these recommendations, you must first enable your namespaces. {learnMore}',
    id: 'optimizationsInfoDesc',
  },
  optimizationsInfoTitle: {
    defaultMessage: 'Assess and monitor usage from all of your clusters and provides optimization recommendations.',
    description: 'Assess and monitor usage from all of your clusters and provides optimization recommendations.',
    id: 'optimizationsInfoTitle',
  },
  optimizationsLoadingStateDesc: {
    defaultMessage: 'Searching for your optimizations. Do not refresh the browser',
    description: 'Searching for your optimizations. Do not refresh the browser',
    id: 'optimizationsLoadingStateDesc',
  },
  optimizationsLoadingStateTitle: {
    defaultMessage: 'Looking for optimizations...',
    description: 'Looking for optimizations',
    id: 'optimizationsLoadingStateTitle',
  },
  optimizationsLongTerm: {
    defaultMessage: 'Last 15 days',
    description: 'Last 15 days',
    id: 'optimizationsLongTerm',
  },
  optimizationsMediumTerm: {
    defaultMessage: 'Last 7 days',
    description: 'Last 7 days',
    id: 'optimizationsMediumTerm',
  },
  optimizationsNames: {
    defaultMessage:
      '{value, select, ' +
      'cluster {Cluster names} ' +
      'change  {Change} ' +
      'container {Container names} ' +
      'cpu  {CPU requests} ' +
      'current  {Current} ' +
      'last_reported {Last reported} ' +
      'memory  {Memory requests} ' +
      'project {Project names} ' +
      'project_type {Project types} ' +
      'workload {Workload names} ' +
      'workload_type {Workload types} ' +
      'other {}}',
    description: 'Optimization table column names',
    id: 'optimizationsNames',
  },
  optimizationsPerformance: {
    defaultMessage: 'Performance optimizations',
    description: 'Performance optimizations',
    id: 'optimizationsPerformance',
  },
  optimizationsShortTerm: {
    defaultMessage: 'Last 24 hrs',
    description: 'Last 24 hrs',
    id: 'optimizationsShortTerm',
  },
  optimizationsProject: {
    defaultMessage: 'Optimization for this project',
    description: 'Optimization for this project',
    id: 'optimizationsProject',
  },
  optimizationsType: {
    defaultMessage: 'View optimizations based on',
    description: 'View optimizations based on',
    id: 'optimizationsType',
  },
  optimizationsValue: {
    defaultMessage: '{count, plural, =1 {{value} {units}} other {{value}{units}}}',
    description: '2 GiB',
    id: 'optimizationsValue',
  },
  optimizationsValues: {
    defaultMessage:
      '{value, select, ' +
      'cluster {Cluster name} ' +
      'container {Container name} ' +
      'last_reported {Last reported} ' +
      'project {Project name} ' +
      'workload {Workload name} ' +
      'workload_type {Workload type} ' +
      'other {}}',
    description: 'Selected items for export',
    id: 'optimizationsValues',
  },
  optimizationsViewAll: {
    defaultMessage: 'View all optimizations for this project',
    description: 'View all optimizations for this project',
    id: 'optimizationsViewAll',
  },
  optimizationsViewAllDisabled: {
    defaultMessage: 'This project has not reported data this month.',
    description: 'This project has not reported data this month.',
    id: 'optimizationsViewAllDisabled',
  },
  optimizedStateDesc: {
    defaultMessage: 'Good job optimizing the current configuration.',
    description: 'Good job optimizing the current configuration.',
    id: 'optimizedStateDesc',
  },
  optimizedStateTitle: {
    defaultMessage: 'You have reached recommended state!',
    description: 'You have reached recommended state!',
    id: 'optimizedStateTitle',
  },
  optimizeFor: {
    defaultMessage: 'Optimize for',
    description: 'Optimize for',
    id: 'optimizeFor',
  },
  pageTitleDefault: {
    defaultMessage: 'Cost Management ROS | OpenShift',
    description: 'Cost Management ROS | OpenShift',
    id: 'pageTitleDefault',
  },
  pageTitleOptimizations: {
    defaultMessage: 'Optimizations - Cost Management | OpenShift',
    description: 'Optimizations - Cost Management | OpenShift',
    id: 'pageTitleOptimizations',
  },
  paginationTitle: {
    defaultMessage:
      '{placement, select, ' +
      'top {{title} top pagination} ' +
      'bottom {{title} bottom pagination} ' +
      'other {{title} pagination}}',
    description: 'title for pagination aria',
    id: 'paginationTitle',
  },
  percentPlus: {
    defaultMessage: '{count, plural, one {+{value}%} other {{value}%}}',
    description: 'Percent value with plus symbol',
    id: 'percentPlus',
  },
  performance: {
    defaultMessage: 'Performance',
    description: 'Performance',
    id: 'performance',
  },
  perspective: {
    defaultMessage: 'Perspective',
    description: 'Perspective dropdown label',
    id: 'perspective',
  },
  perspectiveValues: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services} ' +
      'aws_ocp {Amazon Web Services filtered by OpenShift} ' +
      'azure {Microsoft Azure} ' +
      'azure_ocp {Microsoft Azure filtered by OpenShift} ' +
      'gcp {Google Cloud Platform} ' +
      'gcp_ocp {Google Cloud Platform filtered by OpenShift} ' +
      'ibm {IBM Cloud} ' +
      'ibm_ocp {IBM filtered by OpenShift} ' +
      'oci {Oracle Cloud Infrastructure} ' +
      'ocp {All OpenShift} ' +
      'ocp_cloud {All cloud filtered by OpenShift} ' +
      'rhel {All RHEL} ' +
      'other {}}',
    description: 'Perspective values',
    id: 'perspectiveValues',
  },
  recommendedConfiguration: {
    defaultMessage: 'Recommended configuration',
    description: 'Recommended configuration',
    id: 'recommendedConfiguration',
  },
  recommendedLimit: {
    defaultMessage: 'Recommended limit ({dateRange})',
    description: 'Recommended limit (Jan 1-31)',
    id: 'recommendedLimit',
  },
  recommendedRequest: {
    defaultMessage: 'Recommended request ({dateRange})',
    description: 'Recommended request (Jan 1-31)',
    id: 'recommendedRequest',
  },
  request: {
    defaultMessage: 'Request',
    description: 'Request',
    id: 'request',
  },
  selectableTableAriaLabel: {
    defaultMessage: 'Selectable table',
    description: 'Selectable table',
    id: 'selectableTableAriaLabel',
  },
  selectableTableHeaderAriaLabel: {
    defaultMessage: 'Select to open the optimizations drawer',
    description: 'Select to open the optimizations drawer',
    id: 'selectableTableHeaderAriaLabel',
  },
  selectableTableRowAriaLabel: {
    defaultMessage: 'Selectable table row',
    description: 'Selectable table row',
    id: 'selectableTableRowAriaLabel',
  },
  settingsErrorDesc: {
    defaultMessage: 'Failed to update settings',
    description: 'Failed to update settings',
    id: 'settingsErrorDesc',
  },
  settingsErrorTitle: {
    defaultMessage: 'Unable to save application settings',
    description: 'Unable to save application settings',
    id: 'settingsErrorTitle',
  },
  settingsSuccessDesc: {
    defaultMessage: 'Settings for Cost Management were replaced with new values',
    description: 'Settings for Cost Management were replaced with new values',
    id: 'settingsSuccessDesc',
  },
  settingsSuccessTitle: {
    defaultMessage: 'Application settings saved',
    description: 'Application settings saved',
    id: 'settingsSuccessTitle',
  },
  sinceDate: {
    defaultMessage: '{dateRange}',
    description: 'Jan 1-31',
    id: 'sinceDate',
  },
  suggestions: {
    defaultMessage: 'Suggestions',
    description: 'Suggestions',
    id: 'suggestions',
  },
  typeaheadAriaClear: {
    defaultMessage: 'Clear button and input',
    description: 'Clear button and input',
    id: 'typeaheadAriaClear',
  },
  unitTooltips: {
    defaultMessage:
      '{units, select, ' +
      'byte_ms {{value} Byte-ms} ' +
      'core_hours {{value} core-hours} ' +
      'gb {{value} GB} ' +
      'gb_hours {{value} GB-hours} ' +
      'gb_mo {{value} GB-month} ' +
      'gb_ms {{value} GB-ms} ' +
      'gibibyte_month {{value} GiB-month} ' +
      'hour {{value} hours} ' +
      'hrs {{value} hours} ' +
      'ms {{value} milliseconds} ' +
      'vm_hours {{value} VM-hours} ' +
      'other {{value}}}',
    description: 'return value and unit based on key: "units"',
    id: 'unitTooltips',
  },
  units: {
    defaultMessage:
      '{units, select, ' +
      'bytes {bytes} ' +
      'cores {cores} ' +
      'ei {Ei} ' +
      'eib {EiB} ' +
      'gi {Gi} ' +
      'gib {GiB} ' +
      'ki {Ki} ' +
      'kib {KiB} ' +
      'mi {Mi} ' +
      'mib {MiB} ' +
      'm {m} ' +
      'millicores {millicores} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'units',
  },
  unitsK8: {
    defaultMessage:
      '{units, select, ' +
      'bytes {bytes} ' +
      'cores {} ' +
      'ei {Ei} ' +
      'eib {Ei} ' +
      'gi {Gi} ' +
      'gib {Gi} ' +
      'ki {Ki} ' +
      'kib {Ki} ' +
      'mi {Mi} ' +
      'mib {Mi} ' +
      'm {m} ' +
      'millicores {m} ' +
      'other {}}',
    description: 'return the Kubernetes unit label based on key: "units"',
    id: 'unitsK8',
  },
  usage: {
    defaultMessage: 'Usage',
    description: 'Usage',
    id: 'usage',
  },
  valueUnits: {
    defaultMessage: '{value} {units}',
    description: '{value} {units}',
    id: 'valueUnits',
  },
  welcomeInfo: {
    defaultMessage: 'For more information visit {url}',
    description: 'more information url',
    id: 'welcomeInfo',
  },
  welcomeTitle: {
    defaultMessage: 'Cost Management ROS UI',
    description: 'Cost Management ROS UI',
    id: 'welcomeTitle',
  },
});
