import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import { formatCurrency } from 'utils/formatValue';

function getUsageRangeText(metric, t) {
  return metric.range_value[0] === null && metric.range_value[1] === null
    ? t('details.price_list.modal.no_range_set')
    : `${metric.range_value[0] || ' '} - ${metric.range_value[2] || ' '} ${
        metric.range_unit
      }`;
}

const PriceListTable = ({ rates, t }) => {
  const notAvailableText = t('details.price_list.modal.not_available');
  return (
    <Table
      aria-label="price-list-table"
      cells={[
        t('details.price_list.modal.metric'),
        t('details.price_list.modal.value'),
        t('details.price_list.modal.applied_usage_range'),
        t('details.price_list.modal.applied_usage_date_range'),
      ]}
      rows={rates.map(metric => [
        t(`details.price_list.modal.${metric.display}`, {
          index: metric.index + 1,
          unit: metric.range_unit,
        }),
        metric.value
          ? formatCurrency(metric.value, metric.value_unit)
          : notAvailableText,
        getUsageRangeText(metric, t),
        t(`details.price_list.modal.${metric.period}`),
      ])}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default PriceListTable;
