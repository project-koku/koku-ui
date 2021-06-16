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
    description: '{months_abbr}',
    defaultMessage: 'EN {months_abbr}',
  },
  ChartDateRange: {
    id: 'ChartDateRange',
    description: 'Date range that handles singular and plural',
    defaultMessage:
      '{count, plural, one {EN-ONE {startDate} {month_abbr} {year}} other {EN-OTHER {startDate}-{endDate} {months_abbr} {year}}}',
  },
  ChartMonthLegendLabel: {
    id: 'ChartMonthLegendLabel',
    description: '{months_abbr}',
    defaultMessage: 'EN {months_abbr}',
  },
  ChartNoData: {
    id: 'ChartNoData',
    description: 'no data',
    defaultMessage: 'EN no data',
  },
  UnitTooltips: {
    id: 'UnitTooltips',
    description: 'no data',
    defaultMessage:
      '{unit, select, core-hours {{value} EN core-hours} gb {{value} EN GB} gb-hours {{value} EN GB-hours} gb-mo {{value} EN GB-month} gibibyte month {{value} EN GiB-month} hour {{value} EN hours} hrs {{value} EN hrs} usd {{value} EN} vm-hours {{value} EN VM-hours} other {{value} EN}}',
  },
});
