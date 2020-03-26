import {
  IActions,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { formatCurrency } from 'utils/formatValue';
import { TierData } from './addPriceList';

interface RateTableProps extends InjectedTranslateProps {
  tiers: TierData[];
  actions?: IActions;
  isCompact?: boolean;
}

export const RateTable: React.SFC<RateTableProps> = ({
  t,
  tiers,
  actions,
  isCompact,
}) => {
  return (
    <Table
      aria-label="price-list"
      variant={isCompact ? TableVariant.compact : undefined}
      rows={tiers.map(tier => [
        t(`cost_models.${tier.meta.label_metric}`),
        t(`cost_models.${tier.meta.label_measurement}`, {
          units: tier.meta.label_measurement_unit,
        }),
        `${formatCurrency(Number(tier.rate))}`,
        tier.isInfra ? t('cost_models.infra_yes') : t('cost_models.infra_no'),
      ])}
      cells={[
        t('cost_models.table.metric'),
        t('cost_models.table.measurement'),
        t('cost_models.table.rate'),
        t('cost_models.table.infra'),
      ]}
      actions={actions}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
