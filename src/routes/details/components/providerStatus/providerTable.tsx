import { Button, ButtonVariant } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { getOperatorStatus } from 'routes/utils/operatorStatus';

import { OverallStatus } from './components/overallStatus';
import { SourceLink } from './components/sourceLink';
import { ProviderBreakdownModal } from './providerBreakdownModal';
import { styles } from './providerStatus.styles';

interface ProviderTableOwnProps {
  onClick?: (id: string) => void;
  providers?: Provider[];
  providerType?: ProviderType;
  showContent?: boolean;
}

type ProviderTableProps = ProviderTableOwnProps;

const ProviderTable: React.FC<ProviderTableProps> = ({ onClick, providers, providerType }) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!providers) {
      return;
    }

    const newRows = [];
    const newColumns = [
      {
        name: intl.formatMessage(messages.integration),
      },
      {
        hidden: providerType !== ProviderType.ocp,
        name: intl.formatMessage(messages.operatorVersion),
      },
      {
        name: intl.formatMessage(messages.lastUpdated),
      },
      {
        name: intl.formatMessage(messages.status),
      },
      {
        name: '',
      },
    ];

    providers?.map(item => {
      // const clusterId = item?.authentication?.credentials?.cluster_id;

      newRows.push({
        cells: [
          { value: <SourceLink provider={item} showLabel={false} /> },
          {
            hidden: providerType !== ProviderType.ocp,
            value: getOperatorStatus(item.additional_context?.operator_update_available),
          },
          { value: <OverallStatus isLastUpdated providerId={item.id} providerType={providerType} /> },
          {
            value: <OverallStatus isStatusMsg providerId={item.id} providerType={providerType} />,
          },
          {
            value: onClick ? (
              <Button onClick={() => onClick(item.id)} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
                {intl.formatMessage(messages.dataDetails)}
              </Button>
            ) : (
              <ProviderBreakdownModal providerId={item.id} providerType={providerType} />
            ),
          },
        ],
        item,
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  useEffect(() => {
    initDatum();
  }, [providers]);

  return rows.length ? <DataTable columns={columns} isActionsCell rows={rows} /> : null;
};

export { ProviderTable };
