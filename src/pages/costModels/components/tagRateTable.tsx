import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { TagRates } from 'api/rates';
import React from 'react';
import { formatCurrency } from 'utils/formatValue';

interface TagRateTableProps {
  tagRates: TagRates;
}

const TagRateTable: React.FunctionComponent<TagRateTableProps> = ({ tagRates }) => {
  const cells = ['Tag key', 'Tag value', 'Rate', 'Description', 'Default'];
  const rows = tagRates.tag_values.map((tagValue, ix) => {
    return {
      cells: [
        ix === 0 ? tagRates.tag_key : '',
        tagValue.tag_value,
        formatCurrency(tagValue.value),
        tagValue.description,
        tagValue.default ? 'Yes' : 'No',
      ],
    };
  });
  return (
    <Table variant={TableVariant.compact} borders={false} cells={cells} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default TagRateTable;
