import {
  compoundExpand,
  IActions,
  ISortBy,
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { Rate } from 'api/rates';
import { WithT } from 'i18next';
import React from 'react';
import { formatCurrency } from 'utils/formatValue';

import { compareBy } from './rateForm/utils';
import TagRateTable from './tagRateTable';

interface RateTableProps extends WithT {
  tiers: Rate[];
  actions?: IActions;
  isCompact?: boolean;
}

export const RateTable: React.SFC<RateTableProps> = ({ t, tiers, actions, isCompact }) => {
  const [expanded, setExpanded] = React.useState({});
  const [sortBy, setSortBy] = React.useState<ISortBy>({});
  const cells = [
    { title: t('cost_models.table.description') },
    { title: t('cost_models.table.metric'), transforms: [sortable] },
    { title: t('cost_models.table.measurement'), transforms: [sortable] },
    { title: t('cost_models.table.calculation_type') },
    { title: t('cost_models.table.rate'), cellTransforms: [compoundExpand] },
  ];
  const onSort = (_event, index: number, direction: SortByDirection) => {
    setSortBy({ index, direction });
  };
  let counter = 0;
  const rows = tiers
    .sort((r1, r2) => {
      const projection =
        sortBy.index === 1
          ? (r: Rate) => r.metric.label_metric
          : sortBy.index === 2
          ? (r: Rate) => r.metric.label_measurement
          : (r: Rate) => '';
      return compareBy(r1, r2, sortBy.direction, projection);
    })
    .reduce((acc, tier, ix) => {
      const rateKind = tier.tiered_rates ? 'regular' : 'tagging';
      let compoundRows = [];
      if (rateKind === 'tagging') {
        compoundRows = [
          {
            compoundParent: 4,
            parent: ix + counter,
            cells: [
              {
                title: <TagRateTable tagRates={tier.tag_rates} />,
                props: { colSpan: 6, className: 'pf-m-no-padding' },
              },
            ],
          },
        ];
        counter += 1;
      }
      const isOpen = rateKind === 'tagging' ? expanded[ix + counter - 1] || false : undefined;
      return [
        ...acc,
        {
          data: { index: ix, hasChildren: rateKind === 'tagging' },
          cells: [
            tier.description || '',
            tier.metric.label_metric,
            `${tier.metric.label_measurement} (${tier.metric.label_measurement_unit})`,
            tier.cost_type,
            {
              title:
                rateKind === 'regular'
                  ? `${formatCurrency(Number(tier.tiered_rates[0].value), 'USD')}`
                  : t('cost_models.table.tagged_rates'),
              props: { isOpen, style: { padding: rateKind === 'tagging' ? '' : '1.5rem 1rem' } },
            },
          ],
        },
        ...compoundRows,
      ];
    }, []);
  const onExpand = (_event: any, rowIndex: number, _colIndex: number, isOpen: boolean) => {
    setExpanded({ ...expanded, [rowIndex]: !isOpen });
  };
  const actionResolver = rowData => {
    if (rowData.compoundParent) {
      return [];
    }
    return actions;
  };
  return (
    <Table
      onSort={onSort}
      sortBy={sortBy}
      aria-label="price list"
      variant={isCompact ? TableVariant.compact : undefined}
      rows={rows}
      cells={cells}
      actionResolver={actionResolver}
      onExpand={onExpand}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
