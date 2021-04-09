import { IRow, TableVariant } from '@patternfly/react-table';
import { TagRates } from 'api/rates';
import { TFunction } from 'i18next';
import { TableTemplate } from 'pages/costModels/components/tableTemplate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'utils/formatValue';

interface TagRateTableProps {
  tagRates: TagRates;
}

const cells = [
  'cost_models.table.tag_key',
  'cost_models.table.tag_value',
  'cost_models.table.rate',
  'description',
  'cost_models.table.default',
];

const translateRows = (t: TFunction, rows: IRow[]): IRow[] => {
  return rows.map(row => {
    const rowCells = row.cells.map(cell => {
      if (typeof cell === 'string') {
        return t(cell);
      }
      return cell;
    });

    return {
      ...row,
      cells: rowCells,
    };
  });
};

const TagRateTable: React.FunctionComponent<TagRateTableProps> = ({ tagRates }) => {
  const { t } = useTranslation();
  const rows = tagRates.tag_values.map((tagValue, ix) => {
    return {
      cells: [
        ix === 0 ? tagRates.tag_key : '',
        tagValue.tag_value,
        formatCurrency(tagValue.value),
        tagValue.description,
        tagValue.default ? 'cost_models.table.default_yes' : 'cost_models.table.default_no',
      ],
    };
  });
  const translatedRows = translateRows(t, rows);
  return (
    <TableTemplate
      aria-label={`tag-table-rate-${tagRates.tag_key}`}
      borders={false}
      variant={TableVariant.compact}
      cells={cells}
      rows={translatedRows}
    />
  );
};

export default TagRateTable;
