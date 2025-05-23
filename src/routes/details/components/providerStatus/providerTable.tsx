import { Button, ButtonVariant } from '@patternfly/react-core';
import type { Provider, ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';

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

    setColumns(newColumns);
    setRows(newRows);
  };

  useEffect(() => {
    initDatum();
  }, [providers]);

  return rows.length ? <DataTable columns={columns} isActionsCell rows={rows} /> : null;
};

export { ProviderTable };
