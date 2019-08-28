import { css } from '@patternfly/react-styles';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './costModelsDetails.styles';

interface TableProps extends InjectedTranslateProps {
  columns: string[];
  rows: any[];
}

const CostModelsTable: React.SFC<TableProps> = ({ columns, rows, t }) => (
  <div className={css(styles.tableContainer)}>
    <Table
      aria-label="cost-models-table"
      cells={columns}
      rows={rows}
      actions={[]}
    >
      <TableHeader />
      <TableBody />
    </Table>
  </div>
);

export default translate()(CostModelsTable);
