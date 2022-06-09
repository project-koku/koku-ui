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
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { formatCurrencyRate, unitsLookupKey } from 'utils/format';

import TagRateTable from './tagRateTable';

interface RateTableProps extends WrappedComponentProps {
  actions?: IActions;
  isCompact?: boolean;
  tiers: Rate[];
  sortCallback?: ({ index: number, direction: any }) => void;
}

// defaultIntl required for testing
const RateTableBase: React.SFC<RateTableProps> = ({
  actions,
  intl = defaultIntl,
  isCompact,
  tiers,
  sortCallback = () => {},
}) => {
  const [expanded, setExpanded] = React.useState({});
  const [sortBy, setSortBy] = React.useState<ISortBy>({});
  const getMetric = value => intl.formatMessage(messages.MetricValues, { value }) || value;
  const getMeasurement = (measurement, units) => {
    units = intl.formatMessage(messages.Units, { units: unitsLookupKey(units) }) || units;
    return intl.formatMessage(messages.MeasurementValues, {
      value: measurement.toLowerCase().replace('-', '_'),
      units,
      count: 2,
    });
  };
  const onSort = (_event, index: number, direction: SortByDirection) => {
    setSortBy({ index, direction });
    sortCallback({ index, direction });
  };
  let counter = 0;
  const rows = tiers.reduce((acc, tier, ix) => {
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
    const tierRate = tier.tiered_rates ? tier.tiered_rates[0].value : 0;
    return [
      ...acc,
      {
        data: { index: ix, hasChildren: rateKind === 'tagging' },
        cells: [
          tier.description || '',
          getMetric(tier.metric.label_metric),
          getMeasurement(tier.metric.label_measurement, tier.metric.label_measurement_unit),
          tier.cost_type,
          {
            title:
              rateKind === 'regular'
                ? formatCurrencyRate(tierRate, tier.tiered_rates[0].unit)
                : intl.formatMessage(messages.Various),
            props: { isOpen, style: { padding: rateKind === 'tagging' ? '' : '1.5rem 1rem' } },
          },
        ],
      },
      ...compoundRows,
    ];
  }, []);
  const cells = [
    { title: intl.formatMessage(messages.Description) },
    { title: intl.formatMessage(messages.Metric), ...(rows.length && { transforms: [sortable] }) },
    { title: intl.formatMessage(messages.Measurement), ...(rows.length && { transforms: [sortable] }) },
    { title: intl.formatMessage(messages.CalculationType) },
    { title: intl.formatMessage(messages.Rate), cellTransforms: [compoundExpand] },
  ];
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
      aria-label={intl.formatMessage(messages.CostModelsWizardCreatePriceList)}
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

const RateTable = injectIntl(RateTableBase);
export { RateTable };
