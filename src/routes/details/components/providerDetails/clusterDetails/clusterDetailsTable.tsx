import type { Providers, ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { filterProviders } from 'routes/utils/providers';
import { getReleasePath } from 'utils/paths';

import { ClusterDetailsModal } from './clusterDetailsModal';
import { OverallStatus } from './components/overallStatus';

interface ClusterDetailsTableOwnProps {
  providers?: Providers;
  providerType?: ProviderType;
}

type ClusterDetailsTableProps = ClusterDetailsTableOwnProps;

const ClusterDetailsTable: React.FC<ClusterDetailsTableProps> = ({ providers, providerType }) => {
  const intl = useIntl();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const initDatum = () => {
    if (!providers) {
      return;
    }

    // Filter OCP providers to skip an extra API request
    const filteredProviders = filterProviders(providers, providerType)?.data?.filter(item => item.status !== null);

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

    const release = getReleasePath();

    filteredProviders.map(item => {
      const clusterId = item?.authentication?.credentials?.cluster_id;

      newRows.push({
        cells: [
          {
            value: (
              <>
                <a href={`${release}/openshift/details/${clusterId}`}>{item.name || clusterId}</a>
                {clusterId !== item.name && <div style={styles.infoDescription}>{clusterId}</div>}
              </>
            ),
          },
          { value: <OverallStatus clusterId={clusterId} isLastUpdated /> },
          { value: <OverallStatus clusterId={clusterId} isStatusMsg /> },
          { value: <ClusterDetailsModal clusterId={clusterId} showStatus={false} /> },
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

  return <DataTable columns={columns} isActionsCell rows={rows} />;
};

export { ClusterDetailsTable };
