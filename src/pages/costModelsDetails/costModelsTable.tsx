import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './costModelsDetails.styles';

interface TableProps extends InjectedTranslateProps {
  columns: string[];
  rows: any[];
  setUuid: (uuid: string) => void;
}

const CostModelsTable: React.SFC<TableProps> = ({
  columns,
  rows,
  t,
  setUuid,
}) => {
  const linkedRows = rows.map(row => [
    {
      title: (
        <Button onClick={() => setUuid(row[0])} variant="link">
          {row[1]}
        </Button>
      ),
    },
    ...row.slice(2),
  ]);
  return (
    <div className={css(styles.tableContainer)}>
      <Table
        aria-label="cost-models-table"
        cells={columns}
        rows={linkedRows}
        actions={[]}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
};

export default translate()(CostModelsTable);
