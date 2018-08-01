import { getQuery } from 'api/query';
import { toCurrency } from 'utils/convert';

export function getQueryForTimeScope(timeScope: number) {
  return getQuery({
    filter: {
      time_scope_units: 'month',
      resolution: 'daily',
      time_scope_value: timeScope,
    },
  });
}

export function formatCostSummaryDetailValue(value: number) {
  return toCurrency(value, 0);
}
