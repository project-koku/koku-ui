import {
  IActions,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { formatCurrency } from 'utils/formatValue';
import { TierData } from './addPriceList';

interface RateTableProps extends WrappedComponentProps {
  tiers: TierData[];
  actions?: IActions;
  isCompact?: boolean;
}

export const RateTable: React.SFC<RateTableProps> = ({
  intl,
  tiers,
  actions,
  isCompact,
}) => {
  return (
    <Table
      aria-label="price-list"
      variant={isCompact ? TableVariant.compact : undefined}
      rows={tiers.map(tier => [
        intl.formatMessage({ id: `cost_models.${tier.meta.label_metric}` }),
        intl.formatMessage(
          { id: `cost_models.${tier.meta.label_measurement}` },
          {
            units: tier.meta.label_measurement_unit,
          }
        ),
        `${formatCurrency(Number(tier.rate))}`,
        tier.costType,
      ])}
      cells={[
        intl.formatMessage({ id: 'cost_models.table.metric' }),
        intl.formatMessage({ id: 'cost_models.table.measurement' }),
        intl.formatMessage({ id: 'cost_models.table.rate' }),
        intl.formatMessage({ id: 'cost_models.table.cost_type' }),
      ]}
      actions={actions}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
