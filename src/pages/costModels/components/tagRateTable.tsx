import { Table, TableBody, TableGridBreakpoint, TableHeader, TableVariant } from '@patternfly/react-table';
import { TagRates } from 'api/rates';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { formatCurrencyRate } from 'utils/format';

interface TagRateTableProps extends WrappedComponentProps {
  tagRates: TagRates;
}

// defaultIntl required for testing
const TagRateTable: React.FunctionComponent<TagRateTableProps> = ({ intl = defaultIntl, tagRates }) => {
  const cells = [
    intl.formatMessage(messages.costModelsTagRateTableKey),
    intl.formatMessage(messages.costModelsTagRateTableValue),
    intl.formatMessage(messages.rate),
    intl.formatMessage(messages.description),
    intl.formatMessage(messages.costModelsTagRateTableDefault),
  ];

  const rows =
    tagRates &&
    tagRates.tag_values.map((tagValue, ix) => {
      return {
        cells: [
          ix === 0 ? tagRates.tag_key : '',
          tagValue.tag_value,
          formatCurrencyRate(tagValue.value, tagValue.unit),
          tagValue.description,
          tagValue.default ? intl.formatMessage(messages.yes) : intl.formatMessage(messages.no),
        ],
      };
    });

  return (
    <Table
      aria-label={intl.formatMessage(messages.costModelsTagRateTableAriaLabel)}
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
