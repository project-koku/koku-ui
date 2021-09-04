import { Table, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table';
import { TagRates } from 'api/rates';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { formatCurrency } from 'utils/formatValue';

interface TagRateTableProps extends WrappedComponentProps {
  tagRates: TagRates;
}

// defaultIntl required for testing
const TagRateTable: React.FunctionComponent<TagRateTableProps> = ({ intl = defaultIntl, tagRates }) => {
  const cells = [
    intl.formatMessage(messages.CostModelsTagRateTableKey),
    intl.formatMessage(messages.CostModelsTagRateTableValue),
    intl.formatMessage(messages.Rate),
    intl.formatMessage(messages.Description),
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
