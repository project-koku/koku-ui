/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  AWS: {
    defaultMessage: 'Amazon Web Services',
    description: 'Amazon Web Services',
    id: 'AWS',
  },
  AWSComputeTitle: {
    defaultMessage: 'Compute (EC2) instances usage',
    description: 'Compute (EC2) instances usage',
    id: 'AWSComputeTitle',
  },
  AWSCostTrendTitle: {
    defaultMessage: 'Amazon Web Services cumulative cost comparison ({units})',
    description: 'Amazon Web Services cumulative cost comparison ({units})',
    id: 'AWSCostTrendTitle',
  },
  AWSDailyCostTrendTitle: {
    defaultMessage: 'Amazon Web Services daily cost comparison ({units})',
    description: 'Amazon Web Services daily cost comparison ({units})',
    id: 'AWSDailyCostTrendTitle',
  },
  AWSDashboardCostTitle: {
    defaultMessage: 'Amazon Web Services cost',
    description: 'Amazon Web Services cost',
    id: 'AWSDashboardCostTitle',
  },
  AWSDesc: {
    defaultMessage: 'Raw cost from Amazon Web Services infrastructure.',
    description: 'Raw cost from Amazon Web Services infrastructure.',
    id: 'AWSDesc',
  },
  AWSDetailsTableAriaLabel: {
    defaultMessage: 'Amazon Web Services details table',
    description: 'Amazon Web Services details table',
    id: 'AWSDetailsTable',
  },
  AWSDetailsTitle: {
    defaultMessage: 'Amazon Web Services Details',
    description: 'Amazon Web Services Details',
    id: 'AWSDetailsTitle',
  },
  AWSOcpDashboardCostTitle: {
    defaultMessage: 'Amazon Web Services filtered by OpenShift cost',
    description: 'Amazon Web Services filtered by OpenShift cost',
    id: 'AWSOcpDashboardCostTitle',
  },
  Azure: {
    defaultMessage: 'Microsoft Azure',
    description: 'Microsoft Azure',
    id: 'Azure',
  },
  AzureComputeTitle: {
    defaultMessage: 'Virtual machines usage',
    description: 'Virtual machines usage',
    id: 'AzureComputeTitle',
  },
  AzureCostTrendTitle: {
    defaultMessage: 'Microsoft Azure cumulative cost comparison ({units})',
    description: 'Microsoft Azure cumulative cost comparison ({units})',
    id: 'AzureCostTrendTitle',
  },
  AzureDailyCostTrendTitle: {
    defaultMessage: 'Microsoft Azure daily cost comparison ({units})',
    description: 'Microsoft Azure daily cost comparison ({units})',
    id: 'AzureDailyCostTrendTitle',
  },
  AzureDashboardCostTitle: {
    defaultMessage: 'Microsoft Azure cost',
    description: 'Microsoft Azure cost',
    id: 'AzureDashboardCostTitle',
  },
  AzureDesc: {
    defaultMessage: 'Raw cost from Azure infrastructure.',
    description: 'Raw cost from Azure infrastructure.',
    id: 'AzureDesc',
  },
  AzureDetailsTableAriaLabel: {
    defaultMessage: 'Microsoft Azure details table',
    description: 'Microsoft Azure details table',
    id: 'AzureDetailsTable',
  },
  AzureDetailsTitle: {
    defaultMessage: 'Microsoft Azure details',
    description: 'Microsoft Azure details',
    id: 'AzureDetailsTitle',
  },
  AzureOcpDashboardCostTitle: {
    defaultMessage: 'Microsoft Azure filtered by OpenShift cost',
    description: 'Microsoft Azure filtered by OpenShift cost',
    id: 'AzureOcpDashboardCostTitle',
  },
  Back: {
    defaultMessage: 'Back',
    description: 'Back',
    id: 'Back',
  },
  BreakdownBackToDetails: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Back to {value} account details} ' +
      'cluster {Back to {value} cluster details} ' +
      'gcp_project {Back to {value} GCP project details} ' +
      'node {Back to {value} node details} ' +
      'org_unit_id {Back to {value} organizational unit details} ' +
      'project {Back to {value} project details} ' +
      'region {Back to {value} region details} ' +
      'resource_location {Back to {value} region details} ' +
      'service {Back to {value} service details} ' +
      'service_name {Back to {value} service details} ' +
      'subscription_guid {Back to {value} account details} ' +
      'tag {Back to {value} tag details} ' +
      'other {}}',
    description: 'Back to {value} {groupBy} details',
    id: 'BreakdownBackToDetails',
  },
  BreakdownBackToDetailsAriaLabel: {
    defaultMessage: 'Back to details',
    description: 'Back to details',
    id: 'BreakdownBackToDetailsAriaLabel',
  },
  BreakdownBackToTitles: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services} ' +
      'azure {Microsoft Azure} ' +
      'gcp {Google Cloud Platform} ' +
      'ibm {IBM Cloud - Top 5 Costliest} ' +
      'ocp {OpenShift} ' +
      'other {}}',
    description: 'Breakdown back to page titles',
    id: 'BreakdownBackToTitles',
  },
  BreakdownCostBreakdownAriaLabel: {
    defaultMessage: 'A description of markup, raw cost and usage cost',
    description: 'A description of markup, raw cost and usage cost',
    id: 'BreakdownCostBreakdownAriaLabel',
  },
  BreakdownCostBreakdownTitle: {
    defaultMessage: 'Cost breakdown',
    description: 'A description of markup, raw cost and usage cost',
    id: 'BreakdownCostBreakdownTitle',
  },
  BreakdownCostChartAriaDesc: {
    defaultMessage: 'Breakdown of markup, raw, and usage costs',
    description: 'Breakdown of markup, raw, and usage costs',
    id: 'BreakdownCostChartAriaDesc',
  },
  BreakdownCostChartTooltip: {
    defaultMessage: '{name}: {value}',
    description: '{name}: {value}',
    id: 'BreakdownCostChartTooltip',
  },
  BreakdownCostOverviewTitle: {
    defaultMessage: 'Cost overview',
    description: 'Cost overview',
    id: 'BreakdownCostOverviewTitle',
  },
  BreakdownHistoricalDataTitle: {
    defaultMessage: 'Historical data',
    description: 'Historical data',
    id: 'BreakdownHistoricalDataTitle',
  },
  BreakdownSummaryTitle: {
    defaultMessage:
      '{value, select, ' +
      'account {Cost by accounts} ' +
      'cluster {Cost by clusters} ' +
      'gcp_project {Cost by GCP projects} ' +
      'node {Cost by Node} ' +
      'org_unit_id {Cost by organizational units} ' +
      'project {Cost by projects} ' +
      'region {Cost by regions} ' +
      'resource_location {Cost by regions} ' +
      'service {Cost by services} ' +
      'service_name {Cost by services} ' +
      'subscription_guid {Cost by accounts} ' +
      'tag {Cost by tags} ' +
      'other {}}',
    description: 'Cost by {value}',
    id: 'BreakdownSummaryTitle',
  },
  BreakdownTitle: {
    defaultMessage: '{value}',
    description: 'breakdown title',
    id: 'BreakdownTitle',
  },
  BreakdownTotalCostDate: {
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
    id: 'BreakdownTotalCostDate',
  },
  CalculationType: {
    defaultMessage: 'Calculation type',
    description: 'Calculation type',
    id: 'CalculationType',
  },
  Cancel: {
    defaultMessage: 'Cancel',
    description: 'Cancel',
    id: 'Cancel',
  },
  ChartCostForecastConeLegendLabel: {
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
    id: 'ChartCostForecastConeLegendLabel',
  },
  ChartCostForecastConeLegendNoDataLabel: {
    defaultMessage: 'Cost confidence (no data)',
    description: 'Cost confidence (no data)',
    id: 'ChartCostForecastConeLegendNoDataLabel',
  },
  ChartCostForecastConeLegendTooltip: {
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
    description: 'Cost confidence forecast date label tooltip',
    id: 'ChartCostForecastConeLegendTooltip',
  },
  ChartCostForecastConeTooltip: {
    defaultMessage: '{value0} - {value1}',
    description: '{value0} - {value1}',
    id: 'ChartCostForecastConeTooltip',
  },
  ChartCostForecastLegendLabel: {
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
    id: 'ChartCostForecastLegendLabel',
  },
  ChartCostForecastLegendNoDataLabel: {
    defaultMessage: 'Cost forecast (no data)',
    description: 'Cost forecast (no data)',
    id: 'ChartCostForecastLegendNoDataLabel',
  },
  ChartCostForecastLegendTooltip: {
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
    id: 'ChartCostForecastLegendTooltip',
  },
  ChartCostInfrastructureForecastConeLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Infrastructure confidence (Jan {startDate})} other {Infrastructure confidence (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Infrastructure confidence (Feb {startDate})} other {Infrastructure confidence (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Infrastructure confidence (Mar {startDate})} other {Infrastructure confidence (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Infrastructure confidence (Apr {startDate})} other {Infrastructure confidence (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Infrastructure confidence (May {startDate})} other {Infrastructure confidence (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Infrastructure confidence (Jun {startDate})} other {Infrastructure confidence (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Infrastructure confidence (Jul {startDate})} other {Infrastructure confidence (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Infrastructure confidence (Aug {startDate})} other {Infrastructure confidence (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Infrastructure confidence (Sep {startDate})} other {Infrastructure confidence (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Infrastructure confidence (Oct {startDate})} other {Infrastructure confidence (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Infrastructure confidence (Nov {startDate})} other {Infrastructure confidence (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Infrastructure confidence (Dec {startDate})} other {Infrastructure confidence (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Infrastructure date label',
    id: 'ChartCostInfrastructureForecastConeLegendLabel',
  },
  ChartCostInfrastructureForecastConeLegendNoDataLabel: {
    defaultMessage: 'Infrastructure confidence (no data)',
    description: 'Infrastructure confidence (no data)',
    id: 'ChartCostInfrastructureForecastConeLegendNoDataLabel',
  },
  ChartCostInfrastructureForecastConeLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Infrastructure confidence (Jan)} ' +
      '1 {Infrastructure confidence (Feb)} ' +
      '2 {Infrastructure confidence (Mar)} ' +
      '3 {Infrastructure confidence (Apr)} ' +
      '4 {Infrastructure confidence (May)} ' +
      '5 {Infrastructure confidence (Jun)} ' +
      '6 {Infrastructure confidence (Jul)} ' +
      '7 {Infrastructure confidence (Aug)} ' +
      '8 {Infrastructure confidence (Sep)} ' +
      '9 {Infrastructure confidence (Oct)} ' +
      '10 {Infrastructure confidence (Nov)} ' +
      '11 {Infrastructure confidence (Dec)} ' +
      'other {}}',
    description: 'Infrastructure date label tooltip',
    id: 'ChartCostInfrastructureForecastConeLegendTooltip',
  },
  ChartCostInfrastructureForecastLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Infrastructure forecast (Jan {startDate})} other {Infrastructure forecast (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Infrastructure forecast (Feb {startDate})} other {Infrastructure forecast (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Infrastructure forecast (Mar {startDate})} other {Infrastructure forecast (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Infrastructure forecast (Apr {startDate})} other {Infrastructure forecast (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Infrastructure forecast (May {startDate})} other {Infrastructure forecast (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Infrastructure forecast (Jun {startDate})} other {Infrastructure forecast (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Infrastructure forecast (Jul {startDate})} other {Infrastructure forecast (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Infrastructure forecast (Aug {startDate})} other {Infrastructure forecast (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Infrastructure forecast (Sep {startDate})} other {Infrastructure forecast (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Infrastructure forecast (Oct {startDate})} other {Infrastructure forecast (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Infrastructure forecast (Nov {startDate})} other {Infrastructure forecast (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Infrastructure forecast (Dec {startDate})} other {Infrastructure forecast (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Infrastructure date label',
    id: 'ChartCostInfrastructureForecastLegendLabel',
  },
  ChartCostInfrastructureForecastLegendNoDataLabel: {
    defaultMessage: 'Infrastructure forecast (no data)',
    description: 'Infrastructure forecast (no data)',
    id: 'ChartCostInfrastructureForecastLegendNoDataLabel',
  },
  ChartCostInfrastructureForecastLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Infrastructure forecast (Jan)} ' +
      '1 {Infrastructure forecast (Feb)} ' +
      '2 {Infrastructure forecast (Mar)} ' +
      '3 {Infrastructure forecast (Apr)} ' +
      '4 {Infrastructure forecast (May)} ' +
      '5 {Infrastructure forecast (Jun)} ' +
      '6 {Infrastructure forecast (Jul)} ' +
      '7 {Infrastructure forecast (Aug)} ' +
      '8 {Infrastructure forecast (Sep)} ' +
      '9 {Infrastructure forecast (Oct)} ' +
      '10 {Infrastructure forecast (Nov)} ' +
      '11 {Infrastructure forecast (Dec)} ' +
      'other {}}',
    description: 'Infrastructure date label tooltip',
    id: 'ChartCostInfrastructureForecastLegendTooltip',
  },
  ChartCostInfrastructureLegendLabel: {
    defaultMessage:
      '{month, select, ' +
      '0 {{count, plural, one {Infrastructure cost (Jan {startDate})} other {Infrastructure cost (Jan {startDate}-{endDate})}}} ' +
      '1 {{count, plural, one {Infrastructure cost (Feb {startDate})} other {Infrastructure cost (Feb {startDate}-{endDate})}}} ' +
      '2 {{count, plural, one {Infrastructure cost (Mar {startDate})} other {Infrastructure cost (Mar {startDate}-{endDate})}}} ' +
      '3 {{count, plural, one {Infrastructure cost (Apr {startDate})} other {Infrastructure cost (Apr {startDate}-{endDate})}}} ' +
      '4 {{count, plural, one {Infrastructure cost (May {startDate})} other {Infrastructure cost (May {startDate}-{endDate})}}} ' +
      '5 {{count, plural, one {Infrastructure cost (Jun {startDate})} other {Infrastructure cost (Jun {startDate}-{endDate})}}} ' +
      '6 {{count, plural, one {Infrastructure cost (Jul {startDate})} other {Infrastructure cost (Jul {startDate}-{endDate})}}} ' +
      '7 {{count, plural, one {Infrastructure cost (Aug {startDate})} other {Infrastructure cost (Aug {startDate}-{endDate})}}} ' +
      '8 {{count, plural, one {Infrastructure cost (Sep {startDate})} other {Infrastructure cost (Sep {startDate}-{endDate})}}} ' +
      '9 {{count, plural, one {Infrastructure cost (Oct {startDate})} other {Infrastructure cost (Oct {startDate}-{endDate})}}} ' +
      '10 {{count, plural, one {Infrastructure cost (Nov {startDate})} other {Infrastructure cost (Nov {startDate}-{endDate})}}} ' +
      '11 {{count, plural, one {Infrastructure cost (Dec {startDate})} other {Infrastructure cost (Dec {startDate}-{endDate})}}} ' +
      'other {}}',
    description: 'Infrastructure cost label',
    id: 'ChartCostInfrastructureLegendLabel',
  },
  ChartCostInfrastructureLegendNoDataLabel: {
    defaultMessage: 'Infrastructure cost (no data)',
    description: 'Infrastructure cost (no data)',
    id: 'ChartCostInfrastructureLegendNoDataLabel',
  },
  ChartCostInfrastructureLegendTooltip: {
    defaultMessage:
      '{month, select, ' +
      '0 {Infrastructure cost (Jan)} ' +
      '1 {Infrastructure cost (Feb)} ' +
      '2 {Infrastructure cost (Mar)} ' +
      '3 {Infrastructure cost (Apr)} ' +
      '4 {Infrastructure cost (May)} ' +
      '5 {Infrastructure cost (Jun)} ' +
      '6 {Infrastructure cost (Jul)} ' +
      '7 {Infrastructure cost (Aug)} ' +
      '8 {Infrastructure cost (Sep)} ' +
      '9 {Infrastructure cost (Oct)} ' +
      '10 {Infrastructure cost (Nov)} ' +
      '11 {Infrastructure cost (Dec)} ' +
      'other {}}',
    description: 'Infrastructure cost label tooltip',
    id: 'ChartCostInfrastructureLegendTooltip',
  },
  ChartCostLegendLabel: {
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
    id: 'ChartCostLegendLabel',
  },
  ChartCostLegendNoDataLabel: {
    defaultMessage: 'Cost (no data)',
    description: 'Cost (no data)',
    id: 'ChartCostLegendNoDataLabel',
  },
  ChartCostLegendTooltip: {
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
    id: 'ChartCostLegendTooltip',
  },
  ChartCostSupplementaryLegendLabel: {
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
    id: 'ChartCostSupplementaryLegendLabel',
  },
  ChartCostSupplementaryLegendNoDataLabel: {
    defaultMessage: 'Supplementary cost (no data)',
    description: 'Supplementary cost (no data)',
    id: 'ChartCostSupplementaryLegendNoDataLabel',
  },
  ChartCostSupplementaryLegendTooltip: {
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
    id: 'ChartCostSupplementaryLegendTooltip',
  },
  ChartDateRange: {
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
    id: 'ChartDateRange',
  },
  ChartDayOfTheMonth: {
    defaultMessage: 'Day {day}',
    description: 'The day of the month',
    id: 'ChartDayOfTheMonth',
  },
  ChartLimitLegendLabel: {
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
    id: 'ChartLimitLegendLabel',
  },
  ChartLimitLegendNoDataLabel: {
    defaultMessage: 'Limit (no data)',
    description: 'Limit (no data)',
    id: 'ChartLimitLegendNoDataLabel',
  },
  ChartLimitLegendTooltip: {
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
    id: 'ChartLimitLegendTooltip',
  },
  ChartNoData: {
    defaultMessage: 'no data',
    description: 'no data',
    id: 'ChartNoData',
  },
  ChartOthers: {
    defaultMessage: '{count, plural, one {{count} Other} other {{count} Others}}',
    description: 'Other || Others',
    id: 'ChartOthers',
  },
  ChartRequestsLegendLabel: {
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
    id: 'ChartRequestLegendLabel',
  },
  ChartRequestsLegendNoDataLabel: {
    defaultMessage: 'Requests (no data)',
    description: 'Requests (no data)',
    id: 'ChartRequestsLegendNoDataLabel',
  },
  ChartRequestsLegendTooltip: {
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
    id: 'ChartRequestLegendTooltip',
  },
  ChartUsageLegendLabel: {
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
    id: 'ChartUsageLegendLabel',
  },
  ChartUsageLegendNoDataLabel: {
    defaultMessage: 'Usage (no data)',
    description: 'Usage (no data)',
    id: 'ChartUsageLegendNoDataLabel',
  },
  ChartUsageLegendTooltip: {
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
    id: 'ChartUsageLegendTooltip',
  },
  Close: {
    defaultMessage: 'Close',
    description: 'Close',
    id: 'Close',
  },
  Clusters: {
    defaultMessage: 'Clusters',
    description: 'Clusters',
    id: 'Clusters',
  },
  Cost: {
    defaultMessage: 'Cost',
    description: 'Cost',
    id: 'Cost',
  },
  CostCalculations: {
    defaultMessage: 'Cost calculations',
    description: 'Cost calculations',
    id: 'CostCalculations',
  },
  CostManagement: {
    defaultMessage: 'Cost Management',
    description: 'Cost Management',
    id: 'CostManagement',
  },
  CostModels: {
    defaultMessage: 'Cost Models',
    description: 'Cost Models',
    id: 'CostModels',
  },
  CostModelsAddTagValues: {
    defaultMessage: 'Add more tag values',
    description: 'Add more tag values',
    id: 'CostModelsAddTagValues',
  },
  CostModelsAssignSources: {
    defaultMessage: '{count, plural, one {Assign source} other {Assign sources}}',
    description: 'Assign sources -- plural or singular',
    id: 'CostModelsAssignSources',
  },
  CostModelsAssignSourcesErrorDescription: {
    defaultMessage:
      'You cannot assign a source at this time. Try refreshing this page. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'You cannot assign a source at this time',
    id: 'CostModelsAssignSourcesErrorDescription',
  },
  CostModelsAssignSourcesErrorTitle: {
    defaultMessage: 'This action is temporarily unavailable',
    description: 'This action is temporarily unavailable',
    id: 'CostModelsAssignSourcesErrorTitle',
  },
  CostModelsAssignSourcesParen: {
    defaultMessage: 'Assign source(s)',
    description: 'Assign source(s)',
    id: 'CostModelsAssignSourcesParen',
  },
  CostModelsAssignedSources: {
    defaultMessage: 'Assigned sources',
    description: 'Assigned sourcess',
    id: 'CostModelsAssignedSources',
  },
  CostModelsAvailableSources: {
    defaultMessage: 'The following sources are assigned to my production cost model:',
    description: 'The following sources are assigned to my production cost model:',
    id: 'CostModelsAvailableSources',
  },
  CostModelsCanDelete: {
    defaultMessage: 'This action will delete {name} cost model from the system. This action cannot be undone',
    description: 'This action will delete {name} cost model from the system. This action cannot be undone',
    id: 'CostModelsCanDelete',
  },
  CostModelsCanNotDelete: {
    defaultMessage: 'The following sources are assigned to {name} cost model:',
    description: 'The following sources are assigned to {name} cost model:',
    id: 'CostModelsCanNotDelete',
  },
  CostModelsDelete: {
    defaultMessage: 'Delete cost model',
    description: 'Delete cost model',
    id: 'CostModelsDelete',
  },
  CostModelsDeleteDesc: {
    defaultMessage: 'This action will delete {costModel} cost model from the system. This action cannot be undone.',
    description: 'This action will delete {costModel} cost model from the system. This action cannot be undone.',
    id: 'CostModelsDeleteDesc',
  },
  CostModelsDeleteSource: {
    defaultMessage: 'You must unassign any sources before you can delete this cost model.',
    description: 'You must unassign any sources before you can delete this cost model.',
    id: 'CostModelsDeleteSource',
  },
  CostModelsDescTooLong: {
    defaultMessage: 'Should not exceed 500 characters',
    description: 'Should not exceed 500 characters',
    id: 'CostModelsDescTooLong',
  },
  CostModelsDetailsAssignSourcesTitle: {
    defaultMessage: 'Assign sources',
    description: 'Assign sources',
    id: 'CostModelsDetailsAssignSourcesTitle',
  },
  CostModelsDistributionDesc: {
    defaultMessage:
      'The following is the type of metric that is set to be used when distributing costs to the project level breakdowns.',
    description:
      'The following is the type of metric that is set to be used when distributing costs to the project level breakdowns.',
    id: 'CostModelsDistributionDesc',
  },
  CostModelsDistributionEdit: {
    defaultMessage: 'Edit distribution',
    description: 'Edit distribution',
    id: 'CostModelsDistributionEdit',
  },
  CostModelsEmptyState: {
    defaultMessage: 'What is your hybrid cloud costing you?',
    description: 'What is your hybrid cloud costing you?',
    id: 'CostModelsEmptyState',
  },
  CostModelsEmptyStateDesc: {
    defaultMessage:
      'Create a cost model to start calculating your hybrid cloud costs using custom price lists, markups, or both. Click on the button below to begin the journey.',
    description:
      'Create a cost model to start calculating your hybrid cloud costs using custom price lists, markups, or both. Click on the button below to begin the journey.',
    id: 'CostModelsEmptyStateDesc',
  },
  CostModelsEmptyStateLearnMore: {
    defaultMessage: 'Read about setting up a cost model',
    description: 'Read about setting up a cost model',
    id: 'CostModelsEmptyStateLearnMore',
  },
  CostModelsEnterTagKey: {
    defaultMessage: 'Enter a tag key',
    description: 'Enter a tag key',
    id: 'CostModelsEnterTagKey',
  },
  CostModelsEnterTagRate: {
    defaultMessage: 'Enter rate by tag',
    description: 'Enter rate by tag',
    id: 'CostModelsEnterTagRate',
  },
  CostModelsEnterTagValue: {
    defaultMessage: 'Enter a tag value',
    description: 'Enter a tag value',
    id: 'CostModelsEnterTagValue',
  },
  CostModelsExamplesDoubleMarkup: {
    defaultMessage: 'A markup rate of (+) 100% doubles the base costs of your source(s).',
    description: 'A markup rate of (+) 100% doubles the base costs of your source(s).',
    id: 'CostModelsExamplesDoubleMarkup',
  },
  CostModelsExamplesNoAdjust: {
    defaultMessage:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your source(s).',
    description:
      'A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your source(s).',
    id: 'CostModelsExamplesNoAdjust',
  },
  CostModelsExamplesReduceSeventyfive: {
    defaultMessage: 'A discount rate of (-) 25% reduces the base costs of your source(s) to 75% of the original value.',
    description: 'A discount rate of (-) 25% reduces the base costs of your source(s) to 75% of the original value.',
    id: 'CostModelsExamplesReduceSeventyfive',
  },
  CostModelsExamplesReduceZero: {
    defaultMessage: 'A discount rate of (-) 100% reduces the base costs of your source(s) to 0.',
    description: 'A discount rate of (-) 100% reduces the base costs of your source(s) to 0.',
    id: 'CostModelsExamplesReduceZero',
  },
  CostModelsFilterPlaceholder: {
    defaultMessage: 'Filter by name...',
    description: 'Filter by name',
    id: 'CostModelsFilterPlaceholder',
  },
  CostModelsFilterTagKey: {
    defaultMessage: 'Filter by tag key',
    description: 'Filter by tag key',
    id: 'CostModelsFilterTagKey',
  },
  CostModelsInfoTooLong: {
    defaultMessage: 'Should not exceed 100 characters',
    description: 'Should not exceed 100 characters',
    id: 'CostModelsInfoTooLong',
  },
  CostModelsLastChange: {
    defaultMessage: 'Last change',
    description: 'Last change',
    id: 'CostModelsLastChange',
  },
  CostModelsPopover: {
    defaultMessage:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources. {learnMore}',
    description:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources. {learnMore}',
    id: 'CostModelsPopover',
  },
  CostModelsPopoverAriaLabel: {
    defaultMessage: 'Cost model info popover',
    description: 'Cost model info popover',
    id: 'CostModelsPopoverAriaLabel',
  },
  CostModelsRateTooLong: {
    defaultMessage: 'Should not exceed 10 decimals',
    description: 'Should not exceed 10 decimals',
    id: 'CostModelsRateTooLong',
  },
  CostModelsReadOnly: {
    defaultMessage: 'You have read only permissions',
    description: 'You have read only permissions',
    id: 'CostModelsReadOnly',
  },
  CostModelsRefreshDialog: {
    defaultMessage: 'Refresh this dialog',
    description: 'Refresh this dialog',
    id: 'CostModelsRefreshDialog',
  },
  CostModelsRequiredField: {
    defaultMessage: 'This field is required',
    description: 'This field is required',
    id: 'CostModelsRequiredField',
  },
  CostModelsRouterErrorTitle: {
    defaultMessage: 'Fail routing to cost model',
    description: 'cost models router error title',
    id: 'CostModelsRouterErrorTitle',
  },
  CostModelsRouterServerError: {
    defaultMessage: 'Server error: could not get the cost model.',
    description: 'Server error: could not get the cost model.',
    id: 'CostModelsRouterServerError',
  },
  CostModelsSourceDelete: {
    defaultMessage: 'Unassign',
    description: 'Unassign',
    id: 'CostModelsSourceDelete',
  },
  CostModelsSourceDeleteSource: {
    defaultMessage: 'Unassign source',
    description: 'Unassign source',
    id: 'CostModelsSourceDeleteSource',
  },
  CostModelsSourceDeleteSourceDesc: {
    defaultMessage:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new source.',
    description:
      'This will remove the assignment of {source} from the {costModel} cost model. You can then assign the cost model to a new source.',
    id: 'CostModelsSourceDeleteSourceDesc',
  },
  CostModelsSourceEmptyStateDesc: {
    defaultMessage: 'Select the source(s) you want to apply this cost model to.',
    description: 'Select the source(s) you want to apply this cost model to.',
    id: 'CostModelsSourceEmptyStateDesc',
  },
  CostModelsSourceEmptyStateTitle: {
    defaultMessage: 'No sources are assigned',
    description: 'No sources are assigned',
    id: 'CostModelsSourceEmptyStateTitle',
  },
  CostModelsSourceTableAriaLabel: {
    defaultMessage: 'Sources table',
    description: 'Sources table',
    id: 'CostModelsSourcesTableAriaLabel',
  },
  CostModelsSourceTablePaginationAriaLabel: {
    defaultMessage: 'Sources table pagination controls',
    description: 'Sources table pagination controls',
    id: 'CostModelsSourceTablePaginationAriaLabel',
  },
  CostModelsSourceType: {
    defaultMessage: 'Source type',
    description: 'Source type',
    id: 'CostModelsSourceType',
  },
  CostModelsTableAriaLabel: {
    defaultMessage: 'Cost models table',
    description: 'Cost models table',
    id: 'CostModelsTableAriaLabel',
  },
  CostModelsTagRateTableAriaLabel: {
    defaultMessage: 'Tag rates',
    description: 'Tag rates',
    id: 'CostModelsTagRateTableAriaLabel',
  },
  CostModelsTagRateTableDefault: {
    defaultMessage: 'Default',
    description: 'Default',
    id: 'CostModelsTagRateTableDefault',
  },
  CostModelsTagRateTableKey: {
    defaultMessage: 'Tag key',
    description: 'Tag key',
    id: 'CostModelsTagRateTableKey',
  },
  CostModelsTagRateTableRate: {
    defaultMessage: 'Rate',
    description: 'Rate',
    id: 'CostModelsTagRateTableRate',
  },
  CostModelsTagRateTableValue: {
    defaultMessage: 'Tag value',
    description: 'Tag value',
    id: 'CostModelsTagRateTableValue',
  },
  CostModelsUUIDEmptyState: {
    defaultMessage: 'Cost model can not be found',
    description: 'Cost model can not be found',
    id: 'CostModelsUUIDEmptyState',
  },
  CostModelsUUIDEmptyStateDesc: {
    defaultMessage: 'Cost model with uuid: {uuid} does not exist.',
    description: 'Cost model with uuid: {uuid} does not exist.',
    id: 'CostModelsUUIDEmptyStateDesc',
  },
  CostModelsWizardCreateCostModel: {
    defaultMessage: 'Create cost model',
    description: 'Create cost model',
    id: 'CostModelsWizardCreateCostModel',
  },
  CostModelsWizardCreatePriceList: {
    defaultMessage: 'Create a price list',
    description: 'Create a price list',
    id: 'CostModelsWizardCreatePriceList',
  },
  CostModelsWizardEmptySourceTypeLabel: {
    defaultMessage: 'Select source type',
    description: 'Select source type',
    id: 'CostModelsWizardEmptySourceTypeLabel',
  },
  CostModelsWizardEmptyStateCreate: {
    defaultMessage: 'To create a price list, begin by clicking the {value} button.',
    description: 'To create a price list, begin by clicking the {Create rate} button.',
    id: 'CostModelsWizardEmptyStateCreate',
  },
  CostModelsWizardEmptyStateOtherTime: {
    defaultMessage: 'You can create a price list or modify one at a later time.',
    description: 'You can create a price list or modify one at a later time.',
    id: 'CostModelsWizardEmptyStateOtherTime',
  },
  CostModelsWizardEmptyStateSkipStep: {
    defaultMessage: 'To skip this step, click the {value} button.',
    description: 'To skip this step, click the {next} button.',
    id: 'CostModelsWizardEmptyStateSkipStep',
  },
  CostModelsWizardEmptyStateTitle: {
    defaultMessage: 'A price list has not been created.',
    description: 'A price list has not been created.',
    id: 'CostModelsWizardEmptyStateTitle',
  },
  CostModelsWizardGeneralInfoTitle: {
    defaultMessage: 'Enter general information',
    description: 'Enter general information',
    id: 'CostModelsWizardGeneralInfoTitle',
  },
  CostModelsWizardNoRatesAdded: {
    defaultMessage: 'No rates were added to the price list',
    description: 'No rates were added to the price list',
    id: 'CostModelsWizardNoRatesAdded',
  },
  CostModelsWizardOnboardAWS: {
    defaultMessage: 'Amazon Web Services (AWS)',
    description: 'Amazon Web Services (AWS)',
    id: 'CostModelsWizardOnboardAWS',
  },
  CostModelsWizardOnboardOCP: {
    defaultMessage: 'Red Hat OpenShift Container Platform',
    description: 'Red Hat OpenShift Container Platform',
    id: 'CostModelsWizardOnboardOCP',
  },
  CostModelsWizardPriceListMetric: {
    defaultMessage:
      'Select the metric you want to assign a price to, and specify a measurement unit and rate. You can optionally set multiple rates for particular tags.',
    description:
      'Select the metric you want to assign a price to, and specify a measurement unit and rate. You can optionally set multiple rates for particular tags.',
    id: 'CostModelsWizardPriceListMetric',
  },
  CostModelsWizardRateAriaLabel: {
    defaultMessage: 'Assign rate',
    description: 'Assign rate',
    id: 'CostModelsWizardRateAriaLabel',
  },
  CostModelsWizardReviewMarkDiscount: {
    defaultMessage: 'Markup/Discount',
    description: 'No Markup/Discount',
    id: 'CostModelsWizardReviewMarkDiscount',
  },
  CostModelsWizardReviewStatusSubDetails: {
    defaultMessage:
      'Review and confirm your cost model configuration and assignments. Click {create} to create the cost model, or {back} to revise.',
    description:
      'Review and confirm your cost model configuration and assignments. Click {Create} to create the cost model, or {Back} to revise.',
    id: 'CostModelsWizardReviewStatusSubDetails',
  },
  CostModelsWizardReviewStatusSubTitle: {
    defaultMessage:
      'Costs for resources connected to the assigned sources will now be calculated using the newly created {value} cost model.',
    description:
      'Costs for resources connected to the assigned sources will now be calculated using the newly created {value} cost model.',
    id: 'CostModelsWizardReviewStatusSubTitle',
  },
  CostModelsWizardReviewStatusTitle: {
    defaultMessage: 'Creation successful',
    description: 'Creation successful',
    id: 'CostModelsWizardReviewStatusTitle',
  },
  CostModelsWizardSourceCaption: {
    defaultMessage:
      '{value, select, ' +
      'aws {Select from the following Amazon Web Services sources:} ' +
      'azure {Select from the following Microsoft Azure sources:} ' +
      'gcp {Select from the following Google Cloud Platform sources:} ' +
      'ocp {Select from the following Red Hat OpenShift sources:} ' +
      'other {}}',
    description: 'Select from the following {value} sources:',
    id: 'CostModelsWizardSourceCaption',
  },
  CostModelsWizardSourceErrorDescription: {
    defaultMessage:
      'Try refreshing this step or you can skip this step (as it is optional) and assign the source to the cost model at a later time. If the problem persists, contact your organization administrator or visit our {url} for known outages.',
    description: 'This step is temporarily unavailable',
    id: 'CostModelsWizardSourceErrorDescription',
  },
  CostModelsWizardSourceErrorTitle: {
    defaultMessage: 'This step is temporarily unavailable',
    description: 'This step is temporarily unavailable',
    id: 'CostModelsWizardSourceErrorTitle',
  },
  CostModelsWizardSourceSubtitle: {
    defaultMessage:
      'Select one or more sources to this cost model. You can skip this step and assign the cost model to a source at a later time. A source will be unavailable for selection if a cost model is already assigned to it.',
    description:
      'Select one or more sources to this cost model. You can skip this step and assign the cost model to a source at a later time. A source will be unavailable for selection if a cost model is already assigned to it.',
    id: 'CostModelsWizardSourceSubtitle',
  },
  CostModelsWizardSourceTableAriaLabel: {
    defaultMessage: 'Assign sources to cost model table',
    description: 'Assign sources to cost model table',
    id: 'CostModelsWizardSourceTableAriaLabel',
  },
  CostModelsWizardSourceTableCostModel: {
    defaultMessage: 'Cost model assigned',
    description: 'Cost model assigned',
    id: 'CostModelsWizardSourceTableCostModel',
  },
  CostModelsWizardSourceTableDefaultCostModel: {
    defaultMessage: 'Default cost model',
    description: 'Default cost model',
    id: 'CostModelsWizardSourceTableDefaultCostModel',
  },
  CostModelsWizardSourceTitle: {
    defaultMessage: 'Assign sources to the cost model (optional)',
    description: 'Assign sources to the cost model (optional)',
    id: 'CostModelsWizardSourceTitle',
  },
  CostModelsWizardSourceWarning: {
    defaultMessage: 'This source is assigned to {costModel} cost model. You will have to unassigned it first',
    description: 'This source is assigned to {costModel} cost model. You will have to unassigned it first',
    id: 'CostModelsWizardSourceWarning',
  },
  CostModelsWizardStepsGenInfo: {
    defaultMessage: 'Enter information',
    description: 'Enter information',
    id: 'CostModelsWizardStepsGenInfo',
  },
  CostModelsWizardStepsPriceList: {
    defaultMessage: 'Price list',
    description: 'Price list',
    id: 'CostModelsWizardStepsPriceList',
  },
  CostModelsWizardStepsReview: {
    defaultMessage: 'Review details',
    description: 'Review details',
    id: 'CostModelsWizardStepsReview',
  },
  CostModelsWizardStepsSources: {
    defaultMessage: 'Assign a source to the cost model',
    description: 'Assign a source to the cost model',
    id: 'CostModelsWizardStepsSources',
  },
  CostModelsWizardSubTitleTable: {
    defaultMessage: 'The following is a list of rates you have set so far for this price list.',
    description: 'The following is a list of rates you have set so far for this price list.',
    id: 'CostModelsWizardSubTitleTable',
  },
  CostModelsWizardWarningSources: {
    defaultMessage: 'Cannot assign cost model to a source that is already assigned to another one',
    description: 'No Cannot assign cost model to a source that is already assigned to another one',
    id: 'CostModelsWizardWarningSources',
  },
  CostTypeAmortized: {
    defaultMessage: 'Amortized',
    description: 'Amortized cost type',
    id: 'CostTypeAmortized',
  },
  CostTypeAmortizedDesc: {
    defaultMessage: 'Recurring and/or upfront costs are distributed evenly across the month',
    description: 'Recurring and/or upfront costs are distributed evenly across the month',
    id: 'CostTypeAmortizedDesc',
  },
  CostTypeBlended: {
    defaultMessage: 'Blended',
    description: 'Blended cost type',
    id: 'CostTypeBlended',
  },
  CostTypeBlendedDesc: {
    defaultMessage: 'Using a blended rate to calcuate cost usage',
    description: 'Using a blended rate to calcuate cost usage',
    id: 'CostTypeBlendedDesc',
  },
  CostTypeLabel: {
    defaultMessage: 'Show cost as',
    description: 'Show cost as',
    id: 'CostTypeLabel',
  },
  CostTypeUnblended: {
    defaultMessage: 'Unblended',
    description: 'Unblended cost type',
    id: 'CostTypeUnblended',
  },
  CostTypeUnblendedDesc: {
    defaultMessage: 'Usage cost on the day you are charged',
    description: 'Usage cost on the day you are charged',
    id: 'CostTypeUnblendedDesc',
  },
  CpuTitle: {
    defaultMessage: 'CPU',
    description: 'CPU',
    id: 'CPUTitle',
  },
  Create: {
    defaultMessage: 'Create',
    description: 'Create',
    id: 'Create',
  },
  CreateCostModelConfirmMsg: {
    defaultMessage: 'Are you sure you want to stop creating a cost model? All settings will be discarded.',
    description: 'Are you sure you want to stop creating a cost model? All settings will be discarded.',
    id: 'CreateCostModelConfirmMsg',
  },
  CreateCostModelDesc: {
    defaultMessage:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources.',
    description:
      'A cost model allows you to associate a price to metrics provided by your sources to charge for utilization of resources.',
    id: 'CreateCostModelDesc',
  },
  CreateCostModelExit: {
    defaultMessage: 'Exit cost model creation',
    description: 'Exit cost model creation',
    id: 'CreateCostModelExit',
  },
  CreateCostModelExitYes: {
    defaultMessage: 'Yes, I want to exit',
    description: 'Yes, I want to exit',
    id: 'CreateCostModelExitYes',
  },
  CreateCostModelNoContinue: {
    defaultMessage: 'No, I want to continue',
    description: 'No, I want to continue',
    id: 'CreateCostModelNoContinue',
  },
  CreateCostModelTitle: {
    defaultMessage: 'Create a cost model',
    description: 'Create a cost model',
    id: 'CreateCostModelTitle',
  },
  CreateRate: {
    defaultMessage: 'Create rate',
    description: 'Create rate',
    id: 'CreateRate',
  },
  Currency: {
    defaultMessage: 'Currency',
    description: 'Currency',
    id: 'Currency',
  },
  CurrencyAbbreviations: {
    defaultMessage:
      '{symbol, select, ' +
      'billion {{value} B} ' +
      'million {{value} M} ' +
      'quadrillion {{value} q} ' +
      'thousand {{value} K} ' +
      'trillion {{value} t} ' +
      'other {}}',
    description: 'str.match(/([\\D]*)([\\d.,]+)([\\D]*)/)',
    id: 'CurrencyAbbreviations',
  },
  // See https://www.localeplanet.com/icu/currency.html
  CurrencyOptions: {
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
    id: 'CurrencyOptions',
  },
  // See https://www.localeplanet.com/icu/currency.html
  CurrencyUnits: {
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
    id: 'CurrencyUnits',
  },
  DashboardCumulativeCostComparison: {
    defaultMessage: 'Cumulative cost comparison ({units})',
    description: 'Cumulative cost comparison ({units})',
    id: 'DashboardCumulativeCostComparison',
  },
  DashboardDailyUsageComparison: {
    defaultMessage: 'Daily usage comparison ({units})',
    description: 'Daily usage comparison ({units})',
    id: 'DashboardDailyUsageComparison',
  },
  DashboardDatabaseTitle: {
    defaultMessage: 'Database services cost',
    description: 'Database services cost',
    id: 'DashboardDatabaseTitle',
  },
  DashboardNetworkTitle: {
    defaultMessage: 'Network services cost',
    description: 'Network services cost',
    id: 'DashboardNetworkTitle',
  },
  DashboardStorageTitle: {
    defaultMessage: 'Storage services usage',
    description: 'Storage services usage',
    id: 'DashboardStorageTitle',
  },
  DashboardTotalCostTooltip: {
    defaultMessage:
      'This total cost is the sum of the infrastructure cost {infrastructureCost} and supplementary cost {supplementaryCost}',
    description: 'total cost is the sum of the infrastructure cost and supplementary cost',
    id: 'DashboardTotalCostTooltip',
  },
  Delete: {
    defaultMessage: 'Delete',
    description: 'Delete',
    id: 'Delete',
  },
  Description: {
    defaultMessage: 'Description',
    description: 'Description',
    id: 'Description',
  },
  DetailsActionsExport: {
    defaultMessage: 'Export data',
    description: 'Export data',
    id: 'DetailsActionsExport',
  },
  DetailsActionsPriceList: {
    defaultMessage: 'View all price lists',
    description: 'View all price lists',
    id: 'DetailsActionsPriceList',
  },
  DetailsClustersModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {account {name} clusters} ' +
      'cluster {cluster {name} clusters} ' +
      'gcp_project {GCP project {name} clusters} ' +
      'node {node {name} clusters} ' +
      'org_unit_id {organizational unit {name} clusters} ' +
      'project {project {name} clusters} ' +
      'region {region {name} clusters} ' +
      'resource_location {region {name} clusters} ' +
      'service {service {name} clusters} ' +
      'service_name {service {name} clusters} ' +
      'subscription_guid {account {name} clusters} ' +
      'tag {tags {name} clusters} ' +
      'other {}}',
    description: '{groupBy} {name} clusters',
    id: 'DetailsClustersModalTitle',
  },
  DetailsColumnManagementTitle: {
    defaultMessage: 'Manage columns',
    description: 'Manage columns',
    id: 'DetailsColumnManagementTitle',
  },
  DetailsCostValue: {
    defaultMessage: 'Cost: {value}',
    description: 'Cost value',
    id: 'DetailsCostValue',
  },
  DetailsEmptyState: {
    defaultMessage: 'Processing data to generate a list of all services that sums to a total cost...',
    description: 'Processing data to generate a list of all services that sums to a total cost...',
    id: 'DetailsEmptyState',
  },
  DetailsMoreClusters: {
    defaultMessage: ', {value} more...',
    description: ', {value} more...',
    id: 'DetailsMoreClusters',
  },
  DetailsResourceNames: {
    defaultMessage:
      '{value, select, ' +
      'account {Account names} ' +
      'cluster {Cluster names} ' +
      'gcp_project {GCP project names} ' +
      'node {Node names} ' +
      'org_unit_id {Organizational unit names} ' +
      'project {Project names} ' +
      'region {Region names} ' +
      'resource_location {Region names} ' +
      'service {Service names} ' +
      'service_name {Service names} ' +
      'subscription_guid {Account names} ' +
      'tag {Tag names} ' +
      'other {}}',
    description: 'details table resource names',
    id: 'DetailsResourceNames',
  },
  DetailsSummaryModalTitle: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{name} accounts} ' +
      'cluster {{name} clusters} ' +
      'gcp_project {{name} GCP projects} ' +
      'node {{name} nodes} ' +
      'org_unit_id {{name} organizational units} ' +
      'project {{name} projects} ' +
      'region {{name} regions} ' +
      'resource_location {{name} regions} ' +
      'service {{name} services} ' +
      'service_name {{name} services} ' +
      'subscription_guid {{name} accounts} ' +
      'tag {{name} tags} ' +
      'other {}}',
    description: ', {value} more...',
    id: 'DetailsSummaryModalTitle',
  },
  DetailsUnusedRequestsLabel: {
    defaultMessage: 'Unrequested capacity',
    description: 'Unrequested capacity',
    id: 'DetailsUnusedRequestsLabel',
  },
  DetailsUnusedUnits: {
    defaultMessage: '{units} ({percentage}% of capacity)',
    description: '{units} ({percentage}% of capacity)',
    id: 'DetailsUnusedUsageUnits',
  },
  DetailsUnusedUsageLabel: {
    defaultMessage: 'Unused capacity',
    description: 'Unused capacity',
    id: 'DetailsUnusedUsageLabel',
  },
  DetailsUsageCapacity: {
    defaultMessage: 'Capacity - {value} {units}',
    description: 'Capacity - {value} {units}',
    id: 'DetailsUsageCapacity',
  },
  DetailsUsageLimit: {
    defaultMessage: 'Limit - {value} {units}',
    description: 'Limit - {value} {units}',
    id: 'DetailsUsageLimit',
  },
  DetailsUsageRequests: {
    defaultMessage: 'Requests - {value} {units}',
    description: 'Requests - {value} {units}',
    id: 'DetailsUsageRequests',
  },
  DetailsUsageUsage: {
    defaultMessage: 'Usage - {value} {units}',
    description: 'Usage - {value} {units}',
    id: 'DetailsUsageUsage',
  },
  DetailsViewAll: {
    defaultMessage:
      '{value, select, ' +
      'account {View all accounts} ' +
      'cluster {View all clusters} ' +
      'gcp_project {View all GCP projects} ' +
      'node {View all nodes} ' +
      'org_unit_id {View all organizational units} ' +
      'project {View all projects} ' +
      'region {View all regions} ' +
      'resource_location {View all regions} ' +
      'service {View all Services} ' +
      'service_name {View all services} ' +
      'subscription_guid {View all accounts} ' +
      'tag {View all tags} ' +
      'other {}}',
    description: 'View all {value}',
    id: 'DetailsViewAll',
  },
  DiscountMinus: {
    defaultMessage: 'Discount (-)',
    description: 'Discount (-)',
    id: 'DiscountMinus',
  },
  DistributionModelDesc: {
    defaultMessage:
      'This choice is for users to direct how their raw costs are distributed either by CPU or Memory on the project level breakdowns.',
    description:
      'This choice is for users to direct how their raw costs are distributed either by CPU or Memory on the project level breakdowns.',
    id: 'DistributionModelDesc',
  },
  DistributionType: {
    defaultMessage: 'Distribution type',
    description: 'Distribution type',
    id: 'DistributionType',
  },
  DocsAddOcpSources: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/adding_an_openshift_container_platform_source_to_cost_management',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/adding_an_openshift_container_platform_source_to_cost_management',
    id: 'DocsAddOcpSources',
  },
  DocsConfigCostModels: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#assembly-setting-up-cost-models',
    id: 'DocsConfigCostModels',
  },
  DocsCostModelTerminology: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#cost-model-terminology',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models/index#cost-model-terminology',
    id: 'DocsCostModelTerminology',
  },
  DocsUsingCostModels: {
    defaultMessage:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models',
    description:
      'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html-single/using_cost_models',
    id: 'DocsUsingCostModels',
  },
  Download: {
    defaultMessage: 'Download',
    description: 'download',
    id: 'Download',
  },
  Edit: {
    defaultMessage: 'Edit',
    description: 'Edit',
    id: 'Edit',
  },
  EditCostModel: {
    defaultMessage: 'Edit cost model',
    description: 'Edit cost model',
    id: 'EditCostModel',
  },
  EditMarkup: {
    defaultMessage: 'Edit markup',
    description: 'Edit markup',
    id: 'EditMarkup',
  },
  EditMarkupOrDiscount: {
    defaultMessage: 'Edit markup or discount',
    description: 'Edit markup or discount',
    id: 'EditMarkupOrDiscount',
  },
  EmptyFilterSourceStateSubtitle: {
    defaultMessage: 'Sorry, no source with the given filter was found.',
    description: 'Sorry, no source with the given filter was found.',
    id: 'EmptyFilterSourceStateSubtitle',
  },
  EmptyFilterStateSubtitle: {
    defaultMessage: 'Sorry, no data with the given filter was found.',
    description: 'Sorry, no data with the given filter was found.',
    id: 'EmptyFilterStateSubtitle',
  },
  EmptyFilterStateTitle: {
    defaultMessage: 'No match found',
    description: 'No match found',
    id: 'EmptyFilterStateTitle',
  },
  EqualsSymbol: {
    defaultMessage: '=',
    description: 'equals',
    id: 'EqualsSymbol',
  },
  ErrorStateNotAuthorizedDesc: {
    defaultMessage: 'Contact the cost management administrator to provide access to this application',
    description: 'Contact the cost management administrator to provide access to this application',
    id: 'ErrorStateNotAuthorizedDesc',
  },
  ErrorStateNotAuthorizedTitle: {
    defaultMessage: "You don't have access to the Cost management application",
    description: "You don't have access to the Cost management application",
    id: 'ErrorStateNotAuthorizedTitle',
  },
  ErrorStateUnexpectedDesc: {
    defaultMessage: 'We encountered an unexpected error. Contact your administrator.',
    description: 'We encountered an unexpected error. Contact your administrator.',
    id: 'ErrorStateUnexpectedDesc',
  },
  ErrorStateUnexpectedTitle: {
    defaultMessage: 'Oops!',
    description: 'Oops!',
    id: 'ErrorStateUnexpectedTitle',
  },
  ExamplesTitle: {
    defaultMessage: 'Examples',
    description: 'Examples',
    id: 'ExamplesTitle',
  },
  ExpiresOn: {
    defaultMessage: 'Expires on',
    description: 'Expires on',
    id: 'ExpiresOn',
  },
  ExplorerChartDate: {
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
    id: 'ExplorerDateColumn',
  },
  ExplorerChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'aws {Amazon Web Services - Top 5 Costliest} ' +
      'aws_ocp {Amazon Web Services filtered by OpenShift - Top 5 Costliest} ' +
      'azure {Microsoft Azure - Top 5 Costliest} ' +
      'azure_ocp {Microsoft Azure filtered by OpenShift - Top 5 Costliest} ' +
      'gcp {Google Cloud Platform - Top 5 Costliest} ' +
      'gcp_ocp {Google Cloud Platform filtered by OpenShift - Top 5 Costliest} ' +
      'ibm {IBM Cloud - Top 5 Costliest} ' +
      'ibm_ocp {IBM Cloud filtered by OpenShift - Top 5 Costliest} ' +
      'ocp {All OpenShift - Top 5 Costliest} ' +
      'ocp_cloud {All cloud filtered by OpenShift - Top 5 Costliest} ' +
      'other {}}',
    description: 'Explorer chart title',
    id: 'ExplorerChartTitle',
  },
  ExplorerDateRange: {
    defaultMessage:
      '{value, select, ' +
      'current_month_to_date {Month to date} ' +
      'last_ninety_days {Last 90 days} ' +
      'last_sixty_days {Last 60 days} ' +
      'last_thirty_days {Last 30 days} ' +
      'previous_month_to_date {Previous month and month to date} ' +
      'other {}}',
    description: 'date range based on {value}',
    id: 'ExplorerDateRange',
  },
  ExplorerMonthDate: {
    defaultMessage: '{month} {date}',
    description: 'Cost {month} {date}',
    id: 'ExplorerMonthDate',
  },
  ExplorerTableAriaLabel: {
    defaultMessage: 'Cost Explorer table',
    description: 'Cost Explorer table',
    id: 'ExplorerTableAriaLabel',
  },
  ExplorerTitle: {
    defaultMessage: 'Cost Explorer',
    description: 'Cost Explorer title',
    id: 'ExplorerTitle',
  },
  ExportAggregateType: {
    defaultMessage: 'Aggregate type',
    description: 'Aggregate type',
    id: 'ExportAggregateType',
  },
  ExportAll: {
    defaultMessage: 'Export all',
    description: 'Export all',
    id: 'ExportAll',
  },
  ExportDesc: {
    defaultMessage:
      'The active selections from the table plus the values here will be used to generate an export file. When the file is available, download it from the {value} view.',
    description: 'Export description',
    id: 'ExportAll',
  },
  ExportError: {
    defaultMessage: 'Something went wrong, please try fewer selections',
    description: 'Export error',
    id: 'ExportError',
  },
  ExportFileName: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'cluster {{resolution, select, daily {{provider}_clusters_daily_{startDate}_{endDate}} monthly {{provider}_clusters_monthly_{startDate}_{endDate}} other {}}} ' +
      'gcp_project {{resolution, select, daily {{provider}_gcp-projects_daily_{startDate}_{endDate}} monthly {{provider}_gcp-projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'node {{resolution, select, daily {{provider}_node_daily_{startDate}_{endDate}} monthly {{provider}_node_monthly_{startDate}_{endDate}} other {}}} ' +
      'org_unit_id {{resolution, select, daily {{provider}_orgs_daily_{startDate}_{endDate}} monthly {{provider}_orgs_monthly_{startDate}_{endDate}} other {}}} ' +
      'project {{resolution, select, daily {{provider}_projects_daily_{startDate}_{endDate}} monthly {{provider}_projects_monthly_{startDate}_{endDate}} other {}}} ' +
      'region {{resolution, select, daily {{provider}_regions_daily_{startDate}_{endDate}} monthly {{provider}_regions_monthly_{startDate}_{endDate}} other {}}} ' +
      'resource_location {{resolution, select, daily {{provider}_regions_daily_{startDate}_{endDate}} monthly {{provider}_regions_monthly_{startDate}_{endDate}} other {}}} ' +
      'service {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'service_name {{resolution, select, daily {{provider}_services_daily_{startDate}_{endDate}} monthly {{provider}_services_monthly_{startDate}_{endDate}} other {}}} ' +
      'subscription_guid {{resolution, select, daily {{provider}_accounts_daily_{startDate}_{endDate}} monthly {{provider}_accounts_monthly_{startDate}_{endDate}} other {}}} ' +
      'tag {{resolution, select, daily {{provider}_tags_daily_{startDate}_{endDate}} monthly {{provider}_tags_monthly_{startDate}_{endDate}} other {}}} ' +
      'other {}}',
    description: 'Export file name',
    id: 'ExportFileName',
  },
  ExportFormatType: {
    defaultMessage: '{value, select, csv {CSV} json {JSON} other {}}',
    description: 'Export format type',
    id: 'ExportFormatType',
  },
  ExportFormatTypeTitle: {
    defaultMessage: 'Format type',
    description: 'Format type',
    id: 'ExportFormatTypeTitle',
  },
  ExportGenerate: {
    defaultMessage: 'Generate export',
    description: 'Export export',
    id: 'ExportGenerate',
  },
  ExportHeading: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Aggregates of the following accounts will be exported to a .csv file.} ' +
      'cluster {Aggregates of the following clusters will be exported to a .csv file.} ' +
      'gcp_project {Aggregates of the following GCP projects will be exported to a .csv file.} ' +
      'node {Aggregates of the following nodes will be exported to a .csv file.} ' +
      'org_unit_id {Aggregates of the following organizational units will be exported to a .csv file.} ' +
      'project {Aggregates of the following projects will be exported to a .csv file.} ' +
      'region {Aggregates of the following regions will be exported to a .csv file.} ' +
      'resource_location {Aggregates of the regions will be exported to a .csv file.} ' +
      'service {Aggregates of the following services will be exported to a .csv file.} ' +
      'service_name {Aggregates of the following services will be exported to a .csv file.} ' +
      'subscription_guid {Aggregates of the following accounts will be exported to a .csv file.} ' +
      'tag {Aggregates of the following tags will be exported to a .csv file.} ' +
      'other {}}',
    description: 'Export heading',
    id: 'ExportHeading',
  },
  ExportName: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud Platform grouped by Account} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Account} ibm {IBM Cloud grouped by Account} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'cluster {{provider, select, aws {Amazon Web Services grouped by Cluster} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Cluster} azure {Microsoft Azure grouped by Cluster} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Cluster} gcp {Google Cloud Platform grouped by Cluster} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Cluster} ibm {IBM Cloud grouped by Cluster} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Cluster} ocp {OpenShift grouped by Cluster} ocp_cloud {All cloud filtered by OpenShift grouped by Cluster} other {}}} ' +
      'gcp_project {{provider, select, aws {Amazon Web Services grouped by GCP Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by GCP Project} azure {Microsoft Azure grouped by GCP Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by GCP Project} gcp {Google Cloud Platform grouped by GCP Project} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by GCP Project} ibm {IBM Cloud grouped by GCP Project} ibm_ocp {IBM Cloud filtered by OpenShift grouped by GCP Project} ocp {OpenShift grouped by GCP Project} ocp_cloud {All cloud filtered by OpenShift grouped by GCP Project} other {}}} ' +
      'node {{provider, select, aws {Amazon Web Services grouped by Node} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Node} azure {Microsoft Azure grouped by Node} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Node} gcp {Google Cloud Platform grouped by Node} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Node} ibm {IBM Cloud grouped by Node} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Node} ocp {OpenShift grouped by Node} ocp_cloud {All cloud filtered by OpenShift grouped by Node} other {}}} ' +
      'org_unit_id {{provider, select, aws {Amazon Web Services grouped by Organizational unit} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Organizational unit} azure {Microsoft Azure grouped by Organizational unit} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Organizational unit} gcp {Google Cloud Platform grouped by Organizational unit} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Organizational unit} ibm {IBM Cloud grouped by Organizational unit} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Organizational unit} ocp {OpenShift grouped by Organizational unit} ocp_cloud {All cloud filtered by OpenShift grouped by Organizational unit} other {}}} ' +
      'project {{provider, select, aws {Amazon Web Services grouped by Project} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Project} azure {Microsoft Azure grouped by Project} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Project} gcp {Google Cloud Platform grouped by Project} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Project} ibm {IBM Cloud grouped by Project} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Project} ocp {OpenShift grouped by Project} ocp_cloud {All cloud filtered by OpenShift grouped by Project} other {}}} ' +
      'region {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud Platform grouped by Region} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Region} ibm {IBM Cloud grouped by Region} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'resource_location {{provider, select, aws {Amazon Web Services grouped by Region} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Region} azure {Microsoft Azure grouped by Region} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Region} gcp {Google Cloud Platform grouped by Region} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Region} ibm {IBM Cloud grouped by Region} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Region} ocp {OpenShift grouped by Region} ocp_cloud {All cloud filtered by OpenShift grouped by Region} other {}}} ' +
      'service {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud Platform grouped by Service} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Service} ibm {IBM Cloud grouped by Service} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'service_name {{provider, select, aws {Amazon Web Services grouped by Service} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Service} azure {Microsoft Azure grouped by Service} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Service} gcp {Google Cloud Platform grouped by Service} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Service} ibm {IBM Cloud grouped by Service} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Service} ocp {OpenShift grouped by Service} ocp_cloud {All cloud filtered by OpenShift grouped by Service} other {}}} ' +
      'subscription_guid {{provider, select, aws {Amazon Web Services grouped by Account} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Account} azure {Microsoft Azure grouped by Account} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Account} gcp {Google Cloud Platform grouped by Account} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Account} ibm {IBM Cloud grouped by Account} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Account} ocp {OpenShift grouped by Account} ocp_cloud {All cloud filtered by OpenShift grouped by Account} other {}}} ' +
      'tag {{provider, select, aws {Amazon Web Services grouped by Tag} aws_ocp {Amazon Web Services filtered by OpenShift grouped by Tag} azure {Microsoft Azure grouped by Tag} azure_ocp {Microsoft Azure filtered by OpenShift grouped by Tag} gcp {Google Cloud Platform grouped by Tag} gcp_ocp {Google Cloud Platform filtered by OpenShift grouped by Tag} ibm {IBM Cloud grouped by Tag} ibm_ocp {IBM Cloud filtered by OpenShift grouped by Tag} ocp {OpenShift grouped by Tag} ocp_cloud {All cloud filtered by OpenShift grouped by Tag} other {}}} ' +
      'other {}}',
    description: 'Export name',
    id: 'ExportName',
  },
  ExportNameRequired: {
    defaultMessage: 'Please enter a name for the export',
    description: 'Please enter a name for the export',
    id: 'ExportNameRequired',
  },
  ExportNameTooLong: {
    defaultMessage: 'Should not exceed 50 characters',
    description: 'Should not exceed 50 characters',
    id: 'ExportNameTooLong',
  },
  ExportResolution: {
    defaultMessage: '{value, select, daily {Daily} monthly {Monthly} other {}}',
    description: 'Export file name',
    id: 'ExportResolution',
  },
  ExportSelected: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Selected accounts ({count})} ' +
      'cluster {Selected clusters ({count})} ' +
      'gcp_project {Selected GCP projects ({count})} ' +
      'node {Selected nodes ({count})} ' +
      'org_unit_id {Selected organizational units ({count})} ' +
      'project {Selected projects ({count})} ' +
      'region {Selected regions ({count})} ' +
      'resource_location {Selected regions ({count})} ' +
      'service {Selected services ({count})} ' +
      'service_name {Selected services ({count})} ' +
      'subscription_guid {Selected accounts ({count})} ' +
      'tag {Selected tags ({count})} ' +
      'other {}}',
    description: 'Selected items for export',
    id: 'ExportSelected',
  },
  ExportTimeScope: {
    defaultMessage: '{value, select, current {Current ({date})} previous {Previous ({date})} other {}}',
    description: 'Export time scope',
    id: 'ExportTimeScope',
  },
  ExportTimeScopeTitle: {
    defaultMessage: 'Month',
    description: 'Month',
    id: 'ExportTimeScopeTitle',
  },
  ExportTitle: {
    defaultMessage: 'Export',
    description: 'Export title',
    id: 'ExportTitle',
  },
  ExportsDesc: {
    defaultMessage:
      'Exports are available for download from the time that they are generated up to 7 days later. After 7 days, the export file will be removed.',
    description:
      'Exports are available for download from the time that they are generated up to 7 days later. After 7 days, the export file will be removed.',
    id: 'ExportsDesc',
  },
  ExportsEmptyState: {
    defaultMessage:
      'To get started, close this view and select rows in the table you want to export and click the export button to start the journey.',
    description:
      'To get started, close this view and select rows in the table you want to export and click the export button to start the journey.',
    id: 'ExportsEmptyState',
  },
  ExportsFailed: {
    defaultMessage: 'Could not create export file',
    description: 'Export failed',
    id: 'ExportsFailed',
  },
  ExportsFailedDesc: {
    defaultMessage: 'Something went wrong with the generation of this export file. Try exporting again.',
    description: 'Export failed description',
    id: 'ExportsFailedDesc',
  },
  ExportsSuccess: {
    defaultMessage: 'Export preparing for download',
    description: 'Export success',
    id: 'ExportsSuccess',
  },
  ExportsSuccessDesc: {
    defaultMessage: 'The export is preparing for download. It will be accessible from {value} view. {link}',
    description: 'Export success description',
    id: 'ExportsSuccessDesc',
  },
  ExportsTableAriaLabel: {
    defaultMessage: 'Available exports table',
    description: 'Available exports table',
    id: 'ExportsTableAriaLabel',
  },
  ExportsTitle: {
    defaultMessage: 'All exports',
    description: 'All exports',
    id: 'ExportsTitle',
  },
  ExportsUnavailable: {
    defaultMessage: 'Export cannot be generated',
    description: 'Export cannot be generated',
    id: 'ExportsUnavailable',
  },
  FilterByButtonAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Filter button for account name} ' +
      'cluster {Filter button for cluster name} ' +
      'gcp_project {Filter button for GCP project name} ' +
      'name {Filter button for name name} ' +
      'node {Filter button for node name} ' +
      'org_unit_id {Filter button for organizational unit name} ' +
      'project {Filter button for project name} ' +
      'region {Filter button for region name} ' +
      'resource_location {Filter button for region name} ' +
      'service {Filter button for service name} ' +
      'service_name {Filter button for service_name name} ' +
      'subscription_guid {Filter button for account name} ' +
      'tag {Filter button for tag name} ' +
      'other {}}',
    description: 'Filter button for "value" name',
    id: 'FilterByButtonAriaLabel',
  },
  FilterByInputAriaLabel: {
    defaultMessage:
      '{value, select, ' +
      'account {Input for account name} ' +
      'cluster {Input for cluster name} ' +
      'gcp_project {Input for GCP project name} ' +
      'name {Input for name name} ' +
      'node {Input for node name} ' +
      'org_unit_id {Input for organizational unit name} ' +
      'project {Input for project name} ' +
      'region {Input for region name} ' +
      'resource_location {Input for region name} ' +
      'service {Input for service name} ' +
      'service_name {Input for service_name name} ' +
      'subscription_guid {Input for account name} ' +
      'tag {Input for tag name} ' +
      'other {}}',
    description: 'Input for {value} name',
    id: 'FilterByInputAriaLabel',
  },
  FilterByOrgUnitAriaLabel: {
    defaultMessage: 'Organizational units',
    description: 'Organizational units',
    id: 'FilterByOrgUnitAriaLabel',
  },
  FilterByOrgUnitPlaceholder: {
    defaultMessage: 'Choose unit',
    description: 'Choose unit',
    id: 'FilterByOrgUnitPlaceholder',
  },
  FilterByPlaceholder: {
    defaultMessage:
      '{value, select, ' +
      'account {Filter by account} ' +
      'cluster {Filter by cluster} ' +
      'description {Filter by description} ' +
      'gcp_project {Filter by GCP project} ' +
      'name {Filter by name} ' +
      'node {Filter by node} ' +
      'org_unit_id {Filter by organizational unit} ' +
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
    id: 'FilterByPlaceholder',
  },
  FilterByTagKeyAriaLabel: {
    defaultMessage: 'Tag keys',
    description: 'Tag keys',
    id: 'FilterByTagKeyAriaLabel',
  },
  FilterByTagKeyPlaceholder: {
    defaultMessage: 'Choose key',
    description: 'Choose key',
    id: 'FilterByTagKeyPlaceholder',
  },
  FilterByTagValueAriaLabel: {
    defaultMessage: 'Tag values',
    description: 'Tag values',
    id: 'FilterByTagValueAriaLabel',
  },
  FilterByTagValueButtonAriaLabel: {
    defaultMessage: 'Filter button for tag value',
    description: 'Filter button for tag value',
    id: 'FilterByTagValueButtonAriaLabel',
  },
  FilterByTagValueInputPlaceholder: {
    defaultMessage: 'Filter by value',
    description: 'Filter by value',
    id: 'FilterByTagValueInputPlaceholder',
  },
  FilterByTagValuePlaceholder: {
    defaultMessage: 'Choose value',
    description: 'Choose value',
    id: 'FilterByTagValuePlaceholder',
  },
  FilterByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {Account} ' +
      'cluster {Cluster} ' +
      'gcp_project {GCP project} ' +
      'name {Name} ' +
      'node {Node} ' +
      'org_unit_id {Organizational unit} ' +
      'project {Project} ' +
      'region {Region} ' +
      'resource_location {Region} ' +
      'service {Service} ' +
      'service_name {Service} ' +
      'subscription_guid {Account} ' +
      'tag {Tag} ' +
      'other {}}',
    description: 'Filter by values',
    id: 'FilterByValues',
  },
  ForDate: {
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
    id: 'ForDate',
  },
  GCP: {
    defaultMessage: 'Google Cloud Platform',
    description: 'Google Cloud Platform',
    id: 'GCP',
  },
  GCPComputeTitle: {
    defaultMessage: 'Compute instances usage',
    description: 'Compute instances usage',
    id: 'GCPComputeTitle',
  },
  GCPCostTitle: {
    defaultMessage: 'Google Cloud Platform Services cost',
    description: 'Google Cloud Platform Services cost',
    id: 'GCPCostTitle',
  },
  GCPCostTrendTitle: {
    defaultMessage: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    description: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    id: 'GCPCostTrendTitle',
  },
  GCPDailyCostTrendTitle: {
    defaultMessage: 'Google Cloud Platform Services daily cost comparison ({units})',
    description: 'Google Cloud Platform Services daily cost comparison ({units})',
    id: 'GCPDailyCostTrendTitle',
  },
  GCPDesc: {
    defaultMessage: 'Raw cost from Google Cloud Platform infrastructure.',
    description: 'Raw cost from Google Cloud Platform infrastructure.',
    id: 'GCPDesc',
  },
  GCPDetailsTableAriaLabel: {
    defaultMessage: 'Google Cloud Platform details table',
    description: 'Google Cloud Platform details table',
    id: 'GCPDetailsTable',
  },
  GCPDetailsTitle: {
    defaultMessage: 'Google Cloud Platform Details',
    description: 'Google Cloud Platform Details',
    id: 'GCPDetailsTitle',
  },
  GroupByAll: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {All account} other {All accounts}}} ' +
      'cluster {{count, plural, one {All cluster} other {All clusters}}} ' +
      'gcp_project {{count, plural, one {All GCP project} other {All GCP projects}}} ' +
      'node {{count, plural, one {All node} other {All nodes}}} ' +
      'org_unit_id {{count, plural, one {All organizational unit} other {All organizational units}}} ' +
      'project {{count, plural, one {All project} other {All projects}}} ' +
      'region {{count, plural, one {All region} other {All regions}}} ' +
      'resource_location {{count, plural, one {All region} other {All regions}}} ' +
      'service {{count, plural, one {All service} other {All services}}} ' +
      'service_name {{count, plural, one {All service} other {All services}}} ' +
      'subscription_guid {{count, plural, one {All account} other {All accounts}}} ' +
      'tag {{count, plural, one {All tag} other {All tags}}} ' +
      'other {}}',
    description: 'All group by value',
    id: 'GroupByAll',
  },
  GroupByLabel: {
    defaultMessage: 'Group by',
    description: 'group by label',
    id: 'GroupByLabel',
  },
  GroupByTop: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {Top account} other {Top accounts}}} ' +
      'cluster {{count, plural, one {Top cluster} other {Top clusters}}} ' +
      'gcp_project {{count, plural, one {Top GCP project} other {Top GCP projects}}} ' +
      'node {{count, plural, one {Top node} other {Top node}}} ' +
      'org_unit_id {{count, plural, one {Top organizational unit} other {Top organizational units}}} ' +
      'project {{count, plural, one {Top project} other {Top projects}}} ' +
      'region {{count, plural, one {Top region} other {Top regions}}} ' +
      'resource_location {{count, plural, one {Top region} other {Top regions}}} ' +
      'service {{count, plural, one {Top service} other {Top services}}} ' +
      'service_name {{count, plural, one {Top service} other {Top services}}} ' +
      'subscription_guid {{count, plural, one {Top account} other {Top accounts}}} ' +
      'tag {{count, plural, one {Top tag} other {Top tags}}} ' +
      'other {}}',
    description: 'Top group by value',
    id: 'GroupByTop',
  },
  GroupByValueNames: {
    defaultMessage:
      '{groupBy, select, ' +
      'account {Account names} ' +
      'cluster {Cluster names} ' +
      'gcp_project {GCP project names} ' +
      'node {Node names} ' +
      'org_unit_id {Organizational unit names} ' +
      'project {Project names} ' +
      'region {Region names} ' +
      'resource_location {Region names} ' +
      'service {Service names} ' +
      'service_name {Service names} ' +
      'subscription_guid {Account names} ' +
      'tag {Tag names} ' +
      'other {}}',
    description: 'Selected items for export',
    id: 'GroupByValueNames',
  },
  GroupByValues: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {account} other {accounts}}} ' +
      'cluster {{count, plural, one {cluster} other {clusters}}} ' +
      'gcp_project {{count, plural, one {GCP project} other {GCP projects}}} ' +
      'node {{count, plural, one {node} other {node}}} ' +
      'org_unit_id {{count, plural, one {organizational unit} other {organizational units}}} ' +
      'project {{count, plural, one {project} other {projects}}} ' +
      'region {{count, plural, one {region} other {regions}}} ' +
      'resource_location {{count, plural, one {region} other {regions}}} ' +
      'service {{count, plural, one {service} other {services}}} ' +
      'service_name {{count, plural, one {service} other {services}}} ' +
      'subscription_guid {{count, plural, one {account} other {accounts}}} ' +
      'tag {{count, plural, one {tag} other {tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'GroupByValues',
  },
  GroupByValuesTitleCase: {
    defaultMessage:
      '{value, select, ' +
      'account {{count, plural, one {Account} other {Accounts}}} ' +
      'cluster {{count, plural, one {Cluster} other {Clusters}}} ' +
      'gcp_project {{count, plural, one {GCP project} other {GCP projects}}} ' +
      'node {{count, plural, one {Node} other {Node}}} ' +
      'org_unit_id {{count, plural, one {Organizational unit} other {Organizational units}}} ' +
      'project {{count, plural, one {Project} other {Projects}}} ' +
      'region {{count, plural, one {Region} other {Regions}}} ' +
      'resource_location {{count, plural, one {Region} other {Regions}}} ' +
      'service {{count, plural, one {Service} other {Services}}} ' +
      'service_name {{count, plural, one {Service} other {Services}}} ' +
      'subscription_guid {{count, plural, one {Account} other {Accounts}}} ' +
      'tag {{count, plural, one {Tag} other {Tags}}} ' +
      'other {}}',
    description: 'Group by values',
    id: 'GroupByValuesTitleCase',
  },
  HistoricalChartCostLabel: {
    defaultMessage: 'Cost ({units})',
    description: 'Cost ({units})',
    id: 'HistoricalChartCostLabel',
  },
  HistoricalChartDayOfMonthLabel: {
    defaultMessage: 'Day of Month',
    description: 'Day of Month',
    id: 'HistoricalChartDayOfMonthLabel',
  },
  HistoricalChartTitle: {
    defaultMessage:
      '{value, select, ' +
      'cost {Cost comparison} ' +
      'cpu {CPU usage, request, and limit comparison} ' +
      'memory {Memory usage, request, and limit comparison} ' +
      'modal {{name} daily usage comparison} ' +
      'storage {Storage usage comparison} ' +
      'other {}}',
    description: 'historical chart titles',
    id: 'HistoricalChartTitle',
  },
  HistoricalChartUsageLabel: {
    defaultMessage: '{value, select, instance_type {hrs} storage {gb-mo} other {}}',
    description: 'historical chart usage labels',
    id: 'HistoricalChartUsageLabel',
  },
  IBM: {
    defaultMessage: 'IBM Cloud',
    description: 'IBM Cloud',
    id: 'IBM',
  },
  IBMComputeTitle: {
    defaultMessage: 'Compute instances usage',
    description: 'Compute instances usage',
    id: 'IBMComputeTitle',
  },
  IBMCostTitle: {
    defaultMessage: 'IBM Cloud Services cost',
    description: 'IBM Cloud Services cost',
    id: 'IBMCostTitle',
  },
  IBMCostTrendTitle: {
    defaultMessage: 'IBM Cloud Services cumulative cost comparison ({units})',
    description: 'IBM Cloud Services cumulative cost comparison ({units})',
    id: 'IBMCostTrendTitle',
  },
  IBMDailyCostTrendTitle: {
    defaultMessage: 'IBM Cloud Services daily cost comparison ({units})',
    description: 'IBM Cloud Services daily cost comparison ({units})',
    id: 'IBMDailyCostTrendTitle',
  },
  IBMDesc: {
    defaultMessage: 'Raw cost from IBM Cloud infrastructure.',
    description: 'Raw cost from IBM Cloud infrastructure.',
    id: 'IBMDesc',
  },
  IBMDetailsTableAriaLabel: {
    defaultMessage: 'IBM Cloud details table',
    description: 'IBM Cloud details table',
    id: 'IBMDetailsTable',
  },
  IBMDetailsTitle: {
    defaultMessage: 'IBM Cloud Details',
    description: 'IBM details title',
    id: 'IBMDetailsTitle',
  },
  InactiveSourcesGoTo: {
    defaultMessage: 'Go to Sources for more information',
    description: 'Go to Sources for more information',
    id: 'InactiveSourcesGoTo',
  },
  InactiveSourcesTitle: {
    defaultMessage: 'A problem was detected with {value}',
    description: 'A problem was detected with {value}',
    id: 'InactiveSourcesGoTitle',
  },
  InactiveSourcesTitleMultiplier: {
    defaultMessage: 'A problem was detected with the following sources',
    description: 'A problem was detected with the following sources',
    id: 'InactiveSourcesTitleMultiplier',
  },
  Infrastructure: {
    defaultMessage: 'Infrastructure',
    description: 'Infrastructure',
    id: 'Infrastructure',
  },
  LearnMore: {
    defaultMessage: 'Learn more',
    description: 'Learn more',
    id: 'LearnMore',
  },
  LoadingStateDesc: {
    defaultMessage: 'Searching for your sources. Do not refresh the browser',
    description: 'Searching for your sources. Do not refresh the browser',
    id: 'LoadingStateDesc',
  },
  LoadingStateTitle: {
    defaultMessage: 'Looking for sources...',
    description: 'Looking for sources',
    id: 'LoadingStateTitle',
  },
  MaintenanceEmptyStateDesc: {
    defaultMessage:
      'Cost Management is currently undergoing scheduled maintenance and will be unavailable from 13:00 - 19:00 UTC (09:00 AM - 03:00 PM EDT).',
    description: 'Cost Management is currently undergoing scheduled maintenance',
    id: 'MaintenanceEmptyStateDesc',
  },
  MaintenanceEmptyStateInfo: {
    defaultMessage: 'For more information visit {url}',
    description: 'more information url',
    id: 'MaintenanceEmptyStateInfo',
  },
  MaintenanceEmptyStateThanks: {
    defaultMessage: 'We will be back soon. Thank you for your patience!',
    description: 'thanks you for your patience',
    id: 'MaintenanceEmptyStateThanks',
  },
  ManageColumnsAriaLabel: {
    defaultMessage: 'Table column management',
    description: 'Table column management',
    id: 'ManageColumnsAriaLabel',
  },
  ManageColumnsDesc: {
    defaultMessage: 'Selected categories will be displayed in the table',
    description: 'Selected categories will be displayed in the table',
    id: 'ManageColumnsDesc',
  },
  ManageColumnsTitle: {
    defaultMessage: 'Manage columns',
    description: 'Manage columns',
    id: 'ManageColumnsTitle',
  },
  MarkupDescription: {
    defaultMessage:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    description:
      'The portion of cost calculated by applying markup or discount to infrastructure raw cost in the cost management application',
    id: 'MarkupDescription',
  },
  MarkupOrDiscount: {
    defaultMessage: 'Markup or Discount',
    description: 'Markup or Discount',
    id: 'MarkupOrDiscount',
  },
  MarkupOrDiscountDesc: {
    defaultMessage:
      'This Percentage is applied to raw cost calculations by multiplying the cost with this percentage. Costs calculated from price list rates will not be effected.',
    description:
      'This Percentage is applied to raw cost calculations by multiplying the cost with this percentage. Costs calculated from price list rates will not be effected.',
    id: 'MarkupOrDiscountDesc',
  },
  MarkupOrDiscountModalDesc: {
    defaultMessage:
      'Use markup/discount to manipulate how the raw costs are being calculated for your sources. Note, costs calculated from price list rates will not be affected by this.',
    description:
      'Use markup/discount to manipulate how the raw costs are being calculated for your sources. Note, costs calculated from price list rates will not be affected by this.',
    id: 'MarkupOrDiscountModalDesc',
  },
  MarkupOrDiscountNumber: {
    defaultMessage: 'Markup or discount must be a number',
    description: 'Markup or discount must be a number',
    id: 'MarkupOrDiscountNumber',
  },
  MarkupOrDiscountTooLong: {
    defaultMessage: 'Should not exceed 10 decimals',
    description: 'Should not exceed 10 decimals',
    id: 'MarkupOrDiscountTooLong',
  },
  MarkupPlus: {
    defaultMessage: 'Markup (+)',
    description: 'Markup (+)',
    id: 'MarkupPlus',
  },
  MarkupTitle: {
    defaultMessage: 'Markup',
    description: 'Markup',
    id: 'MarkupTitle',
  },
  Measurement: {
    defaultMessage: 'Measurement',
    description: 'Measurement',
    id: 'Measurement',
  },
  MeasurementPlaceholder: {
    defaultMessage: 'Filter by measurements',
    description: 'Filter by measurements',
    id: 'MeasurementPlaceholder',
  },
  MeasurementValues: {
    defaultMessage:
      '{value, select, ' +
      'count {{count, plural, one {Count} other {Count ({units})}}} ' +
      'effective_usage {{count, plural, one {Request} other {Effective-usage ({units})}}} ' +
      'request {{count, plural, one {Request} other {Request ({units})}}} ' +
      'usage {{count, plural, one {Usage} other {Usage ({units})}}} ' +
      'other {}}',
    description: 'Measurement values',
    id: 'MeasurementValues',
  },
  MemoryTitle: {
    defaultMessage: 'Memory',
    description: 'Memory',
    id: 'MemoryTitle',
  },
  Metric: {
    defaultMessage: 'Metric',
    description: 'Metric',
    id: 'Metric',
  },
  MetricPlaceholder: {
    defaultMessage: 'Filter by metrics',
    description: 'Filter by metrics',
    id: 'MetricPlaceholder',
  },
  MetricValues: {
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
    id: 'MetricValues',
  },
  MonthOverMonthChange: {
    defaultMessage: 'Month over month change',
    description: 'Month over month change',
    id: 'MonthOverMonthChange',
  },
  Names: {
    defaultMessage: '{count, plural, one {Name} other {Names}}',
    description: 'Name plural or singular',
    id: 'Name',
  },
  Next: {
    defaultMessage: 'next',
    description: 'next',
    id: 'Next',
  },
  No: {
    defaultMessage: 'no',
    description: 'no',
    id: 'No',
  },
  NoDataForDate: {
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
    id: 'NoDataForDate',
  },
  NoDataStateDesc: {
    defaultMessage:
      'We have detected a source, but we are not done processing the incoming data. The time to process could take up to 24 hours. Try refreshing the page at a later time.',
    description: 'still processing request, 24 hour message',
    id: 'NoDataStateDesc',
  },
  NoDataStateRefresh: {
    defaultMessage: 'Refresh this page',
    description: 'Refresh this page',
    id: 'NoDataStateRefresh',
  },
  NoDataStateTitle: {
    defaultMessage: 'Still processing the data',
    description: 'Still processing the data',
    id: 'NoDataStateTitle',
  },
  NoExportsStateTitle: {
    defaultMessage: 'There are no export files available',
    description: 'There are no export files available',
    id: 'NoExportsStateTitle',
  },
  NoProvidersStateAwsDesc: {
    defaultMessage:
      'Add an Amazon Web Services account to see a total cost breakdown of your spend by accounts, organizational units, services, regions, or tags.',
    description:
      'Add an Amazon Web Services account to see a total cost breakdown of your spend by accounts, organizational units, services, regions, or tags.',
    id: 'NoProvidersStateAwsDesc',
  },
  NoProvidersStateAwsTitle: {
    defaultMessage: 'Track your Amazon Web Services spending!',
    description: 'Track your Amazon Web Services spending!',
    id: 'NoProvidersStateAwsTitle',
  },
  NoProvidersStateAzureDesc: {
    defaultMessage:
      'Add a Microsoft Azure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add a Microsoft Azure account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'NoProvidersStateAzureDesc',
  },
  NoProvidersStateAzureTitle: {
    defaultMessage: 'Track your Microsoft Azure spending!',
    description: 'Track your Microsoft Azure spending!',
    id: 'NoProvidersStateAzureTitle',
  },
  NoProvidersStateGcpDesc: {
    defaultMessage:
      'Add a Google Cloud Platform account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add a Google Cloud Platform account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'NoProvidersStateGcpDesc',
  },
  NoProvidersStateGcpTitle: {
    defaultMessage: 'Track your Google Cloud Platform spending!',
    description: 'Track your Google Cloud Platform spending!',
    id: 'NoProvidersStateGcpTitle',
  },
  NoProvidersStateGetStarted: {
    defaultMessage: 'Get started with Sources',
    description: 'Get started with Sources',
    id: 'NoProvidersStateGetStarted',
  },
  NoProvidersStateIbmDesc: {
    defaultMessage:
      'Add an IBM Cloud account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    description:
      'Add an IBM Cloud account to see a total cost breakdown of your spend by accounts, services, regions, or tags.',
    id: 'NoProvidersStateIbmDesc',
  },
  NoProvidersStateIbmTitle: {
    defaultMessage: 'Track your IBM Cloud spending!',
    description: 'Track your IBM Cloud spending!',
    id: 'NoProvidersStateIbmTitle',
  },
  NoProvidersStateOcpAddSources: {
    defaultMessage: 'Add an OpenShift cluster to Cost Management',
    description: 'Add an OpenShift cluster to Cost Management',
    id: 'NoProvidersStateOcpAddSources',
  },
  NoProvidersStateOcpDesc: {
    defaultMessage:
      'Add an OpenShift Container Platform cluster to see a total cost breakdown of your pods by cluster, node, project, or labels.',
    description:
      'Add an OpenShift Container Platform cluster to see a total cost breakdown of your pods by cluster, node, project, or labels.',
    id: 'NoProvidersStateOcpDesc',
  },
  NoProvidersStateOcpTitle: {
    defaultMessage: 'Track your OpenShift spending!',
    description: 'Track your OpenShift spending!',
    id: 'NoProvidersStateOcpTitle',
  },
  NoProvidersStateOverviewDesc: {
    defaultMessage:
      'Add a source, like an OpenShift Container Platform cluster or a cloud services account, to see a total cost breakdown as well as usage information like instance counts and storage.',
    description:
      'Add a source, like an OpenShift Container Platform cluster or a cloud services account, to see a total cost breakdown as well as usage information like instance counts and storage.',
    id: 'NoProvidersStateOverviewDesc',
  },
  NoProvidersStateOverviewTitle: {
    defaultMessage: 'Track your spending!',
    description: 'Track your spending!',
    id: 'NoProvidersStateOverviewTitle',
  },
  NoResultsFound: {
    defaultMessage: 'No results found',
    description: 'No results found',
    id: 'NoResultsFound',
  },
  NotAuthorizedStateAws: {
    defaultMessage: 'Amazon Web Services in Cost Management',
    description: 'Amazon Web Services in Cost Management',
    id: 'NoAuthorizedStateAws',
  },
  NotAuthorizedStateAzure: {
    defaultMessage: 'Microsoft Azure in Cost Management',
    description: 'Microsoft Azure in Cost Management',
    id: 'NotAuthorizedStateAzure',
  },
  NotAuthorizedStateCostModels: {
    defaultMessage: 'Cost Models in Cost Management',
    description: 'Cost Models in Cost Management',
    id: 'NotAuthorizedStateCostModels',
  },
  NotAuthorizedStateGcp: {
    defaultMessage: 'Google Cloud Platform in Cost Management',
    description: 'Google Cloud Platform in Cost Management',
    id: 'NotAuthorizedStateGcp',
  },
  NotAuthorizedStateIbm: {
    defaultMessage: 'IBM Cloud in Cost Management',
    description: 'IBM Cloud in Cost Management',
    id: 'NotAuthorizedStateIbm',
  },
  NotAuthorizedStateOcp: {
    defaultMessage: 'OpenShift in Cost Management',
    description: 'OpenShift in Cost Management',
    id: 'NotAuthorizedStateOcp',
  },
  OCPCPUUsageAndRequests: {
    defaultMessage: 'CPU usage and requests',
    description: 'CPU usage and requests',
    id: 'OCPCPUUsageAndRequests',
  },
  OCPCloudDashboardComputeTitle: {
    defaultMessage: 'Compute services usage',
    description: 'Compute services usage',
    id: 'OCPCloudDashboardComputeTitle',
  },
  OCPCloudDashboardCostTitle: {
    defaultMessage: 'All cloud filtered by OpenShift cost',
    description: 'All cloud filtered by OpenShift cost',
    id: 'OCPCloudDashboardCostTitle',
  },
  OCPCloudDashboardCostTrendTitle: {
    defaultMessage: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    description: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    id: 'OCPCloudDashboardCostTrendTitle',
  },
  OCPCloudDashboardDailyCostTrendTitle: {
    defaultMessage: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    description: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    id: 'OCPCloudDashboardDailyCostTrendTitle',
  },
  OCPDailyUsageAndRequestComparison: {
    defaultMessage: 'Daily usage and requests comparison ({units})',
    description: 'Daily usage and requests comparison',
    id: 'OCPDailyUsageAndRequestComparison',
  },
  OCPDashboardCPUUsageAndRequests: {
    defaultMessage: 'OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'OCPDashboardCPUUsageAndRequests',
  },
  OCPDashboardCostTitle: {
    defaultMessage: 'All OpenShift cost',
    description: 'All OpenShift cost',
    id: 'OCPDashboardCostTitle',
  },
  OCPDashboardCostTrendTitle: {
    defaultMessage: 'All OpenShift cumulative cost comparison ({units})',
    description: 'All OpenShift cumulative cost comparison in units',
    id: 'OCPDashboardCostTrendTitle',
  },
  OCPDashboardDailyCostTitle: {
    defaultMessage: 'All OpenShift daily cost comparison ({units})',
    description: 'All OpenShift daily cost comparison in units',
    id: 'OCPDashboardDailyCostTitle',
  },
  OCPDashboardMemoryUsageAndRequests: {
    defaultMessage: 'OpenShift Memory usage and requests',
    description: 'OpenShift Memory usage and requests',
    id: 'OCPDashboardMemoryUsageAndRequests',
  },
  OCPDashboardVolumeUsageAndRequests: {
    defaultMessage: 'OpenShift Volume usage and requests',
    description: 'OpenShift Volume usage and requests',
    id: 'OCPUsageAndRequests',
  },
  OCPDetailsInfrastructureCost: {
    defaultMessage: 'Infrastructure cost',
    description: 'Infrastructure cost',
    id: 'OCPDetailsInfrastructureCost',
  },
  OCPDetailsInfrastructureCostDesc: {
    defaultMessage: 'The cost based on raw usage data from the underlying infrastructure.',
    description: 'The cost based on raw usage data from the underlying infrastructure.',
    id: 'OCPDetailsInfrastructureCostDesc',
  },
  OCPDetailsSupplementaryCost: {
    defaultMessage: 'Supplementary cost',
    description: 'Supplementary cost',
    id: 'OCPDetailsSupplementaryCost',
  },
  OCPDetailsSupplementaryCostDesc: {
    defaultMessage:
      'All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    description:
      'All costs not directly attributed to the infrastructure. These costs are determined by applying a price list within a cost model to OpenShift cluster metrics.',
    id: 'OCPDetailsSupplementaryCostDesc',
  },
  OCPDetailsTableAriaLabel: {
    defaultMessage: 'OpenShift details table',
    description: 'OpenShift details table',
    id: 'OCPDetailsTable',
  },
  OCPDetailsTitle: {
    defaultMessage: 'OpenShift details',
    description: 'OpenShift details title',
    id: 'OCPDetailsTitle',
  },
  OCPInfrastructureCostTitle: {
    defaultMessage: 'OpenShift infrastructure cost',
    description: 'OpenShift infrastructure cost',
    id: 'OCPInfrastructureCostTitle',
  },
  OCPInfrastructureCostTrendTitle: {
    defaultMessage: 'OpenShift cumulative infrastructure cost comparison ({units})',
    description: 'OpenShift cumulative infrastructure cost comparison with units',
    id: 'OCPInfrastructureCostTrendTitle',
  },
  OCPInfrastructureDailyCostTrendTitle: {
    defaultMessage: 'OpenShift daily infrastructure cost comparison ({units})',
    description: 'OpenShift daily infrastructure cost comparison with units',
    id: 'OCPInfrastructureDailyCostTrendTitle',
  },
  OCPMemoryUsageAndRequests: {
    defaultMessage: 'Memory usage and requests',
    description: 'Memory usage and requests',
    id: 'OCPMemoryUsageAndRequests',
  },
  OCPSupplementaryCostTitle: {
    defaultMessage: 'OpenShift supplementary cost',
    description: 'OpenShift supplementary cost',
    id: 'OCPSupplementaryCostTitle',
  },
  OCPSupplementaryCostTrendTitle: {
    defaultMessage: 'OpenShift cumulative supplementary cost comparison ({units})',
    description: 'OpenShift cumulative supplementary cost comparison with units',
    id: 'OCPSupplementaryCostTrendTitle',
  },
  OCPSupplementaryDailyCostTrendTitle: {
    defaultMessage: 'OpenShift daily supplementary cost comparison ({units})',
    description: 'OpenShift daily supplementary cost comparison with units',
    id: 'OCPSupplementaryDailyCostTrendTitle',
  },
  OCPUsageCostTitle: {
    defaultMessage: 'OpenShift usage cost',
    description: 'OpenShift usage cost',
    id: 'OCPUsageCostTitle',
  },
  OCPUsageDashboardCPUTitle: {
    defaultMessage: 'OpenShift CPU usage and requests',
    description: 'OpenShift CPU usage and requests',
    id: 'OCPUsageDashboardCPUTitle',
  },
  OCPUsageDashboardCostTrendTitle: {
    defaultMessage: 'Metering cumulative cost comparison ({units})',
    description: 'Metering cumulative cost comparison with units',
    id: 'OCPUsageDashboardCostTrendTitle',
  },
  OCPVolumeUsageAndRequests: {
    defaultMessage: 'Volume usage and requests',
    description: 'Volume usage and requests',
    id: 'OCPVolumeUsageAndRequests',
  },
  OpenShift: {
    defaultMessage: 'OpenShift',
    description: 'OpenShift',
    id: 'OpenShift',
  },
  OpenShiftCloudInfrastructure: {
    defaultMessage: 'OpenShift cloud infrastructure',
    description: 'OpenShift cloud infrastructure',
    id: 'OpenShiftCloudInfrastructure',
  },
  OpenShiftCloudInfrastructureDesc: {
    defaultMessage:
      'Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    description:
      'Infrastructure cost attributed to OpenShift Container Platform, based on a subset of cloud cost data.',
    id: 'OpenShiftCloudInfrastructureDesc',
  },
  OpenShiftDesc: {
    defaultMessage:
      'Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    description:
      'Total cost for OpenShift Container Platform, comprising the infrastructure cost and cost calculated from metrics.',
    id: 'OpenShiftDesc',
  },
  OverviewInfoArialLabel: {
    defaultMessage: 'A description of perspectives',
    description: 'A description of perspectives',
    id: 'OverviewInfoArialLabel',
  },
  OverviewTitle: {
    defaultMessage: 'Cost Management Overview',
    description: 'Cost Management Overview',
    id: 'OverviewTitle',
  },
  PageTitleAWS: {
    defaultMessage: 'Amazon Web Services - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Amazon Web Services - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleAWS',
  },
  PageTitleAzure: {
    defaultMessage: 'Microsoft Azure - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Microsoft Azure - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleAzure',
  },
  PageTitleCostModels: {
    defaultMessage: 'Cost Models - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Models - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleCostModels',
  },
  PageTitleDefault: {
    defaultMessage: 'Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleDefault',
  },
  PageTitleExplorer: {
    defaultMessage: 'Cost Explorer - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Cost Explorer - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleExplorer',
  },
  PageTitleGCP: {
    defaultMessage: 'Google Cloud Platform - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Google Cloud Platform - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleGCP',
  },
  PageTitleIBM: {
    defaultMessage: 'IBM Cloud - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'IBM Cloud - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleIBM',
  },
  PageTitleOCP: {
    defaultMessage: 'OpenShift - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'OpenShift - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleOpenShift',
  },
  PageTitleOverview: {
    defaultMessage: 'Overview - Cost Management | Red Hat OpenShift Cluster Manager',
    description: 'Overview - Cost Management | Red Hat OpenShift Cluster Manager',
    id: 'PageTitleOverview',
  },
  Percent: {
    defaultMessage: '{value} %',
    description: 'percent value',
    id: 'Percent',
  },
  PercentOfCost: {
    defaultMessage: '{value} % of cost',
    description: '{value} % of cost',
    id: 'PercentOfCost',
  },
  PercentSymbol: {
    defaultMessage: '%',
    description: 'percent symbol',
    id: 'PercentSymbol',
  },
  PercentTotalCost: {
    defaultMessage: '{value} {units} ({percent} %)',
    description: '{value} {units} ({percent} %)',
    id: 'PercentTotalCost',
  },
  Perspective: {
    defaultMessage: 'Perspective',
    description: 'Perspective dropdown label',
    id: 'Perspective',
  },
  PerspectiveValues: {
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
      'ocp {All OpenShift} ' +
      'ocp_cloud {All cloud filtered by OpenShift} ' +
      'other {}}',
    description: 'Perspective values',
    id: 'PerspectiveValues',
  },
  PriceList: {
    defaultMessage: 'Price list',
    description: 'Price list',
    id: 'PriceList',
  },
  PriceListAddRate: {
    defaultMessage: 'Add rate',
    description: 'Add rate',
    id: 'PriceListAddRate',
  },
  PriceListDeleteRate: {
    defaultMessage: 'Delete rate',
    description: 'Delete rate',
    id: 'PriceListDeleteRate',
  },
  PriceListDeleteRateDesc: {
    defaultMessage:
      '{count, plural, one {This action will remove {metric} rate from {costModel}} other {This action will remove {metric} rate from {costModel}, which is assigned to the following sources:}}',
    description: 'This action will remove {metric} rate from {costModel}, which is assigned to the following sources:',
    id: 'PriceListDesc',
  },
  PriceListDuplicate: {
    defaultMessage: 'This tag key is already in use',
    description: 'This tag key is already in use',
    id: 'PriceListDuplicate',
  },
  PriceListEditRate: {
    defaultMessage: 'Edit rate',
    description: 'Edit rate',
    id: 'PriceListEditRate',
  },
  PriceListEmptyRate: {
    defaultMessage: 'No rates are set',
    description: 'No rates are set',
    id: 'PriceListEmptyRate',
  },
  PriceListEmptyRateDesc: {
    defaultMessage: 'To add rates to the price list, click on the "Add" rate button above.',
    description: 'To add rates to the price list, click on the "Add" rate button above.',
    id: 'PriceListEmptyRateDesc',
  },
  PriceListNumberRate: {
    defaultMessage: 'Rate must be a number',
    description: 'Rate must be a number',
    id: 'PriceListNumberRate',
  },
  PriceListPosNumberRate: {
    defaultMessage: 'Rate must be a positive number',
    description: 'Rate must be a positive number',
    id: 'PriceListPosNumberRate',
  },
  Rate: {
    defaultMessage: 'Rate',
    description: 'Rate',
    id: 'Rate',
  },
  RawCostDescription: {
    defaultMessage: 'The costs reported by a cloud provider without any cost model calculations applied.',
    description: 'The costs reported by a cloud provider without any cost model calculations applied.',
    id: 'RawCostDescription',
  },
  RawCostTitle: {
    defaultMessage: 'Raw cost',
    description: 'Raw cost',
    id: 'RawCostTitle',
  },
  RbacErrorDescription: {
    defaultMessage:
      'There was a problem receiving user permissions. Refreshing this page may fix it. If it does not, please contact your admin.',
    description: 'rbac error description',
    id: 'RbacErrorDescription',
  },
  RbacErrorTitle: {
    defaultMessage: 'Failed to get RBAC information',
    description: 'rbac error title',
    id: 'RbacErrorTitle',
  },
  RedHatStatusUrl: {
    defaultMessage: 'https://status.redhat.com',
    description: 'Red Hat status url for cloud services',
    id: 'RedHatStatusUrl',
  },
  Requests: {
    defaultMessage: 'Requests',
    description: 'Requests',
    id: 'Requests',
  },
  Save: {
    defaultMessage: 'Save',
    description: 'Save',
    id: 'Save',
  },
  Select: {
    defaultMessage: 'Select...',
    description: 'Select...',
    id: 'Select',
  },
  SelectAll: {
    defaultMessage: 'Select all',
    description: 'Select all',
    id: 'SelectAll',
  },
  Selected: {
    defaultMessage: '{value} selected',
    description: '{value} selected',
    id: 'Selected',
  },
  SinceDate: {
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
    description: 'SinceDate',
    id: 'SinceDate',
  },
  Sources: {
    defaultMessage: 'Sources',
    description: 'Sources',
    id: 'Sources',
  },
  Status: {
    defaultMessage: '{value, select, ' + 'pending {Pending} ' + 'running {Running} ' + 'failed {Failed} ' + 'other {}}',
    description: 'Status',
    id: 'Status',
  },
  StatusActions: {
    defaultMessage: 'Status/Actions',
    description: 'Status/Actions',
    id: 'StatusActions',
  },
  Suggestions: {
    defaultMessage: 'Suggestions',
    description: 'Suggestions',
    id: 'Suggestions',
  },
  Supplementary: {
    defaultMessage: 'Supplementary',
    description: 'Supplementary',
    id: 'Supplementary',
  },
  TagHeadingKey: {
    defaultMessage: 'Key',
    description: 'Key',
    id: 'TagHeadingKey',
  },
  TagHeadingTitle: {
    defaultMessage: 'Tags ({value})',
    description: 'Tags ({value})',
    id: 'TagHeadingTitle',
  },
  TagHeadingValue: {
    defaultMessage: 'Value',
    description: 'Value',
    id: 'TagHeadingValue',
  },
  TagNames: {
    defaultMessage: 'Tag names',
    description: 'Tag Names',
    id: 'TagNames',
  },
  TimeOfExport: {
    defaultMessage: 'Time of export',
    description: 'Time of export',
    id: 'TimeOfExport',
  },
  ToolBarBulkSelectAll: {
    defaultMessage: 'Select all ({value} items)',
    description: 'Select all ({value} items)',
    id: 'ToolBarBulkSelectAll',
  },
  ToolBarBulkSelectAriaDeselect: {
    defaultMessage: 'Deselect all items',
    description: 'Deselect all items',
    id: 'ToolBarBulkSelectAriaDeselect',
  },
  ToolBarBulkSelectAriaSelect: {
    defaultMessage: 'Select all items',
    description: 'Select all items',
    id: 'ToolBarBulkSelectAriaSelect',
  },
  ToolBarBulkSelectNone: {
    defaultMessage: 'Select none (0 items)',
    description: 'Select none (0 items)',
    id: 'ToolBarBulkSelectNone',
  },
  ToolBarBulkSelectPage: {
    defaultMessage: 'Select page ({value} items)',
    description: 'Select page ({value} items)',
    id: 'ToolBarBulkSelectPage',
  },
  ToolBarPriceListMeasurementPlaceHolder: {
    defaultMessage: 'Filter by measurements',
    description: 'Filter by measurements',
    id: 'ToolBarPriceListMeasurementPlaceHolder',
  },
  ToolBarPriceListMetricPlaceHolder: {
    defaultMessage: 'Filter by metrics',
    description: 'Filter by metrics',
    id: 'ToolBarPriceListMetricPlaceHolder',
  },
  UnitTooltips: {
    defaultMessage:
      '{units, select, ' +
      'core_hours {{value} core-hours} ' +
      'gb {{value} GB} ' +
      'gb_hours {{value} GB-hours} ' +
      'gb_mo {{value} GB-month} ' +
      'gibibyte_month {{value} GiB-month} ' +
      'hour {{value} hours} ' +
      'hrs {{value} hours} ' +
      'vm_hours {{value} VM-hours} ' +
      'other {{value}}}',
    description: 'return value and unit based on key: "units"',
    id: 'UnitTooltips',
  },
  Units: {
    defaultMessage:
      '{units, select, ' +
      'core_hours {core-hours} ' +
      'gb {GB} ' +
      'gb_hours {GB-hours} ' +
      'gb_mo {GB-month} ' +
      'gibibyte_month {GiB-month} ' +
      'hour {hours} ' +
      'hrs {hours} ' +
      'vm_hours {VM-hours} ' +
      'other {}}',
    description: 'return the proper unit label based on key: "units"',
    id: 'Units',
  },
  Usage: {
    defaultMessage: 'Usage',
    description: 'Usage',
    id: 'Usage',
  },
  UsageCostDescription: {
    defaultMessage: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    description: 'The portion of cost calculated by applying hourly and/or monthly price list rates to metrics.',
    id: 'UsageCostDescription',
  },
  UsageCostTitle: {
    defaultMessage: 'Usage cost',
    description: 'Usage cost',
    id: 'UsageCostTitle',
  },
  Various: {
    defaultMessage: 'Various',
    description: 'Various',
    id: 'Various',
  },
  Yes: {
    defaultMessage: 'Yes',
    description: 'Yes',
    id: 'Yes',
  },
});
