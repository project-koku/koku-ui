/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  ChartCostForecastConeTooltip: {
    id: 'ChartCostForecastConeTooltip',
    description: '{value0} - {value1}',
    defaultMessage: 'EN {value0} - {value1}',
  },
  ChartCostLegendLabel: {
    id: 'ChartMonthLegendLabel',
    description: 'Cost start date label',
    defaultMessage:
      '{count, plural, one {EN Cost ({startDate} {monthAbbr})} other {EN Cost ({startDate}-{endDate} {monthAbbr})}}',
  },
  ChartDateRange: {
    id: 'ChartDateRange',
    description: 'Date range that handles singular and plural',
    defaultMessage:
      '{count, plural, one {EN {startDate} {monthAbbr} {year}} other {EN {startDate}-{endDate} {monthAbbr} {year}}}',
  },
  ChartNoData: {
    id: 'ChartNoData',
    description: 'no data',
    defaultMessage: 'EN no data',
  },
  OCPDailyUsageAndRequestComparison: {
    id: 'OCPDailyUsageAndRequestComparison',
    description: 'Daily usage and requests comparison',
    defaultMessage: 'EN Daily usage and requests comparison ({units})',
  },
  OCPDashboardCostTitle: {
    id: 'OCPDashboardCostTitle',
    description: 'All OpenShift cost',
    defaultMessage: 'EN All OpenShift cost',
  },
  OCPDashboardCostTrendTitle: {
    id: 'OCPDashboardCostTrendTitle',
    description: 'All OpenShift cumulative cost comparison in units',
    defaultMessage: 'EN All OpenShift cumulative cost comparison ({units})',
  },
  OCPDashboardDailyCostTitle: {
    id: 'OCPDashboardDailyCostTitle',
    description: 'All OpenShift daily cost comparison in units',
    defaultMessage: 'EN All OpenShift daily cost comparison ({units})',
  },
  UnitTooltips: {
    id: 'UnitTooltips',
    description: 'return the proper translated unit based on key: "unit"',
    defaultMessage:
      '{unit, select, coreHours {{value} EN core-hours} gb {{value} EN GB} gbHours {{value} EN GB-hours} gbMo {{value} EN GB-month} gibibyteMonth {{value} EN GiB-month} hour {{value} EN hours} hrs {{value} EN hrs} usd {{value} EN} vmHours {{value} EN VM-hours} other {{value} EN}}',
  },
});
