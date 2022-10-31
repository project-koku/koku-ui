/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  aws: {
    defaultMessage: 'Amazon Web Services',
    description: 'Amazon Web Services',
    id: 'aws',
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
    defaultMessage: 'Amazon Web Services Details',
    description: 'Amazon Web Services Details',
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
  breakdownBackToDetails: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Back to {value} account details} ' +
      'cluster {Back to {value} cluster details} ' +
      'gcp_project {Back to {value} GCP project details} ' +
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
  breakdownBackToTitles: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services} ' +
      'azure {Microsoft Azure} ' +
      'oci {Oracle Cloud Infrastructure} ' +
      'gcp {Google Cloud Platform} ' +
      'ibm {IBM Cloud - Top 5 Costliest} ' +
      'ocp {OpenShift} ' +
      'other {}}',
    description: 'Breakdown back to page titles',
    id: 'breakdownBackToTitles',
  },
  breakdownCostBreakdownAriaLabel: {
    defaultMessage: 'A description of markup, raw cost and usage cost',
    description: 'A description of markup, raw cost and usage cost',
    id: 'breakdownCostBreakdownAriaLabel',
  },
  breakdownCostBreakdownTitle: {
    defaultMessage: 'Cost breakdown',
    description: 'A description of markup, raw cost and usage cost',
    id: 'breakdownCostBreakdownTitle',
  },
  breakdownCostChartAriaDesc: {
    defaultMessage: 'Breakdown of markup, raw, and usage costs',
    description: 'Breakdown of markup, raw, and usage costs',
    id: 'breakdownCostChartAriaDesc',
  },
  breakdownCostChartTooltip: {
    defaultMessage: '{name}: {value}',
    description: '{name}: {value}',
    id: 'breakdownCostChartTooltip',
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
      'account {Cost by accounts} ' +
      'cluster {Cost by clusters} ' +
      'gcp_project {Cost by GCP projects} ' +
      'node {Cost by Node} ' +
      'org_unit_id {Cost by organizational units} ' +
      'payer_tenant_id {Cost by accounts} ' +
      'product_service {Cost by services} ' +
      'project {Cost by projects} ' +
      'region {Cost by regions} ' +
      'resource_location {Cost by regions} ' +
      'service {Cost by services} ' +
      'service_name {Cost by services} ' +
      'subscription_guid {Cost by accounts} ' +
      'tag {Cost by tags} ' +
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
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {{value} total cost (January {startDate})} other {{value} total cost (January {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {{value} total cost (February {startDate})} other {{value} total cost (February {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {{value} total cost (March {startDate})} other {{value} total cost (March {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {{value} total cost (April {startDate})} other {{value} total cost (April {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {{value} total cost (May {startDate})} other {{value} total cost (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {{value} total cost (June {startDate})} other {{value} total cost (June {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {{value} total cost (July {startDate})} other {{value} total cost (July {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {{value} total cost (August {startDate})} other {{value} total cost (August {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {{value} total cost (September {startDate})} other {{value} total cost (September {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {{value} total cost (October {startDate})} other {{value} total cost (October {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {{value} total cost (November {startDate})} other {{value} total cost (November {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {{value} total cost (December {startDate})} other {{value} total cost (December {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Break down total cost by date',
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
  chartCostForecastConeLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Cost confidence (Jan {startDate})} other {Cost confidence (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Cost confidence (Feb {startDate})} other {Cost confidence (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Cost confidence (Mar {startDate})} other {Cost confidence (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Cost confidence (Apr {startDate})} other {Cost confidence (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Cost confidence (May {startDate})} other {Cost confidence (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Cost confidence (Jun {startDate})} other {Cost confidence (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Cost confidence (Jul {startDate})} other {Cost confidence (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Cost confidence (Aug {startDate})} other {Cost confidence (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Cost confidence (Sep {startDate})} other {Cost confidence (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Cost confidence (Oct {startDate})} other {Cost confidence (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Cost confidence (Nov {startDate})} other {Cost confidence (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Cost confidence (Dec {startDate})} other {Cost confidence (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Cost forecast cone date label',
    id: 'chartCostForecastConeLegendLabel',
  },
  chartCostForecastConeLegendNoDataLabel: {
    defaultMessage: 'Cost confidence (no data)',
    description: 'Cost confidence (no data)',
    id: 'chartCostForecastConeLegendNoDataLabel',
  },
  chartCostForecastConeLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Cost confidence (Jan)} ' +
      '1 {Cost confidence (Feb)} ' +
      '2 {Cost confidence (Mar)} ' +
      '3 {Cost confidence (Apr)} ' +
      '4 {Cost confidence (May)} ' +
      '5 {Cost confidence (Jun)} ' +
      '6 {Cost confidence (Jul)} ' +
      '7 {Cost confidence (Aug)} ' +
      '8 {Cost confidence (Sep)} ' +
      '9 {Cost confidence (Oct)} ' +
      '10 {Cost confidence (Nov)} ' +
      '11 {Cost confidence (Dec)} ' +
      'other {}}',
    description: 'Cost forecast confidence date label tooltip',
    id: 'chartCostForecastConeLegendTooltip',
  },
  chartCostForecastConeTooltip: {
    defaultMessage: '{value0} - {value1}',
    description: 'Cost forecast confidence min/max tooltip',
    id: 'chartCostForecastConeTooltip',
  },
  chartCostForecastLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Cost forecast (Jan {startDate})} other {Cost forecast (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Cost forecast (Feb {startDate})} other {Cost forecast (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Cost forecast (Mar {startDate})} other {Cost forecast (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Cost forecast (Apr {startDate})} other {Cost forecast (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Cost forecast (May {startDate})} other {Cost forecast (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Cost forecast (Jun {startDate})} other {Cost forecast (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Cost forecast (Jul {startDate})} other {Cost forecast (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Cost forecast (Aug {startDate})} other {Cost forecast (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Cost forecast (Sep {startDate})} other {Cost forecast (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Cost forecast (Oct {startDate})} other {Cost forecast (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Cost forecast (Nov {startDate})} other {Cost forecast (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Cost forecast (Dec {startDate})} other {Cost forecast (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Cost forecast date label',
    id: 'chartCostForecastLegendLabel',
  },
  chartCostForecastLegendNoDataLabel: {
    defaultMessage: 'Cost forecast (no data)',
    description: 'Cost forecast (no data)',
    id: 'chartCostForecastLegendNoDataLabel',
  },
  chartCostForecastLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Cost forecast (Jan)} ' +
      '1 {Cost forecast (Feb)} ' +
      '2 {Cost forecast (Mar)} ' +
      '3 {Cost forecast (Apr)} ' +
      '4 {Cost forecast (May)} ' +
      '5 {Cost forecast (Jun)} ' +
      '6 {Cost forecast (Jul)} ' +
      '7 {Cost forecast (Aug)} ' +
      '8 {Cost forecast (Sep)} ' +
      '9 {Cost forecast (Oct)} ' +
      '10 {Cost forecast (Nov)} ' +
      '11 {Cost forecast (Dec)} ' +
      'other {}}',
    description: 'Cost forecast date label tooltip',
    id: 'chartCostForecastLegendTooltip',
  },
  chartCostLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Cost (Jan {startDate})} other {Cost (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Cost (Feb {startDate})} other {Cost (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Cost (Mar {startDate})} other {Cost (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Cost (Apr {startDate})} other {Cost (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Cost (May {startDate})} other {Cost (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Cost (Jun {startDate})} other {Cost (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Cost (Jul {startDate})} other {Cost (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Cost (Aug {startDate})} other {Cost (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Cost (Sep {startDate})} other {Cost (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Cost (Oct {startDate})} other {Cost (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Cost (Nov {startDate})} other {Cost (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Cost (Dec {startDate})} other {Cost (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Cost date label',
    id: 'chartCostLegendLabel',
  },
  chartCostLegendNoDataLabel: {
    defaultMessage: 'Cost (no data)',
    description: 'Cost (no data)',
    id: 'chartCostLegendNoDataLabel',
  },
  chartCostLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Cost (Jan)} ' +
      '1 {Cost (Feb)} ' +
      '2 {Cost (Mar)} ' +
      '3 {Cost (Apr)} ' +
      '4 {Cost (May)} ' +
      '5 {Cost (Jun)} ' +
      '6 {Cost (Jul)} ' +
      '7 {Cost (Aug)} ' +
      '8 {Cost (Sep)} ' +
      '9 {Cost (Oct)} ' +
      '10 {Cost (Nov)} ' +
      '11 {Cost (Dec)} ' +
      'other {}}',
    description: 'Cost (month)',
    id: 'chartCostLegendTooltip',
  },
  chartCostSupplementaryLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Supplementary cost (Jan {startDate})} other {Supplementary cost (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Supplementary cost (Feb {startDate})} other {Supplementary cost (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Supplementary cost (Mar {startDate})} other {Supplementary cost (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Supplementary cost (Apr {startDate})} other {Supplementary cost (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Supplementary cost (May {startDate})} other {Supplementary cost (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Supplementary cost (Jun {startDate})} other {Supplementary cost (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Supplementary cost (Jul {startDate})} other {Supplementary cost (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Supplementary cost (Aug {startDate})} other {Supplementary cost (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Supplementary cost (Sep {startDate})} other {Supplementary cost (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Supplementary cost (Oct {startDate})} other {Supplementary cost (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Supplementary cost (Nov {startDate})} other {Supplementary cost (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Supplementary cost (Dec {startDate})} other {Supplementary cost (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Supplementary cost date label',
    id: 'chartCostSupplementaryLegendLabel',
  },
  chartCostSupplementaryLegendNoDataLabel: {
    defaultMessage: 'Supplementary cost (no data)',
    description: 'Supplementary cost (no data)',
    id: 'chartCostSupplementaryLegendNoDataLabel',
  },
  chartCostSupplementaryLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Supplementary cost (Jan)} ' +
      '1 {Supplementary cost (Feb)} ' +
      '2 {Supplementary cost (Mar)} ' +
      '3 {Supplementary cost (Apr)} ' +
      '4 {Supplementary cost (May)} ' +
      '5 {Supplementary cost (Jun)} ' +
      '6 {Supplementary cost (Jul)} ' +
      '7 {Supplementary cost (Aug)} ' +
      '8 {Supplementary cost (Sep)} ' +
      '9 {Supplementary cost (Oct)} ' +
      '10 {Supplementary cost (Nov)} ' +
      '11 {Supplementary cost (Dec)} ' +
      'other {}}',
    description: 'Supplementary cost (month)',
    id: 'chartCostSupplementaryLegendTooltip',
  },
  chartDateRange: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Jan {startDate} {year}} other {{startDate}-{endDate} Jan {year}}}} ' +
      '1 {{count, plural, one {Feb {startDate} {year}} other {{startDate}-{endDate} Feb {year}}}} ' +
      '2 {{count, plural, one {Mar {startDate} {year}} other {{startDate}-{endDate} Mar {year}}}} ' +
      '3 {{count, plural, one {Apr {startDate} {year}} other {{startDate}-{endDate} Apr {year}}}} ' +
      '4 {{count, plural, one {May {startDate} {year}} other {{startDate}-{endDate} May {year}}}} ' +
      '5 {{count, plural, one {Jun {startDate} {year}} other {{startDate}-{endDate} Jun {year}}}} ' +
      '6 {{count, plural, one {Jul {startDate} {year}} other {{startDate}-{endDate} Jul {year}}}} ' +
      '7 {{count, plural, one {Aug {startDate} {year}} other {{startDate}-{endDate} Aug {year}}}} ' +
      '8 {{count, plural, one {Sep {startDate} {year}} other {{startDate}-{endDate} Sep {year}}}} ' +
      '9 {{count, plural, one {Oct {startDate} {year}} other {{startDate}-{endDate} Oct {year}}}} ' +
      '10 {{count, plural, one {Nov {startDate} {year}} other {{startDate}-{endDate} Nov {year}}}} ' +
      '11 {{count, plural, one {Dec {startDate} {year}} other {{startDate}-{endDate} Dec {year}}}} ' +
      'other {}}',
    description: 'Date range that handles singular and plural',
    id: 'chartDateRange',
  },
  chartDayOfTheMonth: {
    defaultMessage: 'Day {day}',
    description: 'The day of the month',
    id: 'chartDayOfTheMonth',
  },
  chartLimitLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Limit (Jan {startDate})} other {Limit (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Limit (Feb {startDate})} other {Limit (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Limit (Mar {startDate})} other {Limit (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Limit (Apr {startDate})} other {Limit (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Limit (May {startDate})} other {Limit (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Limit (Jun {startDate})} other {Limit (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Limit (Jul {startDate})} other {Limit (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Limit (Aug {startDate})} other {Limit (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Limit (Sep {startDate})} other {Limit (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Limit (Oct {startDate})} other {Limit (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Limit (Nov {startDate})} other {Limit (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Limit (Dec {startDate})} other {Limit (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Limit date label',
    id: 'chartLimitLegendLabel',
  },
  chartLimitLegendNoDataLabel: {
    defaultMessage: 'Limit (no data)',
    description: 'Limit (no data)',
    id: 'chartLimitLegendNoDataLabel',
  },
  chartLimitLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Limit (Jan)} ' +
      '1 {Limit (Feb)} ' +
      '2 {Limit (Mar)} ' +
      '3 {Limit (Apr)} ' +
      '4 {Limit (May)} ' +
      '5 {Limit (Jun)} ' +
      '6 {Limit (Jul)} ' +
      '7 {Limit (Aug)} ' +
      '8 {Limit (Sep)} ' +
      '9 {Limit (Oct)} ' +
      '10 {Limit (Nov)} ' +
      '11 {Limit (Dec)} ' +
      'other {}}',
    description: 'Limit (month)',
    id: 'chartLimitLegendTooltip',
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
  chartRequestsLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Requests (Jan {startDate})} other {Requests (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Requests (Feb {startDate})} other {Requests (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Requests (Mar {startDate})} other {Requests (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Requests (Apr {startDate})} other {Requests (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Requests (May {startDate})} other {Requests (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Requests (Jun {startDate})} other {Requests (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Requests (Jul {startDate})} other {Requests (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Requests (Aug {startDate})} other {Requests (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Requests (Sep {startDate})} other {Requests (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Requests (Oct {startDate})} other {Requests (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Requests (Nov {startDate})} other {Requests (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Requests (Dec {startDate})} other {Requests (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Requests date label',
    id: 'chartRequestLegendLabel',
  },
  chartRequestsLegendNoDataLabel: {
    defaultMessage: 'Requests (no data)',
    description: 'Requests (no data)',
    id: 'chartRequestsLegendNoDataLabel',
  },
  chartRequestsLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Requests (Jan)} ' +
      '1 {Requests (Feb)} ' +
      '2 {Requests (Mar)} ' +
      '3 {Requests (Apr)} ' +
      '4 {Requests (May)} ' +
      '5 {Requests (Jun)} ' +
      '6 {Requests (Jul)} ' +
      '7 {Requests (Aug)} ' +
      '8 {Requests (Sep)} ' +
      '9 {Requests (Oct)} ' +
      '10 {Requests (Nov)} ' +
      '11 {Requests (Dec)} ' +
      'other {}}',
    description: 'Requests (month)',
    id: 'chartRequestLegendTooltip',
  },
  chartUsageLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Usage (Jan {startDate})} other {Usage (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Usage (Feb {startDate})} other {Usage (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Usage (Mar {startDate})} other {Usage (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Usage (Apr {startDate})} other {Usage (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Usage (May {startDate})} other {Usage (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Usage (Jun {startDate})} other {Usage (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Usage (Jul {startDate})} other {Usage (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Usage (Aug {startDate})} other {Usage (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Usage (Sep {startDate})} other {Usage (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Usage (Oct {startDate})} other {Usage (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Usage (Nov {startDate})} other {Usage (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Usage (Dec {startDate})} other {Usage (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Usage (month {startDate})',
    id: 'chartUsageLegendLabel',
  },
  chartUsageLegendNoDataLabel: {
    defaultMessage: 'Usage (no data)',
    description: 'Usage (no data)',
    id: 'chartUsageLegendNoDataLabel',
  },
  chartUsageLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Usage (Jan)} ' +
      '1 {Usage (Feb)} ' +
      '2 {Usage (Mar)} ' +
      '3 {Usage (Apr)} ' +
      '4 {Usage (May)} ' +
      '5 {Usage (Jun)} ' +
      '6 {Usage (Jul)} ' +
      '7 {Usage (Aug)} ' +
      '8 {Usage (Sep)} ' +
      '9 {Usage (Oct)} ' +
      '10 {Usage (Nov)} ' +
      '11 {Usage (Dec)} ' +
      'other {}}',
    description: 'Usage (month)',
    id: 'chartUsageLegendTooltip',
  },
  close: {
    defaultMessage: 'Close',
    description: 'Close',
    id: 'close',
  },
  clusters: {
    defaultMessage: 'Clusters',
    description: 'Clusters',
    id: 'clusters',
  },
  cost: {
    defaultMessage: 'Cost',
    description: 'Cost',
    id: 'cost',
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
  costDistribution: {
    defaultMessage: 'Cost distribution',
    description: 'Cost distribution',
    id: 'costDistribution',
  },
  costManagement: {
    defaultMessage: 'Cost Management',
    description: 'Cost Management',
    id: 'costManagement',
  },
  costModels: {
    defaultMessage: 'Cost Models',
    description: 'Cost Models',
    id: 'costModels',
  },
  costModelsActions: {
    defaultMessage: 'Cost model actions',
    description: 'Cost models',
    id: 'costModelsActions',
  },
  costModelsAddTagValues: {
    defaultMessage: 'Add more tag values',
    description: 'Add more tag values',
    id: 'costModelsAddTagValues',
  },
  costModelsAssignSources: {
    defaultMessage: '{count, plural, one {Assign source} other {Assign sources}}',
    description: 'Assign sources -- plural or singular',
    id: 'costModelsAssignSources',
  },
  costModelsAssignSourcesErrorDescription: {
    defaultMessage:
      'You cannot assign a source at this time. Try refreshing this page. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'You cannot assign a source at this time',
    id: 'costModelsAssignSourcesErrorDescription',
  },
  costModelsAssignSourcesErrorTitle: {
    defaultMessage: 'This action is temporarily unavailable',
    description: 'This action is temporarily unavailable',
    id: 'costModelsAssignSourcesErrorTitle',
  },
  costModelsAssignSourcesParen: {
    defaultMessage: 'Assign source(s)',
    description: 'Assign source(s)',
    id: 'costModelsAssignSourcesParen',
  },
  costModelsAssignedSources: {
    defaultMessage: 'Assigned sources',
    description: 'Assigned sourcess',
    id: 'costModelsAssignedSources',
  },
  costModelsAvailableSources: {
    defaultMessage: 'The following sources are assigned to my production cost model:',
    description: 'The following sources are assigned to my production cost model:',
    id: 'costModelsAvailableSources',
  },
  costModelsCanDelete: {
    defaultMessage: 'This action will delete {name} cost model from the system. This action cannot be undone',
    description: 'This action will delete {name} cost model from the system. This action cannot be undone',
    id: 'costModelsCanDelete',
  },
  costModelsCanNotDelete: {
    defaultMessage: 'The following sources are assigned to {name} cost model:',
    description: 'The following sources are assigned to {name} cost model:',
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
    defaultMessage: 'You must unassign any sources before you can delete this cost model.',
    description: 'You must unassign any sources before you can delete this cost model.',
    id: 'costModelsDeleteSource',
  },
  costModelsDescTooLong: {
    defaultMessage: 'Should not exceed 500 characters',
    description: 'Should not exceed 500 characters',
    id: 'costModelsDescTooLong',
  },
  costModelsDetailsAssignSourcesTitle: {
    defaultMessage: 'Assign sources',
    description: 'Assign sources',
    id: 'costModelsDetailsAssignSourcesTitle',
  },
  costModelsDetailsTitle: {
    defaultMessage: 'Cost Model Details',
    description: 'Cost Model Details',
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
  costModelsEnterTagDescription: {
    defaultMessage: 'Enter a tag description',
    description: 'Enter a tag description',
    id: 'costModelsEnterTagDescription',
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
    defaultMessage: 'A markup rate of (+) 100% doubles the base costs of your source(s).',
    description: 'A markup rate of (+) 100% doubles the base costs of your source(s).',
    id: 'costModelsExamplesDoubleMarkup',
  },
  costModelsExamplesNoAdjust: {
    defaultMessage:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your source(s).',
    description:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your source(s).',
    id: 'costModelsExamplesNoAdjust',
  },
  costModelsExamplesReduceSeventyfive: {
    defaultMessage: 'A discount rate of (-) 25% reduces the base costs of your source(s) to 75% of the original value.',
    description: 'A discount rate of (-) 25% reduces the base costs of your source(s) to 75% of the original value.',
    id: 'costModelsExamplesReduceSeventyfive',
  },
  costModelsExamplesReduceZero: {
    defaultMessage: 'A discount rate of (-) 100% reduces the base costs of your source(s) to 0.',
    description: 'A discount rate of (-) 100% reduces the base costs of your source(s) to 0.',
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
  costModelsInfoTooLong: {
    defaultMessage: 'Should not exceed 100 characters',
    description: 'Should not exceed 100 characters',
    id: 'costModelsInfoTooLong',
  },
  costModelsLastChange: {
    defaultMessage: 'Last change',
    description: 'Last change',
    id: 'costModelsLastChange',
  },
  costModelsPopover: {
    defaultMessage:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources. {learnMore}',
    description:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources. {learnMore}',
    id: 'costModelsPopover',
  },
  costModelsPopoverAriaLabel: {
    defaultMessage: 'Cost model info popover',
    description: 'Cost model info popover',
    id: 'costModelsPopoverAriaLabel',
  },
  costModelsPopoverButtonAriaLabel: {
    defaultMessage: 'Opens a dialog with cost model info',
    description: 'Opens a dialog with cost model info',
    id: 'costModelsPopoverButtonAriaLabel',
  },
  costModelsRateTooLong: {
    defaultMessage: 'Should not exceed 10 decimals',
    description: 'Should not exceed 10 decimals',
    id: 'costModelsRateTooLong',
  },
  costModelsReadOnly: {
    defaultMessage: 'You have read only permissions',
    description: 'You have read only permissions',
    id: 'costModelsReadOnly',
  },
  costModelsRefreshDialog: {
    defaultMessage: 'Refresh this dialog',
    description: 'Refresh this dialog',
    id: 'costModelsRefreshDialog',
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
    defaultMessage: 'Select Measurement',
    description: 'Select Measurement',
    id: 'costModelsSelectMeasurement',
  },
  costModelsSelectMetric: {
    defaultMessage: 'Select Metric',
    description: 'Select Metric',
    id: 'costModelsSelectMetric',
  },
  costModelsSourceDelete: {
    defaultMessage: 'Unassign',
    description: 'Unassign',
    id: 'costModelsSourceDelete',
  },
  costModelsSourceDeleteSource: {
    defaultMessage: 'Unassign source',
    description: 'Unassign source',
    id: 'costModelsSourceDeleteSource',
  },
  costModelsSourceDeleteSourceDesc: {
    defaultMessage:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new source.',
    description:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new source.',
    id: 'costModelsSourceDeleteSourceDesc',
  },
  costModelsSourceEmptyStateDesc: {
    defaultMessage: 'Select the source(s) you want to apply this cost model to.',
    description: 'Select the source(s) you want to apply this cost model to.',
    id: 'costModelsSourceEmptyStateDesc',
  },
  costModelsSourceEmptyStateTitle: {
    defaultMessage: 'No sources are assigned',
    description: 'No sources are assigned',
    id: 'costModelsSourceEmptyStateTitle',
  },
  costModelsSourceTableAriaLabel: {
    defaultMessage: 'Sources table',
    description: 'Sources table',
    id: 'costModelsSourcesTableAriaLabel',
  },
  costModelsSourceTablePaginationAriaLabel: {
    defaultMessage: 'Sources table pagination controls',
    description: 'Sources table pagination controls',
    id: 'costModelsSourceTablePaginationAriaLabel',
  },
  costModelsSourceType: {
    defaultMessage: 'Source type',
    description: 'Source type',
    id: 'costModelsSourceType',
  },
  costModelsTableAriaLabel: {
    defaultMessage: 'Cost models table',
    description: 'Cost models table',
    id: 'costModelsTableAriaLabel',
  },
  costModelsTagRateTableAriaLabel: {
    defaultMessage: 'Tag rates',
    description: 'Tag rates',
    id: 'costModelsTagRateTableAriaLabel',
  },
  costModelsTagRateTableDefault: {
    defaultMessage: 'Default',
    description: 'Default',
    id: 'costModelsTagRateTableDefault',
  },
  costModelsTagRateTableKey: {
    defaultMessage: 'Tag key',
    description: 'Tag key',
    id: 'costModelsTagRateTableKey',
  },
  costModelsTagRateTableRate: {
    defaultMessage: 'Rate',
    description: 'Rate',
    id: 'costModelsTagRateTableRate',
  },
  costModelsTagRateTableValue: {
    defaultMessage: 'Tag value',
    description: 'Tag value',
    id: 'costModelsTagRateTableValue',
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
    defaultMessage: 'Select source type',
    description: 'Select source type',
    id: 'costModelsWizardEmptySourceTypeLabel',
  },
  costModelsWizardEmptyStateCreate: {
    defaultMessage: 'To create a price list, begin by clicking the {value} button.',
    description: 'To create a price list, begin by clicking the {Create rate} button.',
    id: 'costModelsWizardEmptyStateCreate',
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
  costModelsWizardOnboardAws: {
    defaultMessage: 'Amazon Web Services (AWS)',
    description: 'Amazon Web Services (AWS)',
    id: 'costModelsWizardOnboardAws',
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
      'Review and confirm your cost model configuration and assignments. Click {Create} to create the cost model, or {Back} to revise.',
    id: 'costModelsWizardReviewStatusSubDetails',
  },
  costModelsWizardReviewStatusSubTitle: {
    defaultMessage:
      'Costs for resources connected to the assigned sources will now be calculated using the newly created {value} cost model.',
    description:
      'Costs for resources connected to the assigned sources will now be calculated using the newly created {value} cost model.',
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
      'aws {Select from the following Amazon Web Services sources:} ' +
      'azure {Select from the following Microsoft Azure sources:} ' +
      'oci {Select from the following Oracle Cloud Infrastructure sources:} ' +
      'gcp {Select from the following Google Cloud Platform sources:} ' +
      'ocp {Select from the following Red Hat OpenShift sources:} ' +
      'other {}}',
    description: 'Select from the following {value} sources:',
    id: 'costModelsWizardSourceCaption',
  },
  costModelsWizardSourceErrorDescription: {
    defaultMessage:
      'Try refreshing this step or you can skip this step (as it is optional) and assign the source to the cost model at a later time. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'This step is temporarily unavailable',
    id: 'costModelsWizardSourceErrorDescription',
  },
  costModelsWizardSourceErrorTitle: {
    defaultMessage: 'This step is temporarily unavailable',
    description: 'This step is temporarily unavailable',
    id: 'costModelsWizardSourceErrorTitle',
  },
  costModelsWizardSourceSubtitle: {
    defaultMessage:
      'Select one or more sources to this cost model. You can skip this step and assign the cost model to a source at a later time. A source will be unavailable for selection if a cost model is already assigned to it.',
    description:
      'Select one or more sources to this cost model. You can skip this step and assign the cost model to a source at a later time. A source will be unavailable for selection if a cost model is already assigned to it.',
    id: 'costModelsWizardSourceSubtitle',
  },
  costModelsWizardSourceTableAriaLabel: {
    defaultMessage: 'Assign sources to cost model table',
    description: 'Assign sources to cost model table',
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
    defaultMessage: 'Assign sources to the cost model (optional)',
    description: 'Assign sources to the cost model (optional)',
    id: 'costModelsWizardSourceTitle',
  },
  costModelsWizardSourceWarning: {
    defaultMessage: 'This source is assigned to {costModel} cost model. You will have to unassigned it first',
    description: 'This source is assigned to {costModel} cost model. You will have to unassigned it first',
    id: 'costModelsWizardSourceWarning',
  },
  costModelsWizardStepsGenInfo: {
    defaultMessage: 'Enter information',
    description: 'Enter information',
    id: 'costModelsWizardStepsGenInfo',
  },
  costModelsWizardStepsPriceList: {
    defaultMessage: 'Price list',
    description: 'Price list',
    id: 'costModelsWizardStepsPriceList',
  },
  costModelsWizardStepsReview: {
    defaultMessage: 'Review details',
    description: 'Review details',
    id: 'costModelsWizardStepsReview',
  },
  costModelsWizardStepsSources: {
    defaultMessage: 'Assign a source to the cost model',
    description: 'Assign a source to the cost model',
    id: 'costModelsWizardStepsSources',
  },
  costModelsWizardSubTitleTable: {
    defaultMessage: 'The following is a list of rates you have set so far for this price list.',
    description: 'The following is a list of rates you have set so far for this price list.',
    id: 'costModelsWizardSubTitleTable',
  },
  costModelsWizardWarningSources: {
    defaultMessage: 'Cannot assign cost model to a source that is already assigned to another one',
    description: 'No Cannot assign cost model to a source that is already assigned to another one',
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
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources.',
    description:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources.',
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
  // See https://www.localeplanet.com/icu/currency.html
  currencyOptions: {
    defaultMessage:
      '{units, select, ' +
      'AUD {AUD (A$) - Australian Dollar}' +
      'CAD {CAD (CA$) - Canadian Dollar}' +
      'CHF {CHF (CHF) - Swiss Franc}' +
      'CNY {CNY (CN¥) - Chinese Yuan}' +
      'DKK {DKK (DKK) - Danish Krone}' +
      'EUR {EUR (€) - Euro}' +
      'GBP {GBP (£) - British Pound}' +
      'HKD {HKD (HK$) - Hong Kong Dollar}' +
      'JPY {JPY (¥) - Japanese Yen}' +
      'NOK {NOK (NOK) - Norwegian Krone}' +
      'NZD {NZD (NZ$) - New Zealand Dollar}' +
      'SEK {SEK (SEK) - Swedish Krona}' +
      'SGD {SGD (SGD) - Singapore Dollar}' +
      'USD {USD ($) - United States Dollar} ' +
      'ZAR {ZAR (ZAR) - South African Rand}' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'currencyOptions',
  },
  // See https://www.localeplanet.com/icu/currency.html
  currencyUnits: {
    defaultMessage:
      '{units, select, ' +
      'AUD {A$}' +
      'CAD {CA$}' +
      'CHF {CHF}' +
      'CNY {CN¥}' +
      'DKK {DKK}' +
      'EUR {€}' +
      'GBP {£}' +
      'HKD {HK$}' +
      'JPY {¥}' +
      'NOK {NOK}' +
      'NZD {NZ$}' +
      'SEK {SEK}' +
      'SGD {SGD}' +
      'USD {$} ' +
      'ZAR {ZAR}' +
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
  dataTableAriaLabel: {
    defaultMessage: 'Details table',
    description: 'Details table',
    id: 'dataTableAriaLabel',
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
      'cluster {cluster {name} clusters} ' +
      'gcp_project {GCP project {name} clusters} ' +
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
  detailsMoreClusters: {
    defaultMessage: ', {value} more...',
    description: ', {value} more...',
    id: 'detailsMoreClusters',
  },
  detailsResourceNames: {
    defaultMessage:
      '{value, select, ' +
      'account {Account names} ' +
      'cluster {Cluster names} ' +
      'gcp_project {GCP project names} ' +
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
    description: 'Details table resource names',
    id: 'detailsResourceNames',
  },
  detailsSummaryModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{name} accounts} ' +
      'cluster {{name} clusters} ' +
      'gcp_project {{name} GCP projects} ' +
      'node {{name} nodes} ' +
      'org_unit_id {{name} organizational units} ' +
      'payer_tenant_id {{name} accounts} ' +
      'product_service {{name} services} ' +
      'project {{name} projects} ' +
      'region {{name} regions} ' +
      'resource_location {{name} regions} ' +
      'service {{name} services} ' +
      'service_name {{name} services} ' +
      'subscription_guid {{name} accounts} ' +
      'tag {{name} tags} ' +
      'other {}}',
    description: ', {value} more...',
    id: 'detailsSummaryModalTitle',
  },
  detailsUnusedRequestsLabel: {
    defaultMessage: 'Unrequested capacity',
    description: 'Unrequested capacity',
    id: 'detailsUnusedRequestsLabel',
  },
  detailsUnusedUnits: {
    defaultMessage: '{units} ({percentage}% of capacity)',
    description: '{units} ({percentage}% of capacity)',
    id: 'detailsUnusedUsageUnits',
  },
  detailsUnusedUsageLabel: {
    defaultMessage: 'Unused capacity',
    description: 'Unused capacity',
    id: 'detailsUnusedUsageLabel',
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
      'cluster {View all clusters} ' +
      'gcp_project {View all GCP projects} ' +
      'node {View all nodes} ' +
      'org_unit_id {View all organizational units} ' +
      'payer_tenant_id {View all accounts} ' +
      'product_service {View all services} ' +
      'project {View all projects} ' +
      'region {View all regions} ' +
      'resource_location {View all regions} ' +
      'service {View all Services} ' +
      'service_name {View all services} ' +
      'subscription_guid {View all accounts} ' +
      'tag {View all tags} ' +
      'other {}}',
    description: 'View all {value}',
    id: 'detailsViewAll',
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
      'true {Distribute {type, select, platform {platform} workers {workers} other {}} costs}' +
      'false {Do not distribute {type, select, platform {platform} workers {workers} other {}} costs}' +
      'other {}}',
    description: 'distribute costs',
    id: 'distributeCosts',
  },
  distributionModelDesc: {
    defaultMessage:
      'This choice is for users to direct how their raw costs are distributed either by CPU or Memory on the project level breakdowns.',
    description:
      'This choice is for users to direct how their raw costs are distributed either by CPU or Memory on the project level breakdowns.',
    id: 'distributionModelDesc',
  },
  distributionType: {
    defaultMessage: 'Distribution type',
    description: 'Distribution type',
    id: 'distributionType',
  },
  distributionTypeDescription: {
    defaultMessage: 'Distribute costs based on {type} usage',
    description: 'Distribution type description',
    id: 'distributionTypeDescription',
  },
  docsAddOcpSources: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/adding_an_openshift_container_platform_source_to_cost_management',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/adding_an_openshift_container_platform_source_to_cost_management',
    id: 'docsAddOcpSources',
  },
  docsConfigCostModels: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    id: 'docsConfigCostModels',
  },
  docsCostModelTerminology: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index#cost-model-terminology',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index#cost-model-terminology',
    id: 'docsCostModelTerminology',
  },
  docsUsingCostModels: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html-single/using_cost_models/index',
    id: 'docsUsingCostModels',
  },
  docsCostModelsDistribution: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2022/html/using_cost_models/assembly-setting-up-cost-models#creating-an-AWS-Azure-cost-model_setting-up-cost-models',
    description: 'url for cost models distribution',
    id: 'docsCostModelsDistribution',
  },
  doNotDistribute: {
    defaultMessage: 'Do not distribute',
    description: 'Do not distribute',
    id: 'doNotDistribute',
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
  examplesTitle: {
    defaultMessage: 'Examples',
    description: 'Examples',
    id: 'ExamplesTitle',
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
  expiresOn: {
    defaultMessage: 'Expires on',
    description: 'Expires on',
    id: 'expiresOn',
  },
  explorerChartAriaTitle: {
    defaultMessage: 'Cost Explorer Chart',
    description: 'Cost Explorer Chart',
    id: 'explorerChartAriaTitle',
  },
  explorerChartDate: {
    defaultMessage:
      '{month, select, ' +
      '0 {Jan {date}} ' +
      '1 {Feb {date}} ' +
      '2 {Mar {date}} ' +
      '3 {Apr {date}} ' +
      '4 {May {date}} ' +
      '5 {Jun {date}} ' +
      '6 {Jul {date}} ' +
      '7 {Aug {date}} ' +
      '8 {Sep {date}} ' +
      '9 {Oct {date}} ' +
      '10 {Nov {date}} ' +
      '11 {Dec {date}} ' +
      'other {}}',
    description: 'Month {date}',
    id: 'explorerDateColumn',
  },
  explorerChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services - Top 5 Costliest} ' +
      'aws_ocp {Amazon Web Services filtered by OpenShift - Top 5 Costliest} ' +
      'azure {Microsoft Azure - Top 5 Costliest} ' +
      'oci {Oracle Cloud Infrastructure - Top 5 Costliest} ' +
      'azure_ocp {Microsoft Azure filtered by OpenShift - Top 5 Costliest} ' +
      'gcp {Google Cloud Platform - Top 5 Costliest} ' +
      'gcp_ocp {Google Cloud Platform filtered by OpenShift - Top 5 Costliest} ' +
      'ibm {IBM Cloud - Top 5 Costliest} ' +
      'ibm_ocp {IBM Cloud filtered by OpenShift - Top 5 Costliest} ' +
      'ocp {All OpenShift - Top 5 Costliest} ' +
      'ocp_cloud {All cloud filtered by OpenShift - Top 5 Costliest} ' +
      'other {}}',
    description: 'Explorer chart title',
    id: 'explorerChartTitle',
  },
  explorerDateRange: {
    defaultMessage:
      '{value, select, ' +
      'current_month_to_date {Month to date} ' +
      'last_ninety_days {Last 90 days} ' +
      'last_sixty_days {Last 60 days} ' +
      'last_thirty_days {Last 30 days} ' +
      'previous_month_to_date {Previous month and month to date} ' +
      'other {}}',
    description: 'Date range based on {value}',
    id: 'explorerDateRange',
  },
  explorerMonthDate: {
    defaultMessage: '{month} {date}',
    description: 'Cost {month} {date}',
    id: 'explorerMonthDate',
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
      'cluster {{resolution, select, daily {{provider}_clusters_daily_{startDate}_{endDate}} monthly {{provider}_clusters_monthly_{startDate}_{endDate}} other {}}} ' +
      'gcp_project {{resolution, select, daily {{provider}_gcp-projects_daily_{startDate}_{endDate}} monthly {{provider}_gcp-projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'node {{resolution, select, daily {{provider}_node_daily_{startDate}_{endDate}} monthly {{provider}_node_monthly_{startDate}_{endDate}} other {}}} ' +
      'org_unit_id {{resolution, select, daily {{provider}_orgs_daily_{startDate}_{endDate}} monthly {{provider}_orgs_monthly_{startDate}_{endDate}} other {}}} ' +
      'payer_tenant_id {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'product_service {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'project {{resolution, select, daily {{provider}_projects_daily_{startDate}_{endDate}} monthly {{provider}_projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'region {{resolution, select, daily {{provider}_regions_daily_{startDate}_{endDate}} monthly {{provider}_regions_monthly_{startDate}_{endDate}} other {}}} ' +
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
      'cluster {Aggregates of the following clusters will be exported to a .csv file.} ' +
      'gcp_project {Aggregates of the following GCP projects will be exported to a .csv file.} ' +
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
      'account {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} oci {Oracle Cloud Infrastructure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud Platform grouped by Account} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Account} ibm {IBM Cloud grouped by Account} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'cluster {{provider, select, aws {Amazon Web Services grouped by Cluster} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Cluster} azure {Microsoft Azure grouped by Cluster} oci {Oracle Cloud Infrastructure grouped by Cluster} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Cluster} gcp {Google Cloud Platform grouped by Cluster} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Cluster} ibm {IBM Cloud grouped by Cluster} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Cluster} ocp {OpenShift grouped by Cluster} ocp_cloud {All cloud filtered by OpenShift grouped by Cluster} other {}}} ' +
      'gcp_project {{provider, select, aws {Amazon Web Services grouped by GCP Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by GCP Project} azure {Microsoft Azure grouped by GCP Project} oci {Oracle Cloud Infrastructure grouped by GCP Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by GCP Project} gcp {Google Cloud Platform grouped by GCP Project} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by GCP Project} ibm {IBM Cloud grouped by GCP Project} ibm_ocp {IBM Cloud filtered by OpenShift grouped by GCP Project} ocp {OpenShift grouped by GCP Project} ocp_cloud {All cloud filtered by OpenShift grouped by GCP Project} other {}}} ' +
      'node {{provider, select, aws {Amazon Web Services grouped by Node} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Node} azure {Microsoft Azure grouped by Node} oci {Oracle Cloud Infrastructure grouped by Node} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Node} gcp {Google Cloud Platform grouped by Node} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Node} ibm {IBM Cloud grouped by Node} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Node} ocp {OpenShift grouped by Node} ocp_cloud {All cloud filtered by OpenShift grouped by Node} other {}}} ' +
      'org_unit_id {{provider, select, aws {Amazon Web Services grouped by Organizational unit} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Organizational unit} azure {Microsoft Azure grouped by Organizational unit} oci {Oracle Cloud Infrastructure grouped by Organizational unit} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Organizational unit} gcp {Google Cloud Platform grouped by Organizational unit} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Organizational unit} ibm {IBM Cloud grouped by Organizational unit} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Organizational unit} ocp {OpenShift grouped by Organizational unit} ocp_cloud {All cloud filtered by OpenShift grouped by Organizational unit} other {}}} ' +
      'payer_tenant_id {{provider, select, oci {Oracle Cloud Infrastructure grouped by Account} other {}}}' +
      'product_service {{provider, select, oci {Oracle Cloud Infrastructure grouped by Service} other {}}}' +
      'project {{provider, select, aws {Amazon Web Services grouped by Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Project} azure {Microsoft Azure grouped by Project} oci {Oracle Cloud Infrastructure grouped by Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Project} gcp {Google Cloud Platform grouped by Project} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Project} ibm {IBM Cloud grouped by Project} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Project} ocp {OpenShift grouped by Project} ocp_cloud {All cloud filtered by OpenShift grouped by Project} other {}}} ' +
      'region {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} oci {Oracle Cloud Infrastructure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud Platform grouped by Region} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Region} ibm {IBM Cloud grouped by Region} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'resource_location {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} oci {Oracle Cloud Infrastructure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud Platform grouped by Region} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Region} ibm {IBM Cloud grouped by Region} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'service {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} oci {Oracle Cloud Infrastructure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud Platform grouped by Service} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Service} ibm {IBM Cloud grouped by Service} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'service_name {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} oci {Oracle Cloud Infrastructure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud Platform grouped by Service} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Service} ibm {IBM Cloud grouped by Service} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'subscription_guid {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} oci {Oracle Cloud Infrastructure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud Platform grouped by Account} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Account} ibm {IBM Cloud grouped by Account} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'tag {{provider, select, aws {Amazon Web Services grouped by Tag} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Tag} azure {Microsoft Azure grouped by Tag} oci {Oracle Cloud Infrastructure grouped by Tag} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Tag} gcp {Google Cloud Platform grouped by Tag} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Tag} ibm {IBM Cloud grouped by Tag} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Tag} ocp {OpenShift grouped by Tag} ocp_cloud {All cloud filtered by OpenShift grouped by Tag} other {}}} ' +
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
    defaultMessage: 'Should not exceed 50 characters',
    description: 'Should not exceed 50 characters',
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
      'cluster {Selected clusters ({count})} ' +
      'gcp_project {Selected GCP projects ({count})} ' +
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
      'other {}}',
    description: 'Selected items for export',
    id: 'exportSelected',
  },
  exportTimeScope: {
    defaultMessage: '{value, select, current {Current ({date})} previous {Previous ({date})} other {}}',
    description: 'Export time scope',
    id: 'exportTimeScope',
  },
  exportTimeScopeTitle: {
    defaultMessage: 'Month',
    description: 'Month',
    id: 'exportTimeScopeTitle',
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
  filterByButtonAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Filter button for account name} ' +
      'cluster {Filter button for cluster name} ' +
      'gcp_project {Filter button for GCP project name} ' +
      'name {Filter button for name name} ' +
      'node {Filter button for node name} ' +
      'org_unit_id {Filter button for organizational unit name} ' +
      'payer_tenant_id {Filter button for account name} ' +
      'product_service {Filter button for service name} ' +
      'project {Filter button for project name} ' +
      'region {Filter button for region name} ' +
      'resource_location {Filter button for region name} ' +
      'service {Filter button for service name} ' +
      'service_name {Filter button for service_name name} ' +
      'subscription_guid {Filter button for account name} ' +
      'tag {Filter button for tag name} ' +
      'other {}}',
    description: 'Filter button for "value" name',
    id: 'filterByButtonAriaLabel',
  },
  filterByInputAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Input for account name} ' +
      'cluster {Input for cluster name} ' +
      'gcp_project {Input for GCP project name} ' +
      'name {Input for name name} ' +
      'node {Input for node name} ' +
      'org_unit_id {Input for organizational unit name} ' +
      'payer_tenant_id {Input for account name} ' +
      'product_service {Input for service_name name} ' +
      'project {Input for project name} ' +
      'region {Input for region name} ' +
      'resource_location {Input for region name} ' +
      'service {Input for service name} ' +
      'service_name {Input for service_name name} ' +
      'subscription_guid {Input for account name} ' +
      'tag {Input for tag name} ' +
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
      'cluster {Filter by cluster} ' +
      'description {Filter by description} ' +
      'gcp_project {Filter by GCP project} ' +
      'name {Filter by name} ' +
      'node {Filter by node} ' +
      'org_unit_id {Filter by organizational unit} ' +
      'payer_tenant_id {Filter by account} ' +
      'product_service {Filter by service} ' +
      'project {Filter by project} ' +
      'region {Filter by region} ' +
      'resource_location {Filter by region} ' +
      'service {Filter by service} ' +
      'service_name {Filter by service} ' +
      'source_type {Filter by source type} ' +
      'subscription_guid {Filter by account} ' +
      'tag {Filter by tag} ' +
      'other {}}',
    description: 'Filter by "value"',
    id: 'filterByPlaceholder',
  },
  filterByTagKeyAriaLabel: {
    defaultMessage: 'Tag keys',
    description: 'Tag keys',
    id: 'filterByTagKeyAriaLabel',
  },
  filterByTagKeyPlaceholder: {
    defaultMessage: 'Choose key',
    description: 'Choose key',
    id: 'filterByTagKeyPlaceholder',
  },
  filterByTagValueAriaLabel: {
    defaultMessage: 'Tag values',
    description: 'Tag values',
    id: 'filterByTagValueAriaLabel',
  },
  filterByTagValueButtonAriaLabel: {
    defaultMessage: 'Filter button for tag value',
    description: 'Filter button for tag value',
    id: 'filterByTagValueButtonAriaLabel',
  },
  filterByTagValueInputPlaceholder: {
    defaultMessage: 'Filter by value',
    description: 'Filter by value',
    id: 'filterByTagValueInputPlaceholder',
  },
  filterByTagValuePlaceholder: {
    defaultMessage: 'Choose value',
    description: 'Choose value',
    id: 'filterByTagValuePlaceholder',
  },
  filterByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {Account} ' +
      'cluster {Cluster} ' +
      'gcp_project {GCP project} ' +
      'name {Name} ' +
      'node {Node} ' +
      'org_unit_id {Organizational unit} ' +
      'payer_tenant_id {Account} ' +
      'product_service {Service} ' +
      'project {Project} ' +
      'region {Region} ' +
      'resource_location {Region} ' +
      'service {Service} ' +
      'service_name {Service} ' +
      'subscription_guid {Account} ' +
      'tag {Tag} ' +
      'other {}}',
    description: 'Filter by values',
    id: 'filterByValues',
  },
  forDate: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {{value} for January {startDate}} other {{value} for January {startDate}-{endDate}}}} ' +
      '1 {{count, plural, one {{value} for February {startDate}} other {{value} for February {startDate}-{endDate}}}} ' +
      '2 {{count, plural, one {{value} for March {startDate}} other {{value} for March {startDate}-{endDate}}}} ' +
      '3 {{count, plural, one {{value} for April {startDate}} other {{value} for April {startDate}-{endDate}}}} ' +
      '4 {{count, plural, one {{value} for May {startDate}} other {{value} for May {startDate}-{endDate}}}} ' +
      '5 {{count, plural, one {{value} for June {startDate}} other {{value} for June {startDate}-{endDate}}}} ' +
      '6 {{count, plural, one {{value} for July {startDate}} other {{value} for July {startDate}-{endDate}}}} ' +
      '7 {{count, plural, one {{value} for August {startDate}} other {{value} for August {startDate}-{endDate}}}} ' +
      '8 {{count, plural, one {{value} for September {startDate}} other {{value} for September {startDate}-{endDate}}}} ' +
      '9 {{count, plural, one {{value} for October {startDate}} other {{value} for October {startDate}-{endDate}}}} ' +
      '10 {{count, plural, one {{value} for November {startDate}} other {{value} for November {startDate}-{endDate}}}} ' +
      '11 {{count, plural, one {{value} for December {startDate}} other {{value} for December {startDate}-{endDate}}}} ' +
      'other {}}',
    description: '{value} for date range',
    id: 'forDate',
  },
  gcp: {
    defaultMessage: 'Google Cloud Platform',
    description: 'Google Cloud Platform',
    id: 'gcp',
  },
  gcpComputeTitle: {
    defaultMessage: 'Compute instances usage',
    description: 'Compute instances usage',
    id: 'gcpComputeTitle',
  },
  gcpCostTitle: {
    defaultMessage: 'Google Cloud Platform Services cost',
    description: 'Google Cloud Platform Services cost',
    id: 'gcpCostTitle',
  },
  gcpCostTrendTitle: {
    defaultMessage: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    description: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    id: 'gcpCostTrendTitle',
  },
  gcpDailyCostTrendTitle: {
    defaultMessage: 'Google Cloud Platform Services daily cost comparison ({units})',
    description: 'Google Cloud Platform Services daily cost comparison ({units})',
    id: 'gcpDailyCostTrendTitle',
  },
  gcpDesc: {
    defaultMessage: 'Raw cost from Google Cloud Platform infrastructure.',
    description: 'Raw cost from Google Cloud Platform infrastructure.',
    id: 'gcpDesc',
  },
  gcpDetailsTitle: {
    defaultMessage: 'Google Cloud Platform Details',
    description: 'Google Cloud Platform Details',
    id: 'gcpDetailsTitle',
  },
  groupByAll: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {All account} other {All accounts}}} ' +
      'cluster {{count, plural, one {All cluster} other {All clusters}}} ' +
      'gcp_project {{count, plural, one {All GCP project} other {All GCP projects}}} ' +
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
      'cluster {{count, plural, one {Top cluster} other {Top clusters}}} ' +
      'gcp_project {{count, plural, one {Top GCP project} other {Top GCP projects}}} ' +
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
      'cluster {Cluster names} ' +
      'gcp_project {GCP project names} ' +
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
      'cluster {{count, plural, one {cluster} other {clusters}}} ' +
      'gcp_project {{count, plural, one {GCP project} other {GCP projects}}} ' +
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
      'cluster {{count, plural, one {Cluster} other {Clusters}}} ' +
      'gcp_project {{count, plural, one {GCP project} other {GCP projects}}} ' +
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
  historicalChartCostLabel: {
    defaultMessage: 'Cost ({units})',
    description: 'Cost ({units})',
    id: 'historicalChartCostLabel',
  },
  historicalChartDayOfMonthLabel: {
    defaultMessage: 'Day of Month',
    description: 'Day of Month',
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
  ibm: {
    defaultMessage: 'IBM Cloud',
    description: 'IBM Cloud',
    id: 'ibm',
  },
  ibmComputeTitle: {
    defaultMessage: 'Compute instances usage',
    description: 'Compute instances usage',
    id: 'ibmComputeTitle',
  },
  ibmCostTitle: {
    defaultMessage: 'IBM Cloud Services cost',
    description: 'IBM Cloud Services cost',
    id: 'ibmCostTitle',
  },
  ibmCostTrendTitle: {
    defaultMessage: 'IBM Cloud Services cumulative cost comparison ({units})',
    description: 'IBM Cloud Services cumulative cost comparison ({units})',
    id: 'ibmCostTrendTitle',
  },
  ibmDailyCostTrendTitle: {
    defaultMessage: 'IBM Cloud Services daily cost comparison ({units})',
    description: 'IBM Cloud Services daily cost comparison ({units})',
    id: 'ibmDailyCostTrendTitle',
  },
  ibmDesc: {
    defaultMessage: 'Raw cost from IBM Cloud infrastructure.',
    description: 'Raw cost from IBM Cloud infrastructure.',
    id: 'ibmDesc',
  },
  ibmDetailsTitle: {
    defaultMessage: 'IBM Cloud Details',
    description: 'IBM details title',
    id: 'ibmDetailsTitle',
  },
  inactiveSourcesGoTo: {
    defaultMessage: 'Go to Sources for more information',
    description: 'Go to Sources for more information',
    id: 'inactiveSourcesGoTo',
  },
  inactiveSourcesTitle: {
    defaultMessage: 'A problem was detected with {value}',
    description: 'A problem was detected with {value}',
    id: 'inactiveSourcesGoTitle',
  },
  inactiveSourcesTitleMultiplier: {
    defaultMessage: 'A problem was detected with the following sources',
    description: 'A problem was detected with the following sources',
    id: 'inactiveSourcesTitleMultiplier',
  },
  infrastructure: {
    defaultMessage: 'Infrastructure',
    description: 'Infrastructure',
    id: 'infrastructure',
  },
  learnMore: {
    defaultMessage: 'Learn more',
    description: 'Learn more',
    id: 'learnMore',
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
  maintenanceEmptyStateDesc: {
    defaultMessage:
      'Cost Management is currently undergoing scheduled maintenance and will be unavailable from 13:00 - 19:00 UTC (09:00 AM - 03:00 PM EDT).',
    description: 'Cost Management is currently undergoing scheduled maintenance',
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
  markupDescription: {
    defaultMessage:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    description:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    id: 'markupDescription',
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
      'Use markup/discount to manipulate how the raw costs are being calculated for your sources. Note, costs calculated from price list rates will not be affected by this.',
    description:
      'Use markup/discount to manipulate how the raw costs are being calculated for your sources. Note, costs calculated from price list rates will not be affected by this.',
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
      'node {Node} ' +
      'persistent_volume_claims {Persistent volume claims} ' +
      'storage {Storage} ' +
      'other {}}',
    description: 'Metric values',
    id: 'metricValues',
  },
  monthOverMonthChange: {
    defaultMessage: 'Month over month change',
    description: 'Month over month change',
    id: 'monthOverMonthChange',
  },
  names: {
    defaultMessage: '{count, plural, one {Name} other {Names}}',
    description: 'Name plural or singular',
    id: 'names',
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
  noDataForDate: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {No data available for Jan {startDate}} other {No data available for Jan {startDate}-{endDate}}}} ' +
      '1 {{count, plural, one {No data available for Feb {startDate}} other {No data available for Feb {startDate}-{endDate}}}} ' +
      '2 {{count, plural, one {No data available for Mar {startDate}} other {No data available for Mar {startDate}-{endDate}}}} ' +
      '3 {{count, plural, one {No data available for Apr {startDate}} other {No data available for Apr {startDate}-{endDate}}}} ' +
      '4 {{count, plural, one {No data available for May {startDate}} other {No data available for May {startDate}-{endDate}}}} ' +
      '5 {{count, plural, one {No data available for Jun {startDate}} other {No data available for Jun {startDate}-{endDate}}}} ' +
      '6 {{count, plural, one {No data available for Jul {startDate}} other {No data available for Jul {startDate}-{endDate}}}} ' +
      '7 {{count, plural, one {No data available for Aug {startDate}} other {No data available for Aug {startDate}-{endDate}}}} ' +
      '8 {{count, plural, one {No data available for Sep {startDate}} other {No data available for Sep {startDate}-{endDate}}}} ' +
      '9 {{count, plural, one {No data available for Oct {startDate}} other {No data available for Oct {startDate}-{endDate}}}} ' +
      '10 {{count, plural, one {No data available for Nov {startDate}} other {No data available for Nov {startDate}-{endDate}}}} ' +
      '11 {{count, plural, one {No data available for Dec {startDate}} other {No data available for Dec {startDate}-{endDate}}}} ' +
      'other {}}',
    description: 'No data available for date range',
    id: 'noDataForDate',
  },
  noDataStateDesc: {
    defaultMessage:
      'We have detected a source, but we are not done processing the incoming data. The time to process could take up to 24 hours. Try refreshing the page at a later time.',
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
    id: 'NoExportsStateTitle',
  },
  noProvidersStateAwsDesc: {
    defaultMessage:
      'Add an Amazon Web Services account to see a total cost breakdown of your spend by accounts, organizational units, services, regions, or tags.',
    description:
      'Add an Amazon Web Services account to see a total cost breakdown of your spend by accounts, organizational units, services, regions, or tags.',
    id: 'noProvidersStateAwsDesc',
  },
  noProvidersStateAwsTitle: {
    defaultMessage: 'Track your Amazon Web Services spending!',
    description: 'Track your Amazon Web Services spending!',
    id: 'noProvidersStateAwsTitle',
  },
  noProvidersStateAzureDesc: {
    defaultMessage:
      'Add a Microsoft Azure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add a Microsoft Azure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'noProvidersStateAzureDesc',
  },
  noProvidersStateAzureTitle: {
    defaultMessage: 'Track your Microsoft Azure spending!',
    description: 'Track your Microsoft Azure spending!',
    id: 'noProvidersStateAzureTitle',
  },
  noProvidersStateGcpDesc: {
    defaultMessage:
      'Add a Google Cloud Platform account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add a Google Cloud Platform account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'noProvidersStateGcpDesc',
  },
  noProvidersStateGcpTitle: {
    defaultMessage: 'Track your Google Cloud Platform spending!',
    description: 'Track your Google Cloud Platform spending!',
    id: 'noProvidersStateGcpTitle',
  },
  noProvidersStateGetStarted: {
    defaultMessage: 'Get started with Sources',
    description: 'Get started with Sources',
    id: 'noProvidersStateGetStarted',
  },
  noProvidersStateIbmDesc: {
    defaultMessage:
      'Add an IBM Cloud account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add an IBM Cloud account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'noProvidersStateIbmDesc',
  },
  noProvidersStateIbmTitle: {
    defaultMessage: 'Track your IBM Cloud spending!',
    description: 'Track your IBM Cloud spending!',
    id: 'noProvidersStateIbmTitle',
  },
  noProvidersStateOciDesc: {
    defaultMessage:
      'Add an Oracle Cloud Infrastructure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add an Oracle Cloud Infrastructure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'noProvidersStateOciDesc',
  },
  noProvidersStateOciTitle: {
    defaultMessage: 'Track your Oracle Cloud Infrastructure spending!',
    description: 'Track your Oracle Cloud Infrastructure spending!',
    id: 'noProvidersStateOciTitle',
  },
  noProvidersStateOcpAddSources: {
    defaultMessage: 'Add an OpenShift cluster to Cost Management',
    description: 'Add an OpenShift cluster to Cost Management',
    id: 'noProvidersStateOcpAddSources',
  },
  noProvidersStateOcpDesc: {
    defaultMessage:
      'Add an OpenShift Container Platform cluster to see a total cost breakdown of your pods by cluster, node, project, or labels.',
    description:
      'Add an OpenShift Container Platform cluster to see a total cost breakdown of your pods by cluster, node, project, or labels.',
    id: 'noProvidersStateOcpDesc',
  },
  noProvidersStateOcpTitle: {
    defaultMessage: 'Track your OpenShift spending!',
    description: 'Track your OpenShift spending!',
    id: 'noProvidersStateOcpTitle',
  },
  noProvidersStateOverviewDesc: {
    defaultMessage:
      'Add a source, like an OpenShift Container Platform cluster or a cloud services account, to see a total cost breakdown as well as usage information like instance counts and storage.',
    description:
      'Add a source, like an OpenShift Container Platform cluster or a cloud services account, to see a total cost breakdown as well as usage information like instance counts and storage.',
    id: 'noProvidersStateOverviewDesc',
  },
  noProvidersStateOverviewTitle: {
    defaultMessage: 'Track your spending!',
    description: 'Track your spending!',
    id: 'noProvidersStateOverviewTitle',
  },
  noResultsFound: {
    defaultMessage: 'No results found',
    description: 'No results found',
    id: 'noResultsFound',
  },
  notAuthorizedStateAws: {
    defaultMessage: 'Amazon Web Services in Cost Management',
    description: 'Amazon Web Services in Cost Management',
    id: 'noAuthorizedStateAws',
  },
  notAuthorizedStateAzure: {
    defaultMessage: 'Microsoft Azure in Cost Management',
    description: 'Microsoft Azure in Cost Management',
    id: 'notAuthorizedStateAzure',
  },
  notAuthorizedStateCostModels: {
    defaultMessage: 'Cost Models in Cost Management',
    description: 'Cost Models in Cost Management',
    id: 'notAuthorizedStateCostModels',
  },
  notAuthorizedStateGcp: {
    defaultMessage: 'Google Cloud Platform in Cost Management',
    description: 'Google Cloud Platform in Cost Management',
    id: 'notAuthorizedStateGcp',
  },
  notAuthorizedStateIbm: {
    defaultMessage: 'IBM Cloud in Cost Management',
    description: 'IBM Cloud in Cost Management',
    id: 'notAuthorizedStateIbm',
  },
  notAuthorizedStateOci: {
    defaultMessage: 'Oracle Cloud Infrastructure in Cost Management',
    description: 'Oracle Cloud Infrastructure in Cost Management',
    id: 'notAuthorizedStateOci',
  },
  notAuthorizedStateOcp: {
    defaultMessage: 'OpenShift in Cost Management',
    description: 'OpenShift in Cost Management',
    id: 'notAuthorizedStateOcp',
  },
  oci: {
    defaultMessage: 'Oracle Cloud Infrastructure',
    description: 'Oracle Cloud Infrastructure',
    id: 'oci',
  },
  ociComputeTitle: {
    defaultMessage: 'Virtual machines usage',
    description: 'Virtual machines usage',
    id: 'ociComputeTitle',
  },
  ociCostTrendTitle: {
    defaultMessage: 'Oracle Cloud Infrastructure cumulative cost comparison ({units})',
    description: 'Oracle Cloud Infrastructure cumulative cost comparison ({units})',
    id: 'ociCostTrendTitle',
  },
  ociDailyCostTrendTitle: {
    defaultMessage: 'Oracle Cloud Infrastructure daily cost comparison ({units})',
    description: 'Oracle Cloud Infrastructure daily cost comparison ({units})',
    id: 'ociDailyCostTrendTitle',
  },
  ociDashboardCostTitle: {
    defaultMessage: 'Oracle Cloud Infrastructure cost',
    description: 'Oracle Cloud Infrastructure cost',
    id: 'ociDashboardCostTitle',
  },
  ociDesc: {
    defaultMessage: 'Raw cost from Oracle Cloud Infrastructure.',
    description: 'Raw cost from Oracle Cloud Infrastructure.',
    id: 'ociDesc',
  },
  ociDetailsTitle: {
    defaultMessage: 'Oracle Cloud Infrastructure details',
    description: 'Oracle Cloud Infrastructure details',
    id: 'ociDetailsTitle',
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
  ocpDashboardCPUUsageAndRequests: {
    defaultMessage: 'OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'ocpDashboardCPUUsageAndRequests',
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
  ocpDashboardMemoryUsageAndRequests: {
    defaultMessage: 'OpenShift Memory usage and requests',
    description: 'OpenShift Memory usage and requests',
    id: 'ocpDashboardMemoryUsageAndRequests',
  },
  ocpDashboardVolumeUsageAndRequests: {
    defaultMessage: 'OpenShift Volume usage and requests',
    description: 'OpenShift Volume usage and requests',
    id: 'ocpUsageAndRequests',
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
    description: 'OpenShift details title',
    id: 'ocpDetailsTitle',
  },
  ocpInfrastructureCostTitle: {
    defaultMessage: 'OpenShift infrastructure cost',
    description: 'OpenShift infrastructure cost',
    id: 'ocpInfrastructureCostTitle',
  },
  ocpInfrastructureCostTrendTitle: {
    defaultMessage: 'OpenShift cumulative infrastructure cost comparison ({units})',
    description: 'OpenShift cumulative infrastructure cost comparison with units',
    id: 'ocpInfrastructureCostTrendTitle',
  },
  ocpInfrastructureDailyCostTrendTitle: {
    defaultMessage: 'OpenShift daily infrastructure cost comparison ({units})',
    description: 'OpenShift daily infrastructure cost comparison with units',
    id: 'ocpInfrastructureDailyCostTrendTitle',
  },
  ocpMemoryUsageAndRequests: {
    defaultMessage: 'Memory usage and requests',
    description: 'Memory usage and requests',
    id: 'ocpMemoryUsageAndRequests',
  },
  ocpSupplementaryCostTitle: {
    defaultMessage: 'OpenShift supplementary cost',
    description: 'OpenShift supplementary cost',
    id: 'ocpSupplementaryCostTitle',
  },
  ocpSupplementaryCostTrendTitle: {
    defaultMessage: 'OpenShift cumulative supplementary cost comparison ({units})',
    description: 'OpenShift cumulative supplementary cost comparison with units',
    id: 'ocpSupplementaryCostTrendTitle',
  },
  ocpSupplementaryDailyCostTrendTitle: {
    defaultMessage: 'OpenShift daily supplementary cost comparison ({units})',
    description: 'OpenShift daily supplementary cost comparison with units',
    id: 'ocpSupplementaryDailyCostTrendTitle',
  },
  ocpUsageCostTitle: {
    defaultMessage: 'OpenShift usage cost',
    description: 'OpenShift usage cost',
    id: 'ocpUsageCostTitle',
  },
  ocpUsageDashboardCPUTitle: {
    defaultMessage: 'OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'ocpUsageDashboardCPUTitle',
  },
  ocpUsageDashboardCostTrendTitle: {
    defaultMessage: 'Metering cumulative cost comparison ({units})',
    description: 'Metering cumulative cost comparison with units',
    id: 'ocpUsageDashboardCostTrendTitle',
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
    defaultMessage: 'Cost Management Overview',
    description: 'Cost Management Overview',
    id: 'overviewTitle',
  },
  pageTitleAws: {
    defaultMessage: 'Amazon Web Services - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Amazon Web Services - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleAws',
  },
  pageTitleAzure: {
    defaultMessage: 'Microsoft Azure - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Microsoft Azure - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleAzure',
  },
  pageTitleCostModels: {
    defaultMessage: 'Cost Models - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Models - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleCostModels',
  },
  pageTitleDefault: {
    defaultMessage: 'Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleDefault',
  },
  pageTitleExplorer: {
    defaultMessage: 'Cost Explorer - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Explorer - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleExplorer',
  },
  pageTitleGcp: {
    defaultMessage: 'Google Cloud Platform - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Google Cloud Platform - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleGcp',
  },
  pageTitleIbm: {
    defaultMessage: 'IBM Cloud - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'IBM Cloud - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleIbm',
  },
  pageTitleOci: {
    defaultMessage: 'Oracle Cloud Infrastructure - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Oracle Cloud Infrastructure - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleOci',
  },
  pageTitleOcp: {
    defaultMessage: 'OpenShift - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'OpenShift - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleOcp',
  },
  pageTitleOverview: {
    defaultMessage: 'Overview - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Overview - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'pageTitleOverview',
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
      'oci {Oracle Cloud Infrastructure} ' +
      'azure_ocp {Microsoft Azure filtered by OpenShift} ' +
      'gcp {Google Cloud Platform} ' +
      'gcp_ocp {Google Cloud Platform filtered by OpenShift} ' +
      'ibm {IBM Cloud} ' +
      'ibm_ocp {IBM filtered by OpenShift} ' +
      'ocp {All OpenShift} ' +
      'ocp_cloud {All cloud filtered by OpenShift} ' +
      'other {}}',
    description: 'Perspective values',
    id: 'perspectiveValues',
  },
  platformUnallocatedCapacity: {
    defaultMessage: 'Platform unallocated capacity',
    description: 'Platform unallocated capacity',
    id: 'platformUnallocatedCapacity',
  },
  platformUnallocatedCapacityDescription: {
    defaultMessage: 'Distribute the cost of running the OpenShift services to projects',
    description: 'Platform unallocated capacity description',
    id: 'platformUnallocatedCapacityDescription',
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
      '{count, plural, one {This action will remove {metric} rate from {costModel}} other {This action will remove {metric} rate from {costModel}, which is assigned to the following sources:}}',
    description: 'This action will remove {metric} rate from {costModel}, which is assigned to the following sources:',
    id: 'priceListDesc',
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
    id: 'PriceListPosNumberRate',
  },
  rate: {
    defaultMessage: 'Rate',
    description: 'Rate',
    id: 'rate',
  },
  rawCostDescription: {
    defaultMessage: 'The costs reported by a cloud provider without any cost model calculations applied.',
    description: 'The costs reported by a cloud provider without any cost model calculations applied.',
    id: 'rawCostDescription',
  },
  rawCostTitle: {
    defaultMessage: 'Raw cost',
    description: 'Raw cost',
    id: 'rawCostTitle',
  },
  rbacErrorDescription: {
    defaultMessage:
      'There was a problem receiving user permissions. Refreshing this page may fix it. If it does not, please contact your admin.',
    description: 'rbac error description',
    id: 'rbacErrorDescription',
  },
  rbacErrorTitle: {
    defaultMessage: 'Failed to get RBAC information',
    description: 'RBAC error title',
    id: 'rbacErrorTitle',
  },
  redHatStatusUrl: {
    defaultMessage: 'https://status.redhat.com',
    description: 'Red Hat status url for cloud services',
    id: 'redHatStatusUrl',
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
  selectRow: {
    defaultMessage: 'Select row {value}',
    description: 'Select row {value}',
    id: 'selectRow',
  },
  selected: {
    defaultMessage: '{value} selected',
    description: '{value} selected',
    id: 'selected',
  },
  sinceDate: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {January {startDate}} other {January {startDate}-{endDate}}}} ' +
      '1 {{count, plural, one {February {startDate}} other {February {startDate}-{endDate}}}} ' +
      '2 {{count, plural, one {March {startDate}} other {March {startDate}-{endDate}}}} ' +
      '3 {{count, plural, one {April {startDate}} other {April {startDate}-{endDate}}}} ' +
      '4 {{count, plural, one {May {startDate}} other {May {startDate}-{endDate}}}} ' +
      '5 {{count, plural, one {June {startDate}} other {June {startDate}-{endDate}}}} ' +
      '6 {{count, plural, one {July {startDate}} other {July {startDate}-{endDate}}}} ' +
      '7 {{count, plural, one {August {startDate}} other {August {startDate}-{endDate}}}} ' +
      '8 {{count, plural, one {September {startDate}} other {September {startDate}-{endDate}}}} ' +
      '9 {{count, plural, one {October {startDate}} other {October {startDate}-{endDate}}}} ' +
      '10 {{count, plural, one {November {startDate}} other {November {startDate}-{endDate}}}} ' +
      '11 {{count, plural, one {December {startDate}} other {December {startDate}-{endDate}}}} ' +
      'other {}}',
    description: 'Monthly date range',
    id: 'sinceDate',
  },
  sources: {
    defaultMessage: 'Sources',
    description: 'Sources',
    id: 'sources',
  },
  status: {
    defaultMessage: '{value, select, ' + 'pending {Pending} ' + 'running {Running} ' + 'failed {Failed} ' + 'other {}}',
    description: 'Status',
    id: 'status',
  },
  statusActions: {
    defaultMessage: 'Status/Actions',
    description: 'Status/Actions',
    id: 'statusActions',
  },
  suggestions: {
    defaultMessage: 'Suggestions',
    description: 'Suggestions',
    id: 'suggestions',
  },
  supplementary: {
    defaultMessage: 'Supplementary',
    description: 'Supplementary',
    id: 'supplementary',
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
  tagNames: {
    defaultMessage: 'Tag names',
    description: 'Tag Names',
    id: 'tagNames',
  },
  timeOfExport: {
    defaultMessage: 'Time of export',
    description: 'Time of export',
    id: 'timeOfExport',
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
      'byte_ms {Byte-ms} ' +
      'core_hours {core-hours} ' +
      'gb {GB} ' +
      'gb_hours {GB-hours} ' +
      'gb_mo {GB-month} ' +
      'gb_ms {GB-ms} ' +
      'gibibyte_month {GiB-month} ' +
      'hour {hours} ' +
      'hrs {hours} ' +
      'ms {milliseconds} ' +
      'vm_hours {VM-hours} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'units',
  },
  usage: {
    defaultMessage: 'Usage',
    description: 'Usage',
    id: 'usage',
  },
  usageCostDescription: {
    defaultMessage: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    description: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    id: 'usageCostDescription',
  },
  usageCostTitle: {
    defaultMessage: 'Usage cost',
    description: 'Usage cost',
    id: 'usageCostTitle',
  },
  various: {
    defaultMessage: 'Various',
    description: 'Various',
    id: 'various',
  },
  volumeTitle: {
    defaultMessage: 'Volume',
    description: 'Volume',
    id: 'volumeTitle',
  },
  workersUnallocatedCapacity: {
    defaultMessage: 'Workers unallocated capacity',
    description: 'Workers unallocated capcity',
    id: 'workersUnallocatedCapacity',
  },
  workersUnallocatedCapacityDescription: {
    defaultMessage: 'Distribute unused and non-reserved resource costs to projects',
    description: 'Workers unallocated capacity description',
    id: 'workersUnallocatedCapacityDescription',
  },
  yes: {
    defaultMessage: 'Yes',
    description: 'Yes',
    id: 'yes',
  },
});
