import type { Rate } from '@koku-ui/api/rates';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Tooltip } from '@patternfly/react-core';
import type { IActions, ThProps } from '@patternfly/react-table';
import {
  ActionsColumn,
  ExpandableRowContent,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { formatCurrencyRate, unitsLookupKey } from '../../../../utils/format';

interface RateTableProps extends WrappedComponentProps {
  actions?: IActions;
  tiers: Rate[];
  sortCallback?: ({ index, direction }) => void;
}

// defaultIntl required for testing
const RateTableBase: React.FC<RateTableProps> = ({
  actions = [],
  intl = defaultIntl,
  tiers,
  sortCallback = () => {},
}) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [expanded, setExpanded] = React.useState([]);

  const getMetric = value => intl.formatMessage(messages.metricValues, { value }) || value;
  const getMeasurement = (measurement, units) => {
    units = intl.formatMessage(messages.units, { units: unitsLookupKey(units) }) || units;
    return intl.formatMessage(messages.measurementValues, {
      value: measurement.toLowerCase().replace('-', '_'),
      units,
      count: 2,
    });
  };

  const rows = tiers.reduce((acc, tier, ix) => {
    const isTagRates = !tier.tiered_rates;
    const tierRate = tier.tiered_rates ? tier.tiered_rates[0].value : 0;
    return [
      ...acc,
      {
        data: { index: ix, hasChildren: isTagRates, tag_rates: tier.tag_rates, stateIndex: tier.stateIndex },
        cells: [
          getMetric(tier.metric.label_metric),
          tier.description || '',
          getMeasurement(tier.metric.label_measurement, tier.metric.label_measurement_unit),
          tier.cost_type,
          {
            title: isTagRates
              ? intl.formatMessage(messages.various)
              : formatCurrencyRate(tierRate, tier.tiered_rates[0].unit),
            expandToggle: isTagRates,
          },
        ],
      },
    ];
  }, []);
  const columns = [
    { title: intl.formatMessage(messages.metric), sortable: true, sortIndex: 0 },
    { title: intl.formatMessage(messages.description) },
    { title: intl.formatMessage(messages.measurement), sortable: true, sortIndex: 2 },
    { title: intl.formatMessage(messages.calculationType) },
    { title: intl.formatMessage(messages.rate) },
  ];
  const tagColumns = [
    intl.formatMessage(messages.costModelsTagRateTableKey),
    intl.formatMessage(messages.costModelsTagRateTableValue),
    intl.formatMessage(messages.rate),
    intl.formatMessage(messages.description),
    intl.formatMessage(messages.default),
  ];

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_evt, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
      sortCallback({ index, direction });
    },
    columnIndex,
  });
  const setRowExpanded = rowIndex => {
    setExpanded(expanded.includes(rowIndex) ? expanded.filter(ex => ex !== rowIndex) : expanded.concat([rowIndex]));
  };
  const compoundExpandParams = rowIndex => ({
    isExpanded: expanded.includes(rowIndex),
    onToggle: () => setRowExpanded(rowIndex),
    expandId: 'expand-' + rowIndex,
    rowIndex,
    columnIndex: 4,
  });

  const sortedRows =
    activeSortIndex === null
      ? rows
      : rows.sort((a, b) => {
          const aValue = a.cells[activeSortIndex];
          const bValue = b.cells[activeSortIndex];
          if (activeSortDirection === 'asc') {
            return (aValue as string).localeCompare(bValue as string);
          }
          return (bValue as string).localeCompare(aValue as string);
        });

  return (
    <Table
      aria-label={intl.formatMessage(messages.costModelsWizardCreatePriceList)}
      hasAnimations
      isExpandable
      variant={TableVariant.compact}
    >
      <Thead>
        <Tr>
          {columns.map((col: { title?: string; sortable?: boolean }, i) => (
            <Th key={i} sort={col.sortable ? getSortParams(i) : undefined}>
              {col.title}
            </Th>
          ))}
          {!!actions.length && <Th></Th>}
        </Tr>
      </Thead>
      {sortedRows.map((row, rowIndex) => {
        const rowId = `row-${rowIndex}`;
        const isExpanded = row.data.hasChildren && expanded.includes(rowIndex);
        return (
          <Tbody isExpanded={isExpanded} key={rowId}>
            <Tr isContentExpanded={isExpanded} isControlRow key={`${rowId}-${rowIndex}`}>
              {row.cells.map((cell, i) => (
                <Td
                  key={i}
                  compoundExpand={
                    cell.expandToggle && row.data.hasChildren ? compoundExpandParams(rowIndex) : undefined
                  }
                >
                  {cell.title ? cell.title : cell}
                </Td>
              ))}
              {!!actions.length && (
                <Td key={row.cells.length} isActionCell>
                  <Tooltip content={intl.formatMessage(messages.moreOptions)}>
                    <ActionsColumn
                      items={actions.map(a => {
                        return {
                          ...a,
                          onClick: () => {
                            a.onClick(null, rowIndex, row, null);
                          },
                        };
                      })}
                    />
                  </Tooltip>
                </Td>
              )}
            </Tr>
            {row.data.hasChildren && (
              <Tr isExpanded={isExpanded}>
                <Td colSpan={6}>
                  <ExpandableRowContent>
                    <Table borders={false} variant={TableVariant.compact}>
                      <Thead>
                        <Tr>
                          {tagColumns.map((tag, tagIndex) => (
                            <Th key={tagIndex}>{tag}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {row.data.tag_rates.tag_values.map((v, index) => (
                          <Tr key={index}>
                            <Td>{index === 0 ? row.data.tag_rates.tag_key : ''}</Td>
                            <Td>{v.tag_value}</Td>
                            <Td>{formatCurrencyRate(v.value, v.unit)}</Td>
                            <Td>{v.description}</Td>
                            <Td>{v.default ? intl.formatMessage(messages.yes) : intl.formatMessage(messages.no)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </ExpandableRowContent>
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

const RateTable = injectIntl(RateTableBase);
export { RateTable };
