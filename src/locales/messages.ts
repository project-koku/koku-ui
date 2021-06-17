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
    description: 'return the proper translated unit based on key: "unit"',
    defaultMessage:
      '{unit, select, coreHours {{value} EN core-hours} gb {{value} EN GB} gbHours {{value} EN GB-hours} gbMo {{value} EN GB-month} gibibyteMonth {{value} EN GiB-month} hour {{value} EN hours} hrs {{value} EN hrs} usd {{value} EN} vmHours {{value} EN VM-hours} other {{value} EN}}',
  },
  TestMessage: {
    id: 'TestMessage',
    description: 'This is a debug message',
    defaultMessage: 'Testing: {msg}',
  },
  TestPluralMessage: {
    id: 'TestPluralMessage',
    description: 'This is a debug message',
    defaultMessage: '{count, plural, one {ONE {msg}} other {MORE {msg}S}}',
  },
  TestSelectMessage: {
    id: 'TestSelectMessage',
    description: 'This is a debug message',
    defaultMessage: '{unit, select, coreHours {core-hours {msg}} hours {HOURS {msg}} other {OTHER {msg}}}',
  },
});
