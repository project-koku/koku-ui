import { css } from '@patternfly/react-styles';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import { tableOverride } from './detailsTable.styles';
import { styles } from './sourceSettings.styles';

const SourceTable = ({ onCollapse, columns, rows }) => (
  <div className={css(styles.tableContainer)}>
    <Table
      aria-label="source-table"
      // TODO: Uncomment once bulk delete is available
      // onSelect={onSelect}
      onCollapse={onCollapse}
      cells={columns}
      className={tableOverride}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  </div>
);

export default SourceTable;
