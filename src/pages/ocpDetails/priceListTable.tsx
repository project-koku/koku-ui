import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import { formatCurrency } from 'utils/formatValue';

const PriceListTable = ({ rates, t }) => {
  const notAvailableText = t('ocp_details.price_list.modal.not_available');
  return (
    <Table
      aria-label="price-list-table"
      cells={[
        t('ocp_details.price_list.modal.metric'),
        t('ocp_details.price_list.modal.value'),
        t('ocp_details.price_list.modal.usage_start'),
        t('ocp_details.price_list.modal.usage_end'),
      ]}
      rows={Object.keys(rates).map(metric => [
        t(`ocp_details.price_list.modal.${metric}`),
        rates[metric].value
          ? formatCurrency(rates[metric].value, rates[metric].unit)
          : notAvailableText,
        rates[metric].usage_start || notAvailableText,
        rates[metric].usage_end || notAvailableText,
      ])}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default PriceListTable;
