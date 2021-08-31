import { Table, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table';
import { TagRates } from 'api/rates';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { formatCurrency } from 'utils/formatValue';

interface TagRateTableProps extends WrappedComponentProps {
  tagRates: TagRates;
}

const TagRateTable: React.FunctionComponent<TagRateTableProps> = ({ intl, tagRates }) => {
  const cells = [
    intl.formatMessage(messages.CostModelsTagRateTableKey),
    intl.formatMessage(messages.CostModelsTagRateTableValue),
    intl.formatMessage(messages.CostModelsTagRateTableRate),
    intl.formatMessage(messages.CostModelsTagRateTableDesc),
    intl.formatMessage(messages.CostModelsTagRateTableDefault),
  ];

  const rows =
    tagRates &&
    tagRates.tag_values.map((tagValue, ix) => {
      return {
        cells: [
          ix === 0 ? tagRates.tag_key : '',
          tagValue.tag_value,
          formatCurrency(tagValue.value),
          tagValue.description,
          tagValue.default ? intl.formatMessage(messages.Yes) : intl.formatMessage(messages.No),
        ],
      };
    });

  return (
    <Table
      aria-label={intl.formatMessage(messages.CostModelsTagRateTableAriaLabel)}
      borders={false}
      cells={cells}
      gridBreakPoint={TableGridBreakpoint.grid2xl}
      rows={rows}
      variant={TableVariant.compact}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default injectIntl(TagRateTable);
