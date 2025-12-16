import { defineMessages } from 'react-intl';

export default defineMessages({
  addProjects: {
    defaultMessage: 'Add projects',
    description: 'Add projects',
    id: 'addProjects',
  },
  allOtherProjectCosts: {
    defaultMessage: 'Project (All other costs)',
    description: 'Project (All other costs)',
    id: 'allOtherProjectCosts',
  },
  assignCostModel: {
    defaultMessage: 'Assign cost model',
    description: 'Assign cost model',
    id: 'assignCostModel',
  },
  aws: {
    defaultMessage: 'Amazon Web Services',
    description: 'Amazon Web Services',
    id: 'aws',
  },
  awsAlt: {
    defaultMessage: 'Amazon Web Services (AWS)',
    description: 'Amazon Web Services (AWS)',
    id: 'awsAlt',
  },
  awsComputeTitle: {
    defaultMessage: 'Compute (EC2) instances usage',
    description: 'Compute (EC2) instances usage',
    id: 'awsComputeTitle',
  },
  awsCostTrendTitle: {
    defaultMessage: 'Amazon Web Services cumulative cost comparison ({units})',
    description: 'Amazon Web Services cumulative cost comparison ({units})',
    id: 'awsCostTrendTitle',
  },
  awsDailyCostTrendTitle: {
    defaultMessage: 'Amazon Web Services daily cost comparison ({units})',
    description: 'Amazon Web Services daily cost comparison ({units})',
    id: 'awsDailyCostTrendTitle',
  },
  awsDashboardCostTitle: {
    defaultMessage: 'Amazon Web Services cost',
    description: 'Amazon Web Services cost',
    id: 'awsDashboardCostTitle',
  },
  awsDesc: {
    defaultMessage: 'Raw cost from Amazon Web Services infrastructure.',
    description: 'Raw cost from Amazon Web Services infrastructure.',
    id: 'awsDesc',
  },
  awsDetailsTitle: {
    defaultMessage: 'Amazon Web Services details',
    description: 'Amazon Web Services details',
    id: 'awsDetailsTitle',
  },
  awsOcpDashboardCostTitle: {
    defaultMessage: 'Amazon Web Services filtered by OpenShift cost',
    description: 'Amazon Web Services filtered by OpenShift cost',
    id: 'awsOcpDashboardCostTitle',
  },
  azure: {
    defaultMessage: 'Microsoft Azure',
    description: 'Microsoft Azure',
    id: 'azure',
  },
  azureComputeTitle: {
    defaultMessage: 'Virtual machines usage',
    description: 'Virtual machines usage',
    id: 'azureComputeTitle',
  },
  azureCostTrendTitle: {
    defaultMessage: 'Microsoft Azure cumulative cost comparison ({units})',
    description: 'Microsoft Azure cumulative cost comparison ({units})',
    id: 'azureCostTrendTitle',
  },
  azureDailyCostTrendTitle: {
    defaultMessage: 'Microsoft Azure daily cost comparison ({units})',
    description: 'Microsoft Azure daily cost comparison ({units})',
    id: 'azureDailyCostTrendTitle',
  },
  azureDashboardCostTitle: {
    defaultMessage: 'Microsoft Azure cost',
    description: 'Microsoft Azure cost',
    id: 'azureDashboardCostTitle',
  },
  azureDesc: {
    defaultMessage: 'Raw cost from Azure infrastructure.',
    description: 'Raw cost from Azure infrastructure.',
    id: 'azureDesc',
  },
  azureDetailsTitle: {
    defaultMessage: 'Microsoft Azure details',
    description: 'Microsoft Azure details',
    id: 'azureDetailsTitle',
  },
  azureOcpDashboardCostTitle: {
    defaultMessage: 'Microsoft Azure filtered by OpenShift cost',
    description: 'Microsoft Azure filtered by OpenShift cost',
    id: 'azureOcpDashboardCostTitle',
  },
  back: {
    defaultMessage: 'Back',
    description: 'Back',
    id: 'back',
  },
  backToIntegrations: {
    defaultMessage: 'Back to integrations status',
    description: 'Back to integrations status',
    id: 'backToIntegrations',
  },
  breakdownBackToDetails: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Back to {value} account details} ' +
      'aws_category {Back to {value} cost category details} ' +
      'cluster {Back to {value} cluster details} ' +
      'gcp_project {Back to {value} Google Cloud project details} ' +
      'node {Back to {value} node details} ' +
      'org_unit_id {Back to {value} organizational unit details} ' +
      'payer_tenant_id {Back to {value} account details} ' +
      'product_service {Back to {value} service details} ' +
      'project {Back to {value} project details} ' +
      'region {Back to {value} region details} ' +
      'resource_location {Back to {value} region details} ' +
      'service {Back to {value} service details} ' +
      'service_name {Back to {value} service details} ' +
      'subscription_guid {Back to {value} account details} ' +
      'tag {Back to {value} tag details} ' +
      'other {}}',
    description: 'Back to {value} {groupBy} details',
    id: 'breakdownBackToDetails',
  },
  breakdownBackToDetailsAriaLabel: {
    defaultMessage: 'Back to details',
    description: 'Back to details',
    id: 'breakdownBackToDetailsAriaLabel',
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
  breakdownBackToTitles: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services} ' +
      'azure {Microsoft Azure} ' +
      'gcp {Google Cloud} ' +
      'ocp {OpenShift} ' +
      'other {}}',
    description: 'Breakdown back to page titles',
    id: 'breakdownBackToTitles',
  },
  breakdownCostOverviewTitle: {
    defaultMessage: 'Cost overview',
    description: 'Cost overview',
    id: 'breakdownCostOverviewTitle',
  },
  breakdownHistoricalDataTitle: {
    defaultMessage: 'Historical data',
    description: 'Historical data',
    id: 'breakdownHistoricalDataTitle',
  },
  breakdownSummaryTitle: {
    defaultMessage:
      '{value, select, ' +
      'account {Cost breakdown by accounts} ' +
      'aws_category {Cost breakdown by category} ' +
      'cluster {Cost breakdown by clusters} ' +
      'gcp_project {Cost breakdown by Google Cloud projects} ' +
      'node {Cost breakdown by Node} ' +
      'org_unit_id {Cost breakdown by organizational units} ' +
      'payer_tenant_id {Cost breakdown by accounts} ' +
      'platform {Cost breakdown by default projects} ' +
      'product_service {Cost breakdown by services} ' +
      'project {Cost breakdown by projects} ' +
      'region {Cost breakdown by regions} ' +
      'resource_location {Cost breakdown by regions} ' +
      'service {Cost breakdown by services} ' +
      'service_name {Cost breakdown by services} ' +
      'storageclass {Storage cost breakdown by type} ' +
      'subscription_guid {Cost breakdown by accounts} ' +
      'tag {Cost breakdown by tags} ' +
      'other {}}',
    description: 'Cost by {value}',
    id: 'breakdownSummaryTitle',
  },
  breakdownTitle: {
    defaultMessage: '{value}',
    description: 'Breakdown title',
    id: 'breakdownTitle',
  },
  breakdownTotalCostDate: {
    defaultMessage: '{value} total cost ({dateRange})',
    description: '{value} total cost (January 1-31)',
    id: 'breakdownTotalCostDate',
  },
  calculationType: {
    defaultMessage: 'Calculation type',
    description: 'Calculation type',
    id: 'calculationType',
  },
  cancel: {
    defaultMessage: 'Cancel',
    description: 'Cancel',
    id: 'cancel',
  },
  capacity: {
    defaultMessage: 'Capacity',
    description: 'Capacity',
    id: 'capacity',
  },
  chartCostForecastConeLabel: {
    defaultMessage: 'Cost confidence ({dateRange})',
    description: 'Cost confidence (Jan 1-31)',
    id: 'chartCostForecastConeLabel',
  },
  chartCostForecastConeLabelNoData: {
    defaultMessage: 'Cost confidence (no data)',
    description: 'Cost confidence (no data)',
    id: 'chartCostForecastConeLabelNoData',
  },
  chartCostForecastConeRangeTooltip: {
    defaultMessage: '{value0} - {value1}',
    description: 'Cost forecast confidence min/max tooltip',
    id: 'chartCostForecastConeRangeTooltip',
  },
  chartCostForecastConeTooltip: {
    defaultMessage: 'Cost confidence ({month})',
    description: 'Cost confidence (Jan)',
    id: 'chartCostForecastConeTooltip',
  },
  chartCostForecastLabel: {
    defaultMessage: 'Cost forecast ({dateRange})',
    description: 'Cost forecast (Jan 1-31)',
    id: 'chartCostForecastLabel',
  },
  chartCostForecastLabelNoData: {
    defaultMessage: 'Cost forecast (no data)',
    description: 'Cost forecast (no data)',
    id: 'chartCostForecastLabelNoData',
  },
  chartCostForecastTooltip: {
    defaultMessage: 'Cost forecast ({month})',
    description: 'Cost forecast (Jan 1-31)',
    id: 'chartCostForecastTooltip',
  },
  chartCostLabel: {
    defaultMessage: 'Cost ({dateRange})',
    description: 'Cost (Jan 1-31)',
    id: 'chartCostLabel',
  },
  chartCostLabelNoData: {
    defaultMessage: 'Cost (no data)',
    description: 'Cost (no data)',
    id: 'chartCostLabelNoData',
  },
  chartCostTooltip: {
    defaultMessage: 'Cost ({month})',
    description: 'Cost (Jan)',
    id: 'chartCostTooltip',
  },
  chartDataInLabel: {
    defaultMessage: 'Data in ({dateRange})',
    description: 'Data in ({dateRange})',
    id: 'chartDataInLabel',
  },
  chartDataInLabelNoData: {
    defaultMessage: 'Data in (no data)',
    description: 'Data in (no data)',
    id: 'chartDataInLabelNoData',
  },
  chartDataInTooltip: {
    defaultMessage: 'Data in ({month})',
    description: 'Data in ({month})',
    id: 'chartDataInTooltip',
  },
  chartDataOutLabel: {
    defaultMessage: 'Data out ({dateRange})',
    description: 'Data out ({dateRange})',
    id: 'chartDataOutLabel',
  },
  chartDataOutLabelNoData: {
    defaultMessage: 'Data out (no data)',
    description: 'Data out (no data)',
    id: 'chartDataOutLabelNoData',
  },
  chartDataOutTooltip: {
    defaultMessage: 'Data out ({month})',
    description: 'Data out ({month})',
    id: 'chartDataOutTooltip',
  },
  chartDayOfTheMonth: {
    defaultMessage: 'Day {day}',
    description: 'The day of the month',
    id: 'chartDayOfTheMonth',
  },
  chartDestination: {
    defaultMessage: 'Destination',
    description: 'Destination',
    id: 'chartDestination',
  },
  chartLimitLabel: {
    defaultMessage: 'Limit ({dateRange})',
    description: 'Limit (Jan 1-31)',
    id: 'chartLimitLabel',
  },
  chartLimitLabelNoData: {
    defaultMessage: 'Limit (no data)',
    description: 'Limit (no data)',
    id: 'chartLimitLabelNoData',
  },
  chartLimitTooltip: {
    defaultMessage: 'Limit ({month})',
    description: 'Limit (Jan)',
    id: 'chartLimitTooltip',
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
  chartRequestsLabel: {
    defaultMessage: 'Requests ({dateRange})',
    description: 'Requests (Jan 1-31)',
    id: 'chartRequestsLabel',
  },
  chartRequestsLabelNoData: {
    defaultMessage: 'Requests (no data)',
    description: 'Requests (no data)',
    id: 'chartRequestsLabelNoData',
  },
  chartRequestsTooltip: {
    defaultMessage: 'Requests ({month})',
    description: 'Requests (Jan)',
    id: 'chartRequestsTooltip',
  },
  chartSource: {
    defaultMessage: 'Source',
    description: 'Source',
    id: 'chartSource',
  },
  chartSupplementaryCostLabel: {
    defaultMessage: 'Supplementary cost ({dateRange})',
    description: 'Supplementary cost (Jan 1-31)',
    id: 'chartSupplementaryCostLabel',
  },
  chartSupplementaryCostLabelNoData: {
    defaultMessage: 'Supplementary cost (no data)',
    description: 'Supplementary cost (no data)',
    id: 'chartSupplementaryCostLabelNoData',
  },
  chartSupplementaryCostTooltip: {
    defaultMessage: 'Supplementary cost ({month})',
    description: 'Supplementary cost (Jan)',
    id: 'chartSupplementaryCostTooltip',
  },
  chartUsageLabel: {
    defaultMessage: 'Usage ({dateRange})',
    description: 'Usage (Jan 1-31)',
    id: 'chartUsageLabel',
  },
  chartUsageLabelNoData: {
    defaultMessage: 'Usage (no data)',
    description: 'Usage (no data)',
    id: 'chartUsageLabelNoData',
  },
  chartUsageTooltip: {
    defaultMessage: 'Usage ({month})',
    description: 'Usage (Jan)',
    id: 'chartUsageTooltip',
  },
  chooseKeyPlaceholder: {
    defaultMessage: 'Choose key',
    description: 'Choose key',
    id: 'chooseKeyPlaceholder',
  },
  chooseValuePlaceholder: {
    defaultMessage: 'Choose value',
    description: 'Choose value',
    id: 'chooseValuePlaceholder',
  },
  close: {
    defaultMessage: 'Close',
    description: 'Close',
    id: 'close',
  },
  cloudIntegration: {
    defaultMessage: 'Cloud integration',
    description: 'Cloud integration',
    id: 'cloudIntegration',
  },
  cluster: {
    defaultMessage: 'Cluster',
    description: 'Cluster',
    id: 'cluster',
  },
  clusterId: {
    defaultMessage: 'Cluster id',
    description: 'Cluster id',
    id: 'clusterId',
  },
  clusterInfo: {
    defaultMessage: 'Cluster information',
    description: 'Cluster information',
    id: 'clusterInfo',
  },
  clusters: {
    defaultMessage: 'Clusters',
    description: 'Clusters',
    id: 'clusters',
  },
  copied: {
    defaultMessage: 'Copied',
    description: 'Copied',
    id: 'copied',
  },
  copy: {
    defaultMessage: 'Copy',
    description: 'Copy',
    id: 'copy',
  },
  cost: {
    defaultMessage: 'Cost',
    description: 'Cost',
    id: 'cost',
  },
  costBreakdownAriaDesc: {
    defaultMessage: 'Breakdown of markup, raw, and usage costs',
    description: 'Breakdown of markup, raw, and usage costs',
    id: 'costBreakdownAriaDesc',
  },
  costBreakdownAriaLabel: {
    defaultMessage: 'A description of markup, raw cost and usage cost',
    description: 'A description of markup, raw cost and usage cost',
    id: 'costBreakdownAriaLabel',
  },
  costBreakdownTitle: {
    defaultMessage: 'Cost breakdown',
    description: 'A description of markup, raw cost and usage cost',
    id: 'costBreakdownTitle',
  },
  costBreakdownTooltip: {
    defaultMessage: '{name}: {value}',
    description: '{name}: {value}',
    id: 'costBreakdownTooltip',
  },
  costCalculations: {
    defaultMessage: 'Cost calculations',
    description: 'Cost calculations',
    id: 'costCalculations',
  },
  costCalculationsOptional: {
    defaultMessage: 'Cost calculations (optional)',
    description: 'Cost calculations (optional)',
    id: 'costCalculationsOptional',
  },
  costCategoryDesc: {
    defaultMessage:
      'Enable your AWS cost categories to be used for report grouping and filtering. Changes will be reflected within 24 hours. {learnMore}',
    description:
      'Enable your AWS cost categories to be used for report grouping and filtering. Changes will be reflected within 24 hours. {learnMore}',
    id: 'costCategoryDesc',
  },
  costCategoryNames: {
    defaultMessage: 'Cost category names',
    description: 'Cost category names',
    id: 'costCategoryNames',
  },
  costCategoryTitle: {
    defaultMessage: 'Cost categories',
    description: 'Cost categories',
    id: 'costCategoryTitle',
  },
  costDistribution: {
    defaultMessage: 'Cost distribution',
    description: 'Cost distribution',
    id: 'costDistribution',
  },
  costDistributionAriaDesc: {
    defaultMessage: 'Overhead cost breakdown of platform, worker unallocated, and total costs',
    description: 'Overhead cost breakdown of platform, worker unallocated, and total costs',
    id: 'costDistributionAriaDesc',
  },
  costDistributionAriaLabel: {
    defaultMessage: 'A description of platform, worker unallocated, and total costs',
    description: 'A description of platform, worker unallocated, and total costs',
    id: 'costDistributionAriaLabel',
  },
  costDistributionLabel: {
    defaultMessage: 'Overhead cost',
    description: 'Overhead cost',
    id: 'costDistributionLabel',
  },
  costDistributionTitle: {
    defaultMessage: 'Overhead cost breakdown',
    description: 'Overhead cost breakdown',
    id: 'costDistributionTitle',
  },
  costDistributionType: {
    defaultMessage:
      '{value, select, ' +
      'distributed {Distribute through cost models} ' +
      "total {Don't distribute overhead costs} " +
      'other {}}',
    description: 'Cost distribution type',
    id: 'costDistributionType',
  },
  costManagement: {
    defaultMessage: 'Cost management',
    description: 'Cost management',
    id: 'costManagement',
  },
  costManagementDocs: {
    defaultMessage: 'Cost management documentation',
    description: 'Cost management documentation',
    id: 'costManagementDocs',
  },
  costModel: {
    defaultMessage: 'Cost model:',
    description: 'Cost model:',
    id: 'costModel',
  },
  costModels: {
    defaultMessage: 'Cost models',
    description: 'Cost models',
    id: 'costModels',
  },
  costModelsActions: {
    defaultMessage: 'Cost model actions',
    description: 'Cost models',
    id: 'costModelsActions',
  },
  costModelsAddGpu: {
    defaultMessage: 'Add more GPUs',
    description: 'Add more GPUs',
    id: 'costModelsAddGpu',
  },
  costModelsAddTagValues: {
    defaultMessage: 'Add more tag values',
    description: 'Add more tag values',
    id: 'costModelsAddTagValues',
  },
  costModelsAssignSources: {
    defaultMessage: '{count, plural, one {Assign integration} other {Assign integrations}}',
    description: 'Assign integrations -- plural or singular',
    id: 'costModelsAssignSources',
  },
  costModelsAssignSourcesErrorDesc: {
    defaultMessage:
      'You cannot assign a integration at this time. Try refreshing this page. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'You cannot assign a integration at this time',
    id: 'costModelsAssignSourcesErrorDesc',
  },
  costModelsAssignSourcesErrorTitle: {
    defaultMessage: 'This action is temporarily unavailable',
    description: 'This action is temporarily unavailable',
    id: 'costModelsAssignSourcesErrorTitle',
  },
  costModelsAssignSourcesParen: {
    defaultMessage: 'Assign integrations',
    description: 'Assign integrations',
    id: 'costModelsAssignSourcesParen',
  },
  costModelsAssignedSources: {
    defaultMessage: 'Assigned integrations',
    description: 'Assigned integrations',
    id: 'costModelsAssignedSources',
  },
  costModelsAvailableSources: {
    defaultMessage: 'The following integrations are assigned to my production cost model:',
    description: 'The following integrations are assigned to my production cost model:',
    id: 'costModelsAvailableSources',
  },
  costModelsCanDelete: {
    defaultMessage: 'This action will delete {name} cost model from the system. This action cannot be undone',
    description: 'This action will delete {name} cost model from the system. This action cannot be undone',
    id: 'costModelsCanDelete',
  },
  costModelsCanNotDelete: {
    defaultMessage: 'The following integrations are assigned to {name} cost model:',
    description: 'The following integrations are assigned to {name} cost model:',
    id: 'costModelsCanNotDelete',
  },
  costModelsDelete: {
    defaultMessage: 'Delete cost model',
    description: 'Delete cost model',
    id: 'costModelsDelete',
  },
  costModelsDeleteDesc: {
    defaultMessage: 'This action will delete {costModel} cost model from the system. This action cannot be undone.',
    description: 'This action will delete {costModel} cost model from the system. This action cannot be undone.',
    id: 'costModelsDeleteDesc',
  },
  costModelsDeleteSource: {
    defaultMessage: 'You must unassign any integrations before you can delete this cost model.',
    description: 'You must unassign any integrations before you can delete this cost model.',
    id: 'costModelsDeleteSource',
  },
  costModelsDesc: {
    defaultMessage:
      'Cost models can help you analyze and predict future costs. Associate a price to metrics provided by your integrations to calculate your charges for resource usage. {learnMore}',
    description:
      'Cost models can help you analyze and predict future costs. Associate a price to metrics provided by your integrations to calculate your charges for resource usage. {learnMore}',
    id: 'costModelsDesc',
  },
  costModelsDescTooLong: {
    defaultMessage: 'Should not exceed 500 characters',
    description: 'Should not exceed 500 characters',
    id: 'costModelsDescTooLong',
  },
  costModelsDetailsTitle: {
    defaultMessage: 'Cost model details',
    description: 'Cost model details',
    id: 'costModelsDetailsTitle',
  },
  costModelsDistributionDesc: {
    defaultMessage:
      'The following is the type of metric that is set to be used when distributing costs to the project level breakdowns.',
    description:
      'The following is the type of metric that is set to be used when distributing costs to the project level breakdowns.',
    id: 'costModelsDistributionDesc',
  },
  costModelsDistributionEdit: {
    defaultMessage: 'Edit distribution',
    description: 'Edit distribution',
    id: 'costModelsDistributionEdit',
  },
  costModelsEmptyState: {
    defaultMessage: 'What is your hybrid cloud costing you?',
    description: 'What is your hybrid cloud costing you?',
    id: 'costModelsEmptyState',
  },
  costModelsEmptyStateDesc: {
    defaultMessage:
      'Create a cost model to start calculating your hybrid cloud costs using custom price lists, markups, or both. Click on the button below to begin the journey.',
    description:
      'Create a cost model to start calculating your hybrid cloud costs using custom price lists, markups, or both. Click on the button below to begin the journey.',
    id: 'costModelsEmptyStateDesc',
  },
  costModelsEmptyStateLearnMore: {
    defaultMessage: 'Read about setting up a cost model',
    description: 'Read about setting up a cost model',
    id: 'costModelsEmptyStateLearnMore',
  },
  costModelsEnterGpuDesc: {
    defaultMessage: 'Enter a description',
    description: 'Enter a description',
    id: 'costModelsEnterGpuDesc',
  },
  costModelsEnterTagDesc: {
    defaultMessage: 'Enter a tag description',
    description: 'Enter a tag description',
    id: 'costModelsEnterTagDesc',
  },
  costModelsEnterTagKey: {
    defaultMessage: 'Enter a tag key',
    description: 'Enter a tag key',
    id: 'costModelsEnterTagKey',
  },
  costModelsEnterTagRate: {
    defaultMessage: 'Enter rate by tag',
    description: 'Enter rate by tag',
    id: 'costModelsEnterTagRate',
  },
  costModelsEnterTagValue: {
    defaultMessage: 'Enter a tag value',
    description: 'Enter a tag value',
    id: 'costModelsEnterTagValue',
  },
  costModelsExamplesDoubleMarkup: {
    defaultMessage: 'A markup rate of (+) 100% doubles the base costs of your integrations.',
    description: 'A markup rate of (+) 100% doubles the base costs of your integrations.',
    id: 'costModelsExamplesDoubleMarkup',
  },
  costModelsExamplesNoAdjust: {
    defaultMessage:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your integrations.',
    description:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your integrations.',
    id: 'costModelsExamplesNoAdjust',
  },
  costModelsExamplesReduceSeventyfive: {
    defaultMessage:
      'A discount rate of (-) 25% reduces the base costs of your integrations to 75% of the original value.',
    description: 'A discount rate of (-) 25% reduces the base costs of your integrations to 75% of the original value.',
    id: 'costModelsExamplesReduceSeventyfive',
  },
  costModelsExamplesReduceZero: {
    defaultMessage: 'A discount rate of (-) 100% reduces the base costs of your integrations to 0.',
    description: 'A discount rate of (-) 100% reduces the base costs of your integrations to 0.',
    id: 'costModelsExamplesReduceZero',
  },
  costModelsFilterPlaceholder: {
    defaultMessage: 'Filter by name...',
    description: 'Filter by name',
    id: 'costModelsFilterPlaceholder',
  },
  costModelsFilterTagKey: {
    defaultMessage: 'Filter by tag key',
    description: 'Filter by tag key',
    id: 'costModelsFilterTagKey',
  },
  costModelsGpuDesc: {
    defaultMessage: 'Rate of GPU models will apply to all the same models in your cluster.',
    description: 'Rate of GPU models will apply to all the same models in your cluster.',
    id: 'costModelsGpuDesc',
  },
  costModelsGpuLearnMore: {
    defaultMessage: 'Read more about GPUs by reviewing our documentation.',
    description: 'Read more about GPUs by reviewing our documentation.',
    id: 'costModelsGpuLearnMore',
  },
  costModelsInfoTooLong: {
    defaultMessage: 'Should not exceed 100 characters',
    description: 'Should not exceed 100 characters',
    id: 'costModelsInfoTooLong',
  },
  costModelsLastUpdated: {
    defaultMessage: 'Last updated',
    description: 'Last updated',
    id: 'costModelsLastUpdated',
  },
  costModelsGpuModel: {
    defaultMessage: 'Model',
    description: 'Model',
    id: 'costModelsGpuModel',
  },
  costModelsGpuVendor: {
    defaultMessage: 'Vendor',
    description: 'Vendor',
    id: 'costModelsGpuVendor',
  },
  costModelsRateTooLong: {
    defaultMessage: 'Should not exceed 10 decimals',
    description: 'Should not exceed 10 decimals',
    id: 'costModelsRateTooLong',
  },
  costModelsRefreshDialog: {
    defaultMessage: 'Refresh this dialog',
    description: 'Refresh this dialog',
    id: 'costModelsRefreshDialog',
  },
  costModelsRemoveGpuLabel: {
    defaultMessage: 'Remove GPU value',
    description: 'Remove GPU value',
    id: 'costModelsRemoveGpuLabel',
  },
  costModelsRemoveTagLabel: {
    defaultMessage: 'Remove tag value',
    description: 'Remove tag value',
    id: 'costModelsRemoveTagLabel',
  },
  costModelsRequiredField: {
    defaultMessage: 'This field is required',
    description: 'This field is required',
    id: 'costModelsRequiredField',
  },
  costModelsRouterErrorTitle: {
    defaultMessage: 'Fail routing to cost model',
    description: 'Cost models router error title',
    id: 'costModelsRouterErrorTitle',
  },
  costModelsRouterServerError: {
    defaultMessage: 'Server error: could not get the cost model.',
    description: 'Server error: could not get the cost model.',
    id: 'costModelsRouterServerError',
  },
  costModelsSelectMeasurement: {
    defaultMessage: 'Select measurement',
    description: 'Select measurement',
    id: 'costModelsSelectMeasurement',
  },
  costModelsSelectMetric: {
    defaultMessage: 'Select metric',
    description: 'Select metric',
    id: 'costModelsSelectMetric',
  },
  costModelsSourceDelete: {
    defaultMessage: 'Unassign',
    description: 'Unassign',
    id: 'costModelsSourceDelete',
  },
  costModelsSourceDeleteSource: {
    defaultMessage: 'Unassign integration',
    description: 'Unassign integration',
    id: 'costModelsSourceDeleteSource',
  },
  costModelsSourceDeleteSourceDesc: {
    defaultMessage:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new integration.',
    description:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new integration.',
    id: 'costModelsSourceDeleteSourceDesc',
  },
  costModelsSourceEmptyStateDesc: {
    defaultMessage: 'Select the integrations you want to apply this cost model to.',
    description: 'Select the integrations you want to apply this cost model to.',
    id: 'costModelsSourceEmptyStateDesc',
  },
  costModelsSourceEmptyStateTitle: {
    defaultMessage: 'No integrations are assigned',
    description: 'No integrations are assigned',
    id: 'costModelsSourceEmptyStateTitle',
  },
  costModelsSourceTableAriaLabel: {
    defaultMessage: 'Integrations table',
    description: 'Integrations table',
    id: 'costModelsSourceTableAriaLabel',
  },
  costModelsTableAriaLabel: {
    defaultMessage: 'Cost models table',
    description: 'Cost models table',
    id: 'costModelsTableAriaLabel',
  },
  costModelsTagRateTableKey: {
    defaultMessage: 'Tag key',
    description: 'Tag key',
    id: 'costModelsTagRateTableKey',
  },
  costModelsTagRateTableValue: {
    defaultMessage: 'Tag value',
    description: 'Tag value',
    id: 'costModelsTagRateTableValue',
  },
  costModelsUnsupportedTagChars: {
    defaultMessage: 'Match the regex [a-zA-Z_][a-zA-Z0-9_]*',
    description: 'Match the regex [a-zA-Z_][a-zA-Z0-9_]*',
    id: 'costModelsUnsupportedTagChars',
  },
  costModelsUUIDEmptyState: {
    defaultMessage: 'Cost model can not be found',
    description: 'Cost model can not be found',
    id: 'costModelsUUIDEmptyState',
  },
  costModelsUUIDEmptyStateDesc: {
    defaultMessage: 'Cost model with uuid: {uuid} does not exist.',
    description: 'Cost model with uuid: {uuid} does not exist.',
    id: 'costModelsUUIDEmptyStateDesc',
  },
  costModelsWizardCreateCostModel: {
    defaultMessage: 'Create cost model',
    description: 'Create cost model',
    id: 'costModelsWizardCreateCostModel',
  },
  costModelsWizardCreatePriceList: {
    defaultMessage: 'Create a price list',
    description: 'Create a price list',
    id: 'costModelsWizardCreatePriceList',
  },
  costModelsWizardCurrencyToggleLabel: {
    defaultMessage: 'Select currency',
    description: 'Select currency',
    id: 'costModelsWizardCurrencyToggleLabel',
  },
  costModelsWizardEmptySourceTypeLabel: {
    defaultMessage: 'Select integration',
    description: 'Select integration',
    id: 'costModelsWizardEmptySourceTypeLabel',
  },
  costModelsWizardEmptyStateOtherTime: {
    defaultMessage: 'You can create a price list or modify one at a later time.',
    description: 'You can create a price list or modify one at a later time.',
    id: 'costModelsWizardEmptyStateOtherTime',
  },
  costModelsWizardEmptyStateSkipStep: {
    defaultMessage: 'To skip this step, click the {value} button.',
    description: 'To skip this step, click the {next} button.',
    id: 'costModelsWizardEmptyStateSkipStep',
  },
  costModelsWizardEmptyStateTitle: {
    defaultMessage: 'A price list has not been created.',
    description: 'A price list has not been created.',
    id: 'costModelsWizardEmptyStateTitle',
  },
  costModelsWizardGeneralInfoTitle: {
    defaultMessage: 'Enter general information',
    description: 'Enter general information',
    id: 'costModelsWizardGeneralInfoTitle',
  },
  costModelsWizardNoRatesAdded: {
    defaultMessage: 'No rates were added to the price list',
    description: 'No rates were added to the price list',
    id: 'costModelsWizardNoRatesAdded',
  },
  costModelsWizardOnboardOcp: {
    defaultMessage: 'Red Hat OpenShift Container Platform',
    description: 'Red Hat OpenShift Container Platform',
    id: 'costModelsWizardOnboardOcp',
  },
  costModelsWizardPriceListMetric: {
    defaultMessage:
      'Select the metric you want to assign a price to, and specify a measurement unit and rate. You can optionally set multiple rates for particular tags.',
    description:
      'Select the metric you want to assign a price to, and specify a measurement unit and rate. You can optionally set multiple rates for particular tags.',
    id: 'costModelsWizardPriceListMetric',
  },
  costModelsWizardRateAriaLabel: {
    defaultMessage: 'Assign rate',
    description: 'Assign rate',
    id: 'costModelsWizardRateAriaLabel',
  },
  costModelsWizardReviewMarkDiscount: {
    defaultMessage: 'Markup/Discount',
    description: 'No Markup/Discount',
    id: 'costModelsWizardReviewMarkDiscount',
  },
  costModelsWizardReviewStatusSubDetails: {
    defaultMessage:
      'Review and confirm your cost model configuration and assignments. Click {create} to create the cost model, or {back} to revise.',
    description:
      'Review and confirm your cost model configuration and assignments. Click {create} to create the cost model, or {back} to revise.',
    id: 'costModelsWizardReviewStatusSubDetails',
  },
  costModelsWizardReviewStatusSubTitle: {
    defaultMessage:
      'Costs for resources connected to the assigned integrations will now be calculated using the newly created {value} cost model.',
    description:
      'Costs for resources connected to the assigned integrations will now be calculated using the newly created {value} cost model.',
    id: 'costModelsWizardReviewStatusSubTitle',
  },
  costModelsWizardReviewStatusTitle: {
    defaultMessage: 'Creation successful',
    description: 'Creation successful',
    id: 'costModelsWizardReviewStatusTitle',
  },
  costModelsWizardSourceCaption: {
    defaultMessage:
      '{value, select, ' +
      'aws {Select from the following Amazon Web Services integrations:} ' +
      'azure {Select from the following Microsoft Azure integrations:} ' +
      'gcp {Select from the following Google Cloud integrations:} ' +
      'ocp {Select from the following Red Hat OpenShift integrations:} ' +
      'other {}}',
    description: 'Select from the following {value} integrations:',
    id: 'costModelsWizardSourceCaption',
  },
  costModelsWizardSourceErrorDesc: {
    defaultMessage:
      'Try refreshing this step or you can skip this step (as it is optional) and assign the integration to the cost model at a later time. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'This step is temporarily unavailable',
    id: 'costModelsWizardSourceErrorDesc',
  },
  costModelsWizardSourceErrorTitle: {
    defaultMessage: 'This step is temporarily unavailable',
    description: 'This step is temporarily unavailable',
    id: 'costModelsWizardSourceErrorTitle',
  },
  costModelsWizardSourceSubtitle: {
    defaultMessage:
      'Select one or more integrations to this cost model. You can skip this step and assign the cost model to a integration at a later time. An integration will be unavailable for selection if a cost model is already assigned to it.',
    description:
      'Select one or more integrations to this cost model. You can skip this step and assign the cost model to a integration at a later time. An integration will be unavailable for selection if a cost model is already assigned to it.',
    id: 'costModelsWizardSourceSubtitle',
  },
  costModelsWizardSourceTableAriaLabel: {
    defaultMessage: 'Assign integrations to cost model table',
    description: 'Assign integrations to cost model table',
    id: 'costModelsWizardSourceTableAriaLabel',
  },
  costModelsWizardSourceTableCostModel: {
    defaultMessage: 'Cost model assigned',
    description: 'Cost model assigned',
    id: 'costModelsWizardSourceTableCostModel',
  },
  costModelsWizardSourceTableDefaultCostModel: {
    defaultMessage: 'Default cost model',
    description: 'Default cost model',
    id: 'costModelsWizardSourceTableDefaultCostModel',
  },
  costModelsWizardSourceTitle: {
    defaultMessage: 'Assign integrations to the cost model (optional)',
    description: 'Assign integrations to the cost model (optional)',
    id: 'costModelsWizardSourceTitle',
  },
  costModelsWizardSourceWarning: {
    defaultMessage:
      'This integration is assigned to the "{costModel}" cost model. You will have to unassigned it first',
    description: 'This integration is assigned to the "{costModel}" cost model. You will have to unassigned it first',
    id: 'costModelsWizardSourceWarning',
  },
  costModelsWizardStepsGenInfo: {
    defaultMessage: 'Enter information',
    description: 'Enter information',
    id: 'costModelsWizardStepsGenInfo',
  },
  costModelsWizardStepsReview: {
    defaultMessage: 'Review details',
    description: 'Review details',
    id: 'costModelsWizardStepsReview',
  },
  costModelsWizardStepsSources: {
    defaultMessage: 'Assign an integration to the cost model',
    description: 'Assign an integration to the cost model',
    id: 'costModelsWizardStepsSources',
  },
  costModelsWizardSubTitleTable: {
    defaultMessage: 'The following is a list of rates you have set so far for this price list.',
    description: 'The following is a list of rates you have set so far for this price list.',
    id: 'costModelsWizardSubTitleTable',
  },
  costModelsWizardWarningSources: {
    defaultMessage: 'Cannot assign cost model to an integration that is already assigned to another one',
    description: 'No Cannot assign cost model to an integration that is already assigned to another one',
    id: 'costModelsWizardWarningSources',
  },
  costTypeAmortized: {
    defaultMessage: 'Amortized',
    description: 'Amortized cost type',
    id: 'costTypeAmortized',
  },
  costTypeAmortizedDesc: {
    defaultMessage: 'Recurring and/or upfront costs are distributed evenly across the month',
    description: 'Recurring and/or upfront costs are distributed evenly across the month',
    id: 'costTypeAmortizedDesc',
  },
  costTypeBlended: {
    defaultMessage: 'Blended',
    description: 'Blended cost type',
    id: 'costTypeBlended',
  },
  costTypeBlendedDesc: {
    defaultMessage: 'Using a blended rate to calcuate cost usage',
    description: 'Using a blended rate to calcuate cost usage',
    id: 'costTypeBlendedDesc',
  },
  costTypeLabel: {
    defaultMessage: 'Show cost as',
    description: 'Show cost as',
    id: 'costTypeLabel',
  },
  costTypeSettingsDesc: {
    defaultMessage:
      'Select the preferred way of calculating upfront costs of savings plans or subscription fees. This feature is available for Amazon Web Services cost only.',
    description:
      'Select the preferred way of calculating upfront costs of savings plans or subscription fees. This feature is available for Amazon Web Services cost only.',
    id: 'costTypeSettingsDesc',
  },
  costTypeSettingsLabel: {
    defaultMessage: 'Show cost as (Amazon Web Services only)',
    description: 'Show cost as (Amazon Web Services only)',
    id: 'costTypeSettingsLabel',
  },
  costTypeUnblended: {
    defaultMessage: 'Unblended',
    description: 'Unblended cost type',
    id: 'costTypeUnblended',
  },
  costTypeUnblendedDesc: {
    defaultMessage: 'Usage cost on the day you are charged',
    description: 'Usage cost on the day you are charged',
    id: 'costTypeUnblendedDesc',
  },
  cpuTitle: {
    defaultMessage: 'CPU',
    description: 'CPU',
    id: 'cpuTitle',
  },
  create: {
    defaultMessage: 'Create',
    description: 'Create',
    id: 'create',
  },
  createCostModelConfirmMsg: {
    defaultMessage: 'Are you sure you want to stop creating a cost model? All settings will be discarded.',
    description: 'Are you sure you want to stop creating a cost model? All settings will be discarded.',
    id: 'createCostModelConfirmMsg',
  },
  createCostModelDesc: {
    defaultMessage:
      'A cost model allows you to associate a price to metrics provided by your integrations to charge for utilization of resources.',
    description:
      'A cost model allows you to associate a price to metrics provided by your integrations to charge for utilization of resources.',
    id: 'createCostModelDesc',
  },
  createCostModelExit: {
    defaultMessage: 'Exit cost model creation',
    description: 'Exit cost model creation',
    id: 'createCostModelExit',
  },
  createCostModelExitYes: {
    defaultMessage: 'Yes, I want to exit',
    description: 'Yes, I want to exit',
    id: 'createCostModelExitYes',
  },
  createCostModelNoContinue: {
    defaultMessage: 'No, I want to continue',
    description: 'No, I want to continue',
    id: 'createCostModelNoContinue',
  },
  createCostModelTitle: {
    defaultMessage: 'Create a cost model',
    description: 'Create a cost model',
    id: 'createCostModelTitle',
  },
  createRate: {
    defaultMessage: 'Create rate',
    description: 'Create rate',
    id: 'createRate',
  },
  createTagMapping: {
    defaultMessage: 'Create tag mapping',
    description: 'Create tag mapping',
    id: 'createTagMapping',
  },
  credit: {
    defaultMessage: 'Credit',
    description: 'Credit',
    id: 'credit',
  },
  criteriaValues: {
    defaultMessage: '{value, select, ' + 'exact {exact} ' + 'exclude {excludes} ' + 'include {includes} ' + 'other {}}',
    description: 'Exclude filter values',
    id: 'criteriaValues',
  },
  currency: {
    defaultMessage: 'Currency',
    description: 'Currency',
    id: 'currency',
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
  currencyCalcuationsTitle: {
    defaultMessage: 'Currency and calculations',
    description: 'Currency and calculations',
    id: 'currencyCalcuationsTitle',
  },
  currencyDesc: {
    defaultMessage: 'Select the preferred currency view for your organization',
    description: 'Select the preferred currency view for your organization',
    id: 'currencyDesc',
  },
  // See https://www.localeplanet.com/icu/currency.html
  currencyOptions: {
    defaultMessage:
      '{units, select, ' +
      'AED {AED (د.إ) - United Arab Emirates Dirham}' +
      'AUD {AUD (A$) - Australian Dollar}' +
      'BRL {BRL (R$) - Brazilian Real}' +
      'CAD {CAD (CA$) - Canadian Dollar}' +
      'CHF {CHF (CHF) - Swiss Franc}' +
      'CNY {CNY (CN¥) - Chinese Yuan}' +
      'CZK {CZK (Kč) - Czech Koruna}' +
      'DKK {DKK (kr) - Danish Krone}' +
      'EUR {EUR (€) - Euro}' +
      'GBP {GBP (£) - British Pound}' +
      'HKD {HKD (HK$) - Hong Kong Dollar}' +
      'INR {INR (₹) - Indian Rupee}' +
      'JPY {JPY (¥) - Japanese Yen}' +
      'NGN {NGN (₦) - Nigerian Naira}' +
      'NOK {NOK (kr) - Norwegian Krone}' +
      'NZD {NZD (NZ$) - New Zealand Dollar}' +
      'SAR {SAR (ر.س) - Saudi Riyal}' +
      'SEK {SEK (kr) - Swedish Krona}' +
      'SGD {SGD (S$) - Singapore Dollar}' +
      'TWD {TWD (NT$) - New Taiwan Dollar}' +
      'USD {USD ($) - United States Dollar} ' +
      'ZAR {ZAR (R) - South African Rand}' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'currencyOptions',
  },
  // See https://www.localeplanet.com/icu/currency.html
  currencyUnits: {
    defaultMessage:
      '{units, select, ' +
      'AED {د.إ}' +
      'AUD {A$}' +
      'BRL {R$}' +
      'CAD {CA$}' +
      'CHF {CHF}' +
      'CNY {CN¥}' +
      'CZK {Kč}' +
      'DKK {kr}' +
      'EUR {€}' +
      'GBP {£}' +
      'HKD {HK$}' +
      'INR {₹}' +
      'JPY {¥}' +
      'NGN {₦}' +
      'NOK {kr}' +
      'NZD {NZ$}' +
      'SAR {﷼}' +
      'SEK {kr}' +
      'SGD {S$}' +
      'TWD {NT$}' +
      'USD {$} ' +
      'ZAR {R}' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'currencyUnits',
  },
  dashboardCumulativeCostComparison: {
    defaultMessage: 'Cumulative cost comparison ({units})',
    description: 'Cumulative cost comparison ({units})',
    id: 'dashboardCumulativeCostComparison',
  },
  dashboardDailyUsageComparison: {
    defaultMessage: 'Daily usage comparison ({units})',
    description: 'Daily usage comparison ({units})',
    id: 'dashboardDailyUsageComparison',
  },
  dashboardDatabaseTitle: {
    defaultMessage: 'Database services cost',
    description: 'Database services cost',
    id: 'dashboardDatabaseTitle',
  },
  dashboardNetworkTitle: {
    defaultMessage: 'Network services cost',
    description: 'Network services cost',
    id: 'dashboardNetworkTitle',
  },
  dashboardStorageTitle: {
    defaultMessage: 'Storage services usage',
    description: 'Storage services usage',
    id: 'dashboardStorageTitle',
  },
  dashboardTotalCostTooltip: {
    defaultMessage:
      'This total cost is the sum of the infrastructure cost {infrastructureCost} and supplementary cost {supplementaryCost}',
    description: 'total cost is the sum of the infrastructure cost and supplementary cost',
    id: 'dashboardTotalCostTooltip',
  },
  dataDetails: {
    defaultMessage: 'Data details',
    description: 'Data details',
    id: 'dataDetails',
  },
  dataDetailsAvailability: {
    defaultMessage: 'Data availability',
    description: 'Data availability',
    id: 'dataDetailsAvailability',
  },
  dataDetailsCloudData: {
    defaultMessage: 'Cloud data',
    description: 'Cloud data',
    id: 'dataDetailsCloudData',
  },
  dataDetailsCloudIntegration: {
    defaultMessage: 'Cloud integration data',
    description: 'Cloud integration data',
    id: 'dataDetailsCloudIntegration',
  },
  dataDetailsCloudIntegrationStatus: {
    defaultMessage: 'Cloud integration status',
    description: 'Cloud integration status',
    id: 'dataDetailsCloudIntegrationStatus',
  },
  dataDetailsClusterData: {
    defaultMessage: 'Cluster data',
    description: 'Cluster data',
    id: 'dataDetailsClusterData',
  },
  dataDetailsCostManagementData: {
    defaultMessage: 'Cost management data',
    description: 'Cost management data',
    id: 'dataDetailsCostManagementData',
  },
  dataDetailsIntegrationAndFinalization: {
    defaultMessage: 'Data integration and finalization',
    description: 'Data integration and finalization',
    id: 'dataDetailsIntegrationAndFinalization',
  },
  dataDetailsIntegrationStatus: {
    defaultMessage: 'Red Hat integration status',
    description: 'Red Hat integration status',
    id: 'dataDetailsIntegrationStatus',
  },
  dataDetailsProcessing: {
    defaultMessage: 'Data processing',
    description: 'Data processing',
    id: 'dataDetailsProcessing',
  },
  dataDetailsRetrieval: {
    defaultMessage: 'Data retrieval',
    description: 'Data retrieval',
    id: 'dataDetailsRetrieval',
  },
  dataTableAriaLabel: {
    defaultMessage: 'Details table',
    description: 'Details table',
    id: 'dataTableAriaLabel',
  },
  datePickerAfterError: {
    defaultMessage: 'Date is after the allowable range',
    description: 'Date is after the allowable range',
    id: 'datePickerAfterError',
  },
  datePickerBeforeError: {
    defaultMessage: 'Date is before the allowable range',
    description: 'Date is before the allowable range',
    id: 'datePickerBeforeError',
  },
  datePickerEndDateAriaLabel: {
    defaultMessage: 'End date',
    description: 'End date',
    id: 'datePickerEndDateAriaLabel',
  },
  datePickerStartDateAriaLabel: {
    defaultMessage: 'Start date',
    description: 'Start date',
    id: 'datePickerStartDateAriaLabel',
  },
  default: {
    defaultMessage: 'Default',
    description: 'Default',
    id: 'default',
  },
  delete: {
    defaultMessage: 'Delete',
    description: 'Delete',
    id: 'delete',
  },
  description: {
    defaultMessage: 'Description',
    description: 'Description',
    id: 'description',
  },
  deselectTags: {
    defaultMessage:
      'Your account is limited to {count} active tags at a time. You must disable some tags to enable others',
    description: 'Your account is limited to 200 active tags at a time. You must disable some tags to enable others',
    id: 'deselectTags',
  },
  detailsActionsExport: {
    defaultMessage: 'Export data',
    description: 'Export data',
    id: 'detailsActionsExport',
  },
  detailsActionsPriceList: {
    defaultMessage: 'View all price lists',
    description: 'View all price lists',
    id: 'detailsActionsPriceList',
  },
  detailsClustersModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {account {name} clusters} ' +
      'aws_category {cost category {name} clusters} ' +
      'cluster {cluster {name} clusters} ' +
      'clusters {Clusters} ' +
      'gcp_project {Google Cloud project {name} clusters} ' +
      'node {node {name} clusters} ' +
      'org_unit_id {organizational unit {name} clusters} ' +
      'payer_tenant_id {account {name} clusters} ' +
      'product_service {service {name} clusters} ' +
      'project {project {name} clusters} ' +
      'region {region {name} clusters} ' +
      'resource_location {region {name} clusters} ' +
      'service {service {name} clusters} ' +
      'service_name {service {name} clusters} ' +
      'subscription_guid {account {name} clusters} ' +
      'tag {tags {name} clusters} ' +
      'other {}}',
    description: '{groupBy} {name} clusters',
    id: 'detailsClustersModalTitle',
  },
  detailsColumnManagementTitle: {
    defaultMessage: 'Manage columns',
    description: 'Manage columns',
    id: 'detailsColumnManagementTitle',
  },
  detailsCostValue: {
    defaultMessage: 'Cost: {value}',
    description: 'Cost value',
    id: 'detailsCostValue',
  },
  detailsEmptyState: {
    defaultMessage: 'Processing data to generate a list of all services that sums to a total cost...',
    description: 'Processing data to generate a list of all services that sums to a total cost...',
    id: 'detailsEmptyState',
  },
  detailsMore: {
    defaultMessage: '{value} more...',
    description: '{value} more...',
    id: 'detailsMore',
  },
  detailsMoreClusters: {
    defaultMessage: ', {value} more...',
    description: ', {value} more...',
    id: 'detailsMoreClusters',
  },
  detailsResourceNames: {
    defaultMessage:
      '{value, select, ' +
      'account {Account names} ' +
      'aws_category {Cost category names} ' +
      'cluster {Cluster names} ' +
      'cpu {CPU} ' +
      'gcp_project {Google Cloud project names} ' +
      'group {Group} ' +
      'instance {Instance names} ' +
      'instance_type {Instance type} ' +
      'memory {Memory} ' +
      'name {Name} ' +
      'node {Node names} ' +
      'org_unit_id {Organizational unit names} ' +
      'os {OS} ' +
      'operating_system {Operating system} ' +
      'payer_tenant_id {Account names} ' +
      'product_service {Service names} ' +
      'project {Project names} ' +
      'region {Region names} ' +
      'resource_location {Region names} ' +
      'service {Service names} ' +
      'service_name {Service names} ' +
      'status {Status} ' +
      'subscription_guid {Account names} ' +
      'source_type {Integration} ' +
      'storage {Storage} ' +
      'tag {Tag names} ' +
      'tags {Tags} ' +
      'tag_key {Tag keys} ' +
      'usage {Usage} ' +
      'vcpu {vCPU} ' +
      'vm_name {Virtual machine names} ' +
      'other {}}',
    description: 'Details table resource names',
    id: 'detailsResourceNames',
  },
  detailsSummaryModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{name} accounts} ' +
      'aws_category {{name} cost categories} ' +
      'cluster {{name} clusters} ' +
      'gcp_project {{name} Google Cloud projects} ' +
      'node {{name} nodes} ' +
      'org_unit_id {{name} organizational units} ' +
      'payer_tenant_id {{name} accounts} ' +
      'product_service {{name} services} ' +
      'project {{name} projects} ' +
      'region {{name} regions} ' +
      'resource_location {{name} regions} ' +
      'service {{name} services} ' +
      'service_name {{name} services} ' +
      'storageclass{{name} storage types} ' +
      'subscription_guid {{name} accounts} ' +
      'tag {{name} tags} ' +
      'other {}}',
    description: ', {value} more...',
    id: 'detailsSummaryModalTitle',
  },
  detailsUnusedCapacityLabel: {
    defaultMessage: 'Unused capacity',
    description: 'Unused capacity',
    id: 'detailsUnusedCapacityLabel',
  },
  detailsUnusedRequestsLabel: {
    defaultMessage: 'Unused requests',
    description: 'Unused requests',
    id: 'detailsUnusedRequestsLabel',
  },
  detailsUnusedUnits: {
    defaultMessage: '{units} ({percentage}% of capacity)',
    description: '{units} ({percentage}% of capacity)',
    id: 'detailsUnusedUnits',
  },
  detailsUsageCapacity: {
    defaultMessage: 'Capacity - {value} {units}',
    description: 'Capacity - {value} {units}',
    id: 'detailsUsageCapacity',
  },
  detailsUsageLimit: {
    defaultMessage: 'Limit - {value} {units}',
    description: 'Limit - {value} {units}',
    id: 'detailsUsageLimit',
  },
  detailsUsageRequests: {
    defaultMessage: 'Requests - {value} {units}',
    description: 'Requests - {value} {units}',
    id: 'detailsUsageRequests',
  },
  detailsUsageUsage: {
    defaultMessage: 'Usage - {value} {units}',
    description: 'Usage - {value} {units}',
    id: 'detailsUsageUsage',
  },
  detailsViewAll: {
    defaultMessage:
      '{value, select, ' +
      'account {View all accounts} ' +
      'aws_category {View all cost categories} ' +
      'cluster {View all clusters} ' +
      'gcp_project {View all Google Cloud projects} ' +
      'node {View all nodes} ' +
      'org_unit_id {View all organizational units} ' +
      'payer_tenant_id {View all accounts} ' +
      'product_service {View all services} ' +
      'project {View all projects} ' +
      'region {View all regions} ' +
      'resource_location {View all regions} ' +
      'service {View all Services} ' +
      'service_name {View all services} ' +
      'storageclass {View all storage types} ' +
      'subscription_guid {View all accounts} ' +
      'tag {View all tags} ' +
      'other {}}',
    description: 'View all {value}',
    id: 'detailsViewAll',
  },
  disableCategories: {
    defaultMessage: 'Disable categories',
    description: 'Disable categories',
    id: 'disableCategories',
  },
  disableTags: {
    defaultMessage: 'Disable tags',
    description: 'Disable tags',
    id: 'disableTags',
  },
  disabled: {
    defaultMessage: 'Disabled',
    description: 'Disabled',
    id: 'disabled',
  },
  discountMinus: {
    defaultMessage: 'Discount (-)',
    description: 'Discount (-)',
    id: 'discountMinus',
  },
  distribute: {
    defaultMessage: 'Distribute',
    description: 'Distribute',
    id: 'distribute',
  },
  distributeCosts: {
    defaultMessage:
      '{value, select, ' +
      'true {Distribute {type, select, network {network} storage {storage} other {}} unattributed costs}' +
      'false {Do not distribute {type, select, network {network} storage {storage} other {}} unattributed costs}' +
      'other {}}',
    description: 'distribute costs',
    id: 'distributeCosts',
  },
  distributeGpuCosts: {
    defaultMessage:
      '{value, select, ' +
      'true {Distribute costs based on GPU usage}' +
      'false {Do not distribute costs based on GPU usage}' +
      'other {}}',
    description: 'distribute costs',
    id: 'distributeGpuCosts',
  },
  distributeCostsToProjects: {
    defaultMessage: 'Distribute these costs to pods',
    description: 'Distribute these costs to pods',
    id: 'distributeCostsToProjects',
  },
  distributeGpu: {
    defaultMessage: 'GPU unallocated (distribute based on GPU usage)',
    description: 'GPU unallocated (distribute based on GPU usage)',
    id: 'distributeGpu',
  },
  distributeNetwork: {
    defaultMessage: 'Network unattributed',
    description: 'Network unattributed',
    id: 'distributeNetwork',
  },
  distributePlatform: {
    defaultMessage: 'Platform overhead (OpenShift services and platform projects)',
    description: 'Platform overhead (OpenShift services and platform projects)',
    id: 'distributePlatform',
  },
  distributePlatformCosts: {
    defaultMessage:
      '{value, select, ' +
      'true {Distribute platform costs based on unallocated capacity}' +
      'false {Do not distribute platform costs based on unallocated capacity}' +
      'other {}}',
    description: 'Distribute platform costs',
    id: 'distributePlatformCosts',
  },
  distributeStorage: {
    defaultMessage: 'Storage unattributed',
    description: 'Storage unattributed',
    id: 'distributeStorage',
  },
  distributeUnallocatedCapacity: {
    defaultMessage:
      '{value, select, ' +
      'true {Distribute worker unallocated capacity}' +
      'false {Do not distribute worker unallocated capacity}' +
      'other {}}',
    description: 'Distribute unallocated capacity',
    id: 'distributeUnallocatedCapacity',
  },
  distributeWorker: {
    defaultMessage: 'Worker unallocated (unused and non-reserved resources)',
    description: 'Worker unallocated (unused and non-reserved resources)',
    id: 'distributeWorker',
  },
  distributionModelDesc: {
    defaultMessage: 'Choose how your raw costs are distributed at the project level.',
    description: 'Choose how your raw costs are distributed at the project level.',
    id: 'distributionModelDesc',
  },
  distributionType: {
    defaultMessage: 'Distribution type',
    description: 'Distribution type',
    id: 'distributionType',
  },
  distributionTypeDesc: {
    defaultMessage:
      '{type, select, ' +
      'cpu {Distribute costs based on CPU usage}' +
      'memory {Distribute costs based on memory usage}' +
      'other {}}',
    description: 'Distribution type description',
    id: 'distributionTypeDesc',
  },
  docsAccomplish: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/getting_started_with_cost_management/about-cost-management#what_can_you_accomplish_with_cost_management',
    description: 'What can you accomplish with cost management?',
    id: 'docsAccomplish',
  },
  docsCostCategory: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging/assembly-configuring-tags-and-labels-in-cost-management#configuring-categories_configuring-tags-int',
    description: 'Configuring Amazon Web Services cost categories in cost management',
    id: 'docsCostCategory',
  },
  docsCostManagement: {
    defaultMessage: 'https://docs.redhat.com/en/documentation/cost_management_service/1-latest',
    description: 'Introduction to cost management',
    id: 'docsCostManagement',
  },
  docsCostModelTerminology: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models/index#cost-model-terminology',
    description: 'Cost model terminology',
    id: 'docsCostModelTerminology',
  },
  docsCostModels: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    description: 'Setting up a cost model',
    id: 'docsCostModels',
  },
  docsCostModelsDistribution: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-using-cost-models#distributing_costs',
    description: 'Distributing costs',
    id: 'docsCostModelsDistribution',
  },
  docsCostModelsGpu: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    description: 'Read more about GPUs by reviewing our documentation',
    id: 'docsCostModelsGpu',
  },
  docsCostModelsMarkup: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-setting-up-cost-models#creating-an-AWS-Azure-cost-model_setting-up-cost-models',
    description: 'Applying a markup or discount to cloud integrations',
    id: 'docsCostModelsMarkup',
  },
  docsCostModelsOcp: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-setting-up-cost-models#creating-an-ocp-cost-model_setting-up-cost-models',
    description: 'Creating a cost model for an OpenShift Container Platform cluster',
    id: 'docsCostModelsOcp',
  },
  docsIntegrations: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/#Setting%20up%20integrations',
    description: 'Setting up integrations',
    id: 'docsIntegrations',
  },
  docsIntegrationsAws: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/integrating_amazon_web_services_aws_data_into_cost_management/index',
    description: 'Integrating Amazon Web Services (AWS) data into cost management',
    id: 'docsIntegrationsAws',
  },
  docsIntegrationsAzure: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/integrating_microsoft_azure_data_into_cost_management/index',
    description: 'Integrating Microsoft Azure data into cost management',
    id: 'docsIntegrationsAzure',
  },
  docsIntegrationsGcp: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/integrating_google_cloud_data_into_cost_management/index',
    description: 'Integrating Google Cloud data into cost management',
    id: 'docsIntegrationsGcp',
  },
  docsKokuMetricsOperator: {
    defaultMessage: 'https://github.com/project-koku/koku-metrics-operator',
    description: 'Koku Metrics Operator',
    id: 'docsKokuMetricsOperator',
  },
  docsMetricsOperator: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/integrating_openshift_container_platform_data_into_cost_management/assembly-adding-openshift-container-platform-int?extIdCarryOver=true&sc_cid=701f2000001Css5AAC#installing-cost-operator_adding-an-ocp-int',
    description: 'Installing the cost operator by using OperatorHub',
    id: 'docsMetricsOperator',
  },
  docsOcpCli: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/integrating_openshift_container_platform_data_into_cost_management/assembly-adding-openshift-container-platform-int?extIdCarryOver=true&sc_cid=701f2000001Css5AAC#installing-cost-operator-cli_adding-an-ocp-int',
    description: 'Optional: Installing the cost management operator by using the CLI',
    id: 'docsOcpCli',
  },
  docsPlatformProjects: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-using-cost-models#adding-openshift-projects',
    description: 'Adding OpenShift projects',
    id: 'docsPlatformProjects',
  },
  docsReleases: {
    defaultMessage: 'https://github.com/project-koku/koku/releases',
    description: 'Releases',
    id: 'docsReleases',
  },
  docsTagMapping: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging',
    description: 'Managing cost data using tagging',
    id: 'docsTagMapping',
  },
  docsTags: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging/assembly-configuring-tags-and-labels-in-cost-management',
    description: 'Configuring tags and labels in cost management',
    id: 'docsTags',
  },
  docsTroubleshooting: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/integrating_openshift_container_platform_data_into_cost_management/index?extIdCarryOver=true&sc_cid=701f2000001Css5AAC#verifying-cost-operator_adding-an-ocp-int',
    description: 'Troubleshooting issues with your Cost Management Operator',
    id: 'docsTroubleshooting',
  },
  docsUsingCostModels: {
    defaultMessage:
      'https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models',
    description: 'Using cost models',
    id: 'docsUsingCostModels',
  },
  documentation: {
    defaultMessage: 'Documentation',
    description: 'What can you accomplish with cost management?',
    id: 'documentation',
  },
  download: {
    defaultMessage: 'Download',
    description: 'Download',
    id: 'download',
  },
  edit: {
    defaultMessage: 'Edit',
    description: 'Edit',
    id: 'edit',
  },
  editCostModel: {
    defaultMessage: 'Edit cost model',
    description: 'Edit cost model',
    id: 'editCostModel',
  },
  editMarkup: {
    defaultMessage: 'Edit markup',
    description: 'Edit markup',
    id: 'editMarkup',
  },
  editMarkupOrDiscount: {
    defaultMessage: 'Edit markup or discount',
    description: 'Edit markup or discount',
    id: 'editMarkupOrDiscount',
  },
  emptyFilterSourceStateSubtitle: {
    defaultMessage: 'Sorry, no source with the given filter was found.',
    description: 'Sorry, no source with the given filter was found.',
    id: 'emptyFilterSourceStateSubtitle',
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
  enableCategories: {
    defaultMessage: 'Enable categories',
    description: 'Enabled categories',
    id: 'enableCategories',
  },
  enableTags: {
    defaultMessage: 'Enable tags',
    description: 'Enabled tags',
    id: 'enableTags',
  },
  enabled: {
    defaultMessage: 'Enabled',
    description: 'Enabled',
    id: 'enabled',
  },
  end: {
    defaultMessage: 'End',
    description: 'End',
    id: 'end',
  },
  equalsSymbol: {
    defaultMessage: '=',
    description: 'Equals symbol',
    id: 'equalsSymbol',
  },
  errorStateNotAuthorizedDesc: {
    defaultMessage: 'Contact the cost management administrator to provide access to this application',
    description: 'Contact the cost management administrator to provide access to this application',
    id: 'errorStateNotAuthorizedDesc',
  },
  errorStateNotAuthorizedTitle: {
    defaultMessage: "You don't have access to the cost management application",
    description: "You don't have access to the cost management application",
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
  exactLabel: {
    defaultMessage: 'Exact: {value}',
    description: 'Exact filter label',
    id: 'exactLabel',
  },
  examplesTitle: {
    defaultMessage: 'Examples',
    description: 'Examples',
    id: 'examplesTitle',
  },
  excludeLabel: {
    defaultMessage: 'Excludes: {value}',
    description: 'Excludes filter label',
    id: 'excludeLabel',
  },
  expiresOn: {
    defaultMessage: 'Expires on',
    description: 'Expires on',
    id: 'expiresOn',
  },
  explorerChartAriaTitle: {
    defaultMessage: 'Cost Explorer chart',
    description: 'Cost Explorer chart',
    id: 'explorerChartAriaTitle',
  },
  explorerChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services - Top 5 Costliest} ' +
      'aws_ocp {Amazon Web Services filtered by OpenShift - Top 5 Costliest} ' +
      'azure {Microsoft Azure - Top 5 Costliest} ' +
      'azure_ocp {Microsoft Azure filtered by OpenShift - Top 5 Costliest} ' +
      'gcp {Google Cloud - Top 5 Costliest} ' +
      'gcp_ocp {Google Cloud filtered by OpenShift - Top 5 Costliest} ' +
      'ocp {All OpenShift - Top 5 Costliest} ' +
      'ocp_cloud {All cloud filtered by OpenShift - Top 5 Costliest} ' +
      'other {}}',
    description: 'Cost Explorer chart title',
    id: 'explorerChartTitle',
  },
  explorerDateRange: {
    defaultMessage:
      '{value, select, ' +
      'custom {Custom}' +
      'current_month_to_date {Month to date} ' +
      'last_ninety_days {Last 90 days} ' +
      'last_sixty_days {Last 60 days} ' +
      'last_thirty_days {Last 30 days} ' +
      'previous_month {Previous month} ' +
      'previous_month_to_date {Previous month and month to date} ' +
      'other {}}',
    description: 'Date range based on {value}',
    id: 'explorerDateRange',
  },
  explorerTableAriaLabel: {
    defaultMessage: 'Cost Explorer table',
    description: 'Cost Explorer table',
    id: 'explorerTableAriaLabel',
  },
  explorerTitle: {
    defaultMessage: 'Cost Explorer',
    description: 'Cost Explorer title',
    id: 'explorerTitle',
  },
  exportAggregateType: {
    defaultMessage: 'Aggregate type',
    description: 'Aggregate type',
    id: 'exportAggregateType',
  },
  exportAll: {
    defaultMessage: 'Export all',
    description: 'Export all',
    id: 'exportAll',
  },
  exportDesc: {
    defaultMessage:
      'The active selections from the table plus the values here will be used to generate an export file. When the file is available, download it from the {value} view.',
    description: 'Export description',
    id: 'exportDesc',
  },
  exportError: {
    defaultMessage: 'Something went wrong, please try fewer selections',
    description: 'Export error',
    id: 'exportError',
  },
  exportFileName: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'aws_category {{resolution, select, daily {{provider}_cost_category_daily_{startDate}_{endDate}} monthly {{provider}_cost_category_monthly_{startDate}_{endDate}} other {}}} ' +
      'cluster {{resolution, select, daily {{provider}_clusters_daily_{startDate}_{endDate}} monthly {{provider}_clusters_monthly_{startDate}_{endDate}} other {}}} ' +
      'gcp_project {{resolution, select, daily {{provider}_gcp-projects_daily_{startDate}_{endDate}} monthly {{provider}_gcp-projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'instance {{resolution, select, daily {{provider}_instances_daily_{startDate}_{endDate}} monthly {{provider}_instances_monthly_{startDate}_{endDate}} other {}}} ' +
      'node {{resolution, select, daily {{provider}_node_daily_{startDate}_{endDate}} monthly {{provider}_node_monthly_{startDate}_{endDate}} other {}}} ' +
      'org_unit_id {{resolution, select, daily {{provider}_orgs_daily_{startDate}_{endDate}} monthly {{provider}_orgs_monthly_{startDate}_{endDate}} other {}}} ' +
      'payer_tenant_id {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'product_service {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'project {{resolution, select, daily {{provider}_projects_daily_{startDate}_{endDate}} monthly {{provider}_projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'region {{resolution, select, daily {{provider}_regions_daily_{startDate}_{endDate}} monthly {{provider}_regions_monthly_{startDate}_{endDate}} other {}}} ' +
      'resource_id {{resolution, select, daily {{provider}_resources_daily_{startDate}_{endDate}} monthly {{provider}_resources_monthly_{startDate}_{endDate}} other {}}} ' +
      'resource_location {{resolution, select, daily {{provider}_regions_daily_{startDate}_{endDate}} monthly {{provider}_regions_monthly_{startDate}_{endDate}} other {}}} ' +
      'service {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'service_name {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'subscription_guid {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'tag {{resolution, select, daily {{provider}_tags_daily_{startDate}_{endDate}} monthly {{provider}_tags_monthly_{startDate}_{endDate}} other {}}} ' +
      'other {}}',
    description: 'Export file name',
    id: 'exportFileName',
  },
  exportFormatType: {
    defaultMessage: '{value, select, csv {CSV} json {JSON} other {}}',
    description: 'Export format type',
    id: 'exportFormatType',
  },
  exportFormatTypeTitle: {
    defaultMessage: 'Format type',
    description: 'Format type',
    id: 'exportFormatTypeTitle',
  },
  exportGenerate: {
    defaultMessage: 'Generate export',
    description: 'Export export',
    id: 'exportGenerate',
  },
  exportHeading: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Aggregates of the following accounts will be exported to a .csv file.} ' +
      'aws_category {Aggregates of the following cost categories will be exported to a .csv file.} ' +
      'cluster {Aggregates of the following clusters will be exported to a .csv file.} ' +
      'gcp_project {Aggregates of the following Google Cloud projects will be exported to a .csv file.} ' +
      'instance {Aggregates of the following instances will be exported to a .csv file.} ' +
      'node {Aggregates of the following nodes will be exported to a .csv file.} ' +
      'org_unit_id {Aggregates of the following organizational units will be exported to a .csv file.} ' +
      'payer_tenant_id {Aggregates of the following accounts will be exported to a .csv file.} ' +
      'product_service {Aggregates of the following services will be exported to a .csv file.} ' +
      'project {Aggregates of the following projects will be exported to a .csv file.} ' +
      'region {Aggregates of the following regions will be exported to a .csv file.} ' +
      'resource_location {Aggregates of the regions will be exported to a .csv file.} ' +
      'service {Aggregates of the following services will be exported to a .csv file.} ' +
      'service_name {Aggregates of the following services will be exported to a .csv file.} ' +
      'subscription_guid {Aggregates of the following accounts will be exported to a .csv file.} ' +
      'tag {Aggregates of the following tags will be exported to a .csv file.} ' +
      'other {}}',
    description: 'Export heading',
    id: 'exportHeading',
  },
  exportName: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud grouped by Account} gcp_ocp {Google Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'aws_category {{provider, select, aws {Amazon Web Services grouped by Cost category} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Cost category} azure {Microsoft Azure grouped by Cost category} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Cost category} gcp {Google Cloud grouped by Cost category} gcp_ocp {Google Cloud filtered by OpenShift grouped by Cost category} ocp {OpenShift grouped by Cost category} ocp_cloud {All cloud filtered by OpenShift grouped by Cost category} other {}}} ' +
      'cluster {{provider, select, aws {Amazon Web Services grouped by Cluster} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Cluster} azure {Microsoft Azure grouped by Cluster} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Cluster} gcp {Google Cloud grouped by Cluster} gcp_ocp {Google Cloud filtered by OpenShift grouped by Cluster} ocp {OpenShift grouped by Cluster} ocp_cloud {All cloud filtered by OpenShift grouped by Cluster} other {}}} ' +
      'gcp_project {{provider, select, aws {Amazon Web Services grouped by Google Cloud Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Google Cloud Project} azure {Microsoft Azure grouped by Google Cloud Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Google Cloud Project} gcp {Google Cloud grouped by Google Cloud Project} gcp_ocp {Google Cloud filtered by OpenShift grouped by Google Cloud Project} ocp {OpenShift grouped by Google Cloud Project} ocp_cloud {All cloud filtered by OpenShift grouped by Google Cloud Project} other {}}} ' +
      'instance {{provider, select, aws {Amazon Web Services grouped by instance} aws_ocp {Amazon Web Services filtered by OpenShift grouped by instance} azure {Microsoft Azure grouped by instance} azure_ocp {Microsoft Azure filtered by OpenShift grouped by instance} gcp {Google Cloud grouped by instance} gcp_ocp {Google Cloud filtered by OpenShift grouped by instance} ocp {OpenShift grouped by instance} ocp_cloud {All cloud filtered by OpenShift grouped by instance} other {}}} ' +
      'node {{provider, select, aws {Amazon Web Services grouped by Node} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Node} azure {Microsoft Azure grouped by Node} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Node} gcp {Google Cloud grouped by Node} gcp_ocp {Google Cloud filtered by OpenShift grouped by Node} ocp {OpenShift grouped by Node} ocp_cloud {All cloud filtered by OpenShift grouped by Node} other {}}} ' +
      'org_unit_id {{provider, select, aws {Amazon Web Services grouped by Organizational unit} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Organizational unit} azure {Microsoft Azure grouped by Organizational unit} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Organizational unit} gcp {Google Cloud grouped by Organizational unit} gcp_ocp {Google Cloud filtered by OpenShift grouped by Organizational unit} ocp {OpenShift grouped by Organizational unit} ocp_cloud {All cloud filtered by OpenShift grouped by Organizational unit} other {}}} ' +
      'project {{provider, select, aws {Amazon Web Services grouped by Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Project} azure {Microsoft Azure grouped by Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Project} gcp {Google Cloud grouped by Project} gcp_ocp {Google Cloud filtered by OpenShift grouped by Project} ocp {OpenShift grouped by Project} ocp_cloud {All cloud filtered by OpenShift grouped by Project} other {}}} ' +
      'region {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud grouped by Region} gcp_ocp {Google Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'resource_location {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud grouped by Region} gcp_ocp {Google Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'service {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud grouped by Service} gcp_ocp {Google Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'service_name {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud grouped by Service} gcp_ocp {Google Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'subscription_guid {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud grouped by Account} gcp_ocp {Google Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'tag {{provider, select, aws {Amazon Web Services grouped by Tag} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Tag} azure {Microsoft Azure grouped by Tag} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Tag} gcp {Google Cloud grouped by Tag} gcp_ocp {Google Cloud filtered by OpenShift grouped by Tag} ocp {OpenShift grouped by Tag} ocp_cloud {All cloud filtered by OpenShift grouped by Tag} other {}}} ' +
      'other {}}',
    description: 'Export name',
    id: 'exportName',
  },
  exportNameRequired: {
    defaultMessage: 'Please enter a name for the export',
    description: 'Please enter a name for the export',
    id: 'exportNameRequired',
  },
  exportNameTooLong: {
    defaultMessage: 'Should not exceed 255 characters',
    description: 'Should not exceed 255 characters',
    id: 'exportNameTooLong',
  },
  exportResolution: {
    defaultMessage: '{value, select, daily {Daily} monthly {Monthly} other {}}',
    description: 'Export file name',
    id: 'exportResolution',
  },
  exportSelected: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Selected accounts ({count})} ' +
      'aws_category {Selected cost categories ({count})} ' +
      'cluster {Selected clusters ({count})} ' +
      'gcp_project {Selected Google Cloud projects ({count})} ' +
      'instance {Selected instances ({count})} ' +
      'node {Selected nodes ({count})} ' +
      'org_unit_id {Selected organizational units ({count})} ' +
      'payer_tenant_id {Selected accounts ({count})} ' +
      'product_service {Selected services ({count})} ' +
      'project {Selected projects ({count})} ' +
      'region {Selected regions ({count})} ' +
      'resource_location {Selected regions ({count})} ' +
      'service {Selected services ({count})} ' +
      'service_name {Selected services ({count})} ' +
      'subscription_guid {Selected accounts ({count})} ' +
      'tag {Selected tags ({count})} ' +
      'vm_name {Selected virtual machines ({count})}' +
      'other {}}',
    description: 'Selected items for export',
    id: 'exportSelected',
  },
  exportTitle: {
    defaultMessage: 'Export',
    description: 'Export title',
    id: 'exportTitle',
  },
  exportsDesc: {
    defaultMessage:
      'Exports are available for download from the time that they are generated up to 7 days later. After 7 days, the export file will be removed.',
    description:
      'Exports are available for download from the time that they are generated up to 7 days later. After 7 days, the export file will be removed.',
    id: 'exportsDesc',
  },
  exportsEmptyState: {
    defaultMessage:
      'To get started, close this view and select rows in the table you want to export and click the export button to start the journey.',
    description:
      'To get started, close this view and select rows in the table you want to export and click the export button to start the journey.',
    id: 'exportsEmptyState',
  },
  exportsFailed: {
    defaultMessage: 'Could not create export file',
    description: 'Export failed',
    id: 'exportsFailed',
  },
  exportsFailedDesc: {
    defaultMessage: 'Something went wrong with the generation of this export file. Try exporting again.',
    description: 'Export failed description',
    id: 'exportsFailedDesc',
  },
  exportsSuccess: {
    defaultMessage: 'Export preparing for download',
    description: 'Export success',
    id: 'exportsSuccess',
  },
  exportsSuccessDesc: {
    defaultMessage: 'The export is preparing for download. It will be accessible from {value} view. {link}',
    description: 'Export success description',
    id: 'exportsSuccessDesc',
  },
  exportsTableAriaLabel: {
    defaultMessage: 'Available exports table',
    description: 'Available exports table',
    id: 'exportsTableAriaLabel',
  },
  exportsTitle: {
    defaultMessage: 'All exports',
    description: 'All exports',
    id: 'exportsTitle',
  },
  exportsUnavailable: {
    defaultMessage: 'Export cannot be generated',
    description: 'Export cannot be generated',
    id: 'exportsUnavailable',
  },
  filterByCostCategoryKeyAriaLabel: {
    defaultMessage: 'Cost category keys',
    description: 'Cost category keys',
    id: 'filterByCostCategoryKeyAriaLabel',
  },
  filterByCostCategoryValueButtonAriaLabel: {
    defaultMessage: 'Filter button for cost category value',
    description: 'Filter button for cost category value',
    id: 'filterByCostCategoryValueButtonAriaLabel',
  },
  filterByInputAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Input for account name} ' +
      'aws_category {Input for cost category name} ' +
      'cluster {Input for cluster name} ' +
      'gcp_project {Input for Google Cloud project name} ' +
      'gpu_model {Input for GPU model} ' +
      'gpu_vendor {Input for GPU vendor} ' +
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
      'tag_key {Input for tag key} ' +
      'tag_key_child {Input for child tag key} ' +
      'tag_key_parent {Input for parent tag key} ' +
      'other {}}',
    description: 'Input for {value} name',
    id: 'filterByInputAriaLabel',
  },
  filterByOrgUnitAriaLabel: {
    defaultMessage: 'Organizational units',
    description: 'Organizational units',
    id: 'filterByOrgUnitAriaLabel',
  },
  filterByOrgUnitPlaceholder: {
    defaultMessage: 'Choose unit',
    description: 'Choose unit',
    id: 'filterByOrgUnitPlaceholder',
  },
  filterByPlaceholder: {
    defaultMessage:
      '{value, select, ' +
      'account {Filter by account} ' +
      'aws_category {Filter by cost category} ' +
      'cluster {Filter by cluster} ' +
      'container {Filter by container} ' +
      'description {Filter by description} ' +
      'gcp_project {Filter by Google Cloud project} ' +
      'gpu_model {Filter by GPU model} ' +
      'gpu_vendor {Filter by GPU vendor} ' +
      'group {Filter by group} ' +
      'instance {Filter by instance} ' +
      'name {Filter by name} ' +
      'node {Filter by node} ' +
      'operating_system {Filter by operating system} ' +
      'org_unit_id {Filter by organizational unit} ' +
      'payer_tenant_id {Filter by account} ' +
      'persistent_volume_claim {Filter by persistent volume claim} ' +
      'product_service {Filter by service} ' +
      'project {Filter by project} ' +
      'region {Filter by region} ' +
      'resource_location {Filter by region} ' +
      'service {Filter by service} ' +
      'service_name {Filter by service} ' +
      'source_type {Filter by integration} ' +
      'status {Filter by status} ' +
      'storage_class {Filter by StorageClass} ' +
      'subscription_guid {Filter by account} ' +
      'tag {Filter by tag} ' +
      'tag_key {Filter by tag key} ' +
      'tag_key_child {Filter by child tag key} ' +
      'tag_key_parent {Filter by parent tag key} ' +
      'vm_name {Filter by virtual machine} ' +
      'workload {Filter by workload name} ' +
      'workload_type {Filter by workload type} ' +
      'other {}}',
    description: 'Filter by "value"',
    id: 'filterByPlaceholder',
  },
  filterByTagKeyAriaLabel: {
    defaultMessage: 'Tag keys',
    description: 'Tag keys',
    id: 'filterByTagKeyAriaLabel',
  },
  filterByTagValueAriaLabel: {
    defaultMessage: 'Tag values',
    description: 'Tag values',
    id: 'filterByTagValueAriaLabel',
  },
  filterByValuePlaceholder: {
    defaultMessage: 'Filter by value',
    description: 'Filter by value',
    id: 'filterByValuePlaceholder',
  },
  filterByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {Account} ' +
      'aws_category {Cost category} ' +
      'cluster {Cluster} ' +
      'container {Container} ' +
      'default {Default} ' +
      'gcp_project {Google Cloud project} ' +
      'gpu_model {GPU model} ' +
      'gpu_vendor {GPU vendor} ' +
      'group {Group} ' +
      'instance {Instance} ' +
      'name {Name} ' +
      'node {Node} ' +
      'org_unit_id {Organizational unit} ' +
      'operating_system {Operating system} ' +
      'payer_tenant_id {Account} ' +
      'persistent_volume_claim {Persistent volume claim} ' +
      'product_service {Service} ' +
      'project {Project} ' +
      'region {Region} ' +
      'resource_location {Region} ' +
      'service {Service} ' +
      'service_name {Service} ' +
      'source_type {Integration} ' +
      'status {Status} ' +
      'storage_class {StorageClass} ' +
      'subscription_guid {Account} ' +
      'tag {Tag} ' +
      'tag_key {Tag key} ' +
      'tag_key_child {Child tag Key} ' +
      'tag_key_parent {Parent tag Key} ' +
      'vm_name {Virtual machine}' +
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
  filteredBy: {
    defaultMessage: 'Filtered by',
    description: 'Filtered by',
    id: 'filteredBy',
  },
  filteredByWarning: {
    defaultMessage: 'This page shows filtered results. To undo filters, clear filters on the previous page.',
    description: 'This page shows filtered results. To undo filters, clear filters on the previous page.',
    id: 'filteredByWarning',
  },
  finalization: {
    defaultMessage: 'Finalization',
    description: 'Finalization',
    id: 'finalization',
  },
  forDate: {
    defaultMessage: '{value} for {dateRange}',
    description: '{value} for {Jan 1-31}',
    id: 'forDate',
  },
  gcp: {
    defaultMessage: 'Google Cloud',
    description: 'Google Cloud',
    id: 'gcp',
  },
  gcpComputeTitle: {
    defaultMessage: 'Compute instances usage',
    description: 'Compute instances usage',
    id: 'gcpComputeTitle',
  },
  gcpCostTitle: {
    defaultMessage: 'Google Cloud cost',
    description: 'Google Cloud cost',
    id: 'gcpCostTitle',
  },
  gcpCostTrendTitle: {
    defaultMessage: 'Google Cloud cumulative cost comparison ({units})',
    description: 'Google Cloud cumulative cost comparison ({units})',
    id: 'gcpCostTrendTitle',
  },
  gcpDailyCostTrendTitle: {
    defaultMessage: 'Google Cloud daily cost comparison ({units})',
    description: 'Google Cloud daily cost comparison ({units})',
    id: 'gcpDailyCostTrendTitle',
  },
  gcpDesc: {
    defaultMessage: 'Raw cost from Google Cloud infrastructure.',
    description: 'Raw cost from Google Cloud infrastructure.',
    id: 'gcpDesc',
  },
  gcpDetailsTitle: {
    defaultMessage: 'Google Cloud details',
    description: 'Google Cloud details',
    id: 'gcpDetailsTitle',
  },
  gcpOcpDashboardCostTitle: {
    defaultMessage: 'Google Cloud filtered by OpenShift cost',
    description: 'Google Cloud filtered by OpenShift cost',
    id: 'gcpOcpDashboardCostTitle',
  },
  gpuTitle: {
    defaultMessage: 'GPU',
    description: 'GPU',
    id: 'gpuTitle',
  },
  groupByAll: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {All account} other {All accounts}}} ' +
      'aws_category {{count, plural, one {All cost category} other {All cost categories}}} ' +
      'cluster {{count, plural, one {All cluster} other {All clusters}}} ' +
      'gcp_project {{count, plural, one {All Google Cloud project} other {All Google Cloud projects}}} ' +
      'node {{count, plural, one {All node} other {All nodes}}} ' +
      'org_unit_id {{count, plural, one {All organizational unit} other {All organizational units}}} ' +
      'payer_tenant_id {{count, plural, one {All account} other {All accounts}}} ' +
      'product_service {{count, plural, one {All service} other {All services}}} ' +
      'project {{count, plural, one {All project} other {All projects}}} ' +
      'region {{count, plural, one {All region} other {All regions}}} ' +
      'resource_location {{count, plural, one {All region} other {All regions}}} ' +
      'service {{count, plural, one {All service} other {All services}}} ' +
      'service_name {{count, plural, one {All service} other {All services}}} ' +
      'subscription_guid {{count, plural, one {All account} other {All accounts}}} ' +
      'tag {{count, plural, one {All tag} other {All tags}}} ' +
      'other {}}',
    description: 'All group by value',
    id: 'groupByAll',
  },
  groupByLabel: {
    defaultMessage: 'Group by',
    description: 'group by label',
    id: 'groupByLabel',
  },
  groupByTop: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {Top account} other {Top accounts}}} ' +
      'aws_category {{count, plural, one {Top cost category} other {Top cost categories}}} ' +
      'cluster {{count, plural, one {Top cluster} other {Top clusters}}} ' +
      'gcp_project {{count, plural, one {Top Google Cloud project} other {Top Google Cloud projects}}} ' +
      'node {{count, plural, one {Top node} other {Top node}}} ' +
      'org_unit_id {{count, plural, one {Top organizational unit} other {Top organizational units}}} ' +
      'payer_tenant_id {{count, plural, one {Top account} other {Top accounts}}} ' +
      'product_service {{count, plural, one {Top service} other {Top services}}} ' +
      'project {{count, plural, one {Top project} other {Top projects}}} ' +
      'region {{count, plural, one {Top region} other {Top regions}}} ' +
      'resource_location {{count, plural, one {Top region} other {Top regions}}} ' +
      'service {{count, plural, one {Top service} other {Top services}}} ' +
      'service_name {{count, plural, one {Top service} other {Top services}}} ' +
      'subscription_guid {{count, plural, one {Top account} other {Top accounts}}} ' +
      'tag {{count, plural, one {Top tag} other {Top tags}}} ' +
      'other {}}',
    description: 'Top group by value',
    id: 'groupByTop',
  },
  groupByValueNames: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Account names} ' +
      'aws_category {Cost category names} ' +
      'cluster {Cluster names} ' +
      'gcp_project {Google Cloud project names} ' +
      'node {Node names} ' +
      'org_unit_id {Organizational unit names} ' +
      'payer_tenant_id {Account names} ' +
      'product_service {Service names} ' +
      'project {Project names} ' +
      'region {Region names} ' +
      'resource_location {Region names} ' +
      'service {Service names} ' +
      'service_name {Service names} ' +
      'subscription_guid {Account names} ' +
      'tag {Tag names} ' +
      'other {}}',
    description: 'Selected items for export',
    id: 'groupByValueNames',
  },
  groupByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {account} other {accounts}}} ' +
      'aws_category {{count, plural, one {cost category} other {cost categories}}} ' +
      'cluster {{count, plural, one {cluster} other {clusters}}} ' +
      'gcp_project {{count, plural, one {Google Cloud project} other {Google Cloud projects}}} ' +
      'node {{count, plural, one {node} other {node}}} ' +
      'org_unit_id {{count, plural, one {organizational unit} other {organizational units}}} ' +
      'payer_tenant_id {{count, plural, one {account} other {accounts}}} ' +
      'product_service {{count, plural, one {service} other {services}}} ' +
      'project {{count, plural, one {project} other {projects}}} ' +
      'region {{count, plural, one {region} other {regions}}} ' +
      'resource_location {{count, plural, one {region} other {regions}}} ' +
      'service {{count, plural, one {service} other {services}}} ' +
      'service_name {{count, plural, one {service} other {services}}} ' +
      'subscription_guid {{count, plural, one {account} other {accounts}}} ' +
      'tag {{count, plural, one {tag} other {tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'groupByValues',
  },
  groupByValuesTitleCase: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {Account} other {Accounts}}} ' +
      'aws_category {{count, plural, one {Cost category} other {Cost categories}}} ' +
      'cluster {{count, plural, one {Cluster} other {Clusters}}} ' +
      'gcp_project {{count, plural, one {Google Cloud project} other {Google Cloud projects}}} ' +
      'node {{count, plural, one {Node} other {Node}}} ' +
      'org_unit_id {{count, plural, one {Organizational unit} other {Organizational units}}} ' +
      'payer_tenant_id {{count, plural, one {Account} other {Accounts}}} ' +
      'product_service {{count, plural, one {Service} other {Services}}} ' +
      'project {{count, plural, one {Project} other {Projects}}} ' +
      'region {{count, plural, one {Region} other {Regions}}} ' +
      'resource_location {{count, plural, one {Region} other {Regions}}} ' +
      'service {{count, plural, one {Service} other {Services}}} ' +
      'service_name {{count, plural, one {Service} other {Services}}} ' +
      'subscription_guid {{count, plural, one {Account} other {Accounts}}} ' +
      'tag {{count, plural, one {Tag} other {Tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'groupByValuesTitleCase',
  },
  gpuColumns: {
    defaultMessage:
      '{value, select, ' +
      'count {Count} ' +
      'gpu_model {Model} ' +
      'gpu_vendor {Vendor} ' +
      'memory {Memory} ' +
      'node {Node} ' +
      'other {}}',
    description: 'GPU columns',
    id: 'gpuColumns',
  },
  gpuLoadingStateDesc: {
    defaultMessage: 'Searching for your GPUs. Do not refresh the browser',
    description: 'Searching for your GPUs. Do not refresh the browser',
    id: 'gpuLoadingStateDesc',
  },
  gpuLoadingStateTitle: {
    defaultMessage: 'Looking for GPUs...',
    description: 'Looking for GPUs',
    id: 'gpuLoadingStateTitle',
  },
  gpuModelDuplicate: {
    defaultMessage: 'This GPU model is already in use',
    description: 'This GPU model is already in use',
    id: 'gpuModelDuplicate',
  },
  gpuVendorDuplicate: {
    defaultMessage: 'This GPU vendor is already in use',
    description: 'This GPU vendor is already in use',
    id: 'gpuVendorDuplicate',
  },
  historicalChartCostLabel: {
    defaultMessage: 'Cost ({units})',
    description: 'Cost ({units})',
    id: 'historicalChartCostLabel',
  },
  historicalChartDayOfMonthLabel: {
    defaultMessage: 'Day of month',
    description: 'Day of month',
    id: 'historicalChartDayOfMonthLabel',
  },
  historicalChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'cost {Cost comparison} ' +
      'cpu {CPU usage, request, and limit comparison} ' +
      'instance_type {Compute usage comparison}' +
      'memory {Memory usage, request, and limit comparison} ' +
      'modal {{name} daily usage comparison} ' +
      'network {Network usage comparison} ' +
      'storage {Storage usage comparison} ' +
      'virtual_machine {Virtual machine usage comparison}' +
      'other {}}',
    description: 'Historical chart titles',
    id: 'historicalChartTitle',
  },
  historicalChartUsageLabel: {
    defaultMessage: '{value, select, instance_type {hrs} storage {gb-mo} other {}}',
    description: 'Historical chart usage labels',
    id: 'historicalChartUsageLabel',
  },
  inactiveSourcesGoTo: {
    defaultMessage: 'Go to integrations for more information',
    description: 'Go to integrations for more information',
    id: 'inactiveSourcesGoTo',
  },
  inactiveSourcesTitle: {
    defaultMessage: 'A problem was detected with {value}',
    description: 'A problem was detected with {value}',
    id: 'inactiveSourcesTitle',
  },
  inactiveSourcesTitleMultiplier: {
    defaultMessage: 'A problem was detected with the following integrations',
    description: 'A problem was detected with the following integrations',
    id: 'inactiveSourcesTitleMultiplier',
  },
  infrastructure: {
    defaultMessage: 'Infrastructure',
    description: 'Infrastructure',
    id: 'infrastructure',
  },
  instances: {
    defaultMessage: 'Instances',
    description: 'Instances',
    id: 'instances',
  },
  integration: {
    defaultMessage: 'Integration',
    description: 'Integration',
    id: 'integration',
  },
  integrationsDetails: {
    defaultMessage: 'Integrations details',
    description: 'Integrations details',
    id: 'integrationsDetails',
  },
  integrationsStatus: {
    defaultMessage: 'Integrations status',
    description: 'Integrations status',
    id: 'integrationsStatus',
  },
  kokuMetricsOperator: {
    defaultMessage: 'Koku metrics operator',
    description: 'Koku metrics operator',
    id: 'kokuMetricsOperator',
  },
  lastProcessed: {
    defaultMessage: 'Last processed',
    description: 'Last processed',
    id: 'lastProcessed',
  },
  lastUpdated: {
    defaultMessage: 'Last updated',
    description: 'Last updated',
    id: 'lastUpdated',
  },
  learnMore: {
    defaultMessage: 'Learn more',
    description: 'Learn more',
    id: 'learnMore',
  },
  loadingStateDesc: {
    defaultMessage: 'Searching for your integrations. Do not refresh the browser',
    description: 'Searching for your integrations. Do not refresh the browser',
    id: 'loadingStateDesc',
  },
  loadingStateTitle: {
    defaultMessage: 'Looking for integrations...',
    description: 'Looking for integrations',
    id: 'loadingStateTitle',
  },
  maintenanceEmptyStateDesc: {
    defaultMessage:
      'Cost management is currently undergoing scheduled maintenance and will be unavailable from 13:00 - 19:00 UTC (09:00 AM - 03:00 PM EDT).',
    description: 'Cost management is currently undergoing scheduled maintenance',
    id: 'maintenanceEmptyStateDesc',
  },
  maintenanceEmptyStateInfo: {
    defaultMessage: 'For more information visit {url}',
    description: 'more information url',
    id: 'maintenanceEmptyStateInfo',
  },
  maintenanceEmptyStateThanks: {
    defaultMessage: 'We will be back soon. Thank you for your patience!',
    description: 'thanks you for your patience',
    id: 'maintenanceEmptyStateThanks',
  },
  manageColumnsAriaLabel: {
    defaultMessage: 'Table column management',
    description: 'Table column management',
    id: 'manageColumnsAriaLabel',
  },
  manageColumnsDesc: {
    defaultMessage: 'Selected categories will be displayed in the table',
    description: 'Selected categories will be displayed in the table',
    id: 'manageColumnsDesc',
  },
  manageColumnsTitle: {
    defaultMessage: 'Manage columns',
    description: 'Manage columns',
    id: 'manageColumnsTitle',
  },
  markupDesc: {
    defaultMessage:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    description:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    id: 'markupDesc',
  },
  markupOrDiscount: {
    defaultMessage: 'Markup or Discount',
    description: 'Markup or Discount',
    id: 'markupOrDiscount',
  },
  markupOrDiscountDesc: {
    defaultMessage:
      'This Percentage is applied to raw cost calculations by multiplying the cost with this percentage. Costs calculated from price list rates will not be effected.',
    description:
      'This Percentage is applied to raw cost calculations by multiplying the cost with this percentage. Costs calculated from price list rates will not be effected.',
    id: 'markupOrDiscountDesc',
  },
  markupOrDiscountModalDesc: {
    defaultMessage:
      'Use markup/discount to manipulate how the raw costs are being calculated for your integrations. Note, costs calculated from price list rates will not be affected by this.',
    description:
      'Use markup/discount to manipulate how the raw costs are being calculated for your integrations. Note, costs calculated from price list rates will not be affected by this.',
    id: 'markupOrDiscountModalDesc',
  },
  markupOrDiscountNumber: {
    defaultMessage: 'Markup or discount must be a number',
    description: 'Markup or discount must be a number',
    id: 'markupOrDiscountNumber',
  },
  markupOrDiscountTooLong: {
    defaultMessage: 'Should not exceed 10 decimals',
    description: 'Should not exceed 10 decimals',
    id: 'markupOrDiscountTooLong',
  },
  markupPlus: {
    defaultMessage: 'Markup (+)',
    description: 'Markup (+)',
    id: 'markupPlus',
  },
  markupTitle: {
    defaultMessage: 'Markup',
    description: 'Markup',
    id: 'markupTitle',
  },
  measurement: {
    defaultMessage: 'Measurement',
    description: 'Measurement',
    id: 'measurement',
  },
  measurementPlaceholder: {
    defaultMessage: 'Filter by measurements',
    description: 'Filter by measurements',
    id: 'measurementPlaceholder',
  },
  measurementValues: {
    defaultMessage:
      '{value, select, ' +
      'count {{count, plural, one {Count} other {Count ({units})}}} ' +
      'effective_usage {{count, plural, one {Request} other {Effective-usage ({units})}}} ' +
      'request {{count, plural, one {Request} other {Request ({units})}}} ' +
      'usage {{count, plural, one {Usage} other {Usage ({units})}}} ' +
      'other {}}',
    description: 'Measurement values',
    id: 'measurementValues',
  },
  measurementValuesDesc: {
    defaultMessage:
      '{value, select, ' +
      'count {{units, select, ' +
      'node_month {The distinct number of nodes identified during the month} ' +
      'pvc_month {The distinct number of volume claims identified during the month} ' +
      'cluster_month {The distinct number of clusters identified during the month} ' +
      'other {}}} ' +
      'effective_usage {The greater of usage and request each hour} ' +
      'request {The pod resources requested, as reported by OpenShift} ' +
      'usage {The pod resources used, as reported by OpenShift} ' +
      'other {}}',
    description: 'Measurement descriptions',
    id: 'measurementValuesDesc',
  },
  memoryTitle: {
    defaultMessage: 'Memory',
    description: 'Memory',
    id: 'memoryTitle',
  },
  metric: {
    defaultMessage: 'Metric',
    description: 'Metric',
    id: 'metric',
  },
  metricPlaceholder: {
    defaultMessage: 'Filter by metrics',
    description: 'Filter by metrics',
    id: 'metricPlaceholder',
  },
  metricValues: {
    defaultMessage:
      '{value, select, ' +
      'cpu {CPU} ' +
      'cluster {Cluster} ' +
      'memory {Memory} ' +
      'project {Project} ' +
      'node {Node} ' +
      'persistent_volume_claims {Persistent volume claims} ' +
      'storage {Storage} ' +
      'virtual_machine {Virtual machine}' +
      'other {}}',
    description: 'Metric values',
    id: 'metricValues',
  },
  metricsOperatorVersion: {
    defaultMessage: 'Cost management operator version',
    description: 'Cost management operator version',
    id: 'metricsOperatorVersion',
  },
  monthOverMonthChange: {
    defaultMessage: 'Month over month change',
    description: 'Month over month change',
    id: 'monthOverMonthChange',
  },
  moreOptions: {
    defaultMessage: 'More options',
    description: 'More options',
    id: 'moreOptions',
  },
  names: {
    defaultMessage: '{count, plural, one {Name} other {Names}}',
    description: 'Name plural or singular',
    id: 'names',
  },
  networkUnattributedDistributed: {
    defaultMessage: 'Network unattributed',
    description: 'Network unattributed',
    id: 'networkUnattributedDistributed',
  },
  networkUnattributedDistributedDesc: {
    defaultMessage: 'Costs associated with ingress and egress network traffic for individual nodes.',
    description: 'Costs associated with ingress and egress network traffic for individual nodes.',
    id: 'networkUnattributedDistributedDesc',
  },
  newOperatorAvailable: {
    defaultMessage:
      'New version of the Cost Management metrics operator is available. Update your operator version to work with the latest capabilities.',
    description:
      'New version of the Cost Management metrics operator is available. Update your operator version to work with the latest capabilities.',
    id: 'newOperatorAvailable',
  },
  newOperatorVersionAvailable: {
    defaultMessage: 'New version of the Cost Management operator available.',
    description: 'New version of the Cost Management operator available.',
    id: 'newOperatorVersionAvailable',
  },
  newOperatorVersionAvailableDesc: {
    defaultMessage:
      'Update now to unlock the latest features, performance improvements and important bug fixes. Get the best experience and most accurate data by running the newest version of Cost Management metrics operator.',
    description:
      'Update now to unlock the latest features, performance improvements and important bug fixes. Get the best experience and most accurate data by running the newest version of Cost Management metrics operator.',
    id: 'newOperatorVersionAvailableDesc',
  },
  newOperatorVersionAvailableLink: {
    defaultMessage: 'View integrations to update',
    description: 'View integrations to update',
    id: 'newOperatorVersionAvailableLink',
  },
  newVersionAvailable: {
    defaultMessage: 'New version available',
    description: 'New version available',
    id: 'newVersionAvailable',
  },
  next: {
    defaultMessage: 'next',
    description: 'next',
    id: 'next',
  },
  no: {
    defaultMessage: 'No',
    description: 'No',
    id: 'no',
  },
  noCurrentData: {
    defaultMessage: 'No data available for {dateRange}. You are viewing data for the previous month.',
    description: 'No data available for Jan 1-31. You are viewing data for the previous month.',
    id: 'noCurrentData',
  },
  noDataForDate: {
    defaultMessage: 'No data available for {dateRange}',
    description: 'No data available for Jan 1-31',
    id: 'noDataForDate',
  },
  noDataStateDesc: {
    defaultMessage:
      'We have detected an integration, but we are not done processing the incoming data. {status}The time to process could take up to 24 hours. Try refreshing the page at a later time.',
    description: 'still processing request, 24 hour message',
    id: 'noDataStateDesc',
  },
  noDataStateRefresh: {
    defaultMessage: 'Refresh this page',
    description: 'Refresh this page',
    id: 'noDataStateRefresh',
  },
  noDataStateTitle: {
    defaultMessage: 'Still processing the data',
    description: 'Still processing the data',
    id: 'noDataStateTitle',
  },
  noExportsStateTitle: {
    defaultMessage: 'There are no export files available',
    description: 'There are no export files available',
    id: 'noExportsStateTitle',
  },
  noInstancesDesc: {
    defaultMessage:
      'To view the cost of EC2 instances, label your resources with the following tag key and value pair in the AWS console.',
    description:
      'To view the cost of EC2 instances, label your resources with the following tag key and value pair in the AWS console.',
    id: 'noInstancesDesc',
  },
  noInstancesMoreInfo: {
    defaultMessage: 'For more information, {seeDocumentation}.',
    description: 'For more information, see documentation.',
    id: 'noInstancesMoreInfo',
  },
  noInstancesTitle: {
    defaultMessage: 'View cost of EC2 instances',
    description: 'View cost of EC2 instances',
    id: 'noInstancesTitle',
  },
  noMappedTags: {
    defaultMessage: 'No mapped tags',
    description: 'No mapped tags',
    id: 'noMappedTags',
  },
  noMappedTagsDesc: {
    defaultMessage:
      'Map multiple tags across data sources to be used as a single tag key for report grouping and filtering. {warning} Changes will be reflected within 24 hours. {learnMore}',
    description:
      'Map multiple tags across data sources to be used as a single tag key for report grouping and filtering. {warning} Changes will be reflected within 24 hours. {learnMore}',
    id: 'noMappedTagsDesc',
  },
  noMappedTagsWarning: {
    defaultMessage: 'Tags must be enabled to be mapped.',
    description: 'Tags must be enabled to be mapped.',
    id: 'noMappedTagsWarning',
  },
  noProvidersCloudCost: {
    defaultMessage: 'Include cloud provider (AWS, Google Cloud, Azure) cost',
    description: 'Include cloud provider (AWS, Google Cloud, Azure) cost',
    id: 'noProvidersCloudCost',
  },
  noProvidersCloudCostDesc: {
    defaultMessage:
      'If you want to do only cloud provider such as AWS, Google, Azure, or Oracle, you need to set up an integration in order to start using cost management service.',
    description:
      'If you want to do only cloud provider such as AWS, Google, Azure, or Oracle, you need to set up an integration in order to start using cost management service.',
    id: 'noProvidersCloudCostDesc',
  },
  noProvidersCloudIntegration: {
    defaultMessage: 'Set up a cloud provider integration',
    description: 'Set up a cloud provider integration',
    id: 'noProvidersCloudIntegration',
  },
  noProvidersCloudIntegrationHelp: {
    defaultMessage: 'If you need further help setting up cloud provider in cost management',
    description: 'If you need further help setting up cloud provider in cost management',
    id: 'noProvidersCloudIntegrationHelp',
  },
  noProvidersCloudIntegrationHelpAws: {
    defaultMessage: 'Integrating Amazon Web Services data into cost management',
    description: 'Integrating Amazon Web Services data into cost management',
    id: 'noProvidersCloudIntegrationHelpAws',
  },
  noProvidersCloudIntegrationHelpAzure: {
    defaultMessage: 'Integrating Microsoft Azure data into cost management',
    description: 'Integrating Microsoft Azure data into cost management',
    id: 'noProvidersCloudIntegrationHelpAzure',
  },
  noProvidersCloudIntegrationHelpDesc: {
    defaultMessage:
      'The process to set up an integration for each provider varies. To learn how to add your specific integration to cost management, see the following guides:',
    description:
      'The process to set up an integration for each provider varies. To learn how to add your specific integration to cost management, see the following guides:',
    id: 'noProvidersCloudIntegrationHelpDesc',
  },
  noProvidersCloudIntegrationHelpGcp: {
    defaultMessage: 'Integrating Google Cloud data into cost management',
    description: 'Integrating Google Cloud data into cost management',
    id: 'noProvidersCloudIntegrationHelpGcp',
  },
  noProvidersDesc: {
    defaultMessage:
      'Helps you simplify the management of your resources and costs of {ocp}, as well as public clouds like {aws}, {gcp}, and {azure}.',
    description:
      'Helps you simplify the management of your resources and costs of {ocp}, as well as public clouds like {aws}, {gcp}, and {azure}.',
    id: 'noProvidersDesc',
  },
  noProvidersGetStarted: {
    defaultMessage: 'Get started with cost management',
    description: 'Get started with cost management',
    id: 'noProvidersGetStarted',
  },
  noProvidersMetricsOperator: {
    defaultMessage: 'Install cost management metric operator',
    description: 'Install cost management metric operator',
    id: 'noProvidersMetricsOperator',
  },
  noProvidersOcpCli: {
    defaultMessage: 'If you want to use {cli} to install the operator, follow {link}.',
    description: 'If you want to use OpenShift CLI to install the operator, follow this documentation',
    id: 'noProvidersOcpCli',
  },
  noProvidersOcpCliLink: {
    defaultMessage: 'this documentation',
    description: 'this documentation',
    id: 'noProvidersOcpCliLink',
  },
  noProvidersOcpCost: {
    defaultMessage: 'Include OpenShift cost',
    description: 'Include OpenShift cost',
    id: 'noProvidersOcpCost',
  },
  noProvidersOcpCostDesc: {
    defaultMessage:
      'Additionally to your OpenShift cluster set up, you need to set up cost management metrics operator in order to start using cost management service.',
    description:
      'Additionally to your OpenShift cluster set up, you need to set up cost management metrics operator in order to start using cost management service.',
    id: 'noProvidersOcpCostDesc',
  },
  noProvidersRecommended: {
    defaultMessage: 'Recommended content',
    description: 'Recommended content',
    id: 'noProvidersRecommended',
  },
  noProvidersRecommendedAccomplish: {
    defaultMessage: 'What can you accomplish with cost management?',
    description: 'What can you accomplish with cost management?',
    id: 'noProvidersRecommendedAccomplish',
  },
  noProvidersTroubleshooting: {
    defaultMessage: 'Having problem seeing data? See Troubleshooting part of the documentation',
    description: 'Having problem seeing data? See Troubleshooting part of the documentation',
    id: 'noProvidersTroubleshooting',
  },
  noResultsFound: {
    defaultMessage: 'No results found',
    description: 'No results found',
    id: 'noResultsFound',
  },
  noVirtualizationStateDesc: {
    defaultMessage:
      'No virtual machines are present in OpenShift virtualization. Newly added machines will appear within 24 hours.',
    description:
      'No virtual machines are present in OpenShift virtualization. Newly added machines will appear within 24 hours.',
    id: 'noVirtualizationStateDesc',
  },
  noVirtualizationStateTitle: {
    defaultMessage: 'No virtual machines detected',
    description: 'No virtual machines detected',
    id: 'noVirtualizationStateTitle',
  },
  notAuthorizedStateAws: {
    defaultMessage: 'Amazon Web Services in cost management',
    description: 'Amazon Web Services in cost management',
    id: 'notAuthorizedStateAws',
  },
  notAuthorizedStateAzure: {
    defaultMessage: 'Microsoft Azure in cost management',
    description: 'Microsoft Azure in cost management',
    id: 'notAuthorizedStateAzure',
  },
  notAuthorizedStateCostModels: {
    defaultMessage: 'Cost models in cost management',
    description: 'Cost models in cost management',
    id: 'notAuthorizedStateCostModels',
  },
  notAuthorizedStateGcp: {
    defaultMessage: 'Google Cloud in cost management',
    description: 'Google Cloud in cost management',
    id: 'notAuthorizedStateGcp',
  },
  notAuthorizedStateOcp: {
    defaultMessage: 'OpenShift in cost management',
    description: 'OpenShift in cost management',
    id: 'notAuthorizedStateOcp',
  },
  notAuthorizedStateOptimizations: {
    defaultMessage: 'Optimizations in cost management',
    description: 'Optimizations in cost management',
    id: 'notAuthorizedStateOptimizations',
  },
  notAuthorizedStateSettings: {
    defaultMessage: 'Settings in cost management',
    description: 'Settings in cost management',
    id: 'notAuthorizedStateSettings',
  },
  notAvailable: {
    defaultMessage: 'Not available',
    description: 'Not available',
    id: 'notAvailable',
  },
  ocp: {
    defaultMessage: 'OpenShift Container Platform',
    description: 'OpenShift Container Platform',
    id: 'ocp',
  },
  ocpCli: {
    defaultMessage: 'OpenShift CLI',
    description: 'OpenShift CLI',
    id: 'ocpCli',
  },
  ocpCloudDashboardComputeTitle: {
    defaultMessage: 'Compute services usage',
    description: 'Compute services usage',
    id: 'ocpCloudDashboardComputeTitle',
  },
  ocpCloudDashboardCostTitle: {
    defaultMessage: 'All cloud filtered by OpenShift cost',
    description: 'All cloud filtered by OpenShift cost',
    id: 'ocpCloudDashboardCostTitle',
  },
  ocpCloudDashboardCostTrendTitle: {
    defaultMessage: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    description: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    id: 'ocpCloudDashboardCostTrendTitle',
  },
  ocpCloudDashboardDailyCostTrendTitle: {
    defaultMessage: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    description: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    id: 'ocpCloudDashboardDailyCostTrendTitle',
  },
  ocpClusterDetails: {
    defaultMessage: 'OpenShift cluster details',
    description: 'OpenShift cluster details',
    id: 'ocpClusterDetails',
  },
  ocpCpuUsageAndRequests: {
    defaultMessage: 'CPU usage and requests',
    description: 'CPU usage and requests',
    id: 'ocpCpuUsageAndRequests',
  },
  ocpDailyUsageAndRequestComparison: {
    defaultMessage: 'Daily usage and requests comparison ({units})',
    description: 'Daily usage and requests comparison',
    id: 'ocpDailyUsageAndRequestComparison',
  },
  ocpDashboardCostTitle: {
    defaultMessage: 'All OpenShift cost',
    description: 'All OpenShift cost',
    id: 'ocpDashboardCostTitle',
  },
  ocpDashboardCostTrendTitle: {
    defaultMessage: 'All OpenShift cumulative cost comparison ({units})',
    description: 'All OpenShift cumulative cost comparison in units',
    id: 'ocpDashboardCostTrendTitle',
  },
  ocpDashboardDailyCostTitle: {
    defaultMessage: 'All OpenShift daily cost comparison ({units})',
    description: 'All OpenShift daily cost comparison in units',
    id: 'ocpDashboardDailyCostTitle',
  },
  ocpDetailsInfrastructureCost: {
    defaultMessage: 'Infrastructure cost',
    description: 'Infrastructure cost',
    id: 'ocpDetailsInfrastructureCost',
  },
  ocpDetailsInfrastructureCostDesc: {
    defaultMessage: 'The cost based on raw usage data from the underlying infrastructure.',
    description: 'The cost based on raw usage data from the underlying infrastructure.',
    id: 'ocpDetailsInfrastructureCostDesc',
  },
  ocpDetailsSupplementaryCost: {
    defaultMessage: 'Supplementary cost',
    description: 'Supplementary cost',
    id: 'ocpDetailsSupplementaryCost',
  },
  ocpDetailsSupplementaryCostDesc: {
    defaultMessage:
      'All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    description:
      'All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    id: 'ocpDetailsSupplementaryCostDesc',
  },
  ocpDetailsTitle: {
    defaultMessage: 'OpenShift details',
    description: 'OpenShift details',
    id: 'ocpDetailsTitle',
  },
  ocpMemoryUsageAndRequests: {
    defaultMessage: 'Memory usage and requests',
    description: 'Memory usage and requests',
    id: 'ocpMemoryUsageAndRequests',
  },
  ocpVolumeUsageAndRequests: {
    defaultMessage: 'Volume usage and requests',
    description: 'Volume usage and requests',
    id: 'ocpVolumeUsageAndRequests',
  },
  openShift: {
    defaultMessage: 'OpenShift',
    description: 'OpenShift',
    id: 'openShift',
  },
  openShiftCloudInfrastructure: {
    defaultMessage: 'OpenShift cloud infrastructure',
    description: 'OpenShift cloud infrastructure',
    id: 'openShiftCloudInfrastructure',
  },
  openShiftCloudInfrastructureDesc: {
    defaultMessage:
      'Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    description:
      'Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    id: 'openShiftCloudInfrastructureDesc',
  },
  openShiftDesc: {
    defaultMessage:
      'Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    description:
      'Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    id: 'openShiftDesc',
  },
  operatorVersion: {
    defaultMessage: 'Operator version',
    description: 'Operator version',
    id: 'operatorVersion',
  },
  optimizations: {
    defaultMessage: 'Optimizations',
    description: 'Optimizations',
    id: 'optimizations',
  },
  overhead: {
    defaultMessage: 'Includes overhead',
    description: 'Includes overhead',
    id: 'overhead',
  },
  overheadDesc: {
    defaultMessage: 'Includes distributed costs {value}',
    description: 'Includes distributed costs',
    id: 'overheadDesc',
  },
  overviewInfoArialLabel: {
    defaultMessage: 'A description of perspectives',
    description: 'A description of perspectives',
    id: 'overviewInfoArialLabel',
  },
  overviewInfoButtonArialLabel: {
    defaultMessage: 'A dialog with a description of perspectives',
    description: 'A dialog with a description of perspectives',
    id: 'overviewInfoButtonArialLabel',
  },
  overviewTitle: {
    defaultMessage: 'Cost management overview',
    description: 'Cost management overview',
    id: 'overviewTitle',
  },
  pageTitleAws: {
    defaultMessage: 'Amazon Web Services - Cost management | OpenShift',
    description: 'Amazon Web Services - Cost management | OpenShift',
    id: 'pageTitleAws',
  },
  pageTitleAzure: {
    defaultMessage: 'Microsoft Azure - Cost management | OpenShift',
    description: 'Microsoft Azure - Cost management | OpenShift',
    id: 'pageTitleAzure',
  },
  pageTitleCostModels: {
    defaultMessage: 'Cost models - Cost management | OpenShift',
    description: 'Cost models - Cost management | OpenShift',
    id: 'pageTitleCostModels',
  },
  pageTitleDefault: {
    defaultMessage: 'Cost management | OpenShift',
    description: 'Cost management | OpenShift',
    id: 'pageTitleDefault',
  },
  pageTitleExplorer: {
    defaultMessage: 'Cost Explorer - Cost management | OpenShift',
    description: 'Cost Explorer - Cost management | OpenShift',
    id: 'pageTitleExplorer',
  },
  pageTitleGcp: {
    defaultMessage: 'Google Cloud - Cost management | OpenShift',
    description: 'Google Cloud - Cost management | OpenShift',
    id: 'pageTitleGcp',
  },
  pageTitleOcp: {
    defaultMessage: 'OpenShift - Cost management | OpenShift',
    description: 'OpenShift - Cost management | OpenShift',
    id: 'pageTitleOcp',
  },
  pageTitleOptimizations: {
    defaultMessage: 'Optimizations - Cost management | OpenShift',
    description: 'Optimizations - Cost management | OpenShift',
    id: 'pageTitleOptimizations',
  },
  pageTitleOverview: {
    defaultMessage: 'Overview - Cost management | OpenShift',
    description: 'Overview - Cost management | OpenShift',
    id: 'pageTitleOverview',
  },
  pageTitleSettings: {
    defaultMessage: 'Settings - Cost management | OpenShift',
    description: 'Settings - Cost management | OpenShift',
    id: 'pageTitleSettings',
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
  percent: {
    defaultMessage: '{value} %',
    description: 'Percent value',
    id: 'percent',
  },
  percentOfCost: {
    defaultMessage: '{value} % of cost',
    description: '{value} % of cost',
    id: 'percentOfCost',
  },
  percentSymbol: {
    defaultMessage: '%',
    description: 'Percent symbol',
    id: 'percentSymbol',
  },
  percentTotalCost: {
    defaultMessage: '{value} {units} ({percent} %)',
    description: '{value} {units} ({percent} %)',
    id: 'percentTotalCost',
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
      'gcp {Google Cloud} ' +
      'gcp_ocp {Google Cloud filtered by OpenShift} ' +
      'ocp {All OpenShift} ' +
      'ocp_cloud {All cloud filtered by OpenShift} ' +
      'other {}}',
    description: 'Perspective values',
    id: 'perspectiveValues',
  },
  platform: {
    defaultMessage: 'Platform',
    description: 'Platform',
    id: 'platform',
  },
  platformDesc: {
    defaultMessage: 'Distribute the cost of running the OpenShift services to projects',
    description: 'Distribute the cost of running the OpenShift services to projects',
    id: 'platformDesc',
  },
  platformDistributed: {
    defaultMessage: 'Platform distributed',
    description: 'Platform distributed',
    id: 'platformDistributed',
  },
  platformProjectsDesc: {
    defaultMessage:
      "Associate additional projects with OpenShift Platform project costs to charge for utilization of resources. Changes will be reflected in this month's cost calculations within 24 hrs. {learnMore}",
    description:
      "Associate additional projects with OpenShift Platform project costs to charge for utilization of resources. Changes will be reflected in this month's cost calculations within 24 hrs. {learnMore}",
    id: 'platformProjectsDesc',
  },
  platformProjectsTitle: {
    defaultMessage: 'Platform projects',
    description: 'Platform projects',
    id: 'platformProjectsTitle',
  },
  priceList: {
    defaultMessage: 'Price list',
    description: 'Price list',
    id: 'priceList',
  },
  priceListAddRate: {
    defaultMessage: 'Add rate',
    description: 'Add rate',
    id: 'priceListAddRate',
  },
  priceListDeleteRate: {
    defaultMessage: 'Delete rate',
    description: 'Delete rate',
    id: 'priceListDeleteRate',
  },
  priceListDeleteRateDesc: {
    defaultMessage:
      '{count, plural, one {This action will remove {metric} rate from {costModel}} other {This action will remove {metric} rate from {costModel}, which is assigned to the following integrations:}}',
    description:
      'This action will remove {metric} rate from {costModel}, which is assigned to the following integrations:',
    id: 'priceListDeleteRateDesc',
  },
  priceListDuplicate: {
    defaultMessage: 'This tag key is already in use',
    description: 'This tag key is already in use',
    id: 'priceListDuplicate',
  },
  priceListEditRate: {
    defaultMessage: 'Edit rate',
    description: 'Edit rate',
    id: 'priceListEditRate',
  },
  priceListEmptyRate: {
    defaultMessage: 'No rates are set',
    description: 'No rates are set',
    id: 'priceListEmptyRate',
  },
  priceListEmptyRateDesc: {
    defaultMessage: 'To add rates to the price list, click on the "Add" rate button above.',
    description: 'To add rates to the price list, click on the "Add" rate button above.',
    id: 'priceListEmptyRateDesc',
  },
  priceListNumberRate: {
    defaultMessage: 'Rate must be a number',
    description: 'Rate must be a number',
    id: 'priceListNumberRate',
  },
  priceListPosNumberRate: {
    defaultMessage: 'Rate must be a positive number',
    description: 'Rate must be a positive number',
    id: 'priceListPosNumberRate',
  },
  projectKoku: {
    defaultMessage: 'Upstream project Koku',
    description: 'Upstream project Koku',
    id: 'projectKoku',
  },
  pvcTitle: {
    defaultMessage: 'Persistent Volume Claims',
    description: 'Persistent Volume Claims',
    id: 'pvcTitle',
  },
  rate: {
    defaultMessage: 'Rate',
    description: 'Rate',
    id: 'rate',
  },
  rawCostDesc: {
    defaultMessage: 'The costs reported by a cloud provider without any cost model calculations applied.',
    description: 'The costs reported by a cloud provider without any cost model calculations applied.',
    id: 'rawCostDesc',
  },
  rawCostTitle: {
    defaultMessage: 'Raw cost',
    description: 'Raw cost',
    id: 'rawCostTitle',
  },
  rbacErrorDesc: {
    defaultMessage:
      'There was a problem receiving user permissions. Refreshing this page may fix it. If it does not, please contact your admin.',
    description: 'rbac error description',
    id: 'rbacErrorDesc',
  },
  rbacErrorTitle: {
    defaultMessage: 'Failed to get RBAC information',
    description: 'RBAC error title',
    id: 'rbacErrorTitle',
  },
  readOnly: {
    defaultMessage: 'Read only',
    description: 'Read only',
    id: 'readOnly',
  },
  readOnlyPermissions: {
    defaultMessage: 'You have read only permissions',
    description: 'You have read only permissions',
    id: 'readOnlyPermissions',
  },
  redHatIntegration: {
    defaultMessage: 'Red Hat integration',
    description: 'Red Hat integration',
    id: 'redHatIntegration',
  },
  redHatStatusUrl: {
    defaultMessage: 'https://status.redhat.com',
    description: 'Red Hat status url for cloud services',
    id: 'redHatStatusUrl',
  },
  releaseNotes: {
    defaultMessage: 'Release notes',
    description: 'Release notes',
    id: 'releaseNotes',
  },
  remove: {
    defaultMessage: 'Remove',
    description: 'Remove',
    id: 'remove',
  },
  removeProjects: {
    defaultMessage: 'Remove projects',
    description: 'Remove projects',
    id: 'removeProjects',
  },
  requestedCapacity: {
    defaultMessage: 'Requested capacity',
    description: 'Requested capacity',
    id: 'requestedCapacity',
  },
  requestedCapacityValue: {
    defaultMessage: 'Requested capacity - {value} {units}',
    description: 'Requested capacity - {value} {units}',
    id: 'requestedCapacityValue',
  },
  requests: {
    defaultMessage: 'Requests',
    description: 'Requests',
    id: 'requests',
  },
  save: {
    defaultMessage: 'Save',
    description: 'Save',
    id: 'save',
  },
  seeDocumentation: {
    defaultMessage: 'see documentation',
    description: 'see documentation',
    id: 'seeDocumentation',
  },
  select: {
    defaultMessage: 'Select...',
    description: 'Select...',
    id: 'select',
  },
  selectAll: {
    defaultMessage: 'Select all',
    description: 'Select all',
    id: 'selectAll',
  },
  selectCategories: {
    defaultMessage: 'Select categories to enable or disable',
    description: 'Select categories to enable or disable',
    id: 'selectCategories',
  },
  selectClearAriaLabel: {
    defaultMessage: 'Clear input value',
    description: 'Clear input value',
    id: 'selectClearAriaLabel',
  },
  selectProjects: {
    defaultMessage: 'Select projects to add or remove',
    description: 'Select projects to add or remove',
    id: 'selectProjects',
  },
  selectRow: {
    defaultMessage: 'Select row {value}',
    description: 'Select row {value}',
    id: 'selectRow',
  },
  selectTags: {
    defaultMessage: 'Select tags to enable or disable',
    description: 'Select tags to enable or disable',
    id: 'selectTags',
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
  selected: {
    defaultMessage: '{value} selected',
    description: '{value} selected',
    id: 'selected',
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
  settingsSuccessChanges: {
    defaultMessage: 'Changes will be reflected in report summarizations within 24 hours',
    description: 'Changes will be reflected in report summarizations within 24 hours',
    id: 'settingsSuccessChanges',
  },
  settingsSuccessCostCategories: {
    defaultMessage:
      '{value, select, ' +
      'enable {{count, plural, one {{count} cost category key enabled} other {{count} cost category keys enabled}}} ' +
      'disable {{count, plural, one {{count} cost category key disabled} other {{count} cost category keys disabled}}} ' +
      'other {}}',
    description: 'Cost category keys enabled or disabled',
    id: 'settingsSuccessCostCategories',
  },
  settingsSuccessDesc: {
    defaultMessage: 'Settings for cost management were replaced with new values',
    description: 'Settings for cost management were replaced with new values',
    id: 'settingsSuccessDesc',
  },
  settingsSuccessPlatformProjects: {
    defaultMessage:
      '{value, select, ' +
      'add {{count, plural, one {{count} projects added to Platform projects} other {{count} project added to Platform projects}}} ' +
      'remove {{count, plural, one {{count} projects removed from Platform projects} other {{count} project removed from Platform projects}}} ' +
      'other {}}',
    description: 'Platform projects added or removed',
    id: 'settingsSuccessPlatformProjects',
  },
  settingsSuccessTags: {
    defaultMessage:
      '{value, select, ' +
      'add {{count, plural, one {{count} tag key added} other {{count} tag key added}}} ' +
      'enable {{count, plural, one {{count} tag enabled} other {{count} tags enabled}}} ' +
      'disable {{count, plural, one {{count} tag disabled} other {{count} tags disabled}}} ' +
      'remove {{count, plural, one {{count} tag key removed} other {{count} tag key removed}}} ' +
      'other {}}',
    description: 'Cost category keys enabled or disabled',
    id: 'settingsSuccessTags',
  },
  settingsSuccessTitle: {
    defaultMessage: 'Application settings saved',
    description: 'Application settings saved',
    id: 'settingsSuccessTitle',
  },
  settingsTagMappingDisableErrorDesc: {
    defaultMessage: 'You have selected {value} tag mappings',
    description: 'You have selected {value} tag mappings',
    id: 'settingsTagMappingDisableErrorDesc',
  },
  settingsTagMappingDisableErrorTitle: {
    defaultMessage: 'Can not disable a key associated with a tag mapping',
    description: 'Can not disable a key associated with a tag mapping',
    id: 'settingsTagMappingDisableErrorTitle',
  },
  settingsTagsErrorDesc: {
    defaultMessage: 'You currently have {value} tags enabled',
    description: 'You currently have {value} tags enabled',
    id: 'settingsTagsErrorDesc',
  },
  settingsTagsErrorTitle: {
    defaultMessage: 'You can not enable more than {value} tags total',
    description: 'You can not enable more than {value} tags total',
    id: 'settingsTagsErrorTitle',
  },
  settingsTitle: {
    defaultMessage: 'Cost management settings',
    description: 'Cost management settings',
    id: 'settingsTitle',
  },
  sinceDate: {
    defaultMessage: '{dateRange}',
    description: 'Jan 1-31',
    id: 'sinceDate',
  },
  source: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services source:} ' +
      'azure {Microsoft Azure source:} ' +
      'gcp {Google Cloud source:} ' +
      'ocp {OpenShift source:} ' +
      'other {}}',
    description: 'Select from the following {value} integrations:',
    id: 'source',
  },
  sourceType: {
    defaultMessage: 'Integration',
    description: 'Integration',
    id: 'sourceType',
  },
  sourceTypes: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services} ' +
      'azure {Microsoft Azure} ' +
      'gcp {Google Cloud} ' +
      'ocp {OpenShift} ' +
      'other {}}',
    description: 'Integrations',
    id: 'sourceTypes',
  },
  sources: {
    defaultMessage: 'Integrations',
    description: 'Integrations',
    id: 'sources',
  },
  start: {
    defaultMessage: 'Start',
    description: 'Start',
    id: 'start',
  },
  status: {
    defaultMessage: 'Status',
    description: 'Status',
    id: 'status',
  },
  statusActions: {
    defaultMessage: 'Status/Actions',
    description: 'Status/Actions',
    id: 'statusActions',
  },
  statusMsg: {
    defaultMessage:
      '{value, select, ' +
      'complete {Complete} ' +
      'failed {Failed} ' +
      'in_progress {in-Progress} ' +
      'none {Incomplete} ' +
      'paused {Paused} ' +
      'pending {Pending} ' +
      'other {}}',
    description: 'Status message',
    id: 'statusMsg',
  },
  statusStates: {
    defaultMessage: '{value, select, ' + 'pending {Pending} ' + 'running {Running} ' + 'failed {Failed} ' + 'other {}}',
    description: 'Status states',
    id: 'statusStates',
  },
  storage: {
    defaultMessage: 'Storage',
    description: 'Storage',
    id: 'storage',
  },
  storageClass: {
    defaultMessage: 'StorageClass',
    description: 'StorageClass',
    id: 'storageClass',
  },
  storageHeadingTitle: {
    defaultMessage: 'Storage ({value})',
    description: 'Storage ({value})',
    id: 'storageHeadingTitle',
  },
  storageNames: {
    defaultMessage: 'Storage names',
    description: 'Storage names',
    id: 'storageNames',
  },
  storageUnattributedDistributed: {
    defaultMessage: 'Storage unattributed',
    description: 'Storage unattributed',
    id: 'storageUnattributedDistributed',
  },
  storageUnattributedDistributedDesc: {
    defaultMessage:
      'A type of project that gets created when cost management is unable to correlate a portion of the cloud cost to an OpenShift namespace',
    description:
      'A type of project that gets created when cost management is unable to correlate a portion of the cloud cost to an OpenShift namespace',
    id: 'storageUnattributedDistributedDesc',
  },
  suggestions: {
    defaultMessage: 'Suggestions',
    description: 'Suggestions',
    id: 'suggestions',
  },
  sumPlatformCosts: {
    defaultMessage: 'Sum platform costs',
    description: 'Sum platform costs',
    id: 'sumPlatformCosts',
  },
  supplementary: {
    defaultMessage: 'Supplementary',
    description: 'Supplementary',
    id: 'supplementary',
  },
  tagDesc: {
    defaultMessage:
      'Enable your tags and labels to be used as tag keys for report grouping and filtering. Your account is limited to {count} active tags at a time. Changes will be reflected within 24 hours. {learnMore}',
    description:
      'Enable your tags and labels to be used as tag keys for report grouping and filtering. Your account is limited to 200 active tags at a time. Changes will be reflected within 24 hours. {learnMore}',
    id: 'tagDesc',
  },
  tagHeadingKey: {
    defaultMessage: 'Key',
    description: 'Key',
    id: 'tagHeadingKey',
  },
  tagHeadingTitle: {
    defaultMessage: 'Tags ({value})',
    description: 'Tags ({value})',
    id: 'tagHeadingTitle',
  },
  tagHeadingValue: {
    defaultMessage: 'Value',
    description: 'Value',
    id: 'tagHeadingValue',
  },
  tagKey: {
    defaultMessage: 'Tag key:',
    description: 'Tag keys',
    id: 'tagKey',
  },
  tagKeyChild: {
    defaultMessage: 'Child tag keys',
    description: 'Child tag keys',
    id: 'tagKeyChild',
  },
  tagKeyParent: {
    defaultMessage: 'Parent tag key',
    description: 'Parent tag key',
    id: 'tagKeyParent',
  },
  tagKeyParentSource: {
    defaultMessage: 'Parent integration',
    description: 'Parent integration',
    id: 'tagKeyParentSource',
  },
  tagLabelsEnable: {
    defaultMessage: 'Enable tags and labels',
    description: 'Enable tags and labels',
    id: 'tagLabelsEnable',
  },
  tagLabelsMap: {
    defaultMessage: 'Map tags and labels',
    description: 'Map tags and labels',
    id: 'tagLabelsMap',
  },
  tagLabelsTitle: {
    defaultMessage: 'Tags and labels',
    description: 'Tags and labels',
    id: 'tagLabels',
  },
  tagMappingAddChildTags: {
    defaultMessage: 'Add child tags',
    description: 'Add child tags',
    id: 'tagMappingAddChildTags',
  },
  tagMappingAddChildTagsDesc: {
    defaultMessage:
      'Select additional tag key(s) that will be mapped to the {value} tag map. Tags that have been already mapped will not be available for selection.',
    description:
      'Select additional tag key(s) that will be mapped to the {value} tag map. Tags that have been already mapped will not be available for selection.',
    id: 'tagMappingAddChildTagsDesc',
  },
  tagMappingAddErrorDesc: {
    defaultMessage: 'Failed to add tags',
    description: 'Failed to add tags',
    id: 'tagMappingAddErrorDesc',
  },
  tagMappingAddErrorTitle: {
    defaultMessage: 'Unable to create tag mapping',
    description: 'Unable to create tag mapping',
    id: 'tagMappingAddErrorTitle',
  },
  tagMappingDelete: {
    defaultMessage: 'Delete tag mapping',
    description: 'Delete tag mapping',
    id: 'tagMappingDelete',
  },
  tagMappingDeleteDesc: {
    defaultMessage: 'Deleting {value} will queue a resummarization. Changes will be reflected within 24 hours.',
    description: 'Deleting {value} will queue a resummarization. Changes will be reflected within 24 hours.',
    id: 'tagMappingDeleteDesc',
  },
  tagMappingDeleteTitle: {
    defaultMessage: 'Delete tag mapping?',
    description: 'Delete tag mapping?',
    id: 'tagMappingDeleteTitle',
  },
  tagMappingDesc: {
    defaultMessage:
      'Combine multiple tags across your cloud integrations to group and filter similar tags with one tag key. {warning} Changes will be reflected within 24 hours. {learnMore}',
    description:
      'Combine multiple tags across your cloud integrations to group and filter similar tags with one tag key. {warning} Changes will be reflected within 24 hours. {learnMore}',
    id: 'tagMappingDesc',
  },
  tagMappingRemove: {
    defaultMessage: 'Remove child tag',
    description: 'Remove child tag',
    id: 'tagMappingRemove',
  },
  tagMappingRemoveDesc: {
    defaultMessage: 'Removing {value} will queue a resummarization. Changes will be reflected within 24 hours.',
    description: 'Removing {value} will queue a resummarization. Changes will be reflected within 24 hours.',
    id: 'tagMappingRemoveDesc',
  },
  tagMappingRemoveTitle: {
    defaultMessage: 'Remove child tag?',
    description: 'Remove child tag?',
    id: 'tagMappingRemoveTitle',
  },
  tagMappingSelectChildTags: {
    defaultMessage: 'Select child tags',
    description: 'Select child tags',
    id: 'tagMappingSelectChildTags',
  },
  tagMappingSelectChildTagsDesc: {
    defaultMessage:
      'Select the child tags that you want to map to the parent key you selected in the previous step. Tags that have been already mapped will not be available for selection. {learnMore}',
    description:
      'Select the child tags that you want to map to the parent key you selected in the previous step. Tags that have been already mapped will not be available for selection. {learnMore}',
    id: 'tagMappingSelectChildTagsDesc',
  },
  tagMappingSelectParentTags: {
    defaultMessage: 'Select parent tag',
    description: 'Select parent tag',
    id: 'tagMappingSelectParentTags',
  },
  tagMappingSelectParentTagsDesc: {
    defaultMessage:
      'Select a parent tag key that will be mapped to child tags in the next step. This tag will be available for filtering in cost management.',
    description:
      'Select a parent tag key that will be mapped to child tags in the next step. This tag will be available for filtering in cost management.',
    id: 'tagMappingSelectParentTagsDesc',
  },
  tagMappingWarning: {
    defaultMessage: 'You must enable tags to use tag mapping.',
    description: 'You must enable tags to use tag mapping.',
    id: 'tagMappingWarning',
  },
  tagMappingWizardDesc: {
    defaultMessage:
      'Map multiple tags across data sources to be used as a single tag key for report grouping and filtering. Changes will be reflected within 24 hours.',
    description:
      'Map multiple tags across data sources to be used as a single tag key for report grouping and filtering. Changes will be reflected within 24 hours.',
    id: 'tagMappingWizardDesc',
  },
  tagMappingWizardNavToCreateTagMapping: {
    defaultMessage: 'Create another tag mapping',
    description: 'Create another tag mapping',
    id: 'tagMappingWizardNavToCreateTagMapping',
  },
  tagMappingWizardNavToTagMapping: {
    defaultMessage: 'Go back to cost management settings',
    description: 'Go back to cost management settings',
    id: 'tagMappingWizardNavToTagMapping',
  },
  tagMappingWizardReview: {
    defaultMessage: 'Review details',
    description: 'Review details',
    id: 'tagMappingWizardReview',
  },
  tagMappingWizardReviewDesc: {
    defaultMessage:
      'Review and confirm the tag mappings. Click {create} to create the mappings, or {back} to revise. Changes to the reports will be reflected within 24 hours.',
    description:
      'Review and confirm the tag mappings. Click {create} to create the mappings, or {back} to revise. Changes to the reports will be reflected within 24 hours.',
    id: 'tagMappingWizardReviewDesc',
  },
  tagMappingWizardSelectChildTags: {
    defaultMessage: 'Select child tags',
    description: 'Select child tags',
    id: 'tagMappingWizardSelectChildTags',
  },
  tagMappingWizardSelectParentTag: {
    defaultMessage: 'Select parent tag',
    description: 'Select parent tag',
    id: 'tagMappingWizardSelectParentTag',
  },
  tagMappingWizardSuccess: {
    defaultMessage: 'Tag mapping successful',
    description: 'Tag mapping successful',
    id: 'tagMappingWizardSuccess',
  },
  tagMappingWizardSuccessDesc: {
    defaultMessage:
      'Your tag keys were successfully mapped. Changes will be reflected in report summarizations within 24 hours.',
    description:
      'Your tag keys were successfully mapped. Changes will be reflected in report summarizations within 24 hours.',
    id: 'tagMappingWizardSuccessDesc',
  },
  tagNames: {
    defaultMessage: 'Tag names',
    description: 'Tag Names',
    id: 'tagNames',
  },
  tagValue: {
    defaultMessage: 'Tag value:',
    description: 'Tag value',
    id: 'tagValue',
  },
  timeOfExport: {
    defaultMessage: 'Time of export',
    description: 'Time of export',
    id: 'timeOfExport',
  },
  to: {
    defaultMessage: 'to',
    description: 'start date to end date',
    id: 'to',
  },
  toolBarBulkSelectAll: {
    defaultMessage: 'Select all ({value} items)',
    description: 'Select all ({value} items)',
    id: 'toolBarBulkSelectAll',
  },
  toolBarBulkSelectAriaDeselect: {
    defaultMessage: 'Deselect all items',
    description: 'Deselect all items',
    id: 'toolBarBulkSelectAriaDeselect',
  },
  toolBarBulkSelectAriaSelect: {
    defaultMessage: 'Select all items',
    description: 'Select all items',
    id: 'toolBarBulkSelectAriaSelect',
  },
  toolBarBulkSelectNone: {
    defaultMessage: 'Select none (0 items)',
    description: 'Select none (0 items)',
    id: 'toolBarBulkSelectNone',
  },
  toolBarBulkSelectPage: {
    defaultMessage: 'Select page ({value} items)',
    description: 'Select page ({value} items)',
    id: 'toolBarBulkSelectPage',
  },
  toolBarPriceListMeasurementPlaceHolder: {
    defaultMessage: 'Filter by measurements',
    description: 'Filter by measurements',
    id: 'toolBarPriceListMeasurementPlaceHolder',
  },
  toolBarPriceListMetricPlaceHolder: {
    defaultMessage: 'Filter by metrics',
    description: 'Filter by metrics',
    id: 'toolBarPriceListMetricPlaceHolder',
  },
  totalCost: {
    defaultMessage: 'Total cost',
    description: 'Total cost',
    id: 'totalCost',
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
      'cluster_month {cluster-month} ' +
      'core_hours {{value} core-hours} ' +
      'gb {{value} GB} ' +
      'gb_hours {{value} GB-hours} ' +
      'gb_month {{value} GB-month} ' +
      'gb_ms {{value} GB-ms} ' +
      'gib {{value} GiB} ' +
      'gib_hours {{value} GiB-hours} ' +
      'gib_month {{value} GiB-month} ' +
      'gibibyte_month {{value} GiB-month} ' +
      'hour {{value} hours} ' +
      'hrs {{value} hours} ' +
      'ms {{value} milliseconds} ' +
      'pvc_month {PVC-month} ' +
      'tag_month {{value} tag-month} ' +
      'vm_hours {{value} VM-hours} ' +
      'other {{value}}}',
    description: 'return value and unit based on key: "units"',
    id: 'unitTooltips',
  },
  units: {
    defaultMessage:
      '{units, select, ' +
      'byte_ms {Byte-ms} ' +
      'cluster_month {cluster-month} ' +
      'core {core} ' +
      'core_hours {core-hours} ' +
      'gb {GB} ' +
      'gb_hours {GB-hours} ' +
      'gb_month {GB-month} ' +
      'gb_ms {GB-ms} ' +
      'gib {GiB} ' +
      'gib_hours {GiB-hours} ' +
      'gib_month {GiB-month} ' +
      'gibibyte_month {GiB-month} ' +
      'gpu {GPU} ' +
      'gpus {GPUs} ' +
      'hour {hours} ' +
      'hrs {hours} ' +
      'ms {milliseconds} ' +
      'pvc_month {PVC-month} ' +
      'tag_month {tag-month} ' +
      'vm_hours {VM-hours} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'units',
  },
  upToDate: {
    defaultMessage: 'Up to date',
    description: 'Up to date',
    id: 'upToDate',
  },
  usage: {
    defaultMessage: 'Usage',
    description: 'Usage',
    id: 'usage',
  },
  usageCostDesc: {
    defaultMessage: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    description: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    id: 'usageCostDesc',
  },
  usageCostTitle: {
    defaultMessage: 'Usage cost',
    description: 'Usage cost',
    id: 'usageCostTitle',
  },
  usageSubtitle: {
    defaultMessage: '{value} {units} maximum',
    description: '{value} {units} maximum',
    id: 'usageSubtitle',
  },
  valueUnits: {
    defaultMessage: '{value} {units}',
    description: '{value} {units}',
    id: 'valueUnits',
  },
  various: {
    defaultMessage: 'Various',
    description: 'Various',
    id: 'various',
  },
  vcpuTitle: {
    defaultMessage: 'vCPU',
    description: 'vCPU',
    id: 'vcpuTitle',
  },
  viewAll: {
    defaultMessage: 'View all',
    description: 'View all',
    id: 'viewAll',
  },
  viewDocumentation: {
    defaultMessage: 'View documentation',
    description: 'View documentation',
    id: 'viewDocumentation',
  },
  viewLearningResources: {
    defaultMessage: 'View all OpenShift learning resources',
    description: 'View all OpenShift learning resources',
    id: 'viewLearningResources',
  },
  viewReleaseNotes: {
    defaultMessage: 'View release notes',
    description: 'View release notes',
    id: 'viewReleaseNotes',
  },
  virtualMachine: {
    defaultMessage: 'Virtual machine',
    description: 'Virtual machine',
    id: 'virtualMachine',
  },
  virtualization: {
    defaultMessage: 'Virtualization',
    description: 'Virtualization',
    id: 'virtualization',
  },
  volumeTitle: {
    defaultMessage: 'Volume',
    description: 'Volume',
    id: 'volumeTitle',
  },
  workerUnallocated: {
    defaultMessage: 'Worker unallocated',
    description: 'Worker unallocated',
    id: 'workerUnallocated',
  },
  workerUnallocatedDesc: {
    defaultMessage: 'Distribute unused and non-reserved resource costs to projects',
    description: 'Distribute unused and non-reserved resource costs to projects',
    id: 'workerUnallocatedDesc',
  },
  yes: {
    defaultMessage: 'Yes',
    description: 'Yes',
    id: 'yes',
  },
});
